import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
// import sentryVitePlugin from "@sentry/vite-plugin";

const config: UserConfig = {
    build: {
        sourcemap: true // Source map generation must be turned on
    },
    plugins: [
        sveltekit()
        // sentryVitePlugin({
        // 	org: "rain-protocol",
        // 	project: "rain-studio",

        // 	// Specify the directory containing build artifacts
        // 	include: "./output",

        // 	// Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
        // 	// and needs the `project:releases` and `org:read` scopes
        // 	authToken: process.env.SENTRY_AUTH_TOKEN,

        // 	// Optionally uncomment the line below to override automatic release name detection
        // 	// release: process.env.VERCEL_URL,

        // 	deploy: {
        // 		env: process.env.VERCEL_ENV || 'local',
        // 		name: process.env.VERCEL_URL || 'local',
        // 		url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:8080'
        // 	}
        // }),
    ],
    optimizeDeps: {
        exclude: ['javascript-time-ago']
    }
};

export default config;
