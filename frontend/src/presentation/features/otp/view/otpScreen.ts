import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {OTPBloc} from "@/presentation/features/otp/logic/otpBloc";
import {OTPState, OTPStatus} from "@/presentation/features/otp/logic/otpState";
import {TextController} from "@/core/framework/controllers/textController";
// import {OtpButton} from "@/presentation/features/otp/view/otpButton";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {OtpErrorWidget} from "@/presentation/features/otp/view/otpErrorWidget";
import {QRWidget} from "@/presentation/features/otp/view/QRWidget";
import {TextInputWidget} from "@/presentation/common/widget/textInputWidget";
import {SubmitButton} from "@/presentation/common/widget/submitButton";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {AuthStatus} from "@/presentation/features/auth/logic/auth_state";
import {showFlushBar} from "@/presentation/common/widget/flushBar";
import {Navigator} from "@/core/framework/widgets/navigator";
import {BlocListener} from "@/core/framework/bloc/blocListener";

export interface OTPParams {
    parentId?: string,
    showQR: boolean
}

export class OtpScreen extends StatelessWidget {
    readonly showQR: boolean;

    constructor(private params: OTPParams) {
        super();
        this.showQR = params.showQR ?? true
    }

    tokenController: TextController = new TextController()

    didMounted(context: BuildContext) {
        super.didMounted(context);
    }

    build(context: BuildContext): Widget {
        return new BlocListener<OTPBloc, OTPState>({

            blocType: OTPBloc,
            listener: (context, otpState) => {
                if (otpState.status == OTPStatus.Error) {
                    showFlushBar({message: otpState.errorMessage ?? "UNKNOWN ERROR"});
                    context.read(OTPBloc).resetOtp();
                }
                context.read(AuthBloc).stream.subscribe((state) => {
                    if (state.status == AuthStatus.SuccessTFA && otpState.status == OTPStatus.Success && !this.showQR) {
                        context.read(AuthBloc).claimTicket(state.loginTicket?.loginTicket ?? '').then(r => {
                        });
                        context.read(AuthBloc).resetState().then(() => {
                        });
                    }


                })

            },
            child: new DependComposite({
                dependWidgets: [
                    new HtmlWidget(`
                    <div id="otp-qr-content"></div>
                <div id="twofa-token-input-content"></div>
                 <div id="otp-btn-content"></div>
                 <div id="otp-error"></div>
                
                `, this.params.parentId),

                ], children: [
                    new SubmitButton({
                        label: "Verify",
                        id: "verify-2fa-btn",
                        className: "bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded",
                        onClick: () => {
                            const otpBloc = context.read(OTPBloc);
                            otpBloc.validateToken(this.tokenController.text);
                            const authBloc = context.read(AuthBloc);
                            const loginTicket = authBloc.state.loginTicket;
                            if (!(loginTicket && loginTicket.requires2fa && authBloc.state.status == AuthStatus.SuccessTFA)) {
                                otpBloc.otpVerify(this.tokenController.text).then()
                            }
                            else {
                                context.read(OTPBloc).stream.subscribe((state) => {
                                    if (state.isValidating && loginTicket && loginTicket.requires2fa && authBloc.state.status == AuthStatus.SuccessTFA) {
                                        authBloc.loginTwoFa(authBloc.state.loginTicket!.loginTicket, this.tokenController.text, state.isValid).then(() => {
                                        })
                                        otpBloc.resetOtp();
                                        otpBloc.resetValidating();
                                    }
                                })
                            }
                        },
                        disabled: false,
                        isHidden: false,
                        parentId: "otp-btn-content"
                    }),
                    new QRWidget('otp-qr-content', !this.showQR),
                    new TextInputWidget({
                        type: 'text',
                        id: 'twofa-token-input',
                        name: 'twofa-token',
                        className: 'w-full px-2 py-1 rounded-md text-black mb-2 border-grey-500',
                        props: `maxlength="6" pattern="[0-9]*" placeholder="Enter 6-digit code"`,
                        controller: this.tokenController,
                        parentId: "twofa-token-input-content"
                    }),
                    new OtpErrorWidget('otp-error')
                ]
            })
        })
    }
}