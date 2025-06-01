import "reflect-metadata";
import {clearErrors, showError} from "@/utils/error_messages";
import {isValidEmail} from "@/utils/validation";
import {ApiConstants} from "@/core/constants/apiConstants";
import type {UserEntity} from "@/domain/entity/user_entity.ts";
import {container} from "tsyringe";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository";
import {AuthLogic} from "@/presentation/features/oauth/logic/auth_logic";
import {AuthStatus} from "@/presentation/features/oauth/state/auth_state";
import {loadProfilePage} from "@/presentation/templates/templates";
import {currentUser} from "@/utils/user";
import type {BuildContext} from "@/core/framework/buildContext";


export function initGoogleAuth() {
    const googleLoginButton = document.getElementById('google-login-btn');
    if (!googleLoginButton)
        return;

    googleLoginButton.addEventListener('click', async () => {
        window.location.href = `${ApiConstants.baseUrlDev}${ApiConstants.auth}`;
    });
}

export function initLoginForm(context: BuildContext) {
    const navigator = context.navigator();
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
        } else if (!isValidEmail(email)) {
            showError('login_email', 'Invalid email format.');
            hasError = true;
        }

        if (!password) {
            showError('login_password', 'Password is required.');
            hasError = true;
        }

        if (hasError)
            return;

        const authRepository = container.resolve<RemoteAuthRepository>('RemoteAuthRepository');
        const authLogic = new AuthLogic(authRepository);
        await authLogic.login({email, password});

        if (authLogic.state.status === AuthStatus.Success) {
            if (authLogic.state.user) {
                localStorage.setItem("currentUser", JSON.stringify(authLogic.state.user));
                localStorage.setItem("currentUserId", authLogic.state.user.userId.toString());
            }
            await authLogic.resetState();
            navigator.pushNamed(context, '/profile')
            // loadProfilePage(currentUser);
            return;
        }
        else if(authLogic.state.status === AuthStatus.Error) {
            console.error('Login failed:', authLogic.state.errorMessage);
            showError('login_password', 'Network or server error.');
            await authLogic.resetState();
            return;
        }
    });
}
