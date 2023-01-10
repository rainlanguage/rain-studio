const colors = require('tailwindcss/colors');

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/rain-svelte-components/**/*'],

	theme: {
		extend: {},
		colors: {
			...colors,
			gray: colors.neutral
		},
		fontFamily: {
			sans: ['DM Sans', { fontFeatureSettings: '"calt", "off"' }],
			mono: 'DM Mono'
		}
	},
	darkMode: 'class',

	plugins: [require('tailwind-gradient-mask-image'), require('@tailwindcss/typography')]
};

module.exports = config;
