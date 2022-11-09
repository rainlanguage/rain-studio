import { env } from '$env/dynamic/public'
import TimeAgo from 'javascript-time-ago';
import en from '$lib/assets/en.json';


TimeAgo.addDefaultLocale(en);

import '$lib/supabaseClient'