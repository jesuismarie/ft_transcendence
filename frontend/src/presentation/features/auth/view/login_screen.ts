import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {loadSignInForm} from "@/presentation/templates/templates";
import {Navigator} from "@/core/framework/widgets/navigator";
import type {Widget} from "@/core/framework/core/base";
import {BlocListener} from "@/core/framework/bloc/blocListener";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {type AuthState, AuthStatus} from "@/presentation/features/auth/logic/auth_state";
import {showError} from "@/utils/error_messages";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
import {ProfileState, ProfileStatus} from "@/presentation/features/profile/bloc/profileState";
import {AuthGuard} from "@/presentation/features/auth/view/authGuard";

export class LoginScreen extends StatelessWidget {
    didMounted(context: BuildContext) {
        super.didMounted(context);
        const authGuard = new AuthGuard('/login', false, true);
        authGuard.guard(context)
        const nav = Navigator.of(context);
        const btn = document.getElementById('close-btn-login');
        btn?.addEventListener('click', () => {
            console.log("Clicccc")
            nav.pop()
        })
        loadSignInForm(context);
    }

    build(context: BuildContext): Widget {
        return new BlocListener<AuthBloc, AuthState>({
            blocType: AuthBloc,
            listener: (context, state) => {
                if (state.status == AuthStatus.Success) {
                    context.read(AuthBloc).resetState().then();
                    // context.read(ProfileBloc).getUserProfile(state.user?.userId?.toString() ?? '').then(r => r);
                    Navigator.of(context).pushNamed('/profile')
                }
                if (state.status == AuthStatus.Error) {
                    console.error('Login failed:', state.errorMessage);
                    showError('login_password', state.errorMessage ?? "UNKNOWN ERROR");
                    context.read(AuthBloc).resetState().then();
                }
            },
            child: new HtmlWidget(`<div class="w-[100dvw] h-[100dvh] flex justify-center items-center">
  <div class="w-[400px] h-[500px]">
    <button id="close-btn-login" class="absolute w-[30px] h-[30px] mt-8 ml-8 p-2 rounded-full hover:shadow-neon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
      </svg>
    </button>
    <form id="loginForm" class="bg-white p-[7%] flex flex-col items-center justify-around w-full h-full border rounded-[20px] shadow-div-glow">
      <h1>Sign In</h1>
      <a id="google-login-btn" href="#" class="w-9 h-9 grid place-items-center p-1 border border-gray-300 rounded-full hover:shadow-neon">
        <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="google">
      </a>
      <span>or use your email password</span>
      <input type="text" name="login_email" placeholder="Email" />
      <p class="error-msg text-red-500 text-sm" data-error-for="login_email"></p>
      <input type="password" name="login_password" placeholder="Password" />
      <p class="error-msg text-red-500 text-sm" data-error-for="login_password"></p>
      <button type="submit">Sign In</button>
    </form>
  </div>
</div>
        `)
        });
    }
}