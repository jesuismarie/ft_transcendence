import {StatelessWidget} from "@/core/framework/statelessWidget";
import {type BuildContext} from "@/core/framework/buildContext";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import {loadSignUpForm} from "@/presentation/templates/templates";
import {Navigator} from "@/core/framework/navigator";
import type {Widget} from "@/core/framework/base";
import {AuthGuard} from "@/presentation/features/auth/view/authGuard";
import {BlocListener} from "@/core/framework/blocListener";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {type AuthState, AuthStatus} from "@/presentation/features/auth/logic/auth_state";
import {ProfileBloc} from "@/presentation/profile/bloc/profileBloc";
import {showError} from "@/utils/error_messages";

export class RegisterScreen extends StatelessWidget {

    afterMounted(context: BuildContext) {
        super.afterMounted(context);
        const authGuard = new AuthGuard('/register', false, true);
        authGuard.guard(context)
        const nav = Navigator.of(context);
        const btn = document.getElementById('close-signup-btn');
        btn?.addEventListener('click', () => {
            nav.pop()
        })
        loadSignUpForm(context)
        // initGoogleRegister();
        // initRegistrationForm();
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
                    console.error('Register failed:', state.errorMessage);
                    showError('reg_username', state.errorMessage ?? "UNKNOWN ERROR");
                    context.read(AuthBloc).resetState().then();
                }
            },
            child: new HtmlWidget(`
    <div class="w-[100dvw] h-[100dvh] flex justify-center items-center">
      <div class="w-[400px] h-[500px]">
        <button id="close-signup-btn" class="absolute w-[30px] h-[30px] mt-8 ml-8 p-2 rounded-full hover:shadow-neon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
        </button>
        <form id="registrationForm" class="bg-white p-[7%] flex flex-col items-center justify-around w-full h-full border rounded-[20px] shadow-div-glow">
          <h1> Create Account </h1>
          <a id="google-register-btn" href="#" class="w-9 h-9 grid place-items-center p-1 border border-gray-300 rounded-full hover:shadow-neon">
            <img src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA" alt="google">
          </a>
          <span>or use your email for registration</span>
          <input type="text" name="reg_username" placeholder="Username" />
          <p class="error-msg text-red-500 text-sm" data-error-for="reg_username"></p>
          <input type="text" name="reg_email" placeholder="Email" />
          <p class="error-msg text-red-500 text-sm" data-error-for="reg_email"></p>
          <input type="password" name="reg_password" placeholder="Password" />
          <p class="error-msg text-red-500 text-sm" data-error-for="reg_password"></p>
          <input type="password" name="reg_confirm_password" placeholder="Confirm Password" />
          <p class="error-msg text-red-500 text-sm" data-error-for="reg_confirm_password"></p>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>`)
        });
    }

}