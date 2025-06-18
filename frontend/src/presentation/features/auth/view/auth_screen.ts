import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
import {State, StatefulWidget} from "@/core/framework/widgets/statefulWidget";
import {AuthGuard} from "@/presentation/features/auth/view/authGuard";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {type AuthState, AuthStatus} from "@/presentation/features/auth/logic/auth_state";
import {Navigator} from "@/core/framework/widgets/navigator";
import type {Widget} from "@/core/framework/core/base";
import {BlocListener} from "@/core/framework/bloc/blocListener";
import {showError} from "@/utils/error_messages";


export class AuthScreen extends  StatefulWidget {
    createState(): State<AuthScreen> {
        return new AuthScreenState();
    }
}

export class  AuthScreenState extends State<AuthScreen> {


    didMounted(context: BuildContext) {
        super.didMounted(context);
       this.setup(context);


    }


    setup(context: BuildContext) {
        const authBloc = context.read(AuthBloc);
        // const authBloc = context.watch(AuthBloc);



        const navigator = Navigator.of(context);
        const btn = document.getElementById('to-sign-in');
        const signupBtn = document.getElementById('to-sign-up');
        const tempProf = document.getElementById('temp-prof');

        btn?.addEventListener('click', e => {
            e.preventDefault();
            navigator.pushNamed('/login')
        })
        signupBtn?.addEventListener('click', e => {
            e.preventDefault();
            navigator.pushNamed('/register')
            // loadSignUpForm(context);
        })
        tempProf?.addEventListener('click', () => {
            this.setState(() => {})
            // navigator.pushNamed('/profile')
        })
        const googleLogoutButton = document.getElementById('logout-btn');

        googleLogoutButton?.addEventListener('click', async () => {
            await authBloc.logout();
            navigator.pushNamed('/');
            // loadHomePage();
        });
    }


    build(context: BuildContext): Widget {

        return new BlocListener<AuthBloc, AuthState>({
            blocType: AuthBloc,
            listener: (context, state) => {

                this.setup(context);

            },
            child: new HtmlWidget(`
        <div class="w-[100dvw] h-[100dvh] flex flex-col justify-center items-center text-center">
      <h1 class="wipe-text neon-text flex gap-0 overflow-hidden text-[2.5rem] sm:text-[4rem] md:text-[5rem] lg:text-[8rem] font-bold select-none text-primary animate-neonGlow"> WELCOME TO PONG! </h1>
      <div class="max-sm:flex-col login-div w-[70%] flex justify-evenly items-center gap-4 mt-10">
        <button id="to-sign-in">Sign In</button>
        <button id="to-sign-up">Sign up</button>
      </div>
    </div>
    `)
        });
    }
}