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

function isValidUsername(username: string): boolean {
	return (
		/^[a-zA-Z_][a-zA-Z0-9_]{2,19}$/.test(username)
	);
}

function isValidEmail(email: string): boolean {
	return /^[^\d][^@]*@[^@]+\.[^@]+$/.test(email);
}

function isValidPassword(password: string): boolean {
	return (
		password.length >= 8 &&
		/[A-Z]/.test(password) &&
		/[!@#$%^&*(),.?":{}|<>]/.test(password) &&
		!/\s/.test(password)
	);
}

function initRegistrationForm() {
	const registrationForm = document.getElementById('registrationForm') as HTMLFormElement | null;

	if (!registrationForm) return;

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

		const username = formValues.username || '';
		const email = formValues.email || '';
		const password = formValues.password?.toString() || '';

		let hasError = false;

		if (!username) {
			showError('username', 'Username is required.');
			hasError = true;
		} else if (!isValidUsername(username)) {
			showError('username', 'Invalid username.');
			hasError = true;
		}

		if (!email) {
			showError('email', 'Email is required.');
			hasError = true;
		} else if (!isValidEmail(email)) {
			showError('email', 'Invalid email.');
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

		if (!hasError && !isValidPassword(password)) {
			showError('password', 'Invalid password.');
			showError('confirm_password', 'Invalid password.');
			hasError = true;
		}

		if (password !== confirmPassword) {
			showError('confirm_password', 'Passwords do not match.');
			hasError = true;
		}

		if (hasError) return;

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
