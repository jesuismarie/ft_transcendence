import "reflect-metadata";
import {clearErrors, showError} from "@/utils/error_messages";
import {ApiConstants} from "@/core/constants/apiConstants";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {AuthStatus} from "@/presentation/features/auth/logic/auth_state";
import type {BuildContext} from "@/core/framework/core/buildContext";
import {Validator} from "@/utils/validation";
import {Navigator} from "@/core/framework/widgets/navigator";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";


export function initGoogleAuth(context: BuildContext) {
    const googleLoginButton = document.getElementById('google-login-btn');
    if (!googleLoginButton)
        return;

    googleLoginButton.addEventListener('click', async () => {
        const authBloc = context.read(AuthBloc);
        await authBloc.loginWithGoogle();

        // window.location.href = `${ApiConstants.baseUrlDev}${ApiConstants.auth}`;
        // listen /auth/redirect route params and
        // send second request with code
    });
}

export function initLoginForm(context: BuildContext) {

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
    // });
}
