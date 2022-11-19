import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit';
import { redirect, error, invalid } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const session = await getServerSession(event);
	if (session) return { session };
	throw redirect(307, '/login');
}

/** @type {import('./$types').Actions} */
export const actions = {
	linkAddress: async (event) => {
		const { request } = event;
		const { supabaseClient, session } = await getSupabase(event);

		const formData = await request.formData();
		const address = formData.get('address');
		const userId = session.user.id;

		const { data, error: nonceError } = await supabaseClient.functions.invoke('get_nonce', {
			body: { address }
		});

		if (nonceError) {
			// Print on server console
			const message = `There was an error with the address. Please, check if the address '${address}' is already linked.`;
			console.log(message);

			return invalid(400, {
				success: false,
				error: {
					message
				}
			});
		}
		const insertData = {
			id: data.id,
			address,
			user_id: userId
		};

		const { error: insertError } = await supabaseClient.from('wallets').insert(insertData);

		if (insertError) {
			// Print on server console
			const message = `There was an error inserting the address. Please, check if the address '${address}' is already linked.`;
			console.log(message);

			return invalid(400, {
				success: false,
				error: {
					message
				}
			});
		}

		return { success: true };
	}
};
