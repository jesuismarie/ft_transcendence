function showError(fieldName: string, message: string) {
	const errorP = document.querySelector<HTMLParagraphElement>(`.error-msg[data-error-for="${fieldName}"]`);
	if (errorP) {
		errorP.textContent = message;
		errorP.classList.add('h-4');
	}
}

function clearErrors() {
	const allErrors = document.querySelectorAll<HTMLParagraphElement>('.error-msg');
	allErrors.forEach((el) => (el.textContent = '', el.classList.remove('h-4')));
}
