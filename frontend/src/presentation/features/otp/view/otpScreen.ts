import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import {OTPBloc} from "@/presentation/features/otp/logic/otpBloc";
import {OTPState, OTPStatus} from "@/presentation/features/otp/logic/otpState";
import {TextController} from "@/core/framework/controllers/textController";
import {EmptyWidget} from "@/core/framework/widgets/emptyWidget";
import {BlocListener} from "@/core/framework/bloc/blocListener";
import {Composite} from "@/core/framework/widgets/composite";
import {OtpButton} from "@/presentation/features/otp/view/otpButton";
import {MountAwareComposite} from "@/core/framework/widgets/mountAwareComposite";
import {BuilderWidget} from "@/core/framework/widgets/builderWidget";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {OtpErrorWidget} from "@/presentation/features/otp/view/otpErrorWidget";

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
        return new DependComposite({
            dependWidgets: [
                new HtmlWidget(`
                <p class="mb-2 text-white">Scan this QR Code in your authenticator app:</p>
                <div class="mb-4 w-48 h-48">
                    <div id="otp-qr"></div>
                </div>
                <input id="twofa-token-input" type="text" placeholder="Enter 6-digit code" 
                    class="w-full px-2 py-1 rounded-md text-black mb-2" maxlength="6" pattern="[0-9]*" />
                 <div id="otp-btn-content"></div>
                 <div id="otp-error"></div>
                
                `, this.parentId),

            ], children: [

                new OtpButton(this.tokenController),
                new BlocBuilder<OTPBloc, OTPState>({
                    blocType: OTPBloc,
                    parentId: 'otp-qr',
                    buildWhen: (oldState: OTPState, newState: OTPState) => !oldState.equals(newState),
                    builder: (context, state) => new HtmlWidget(`${state.otp?.qrSvg ?? ""}`)
                }),
                new OtpErrorWidget('otp-error')
            ]
        })
    }
}