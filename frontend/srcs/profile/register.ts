function showError(fieldName: string, message: string) {
	const errorP = document.querySelector<HTMLParagraphElement>(`.error-msg[data-error-for="${fieldName}"]`);
	if (errorP) {
		errorP.textContent = message;
	}
}

function clearErrors() {
	const allErrors = document.querySelectorAll<HTMLParagraphElement>('.error-msg');
	allErrors.forEach((el) => (el.textContent = ''));
}

function initRegistrationForm() {
	const registrationForm = document.getElementById('registrationForm') as HTMLFormElement | null;

	if (!registrationForm)
		return;

	registrationForm.addEventListener('submit', async (event: Event) => {
		event.preventDefault();
		clearErrors();

		const formData = new FormData(registrationForm);
		const formValues: Partial<RegistrationFormData> = {};

		let confirmPassword = '';

		formData.forEach((value, key) => {
			if (typeof value === 'string') {
				if (key === 'confirm_password') {
					confirmPassword = value.trim();
				} else {
					formValues[key as keyof RegistrationFormData] = value.trim();
				}
			}
		});

		const username = formValues.username?.trim() || '';
		const email = formValues.email?.trim() || '';
		const password = formValues.password?.toString() || '';

		console.log('Form data:', {
			username,
			email,
			password,
			confirmPassword,
		});
		let hasError = false;

		if (!username) {
			showError('username', 'Username is required.');
			hasError = true;
		}
		if (!email) {
			showError('email', 'Email is required.');
			hasError = true;
		}
		if (!password) {
			showError('password', 'Password is required.');
			hasError = true;
		}
		if (!confirmPassword) {
			showError('confirm_password', 'Confirm Password is required.');
			hasError = true;
		}

		if (hasError)
			return;

		if (/^\d/.test(username) || /\s/.test(username) || /[^a-zA-Z0-9_]/.test(username) || username.length < 3 || username.length > 20) {
			showError('username', 'Invalid username.');
			hasError = true;
		}

		if (!email.includes('@')) {
			showError('email', 'Invalid email.');
			hasError = true;
		}

		if (password.length < 8) {
			showError('password', 'Password must be at least 8 characters.');
			hasError = true;
		} else if (!/[A-Z]/.test(password)) {
			showError('password', 'Password must contain at least one uppercase letter.');
			hasError = true;
		} else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
			showError('password', 'Password must include at least one special character.');
			hasError = true;
		} else if (/\s/.test(password)) {
			showError('password', 'Password must not contain spaces.');
			hasError = true;
		}

		if (password !== confirmPassword) {
			showError('confirm_password', 'Passwords do not match.');
			hasError = true;
		}

		if (hasError)
			return;

		try {
			const response = await fetch('https://pong/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formValues),
			});

			const result = await response.json();

			if (!response.ok) {
				console.error('Server responded with error:', result);
				showError('email', result?.message || 'Server error');
				return;
			}

			console.log('Registration successful:', result);
			// loadProfile(); // optional
		} catch (error) {
			console.error('Registration failed:', error);
		}
	});
}
