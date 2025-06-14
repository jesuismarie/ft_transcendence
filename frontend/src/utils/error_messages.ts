export function showError(fieldName: string, message: string) {
	const errorP = document.querySelector<HTMLParagraphElement>(`.error-msg[data-error-for="${fieldName}"]`);
	if (errorP) {
		errorP.textContent = message;
		errorP.classList.add('h-4');
	}
}

export function clearError(fieldName: string) {
	const errorP = document.querySelector<HTMLParagraphElement>(`.error-msg[data-error-for="${fieldName}"]`);
	if (errorP) {
		errorP.textContent = '';
		errorP.classList.remove('h-4');
	}
}

export function clearErrors() {
	const allErrors = document.querySelectorAll<HTMLParagraphElement>('.error-msg');
	allErrors.forEach((el) => (el.textContent = '', el.classList.remove('h-4')));
}
