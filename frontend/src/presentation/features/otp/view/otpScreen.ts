import {StatelessWidget} from "@/core/framework/statelessWidget";
import {type BuildContext} from "@/core/framework/buildContext";
import type {Widget} from "@/core/framework/base";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import {BlocBuilder} from "@/core/framework/blocBuilder";
import {OTPBloc} from "@/presentation/features/otp/logic/otpBloc";
import {OTPState, OTPStatus} from "@/presentation/features/otp/logic/otpState";
import {TextController} from "@/core/framework/textController";
import {EmptyWidget} from "@/core/framework/emptyWidget";
import {BlocListener} from "@/core/framework/blocListener";
import {Composite} from "@/core/framework/composite";
import {OtpButton} from "@/presentation/features/otp/view/otpButton";
import {MountAwareComposite} from "@/core/framework/mountAwareComposite";
import {BuilderWidget} from "@/core/framework/builderWidget";

export class OtpScreen extends StatelessWidget {

    constructor(public parentId?: string) {
        super();
    }

    tokenController: TextController = new TextController()

    didMounted(context: BuildContext) {
        super.didMounted(context);


        const tokenInput = document.getElementById("twofa-token-input") as HTMLInputElement;

        if (tokenInput) {
            this.tokenController.bindInput(tokenInput)
        }



    }

    build(context: BuildContext): Widget {
        return new BlocBuilder<OTPBloc, OTPState>({
            blocType: OTPBloc,
            parentId: this.parentId,
            buildWhen: (oldState: OTPState, newState: OTPState) => !oldState.equals(newState),
            builder: (context, state) => {
                console.log(`BUILDDDERRR:::: ${state.status}`);
                if (state.status == OTPStatus.Loading) {
                    return new HtmlWidget(`Loading QR code...`)
                }
                if (state.status == OTPStatus.Error) {
                    return new HtmlWidget(`<p class="text-red-500">Could not generate QR code. Please try again later.</p>`)
                }
                if (state.status == OTPStatus.Success) {
                    return new HtmlWidget(`<p class="text-green-500">2FA enabled successfully!</p>`)
                }
                if (!state.isValid) {
                    return new HtmlWidget(`<p class="text-red-500">Please enter a valid 6-digit code.</p>`)
                }
                if (state.verified && state.verified.verified) {
                    return new HtmlWidget(`<p class="text-red-500">2FA verified verified!</p>`)
                } else if (state.verified && !state.verified.verified) {
                    return new HtmlWidget(`<p class="text-red-500">Invalid verification code. Please try again.</p>`)
                }
                if (!state.otp?.qrSvg && state.isInitialized) {
                    return new HtmlWidget(`<p class="text-red-500">Could not generate QR code. Please try again later.</p>`)
                }
                if (state.isInitialized) {
                    return new Composite([
                        new HtmlWidget(`
                <p class="mb-2 text-white">Scan this QR Code in your authenticator app:</p>
                <div class="mb-4 w-48 h-48">
                ${state.otp?.qrSvg ?? ""}
                </div>
                <input id="twofa-token-input" type="text" placeholder="Enter 6-digit code" 
                    class="w-full px-2 py-1 rounded-md text-black mb-2" maxlength="6" pattern="[0-9]*" />
                 <div id="otp-btn-content"></div>
                
                `),
                    new MountAwareComposite((context) => new BuilderWidget((context)=>new OtpButton(this.tokenController.text))
                    )])
                }
                return new EmptyWidget()
            }
        });
    }
}