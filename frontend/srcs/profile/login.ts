function initGoogleAuth() {
	const googleLoginButton = document.getElementById('google-login-btn');
	if (!googleLoginButton)
		return;

	googleLoginButton.addEventListener('click', () => {
		window.location.href = '/auth/oauth/google';
	});
}

function initLoginForm() {
	const loginForm = document.getElementById('loginForm') as HTMLFormElement | null;

	if (!loginForm)
		return;

	loginForm.addEventListener('submit', async (event: Event) => {
		event.preventDefault();
		clearErrors();

		const formData = new FormData(loginForm);
		const email = (formData.get('login_email') as string)?.trim();
		const password = (formData.get('login_password') as string)?.trim();

		let hasError = false;
		clearErrors();

		if (!email) {
			showError('login_email', 'Email is required.');
			hasError = true;
		} else if (!isValidEmail(email)) {
			showError('login_email', 'Invalid email format.');
			hasError = true;
		}

		if (!password) {
			showError('login_password', 'Password is required.');
			hasError = true;
		}

		if (hasError)
			return;

		try {
			const response = await fetch("/auth/login", {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
				credentials: 'include'
			});

			const result = await response.json();

			if (!response.ok) {
				console.error('Login error:', result);
				showError('login_password', result?.message || 'Invalid credentials');
				return;
			}
			if (result.id) {
				localStorage.setItem("currentUser", result.username);
				localStorage.setItem("currentUserId", result.id.toString());
			}
		} catch (error) {
			console.error('Login failed:', error);
			showError('login_password', 'Network or server error.');
		}
	});
}
