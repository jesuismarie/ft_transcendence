function initGoogleRegister() {
	const googleRegisterButton = document.getElementById('google-register-btn');
	if (!googleRegisterButton)
		return;

	googleRegisterButton.addEventListener('click', () => {
		window.location.href = '/auth/oauth/google';
	});
}

function initRegistrationForm() {
	const registrationForm = document.getElementById('registrationForm') as HTMLFormElement | null;

	if (!registrationForm) 
		return;

	registrationForm.addEventListener('submit', async (event: Event) => {
		event.preventDefault();

		const formData = new FormData(registrationForm);

		const username = (formData.get('reg_username') as string)?.trim();
		const email = (formData.get('reg_email') as string)?.trim();
		const password = (formData.get('reg_password') as string)?.trim();
		const confirmPassword = (formData.get('reg_confirm_password') as string)?.trim();

		let hasError = false;
		clearErrors();

		if (!username) {
			showError('reg_username', 'Username is required.');
			hasError = true;
		} else if (!isValidUsername(username)) {
			showError('reg_username', 'Invalid username.');
			hasError = true;
		}

		if (!email) {
			showError('reg_email', 'Email is required.');
			hasError = true;
		} else if (!isValidEmail(email)) {
			showError('reg_email', 'Invalid email address.');
			hasError = true;
		}

		if (!password) {
			showError('reg_password', 'Password is required.');
			hasError = true;
		}

		if (!confirmPassword) {
			showError('reg_confirm_password', 'Please confirm your password.');
			hasError = true;
		}

		if (!hasError && !isValidPassword(password)) {
			showError('reg_password', 'Invalid password.');
			showError('confirm_password', 'Invalid password.');
			hasError = true;
		}

		if (password !== confirmPassword) {
			showError('reg_confirm_password', 'Passwords do not match.');
			hasError = true;
		}

		if (hasError)
			return;

		try {
			const response = await fetch("/auth/register", {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, username, password }),
				credentials: 'include'
			});

			const result = await response.json();

			if (!response.ok) {
				console.error('Registration failed:', result);
				showError('reg_email', result?.message || 'Server error');
				return;
			}

			console.log('Registration successful:', result);
			// window.location.href = '/login';
		} catch (error) {
			console.error('Network error during registration:', error);
			showError('reg_email', 'Network or server error.');
		}
	});
}
