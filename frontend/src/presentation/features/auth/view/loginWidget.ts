// Turn this into a widget that can be used in the app
import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import type {Widget} from "@/core/framework/core/base";
import {BuildContext} from "@/core/framework/core/buildContext";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {SubmitButton} from "@/presentation/common/widget/submitButton";
import {clearErrors, showError} from "@/utils/error_messages";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {BlocListener} from "@/core/framework/bloc/blocListener";
import {AuthState, AuthStatus} from "@/presentation/features/auth/logic/auth_state";
import {Navigator} from "@/core/framework/widgets/navigator";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";

export class LoginWidget extends StatelessWidget {
	didMounted(context: BuildContext) {
		super.didMounted(context);
		// Whatever setup you need to do after the widget is mounted
		const googleLoginButton = document.getElementById('google-login-btn');
		if (!googleLoginButton)
			return;
		googleLoginButton.addEventListener('click', async () => {
			context.read(AuthBloc).oauth();
		});
	}
	
	constructor(public parentId?: string) {
		super();
	}
	build(context: BuildContext): Widget {
		return new BlocListener<AuthBloc, AuthState>({
			blocType: AuthBloc,
			listener: (context, state) => {
				if (state.status == AuthStatus.Error) {
					console.error('Login failed:', state.errorMessage);
					showError('login_password', state.errorMessage ?? "UNKNOWN ERROR");
					context.read(AuthBloc).resetState().then();
				}
				if (state.status == AuthStatus.Success) {
					context.read(AuthBloc).resetState().then();
					Navigator.of(context).pushNamed('/profile');
				}
			},
			child: new DependComposite({
				dependWidgets:[ new HtmlWidget(`<div class="w-[100dvw] h-[100dvh] flex justify-center items-center">
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
      				<div id="submit-btn-content">
      				</div>
    				</form>
  				</div>
			</div>`,
					this.parentId),
				],
				children: [
					// Submit Button
					new BlocBuilder<AuthBloc, AuthState>({
						blocType: AuthBloc,
						buildWhen: (oldState, newState) => !oldState.equals(newState),
						builder: (context, state) => new SubmitButton({
							id: 'login-btn',
							parentId: 'submit-btn-content',
							disabled: state.status == AuthStatus.Loading,
							isHidden: false,
							label: 'Sign In',
							onClick: async (loginForm) => {
								clearErrors();
								
								const formData = new FormData(loginForm as HTMLFormElement);
								const email = (formData.get('login_email') as string)?.trim();
								const password = (formData.get('login_password') as string)?.trim();
								
								const authBloc = context.read(AuthBloc)
								if (email && password) {
									await authBloc.login({email, password});
								}
							}
						}),
					})
					
					// TODO: OTP Modal
				]}
			)
		})
	}
}

