import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, error as sveltekitError } from '@sveltejs/kit';
import { signAddress, verifySignature } from '$lib/utils/auth';

import type { PageServerLoad, RequestEvent } from './$types';

/** @type {import('./$types').PageServerLoad} */
export const load: PageServerLoad = async (event) => {
    const session = await getServerSession(event);
    if (session) {
        throw redirect(307, '/dashboard');
    }
    return { session };
};

/** @type {import('./$types').Actions} */
export const actions = {
    default: async (event: RequestEvent) => {
        const { cookies, request, fetch } = event;
        const { supabaseClient } = await getSupabase(event);

        const data = await request.formData();
        const signatureForm = data.get('signature');
        const addressForm = data.get('address');

        if (!signatureForm || !addressForm) {
            throw sveltekitError(400, {
                message: 'Missing signature or address'
            });
        }

        const signature = signatureForm.toString();
        const address = addressForm.toString();

        await verifySignature(address, signature, fetch);
        const newCookie = await signAddress(address, supabaseClient);

        cookies.set('rain-studio-session', JSON.stringify(newCookie), {
            path: '/',
            maxAge: newCookie.expires_at,
            httpOnly: false
        });
    }
};
