const mainWrapper = document.getElementById("wrapper") as HTMLElement | null;
const initialContent = mainWrapper?.innerHTML;

function loadSignInForm() {
	if (!mainWrapper) return;
	location.hash = "#signin";
	mainWrapper.innerHTML = `
		<div class="w-[100dvw] h-[100dvh] flex justify-center items-center">
			<div class="w-[400px] h-[500px]">
				<button id="back" onclick="returnToMainPage()" class="absolute w-[30px] h-[30px] mt-8 ml-8 p-2 rounded-full hover:shadow-[0_0_5px_#DCDCDD,0_0_15px_#30BDAC,0_0_20px_#50A39A]">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
						<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
					</svg>
				</button>
				<form id="loginForm" class="bg-white p-[7%] flex flex-col items-center justify-around w-full h-full border rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
					<h1>Sign In</h1>
					<a href="#" class="w-[30px] h-[30px] grid place-items-center p-1 rounded-full hover:shadow-[0_0_5px_#DCDCDD,0_0_15px_#30BDAC,0_0_20px_#50A39A]">
						<img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="google">
					</a>
					<span>or use your username password</span>
					<input type="username" name="username" placeholder="Username" required/>
					<input type="password" name="password" placeholder="Password" required/>
					<a href="#">Forgot your password?</a>
					<button type="submit">Sign In</button>
				</form>
			</div>
		</div>`;
	document.title = "Sign In";
}

function loadSignUpForm() {
	if (!mainWrapper) return;
	location.hash = "#signup";
	mainWrapper.innerHTML = `
		<div class="w-[100dvw] h-[100dvh] flex justify-center items-center">
			<div class="w-[400px] h-[500px]">
				<button id="back" onclick="returnToMainPage()" class="absolute w-[30px] h-[30px] mt-8 ml-8 p-2 rounded-full hover:shadow-[0_0_5px_#DCDCDD,0_0_15px_#30BDAC,0_0_20px_#50A39A]">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
						<path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
					</svg>
				</button>
				<form id="registrationForm" class="bg-white p-[7%] flex flex-col items-center justify-around w-full h-full border rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
					<h1>Create Account</h1>
					<a href="#" class="w-[30px] h-[30px] grid place-items-center p-1 rounded-full hover:shadow-[0_0_5px_#DCDCDD,0_0_15px_#30BDAC,0_0_20px_#50A39A]">
						<img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="google">
					</a>
					<span>or use your email for registration</span>
					<input type="text" name="name" placeholder="Name" required/>
					<input type="text" name="surname" placeholder="Surname" required/>
					<input type="text" name="username" placeholder="Username" required/>
					<input type="email" name="email" placeholder="Email" required/>
					<input type="password" name="password" placeholder="Password" required/>
					<button type="submit">Sign Up</button>
				</form>
			</div>
		</div>`;
	document.title = "Sign Up";
}

function returnToMainPage() {
	if (mainWrapper && initialContent) {
		location.hash = "#";
		mainWrapper.innerHTML = initialContent;
		document.title = "Welcome to Pong!";
	}
}

function handleRouting() {
	switch (location.hash) {
		case "#signin":
			loadSignInForm();
			break;
		case "#signup":
			loadSignUpForm();
			break;
		default:
			returnToMainPage();
			break;
	}
}

window.addEventListener("DOMContentLoaded", handleRouting);
window.addEventListener("hashchange", handleRouting);
