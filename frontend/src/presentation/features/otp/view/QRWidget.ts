import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import {OTPBloc} from "@/presentation/features/otp/logic/otpBloc";
import {OTPState} from "@/presentation/features/otp/logic/otpState";
import {EmptyWidget} from "@/core/framework/widgets/emptyWidget";

export class QRWidget extends StatelessWidget {

    constructor(private parentId?: string, private isHidden: boolean = false) {
        super();
    }
    build(context: BuildContext): Widget {
        return !this.isHidden ? new DependComposite({
            dependWidgets: [
                new HtmlWidget(`<p class="mb-2 text-white">Scan this QR Code in your authenticator app:</p>
                <div class="mb-4 w-48 h-48">
                    <div id="otp-qr"></div>
                </div>`, this.parentId)
            ],
            children: [
                new BlocBuilder<OTPBloc, OTPState>({
                    blocType: OTPBloc,
                    parentId: 'otp-qr',
                    buildWhen: (oldState: OTPState, newState: OTPState) => !oldState.equals(newState),
                    builder: (context, state) => new HtmlWidget(`${state.otp?.qrSvg ?? ""}`)
                }),
            ]
        }) : new EmptyWidget()
    }
}