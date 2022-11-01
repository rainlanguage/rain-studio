import { supabaseClient } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {

    console.log(params)

    const query = supabaseClient
        .from('contracts')
        .select('project ( name, logo_url ), metadata, abi')
        .contains('metadata', JSON.stringify(
            {
                addresses:
                    [
                        {
                            chainId: parseInt(params.chain),
                            knownAddresses:
                                [
                                    params.address
                                ]
                        }
                    ]
            }
        )
        )

    return { query }

    throw error(404, 'Not found');
}