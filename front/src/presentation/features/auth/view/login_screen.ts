import {StatelessWidget} from "@/core/rendering-engine/statelessWidget";
import {type BuildContext} from "@/core/rendering-engine/buildContext";
import type {Widget} from "@/core/rendering-engine/widget";
import {HtmlWidget} from "@/core/rendering-engine/htmlWidget";
import {initGoogleAuth, initLoginForm} from "@/profile/login";
import {loadSignInForm} from "@/presentation/templates/templates";

export class LoginScreen extends StatelessWidget {
    afterMounted(context: BuildContext) {
        super.afterMounted(context);
        const nav = context.navigator();
        const btn = document.getElementById('close-btn-login');
        // const googleSignBtn = document.getElementById('google-login-btn');
        btn?.addEventListener('click', () => {
            console.log("Clicccc")
            nav.pop(context)
        })
        loadSignInForm(context);
        // initGoogleAuth();
        // initLoginForm(context);
    }

    build(context: BuildContext): Widget {
        return new HtmlWidget(`<div class="w-[100dvw] h-[100dvh] flex justify-center items-center">
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
        `);
    }
}