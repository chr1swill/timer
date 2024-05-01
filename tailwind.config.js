/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js}"],
	theme: {
		extend: {
			colors: {
				text: "var(--text)", // quoted for correct syntax
				background: "var(--background)",
				primary: "var(--primary)",
				accent: "var(--accent)",
			},
			fontFamily: {
				base: "var(--font-family)",
			},
		},
	},
	plugins: [],
};
