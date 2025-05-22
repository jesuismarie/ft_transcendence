function initLoginForm() {
	const loginForm = document.getElementById('loginForm') as HTMLFormElement | null;

	if (!loginForm)
		return;

	loginForm.addEventListener('submit', async (event: Event) => {
		event.preventDefault();
		clearErrors();

		const formData = new FormData(loginForm);
		const username = (formData.get('login_username') as string)?.trim();
		const password = (formData.get('login_password') as string)?.trim();

		let hasError = false;

		if (!username) {
			showError('login_username', 'Username is required.');
			hasError = true;
		}

		if (!password) {
			showError('login_password', 'Password is required.');
			hasError = true;
		}

		if (hasError)
			return;

		try {
			const response = await fetch('https://pong/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, password }),
			});

			const result = await response.json();

			if (!response.ok) {
				console.error('Login error:', result);
				showError('login_password', result?.message || 'Invalid credentials');
				return;
			}

			console.log('Login successful:', result);

			// localStorage.setItem('token', result.token);
		} catch (error) {
			console.error('Login failed:', error);
			showError('login_password', 'Network or server error.');
		}
	});
}
