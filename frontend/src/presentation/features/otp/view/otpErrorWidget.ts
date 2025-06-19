import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import type {BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import {OTPBloc} from "@/presentation/features/otp/logic/otpBloc";
import {OTPState, OTPStatus} from "@/presentation/features/otp/logic/otpState";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {EmptyWidget} from "@/core/framework/widgets/emptyWidget";

export class OtpErrorWidget extends StatelessWidget {
    constructor(private parentId?: string) {
        super();
    }
    build(context: BuildContext): Widget {
        return new BlocBuilder<OTPBloc, OTPState>({
            blocType: OTPBloc,
            parentId: this.parentId,
            buildWhen: (oldState: OTPState, newState: OTPState) => !oldState.equals(newState),
            builder: (context, state) => {
                if (state.status == OTPStatus.Error) {
                    return new HtmlWidget(`<p class="text-red-500">${state.errorMessage ?? "Could not generate QR code. Please try again later."}</p>`)
                }
                if (state.status == OTPStatus.Loading) {
                    return new HtmlWidget(`Loading QR code...`)
                }
                if (state.status == OTPStatus.Success) {
                    return new HtmlWidget(`<p class="text-green-500">2FA enabled successfully!</p>`)
                }
                if (!state.isValid) {
                    return new HtmlWidget(`<p class="text-red-500">Please enter a valid 6-digit code.</p>`)
                }
                if (state.verified && state.verified.verified) {
                    return new HtmlWidget(`<p class="text-green-500">2FA verified Successfully</p>`)
                } else if (state.verified && !state.verified.verified) {
                    return new HtmlWidget(`<p class="text-red-500">Invalid verification code. Please try again.</p>`)
                }
                return new EmptyWidget()
            }
        })
    }
}