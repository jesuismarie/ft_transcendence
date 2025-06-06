import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {OTPBloc} from "@/presentation/features/otp/logic/otpBloc";

export class OtpButton extends StatelessWidget {
    constructor(private token: string) {
        super();
    }
    didMounted(context: BuildContext) {
        super.didMounted(context);
        const verifyBtn = document.getElementById("verify-2fa-btn");
        const otpBloc = context.read(OTPBloc);
        verifyBtn?.addEventListener("click", async () => {
            otpBloc.validateToken(this.token)
            otpBloc.otpVerify(this.token).then()
        });
    }

    build(context: BuildContext): Widget {
        return new HtmlWidget(`
            <button id="verify-2fa-btn" class="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded">
               Verify 2FA
            </button>`);
    }

}