/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

const config = {
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Proxima Nova", ...defaultTheme.fontFamily.sans],
				druk: ["DrukCond", ...defaultTheme.fontFamily.sans],
			},
		},
	},
	plugins: [],
};

module.exports = config;
