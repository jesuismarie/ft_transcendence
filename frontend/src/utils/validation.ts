export class Validator {
	static isValidUsername(username: string): boolean {
		return (
			/^[a-zA-Z_][a-zA-Z0-9_]{2,19}$/.test(username)
		);
	}
	static isValidEmail(email: string): boolean {
		return /^[^\d][^@]*@[^@]+\.[^@]+$/.test(email);
	}

	static isValidToken(token: string | undefined): boolean {
		return token !== undefined && token.length === 6 && /^\d+$/.test(token);
	}

	static isValidPassword(password: string): boolean {
		return (
			password.length >= 8 &&
			/[A-Z]/.test(password) &&
			/[!@#$%^&*(),.?":{}|<>]/.test(password) &&
			!/\s/.test(password)
		);
	}

	static isValidAvatar(dataUrl: string): boolean {
		return /^data:image\/(jpe?g|png|gif|webp);base64,/.test(dataUrl);
	}

	static isValidTwoFACode(code: string): boolean {
		return /^\d{6}$/.test(code);
	}

}

