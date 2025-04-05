const mainWrapper = document.getElementById("wrapper") as HTMLElement | null;
const initialContent = mainWrapper?.innerHTML;

document.addEventListener("DOMContentLoaded", () => {
	document.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;

		if (target.id === 'to-sign-in' || target.closest('#to-sign-in')) {
			loadSignInForm();
			document.title = "Sign In";
			event.preventDefault();
		}

		if (target.id === 'to-sign-up' || target.closest('#to-sign-up')) {
			loadSignUpForm();
			document.title = "Sign Up";
			event.preventDefault();
		}
		
		if (target.id === 'back' || target.closest('#back')) {
			returnToMainPage();
			document.title = "Welcome to Pong!";
			event.preventDefault();
		}
	});
});

function loadSignInForm() {
	if (!mainWrapper) return;
		
	mainWrapper.innerHTML = `
		<div class="w-[100dvw] h-[100dvh] flex justify-center items-center">
			<div class="w-[400px] h-[500px]">
				<button id="back" class="absolute w-[30px] h-[30px] mt-8 ml-8 p-2 rounded-full hover:shadow-[0_0_5px_#DCDCDD,0_0_15px_#30BDAC,0_0_20px_#50A39A]">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
						<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
					</svg>
				</button>
				<form class="bg-white p-[7%] flex flex-col items-center justify-around w-full h-full border rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
					<h1>Sign In</h1>
					<a href="#" class="w-[30px] h-[30px] grid place-items-center p-1 rounded-full hover:shadow-[0_0_5px_#DCDCDD,0_0_15px_#30BDAC,0_0_20px_#50A39A]">
						<img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="google">
					</a>
					<span>or use your username password</span>
					<input type="username" placeholder="Usename"/>
					<input type="password" placeholder="Password"/>
					<a href="#">Forgot your password?</a>
					<button>Sign In</button>
				</form>
			</div>
		</div>`;
}

function loadSignUpForm() {
	if (!mainWrapper) return;
		
	mainWrapper.innerHTML = `
		<div class="w-[100dvw] h-[100dvh] flex justify-center items-center">
			<div class="w-[400px] h-[500px]">
				<button id="back" class="absolute w-[30px] h-[30px] mt-8 ml-8 p-2 rounded-full hover:shadow-[0_0_5px_#DCDCDD,0_0_15px_#30BDAC,0_0_20px_#50A39A]">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
						<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
					</svg>
				</button>
				<form class="bg-white p-[7%] flex flex-col items-center justify-around w-full h-full border rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
					<h1>Create Account</h1>
					<a href="#" class="w-[30px] h-[30px] grid place-items-center p-1 rounded-full hover:shadow-[0_0_5px_#DCDCDD,0_0_15px_#30BDAC,0_0_20px_#50A39A]">
						<img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="google">
					</a>
					<span>or use your email for registration</span>
					<input type="text" placeholder="Name"/>
					<input type="text" placeholder="Surname"/>
					<input type="text" placeholder="Username"/>
					<input type="email" placeholder="Email"/>
					<input type="password" placeholder="Password"/>
					<button>Sign Up</button>
				</form>
			</div>
		</div>`;
}

function returnToMainPage() {
	if (mainWrapper && initialContent) {
		mainWrapper.innerHTML = initialContent;
	}
}
