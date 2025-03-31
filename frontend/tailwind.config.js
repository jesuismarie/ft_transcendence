/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./public/**/*.html",
		"./srcs/**/*.{ts,js}",
		"./index.html"
	],
	theme: {
		extend: {
			fontFamily: {
				tektur: ['"Tektur"', 'sans-serif'],
			},
			borderWidth: {
				'5': '5px'
			},
			keyframes: {
				neonGlow: {
					'0%, 100%': {
						textShadow: '0 0 5px #DCDCDD, 0 0 10px #B8B8B9, 0 0 15px #8F8F90',
					},
					'50%': { 
						textShadow: '0 0 10px #DCDCDD, 0 0 20px #B8B8B9, 0 0 30px #8F8F90',
					},
				}
			},
			animation: {
				neonGlow: 'neonGlow 1.5s infinite alternate',
			},
		},
	},
}