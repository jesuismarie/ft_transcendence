import {container} from "tsyringe";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository";
import {AuthLogic} from "@/presentation/features/oauth/logic/auth_logic";
import {HtmlWidget} from "@/core/rendering-engine/htmlWidget";
import type {BuildContext} from "@/core/rendering-engine/buildContext";
import type {Widget} from "@/core/rendering-engine/widget";
import {State, StatefulWidget} from "@/core/rendering-engine/statefulWidget";
import {loadSignUpForm} from "@/presentation/templates/templates";

export function logoutCallback() {
    const googleLogoutButton = document.getElementById('logout-btn');
    if (!googleLogoutButton)
        return;

    googleLogoutButton.addEventListener('click', async () => {
        const authRepository = container.resolve<RemoteAuthRepository>('RemoteAuthRepository');
        const authLogic = new AuthLogic(authRepository);
        await authLogic.logout();
        // loadHomePage();
    });
}



export class AuthScreen extends  StatefulWidget {
    createState(): State<AuthScreen> {
        return new AuthScreenState();
    }
}

export class  AuthScreenState extends State<AuthScreen> {
    x = 0;

    afterMounted(context: BuildContext) {
        super.afterMounted(context);
        const navigator = context.navigator();
        const btn = document.getElementById('to-sign-in');
        const signupBtn = document.getElementById('to-sign-up');
        const tempProf = document.getElementById('temp-prof');
        // context.logWidgetTree(context);
        btn?.addEventListener('click', e => {
            e.preventDefault();
            const navigator = context.navigator();
                navigator.pushNamed(context, '/login')
        })
        signupBtn?.addEventListener('click', e => {
            e.preventDefault();
            loadSignUpForm(context);
        })
        tempProf?.addEventListener('click', () => {
            console.log("pppppppp")
            navigator.pushNamed(context, '/profile')
        })
    }

    build(context: BuildContext): Widget {

        return new HtmlWidget(`
        <div class="w-[100dvw] h-[100dvh] flex flex-col justify-center items-center text-center">
      <h1 class="wipe-text neon-text flex gap-0 overflow-hidden text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-[8rem] font-bold select-none text-primary animate-neonGlow"> WELCOME TO PONG! ${this.x}</h1>
      <div class="max-sm:flex-col login-div w-[70%] flex justify-evenly items-center gap-4 mt-10">
        <button id="to-sign-in">Sign In</button>
        <button id="to-sign-up">Sign up</button>
        <button id="temp-prof">Temprory Profile</button>
      </div>
    </div>
    <div id="twofa-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
      <div class="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden transform transition-all">
        <div class="px-4 pt-5 pb-4 sm:p-6">
          <h3 class="text-lg border-b border-hover pb-2"> Two Factor Authentication </h3>
          <div class="flex flex-col sm:flex-row gap-4 mt-4">
            <input type="text" id="twofa-input" name="twofa-code" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-hover sm:text-sm">
            <p class="error-msg text-red-500 text-sm" data-error-for="twofa-code"></p>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
          <button id="twofa-verify" class="bg-hover hover:shadow-neon text-white py-2 px-4 rounded-md">Verify</button>
        </div>
      </div>
    </div>`);
    }
}