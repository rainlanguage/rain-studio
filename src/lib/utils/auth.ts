import { error as sveltekitError } from '@sveltejs/kit';
import { SUPABASE_JWT } from '$env/static/private';
import { ContextBuilder } from '$lib/user-context';
import { utils } from 'ethers';
import jwt from 'jsonwebtoken';
import {
    uniqueNamesGenerator,
    NumberDictionary,
    adjectives,
    names,
    type Config
} from 'unique-names-generator';

import type { RequestEvent } from '../../routes/$types';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit/dist/types';
import type { Profile } from '$lib/types/app-types';
import type { ContextInfo } from '$lib/types/context-types';

export const verifySignature = async (
    address_: string,
    signature: string,
    fetch_: RequestEvent['fetch']
): Promise<void | never> => {
    const resp = await fetch_(`/api/auth/request_message`, {
        method: 'POST',
        body: JSON.stringify({
            address: address_
        })
    });

    if (!resp.ok) {
        throw sveltekitError(400, {
            message: 'Failed to sign in.'
        });
    }

    const message = (await resp.json()).message;
    const signerAddress = utils.verifyMessage(message, signature);

    if (signerAddress !== address_) {
        // Unauthorized address
        throw sveltekitError(401, {
            message: 'Wrong sign from the address.'
        });
    }
};

/**
 * Sign a given address as a JWT Token and return a fully complete cookie. The address must be verified
 * by checking a signature signed by the wallet owner, use `verifySignature()` before sign in.
 * @param address_ The address that be used to check and sign
 * @param supabase_ The supabase client required to query to the database
 */
export const signAddress = async (address_: string, supabase_: TypedSupabaseClient) => {
    let user: Profile;
    let userContext: ContextInfo | null = null;

    const resp = await supabase_
        .from('wallets_linked')
        .select('id, user:user_id(id, full_name, username, avatar_url, website)')
        .eq('address', address_)
        .single();

    user = resp.data?.user as Profile;

    if (resp.error) {
        // Since it's sign up - Create a new user with this wallet and a random Username
        const numberDictionary = NumberDictionary.generate({ min: 10, max: 999 });
        const customConfig: Config = {
            dictionaries: [names, adjectives, numberDictionary],
            separator: '',
            length: 3
        };
        const username_ = uniqueNamesGenerator(customConfig).toLowerCase();
        const respNewUser = await supabase_.rpc('new_user_from_address', {
            address_,
            username_
        });

        if (respNewUser.error) {
            throw sveltekitError(400, {
                message: 'Failed to sign up a new user.'
            });
        }

        const resp = await supabase_
            .from('wallets_linked')
            .select('id, user:user_id(*)')
            .eq('address', address_)
            .single();

        user = resp.data?.user as Profile;
    }

    if (!user) {
        throw sveltekitError(400, {
            message: 'Failed to sign in.'
        });
    }

    userContext = ContextBuilder.fromProfile(user);

    return generateCookie(user, userContext);
};

export const generateCookie = async (
    user_: Profile,
    context_: ContextInfo | null,
    options_?: {
        exp_in: number;
        exp_at: number;
    }
) => {
    if (!context_)
        throw sveltekitError(400, {
            message: 'ERROR_COOKIE_01: WRONG USER_ORG CONTEXT'
        });

    let expires_in: number;
    let expires_at: number;

    if (options_) {
        expires_in = options_.exp_in;
        expires_at = options_.exp_at;
    } else {
        expires_in = 60 * 60 * 24; // 1h * 24 (1 day)
        expires_at = Math.floor(Date.now() / 1000) + expires_in;
    }

    const token = jwt.sign(
        {
            ...user_,
            orgContext: context_,
            aud: 'authenticated',
            role: 'authenticated',
            exp: expires_at
        },
        SUPABASE_JWT
    );

    const cookie = {
        access_token: token,
        token_type: 'bearer',
        refresh_token: '',
        user: user_,
        orgContext: context_,
        expires_in,
        expires_at
    };

    return cookie;
};
