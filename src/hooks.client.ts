import TimeAgo from 'javascript-time-ago';
import en from '$lib/assets/en.json';
import * as Sentry from '@sentry/svelte';
import '$lib/supabaseClient';
import type { HandleClientError } from '@sveltejs/kit';

// export const handleError = (({ error, event }) => {
//     const errorId = crypto.randomUUID();
//     Sentry.init({
//         dsn: 'https://e384ab07b25a4be9afb4ed541f52c95a@o4504335130689536.ingest.sentry.io/4504335132393472',

//         // Set tracesSampleRate to 1.0 to capture 100%
//         // of transactions for performance monitoring.
//         // We recommend adjusting this value in production
//         tracesSampleRate: 1.0
//     });

//     // example integration with https://sentry.io/
//     Sentry.captureException(error, { event, errorId });

//     return {
//         message: 'Whoops!',
//         errorId
//     };
// }) satisfies HandleClientError;

TimeAgo.addDefaultLocale(en);
