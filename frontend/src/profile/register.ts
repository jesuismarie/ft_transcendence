import {clearErrors, showError } from "@/utils/error_messages";
// import {isValidEmail, isValidPassword, isValidUsername } from "@/utils/validation";
import {AuthStatus} from "@/presentation/features/auth/logic/auth_state";
import {ApiConstants} from "@/core/constants/apiConstants";
import {Resolver} from "@/di/resolver";
import type {BuildContext} from "@/core/framework/buildContext";
import {Validator} from "@/utils/validation";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {Navigator} from "@/core/framework/navigator";

export function initGoogleRegister() {
	const googleRegisterButton = document.getElementById('google-register-btn');
	if (!googleRegisterButton)
		return;

	googleRegisterButton.addEventListener('click', () => {
		window.location.href = `${ApiConstants.baseUrlDev}${ApiConstants.auth}`;
	});
}

export function initRegistrationForm(context: BuildContext) {
	const registrationForm = document.getElementById('registrationForm') as HTMLFormElement | null;

	if (!registrationForm) 
		return;

	const navigator = Navigator.of(context);
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
		} else if (!Validator.isValidUsername(username)) {
			showError('reg_username', 'Invalid username.');
			hasError = true;
		}

		if (!email) {
			showError('reg_email', 'Email is required.');
			hasError = true;
		} else if (!Validator.isValidEmail(email)) {
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

		if (!hasError && !Validator.isValidPassword(password)) {
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

		const authLogic = context.read(AuthBloc)
		await authLogic.register({username, password, email});
		if (authLogic.state.status === AuthStatus.Success) {
			console.log('Registration successful:');
			await authLogic.resetState();

			navigator.pushNamed( '/profile');
			return;
		}
		else if(authLogic.state.status === AuthStatus.Error) {
			showError('reg_email', authLogic.state.errorMessage || 'Registration Failed.');
			return;
		}
	});
}
