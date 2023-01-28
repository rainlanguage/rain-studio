import { env } from '$env/dynamic/public';
import * as Sentry from '@sentry/node';
import '$lib/supabaseClient';

// console.log('server', env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY);

import crypto from 'crypto';
import type { HandleServerError, RequestEvent, ResolveOptions } from '@sveltejs/kit';
import type { MaybePromise } from '@sveltejs/kit/types/private';

// export const handleError = (({ error, event }) => {
//   const errorId = crypto.randomUUID();
//   Sentry.init({
//     dsn: 'https://e384ab07b25a4be9afb4ed541f52c95a@o4504335130689536.ingest.sentry.io/4504335132393472',

//     // Set tracesSampleRate to 1.0 to capture 100%
//     // of transactions for performance monitoring.
//     // We recommend adjusting this value in production
//     tracesSampleRate: 1.0
//   });
//   // example integration with https://sentry.io/
//   Sentry.captureException(error, { event, errorId });

//   return {
//     message: 'Whoops!',
//     errorId
//   };
// }) satisfies HandleServerError;

// TODO: Use the hooks HANDLE to work as Loggin Guard (?)
// /** @type {import('@sveltejs/kit').Handle} */
// export async function handle({
//     event,
//     resolve
// }: {
//     event: RequestEvent;
//     resolve(event: RequestEvent, opts?: ResolveOptions): MaybePromise<Response>;
// }) {
//     const response = await resolve(event);
//     return response;
// }
