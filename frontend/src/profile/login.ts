import "reflect-metadata";
import {clearErrors, showError} from "@/utils/error_messages";
import {ApiConstants} from "@/core/constants/apiConstants";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {AuthStatus} from "@/presentation/features/auth/logic/auth_state";
import type {BuildContext} from "@/core/framework/buildContext";
import {Validator} from "@/utils/validation";
import {Navigator} from "@/core/framework/navigator";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";


export function initGoogleAuth(context: BuildContext) {
    const googleLoginButton = document.getElementById('google-login-btn');
    if (!googleLoginButton)
        return;

    googleLoginButton.addEventListener('click', async () => {
        const authBloc = context.read(AuthBloc);
        await authBloc.loginWithGoogle();
        // window.location.href = `${ApiConstants.baseUrlDev}${ApiConstants.auth}`;
    });
}

export function initLoginForm(context: BuildContext) {
    const navigator = Navigator.of(context);
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
        } else if (!Validator.isValidEmail(email)) {
            showError('login_email', 'Invalid email format.');
            hasError = true;
        }

        if (!password) {
            showError('login_password', 'Password is required.');
            hasError = true;
        }

        if (hasError)
            return;

        const authBloc = context.read(AuthBloc)
        await authBloc.login({email, password});
        // if (authBloc.state.status === AuthStatus.Success) {
        //     // if (authLogic.state.user) {
        //     //     // localStorage.setItem("currentUser", JSON.stringify(authLogic.state.user));
        //     //     // localStorage.setItem("currentUserId", authLogic.state.user.userId.toString());
        //     // }
        //     await authBloc.resetState();
        //     navigator.pushNamed( '/profile')
        //     // loadProfilePage(currentUser);
        //     return;
        // }
        // else if(authBloc.state.status === AuthStatus.Error) {
        //     console.error('Login failed:', authBloc.state.errorMessage);
        //     showError('login_password', 'Network or server error.');
        //     await authBloc.resetState();
        //     return;
        // }
    });
}
