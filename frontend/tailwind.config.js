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
			colors: {
				hover: '#50A39A',
				primary: '#DCDCDD',
			},
			borderWidth: {
				'5': '5px'
			},
			boxSHadow: {
				'neon-btn-hover': '0_0_10px_#DCDCDD,0_0_20px_#B8B8B9,0_0_30px_#8F8F90',
				'neon-hover': '0_0_5px_#DCDCDD,0_0_15px_#30BDAC,0_0_20px_#50A39A',
				'white-glow': '0_0_5px_#DCDCDD,0_0_10px_#B8B8B9,0_0_15px_#8F8F90',
				'div-glow': '0_10px_30px_rgba(0,0,0,0.2)',
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