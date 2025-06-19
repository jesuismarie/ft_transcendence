import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {OtpScreen} from "@/presentation/features/otp/view/otpScreen";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {Navigator} from "@/core/framework/widgets/navigator";

export class TwoFaScreen extends StatelessWidget {
    didMounted(context: BuildContext) {
        super.didMounted(context);

        const authBloc = context.read(AuthBloc);
        if (!(authBloc.state.loginTicket?.requires2fa ?? false)) {
            Navigator.of(context).pushNamed('/profile')
        }
    }

    build(context: BuildContext): Widget {
        return new DependComposite({dependWidgets: [new HtmlWidget(`
        <div class="w-[100dvw] h-[100dvh] flex justify-center items-center">
  			<div class="w-[400px] h-[500px]">
  			<div class="bg-white p-[7%] flex flex-col items-center justify-around w-full h-full border rounded-[20px] shadow-div-glow">
  			    <div>Two Factor Verification</div>
  			    <div id="otp-modal-content"></div>
            </div>	
            </div>
        </div>`)],
            children: [
                new OtpScreen({parentId: 'otp-modal-content', showQR: false})
            ]
        })
    }
}