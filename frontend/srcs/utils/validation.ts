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