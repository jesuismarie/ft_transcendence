const mainWrapper = document.getElementById("wrapper");

document.addEventListener("DOMContentLoaded", () => {
	const button = document.getElementById("to-sign-in");
	if (button) {
		button.addEventListener("click", () => {
			if (mainWrapper) {
				mainWrapper.innerHTML = `
					<div class="w-[100dvw] h-[100dvh] flex justify-center items-center">
						<div class="w-[400px] h-[500px]">
							<form class="bg-white p-[7%] flex flex-col items-center justify-around w-full h-full	border rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
								<h1>Sign In</h1>
								<a href="#" class="w-[23px] h-[23px] grid place-items-center">
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
			document.title = "Sign In";
		});
	}
});

document.addEventListener("DOMContentLoaded", () => {
	const button = document.getElementById("to-sign-up");
	if (button) {
		button.addEventListener("click", () => {
			if (mainWrapper) {
				mainWrapper.innerHTML = `
					<div class="w-[100dvw] h-[100dvh] flex justify-center items-center">
						<div class="w-[400px] h-[500px]">
							<form class="bg-white p-[7%] flex flex-col items-center justify-around w-full h-full border rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
								<h1>Create Account</h1>
								<a href="#" class="w-[23px] h-[23px] grid place-items-center">
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
			document.title = "Sign Up";
		});
	}
});
