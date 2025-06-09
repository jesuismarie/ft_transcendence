import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {type Widget} from "@/core/framework/core/base";
import {hideModal, showModal} from "@/utils/modal_utils";
import {ModalConstants} from "@/core/constants/modalConstants";
import {TextController} from "@/core/framework/controllers/textController";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
import {initiate2FASetup} from "@/profile/twofa";
import {clearErrors} from "@/utils/error_messages";
import {Composite} from "@/core/framework/widgets/composite";
import {OtpScreen} from "@/presentation/features/otp/view/otpScreen";
import {BlocProvider} from "@/core/framework/bloc/blocProvider";
import {OTPBloc} from "@/presentation/features/otp/logic/otpBloc";
import {Resolver} from "@/di/resolver";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import type {OTPState} from "@/presentation/features/otp/logic/otpState";
import {MountAwareComposite} from "@/core/framework/widgets/mountAwareComposite";
import {BuilderWidget} from "@/core/framework/widgets/builderWidget";
import {DependComposite} from "@/core/framework/widgets/dependComposite";


export class EditProfile extends StatelessWidget {
    constructor(public parentId?: string) {
        super();
    }

    build(context: BuildContext): Widget {
        return new BlocProvider(
            {
                create: () => new OTPBloc(
                    Resolver.twoFaRepository()
                ),
                child: new BuilderWidget((context) => new EditProfileContent(this.parentId))
            }
        );
    }

}

export class EditProfileContent extends StatelessWidget {
    constructor(public parentId?: string) {
        super();
    }

    userNameController: TextController = new TextController();
    emailController: TextController = new TextController();
    oldPasswordController: TextController = new TextController();
    passwordController: TextController = new TextController();
    confirmPasswordController: TextController = new TextController();


    didMounted(context: BuildContext) {
        super.didMounted(context);
        console.log("MOUNTEDDDD");
        this.setup(context);
    }

    setup(context: BuildContext) {
        const profileBloc = context.read(ProfileBloc)
        const otpBloc = context.read(OTPBloc)
        const usernameInput = document.getElementById("edit-username") as HTMLInputElement;
        const emailInput = document.getElementById("edit-email") as HTMLInputElement;
        const oldPasswordInput = document.getElementById("edit-old-password") as HTMLInputElement;
        const passwordInput = document.getElementById("edit-password") as HTMLInputElement;
        const confirmPasswordInput = document.getElementById("edit-confirm-password") as HTMLInputElement;
        const closeBtn = document.getElementById('close-edit-modal');
        const saveBtn = document.getElementById('save-profile-btn');
        const enable2faBtn = document.getElementById("enable-2fs-btn") as HTMLButtonElement | null;
        const twoFaContainer = document.getElementById("twofa-container") as HTMLElement | null;

        closeBtn?.addEventListener('click', () => {
            hideModal(ModalConstants.editProfileModalName)
            // profileBloc.resetStatus().then(r => r);
            otpBloc.resetOtp()
        })
        enable2faBtn?.addEventListener('click', async () => {
            otpBloc.initializeOtp();
            otpBloc.enableOTP().then()
        })


        saveBtn?.addEventListener('click', () => {
            clearErrors();
            profileBloc.onSaveProfile({
                username: this.userNameController.text,
                email: this.emailController.text,
                confirmPassword: this.confirmPasswordController.text,
                password: this.oldPasswordController.text,
                newPassword: this.passwordController.text,
            }).then(r => r)
        })
        if (usernameInput) {
            this.userNameController.bindInput(usernameInput!);
        }
        if(emailInput) {
            this.emailController.bindInput(emailInput!);
        }
        if (oldPasswordInput) {
            this.oldPasswordController.bindInput(oldPasswordInput!);
        }
        if(emailInput) {
            this.passwordController.bindInput(passwordInput!);
        }
        if (confirmPasswordInput) {
            this.confirmPasswordController.bindInput(confirmPasswordInput!);
        }
    }



    build(context: BuildContext): Widget {
        // return new HtmlWidget('');
        return new DependComposite({
            dependWidgets: [new HtmlWidget(`
        <div class="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden transform transition-all">
			<div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
				<h3 class="text-lg font-medium">
					Edit Profile
				</h3>
				<div class="mt-4 space-y-4">
					<div>
						<label for="edit-username" class="block text-sm font-medium">Username</label>
						<input type="text" id="edit-username" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
						<p class="error-msg text-red-500 text-sm" data-error-for="edit_username"></p>
					</div>
					<div>
						<label for="edit-email" class="block text-sm font-medium">Email</label>
						<input type="email" id="edit-email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
						<p class="error-msg text-red-500 text-sm" data-error-for="edit_email"></p>
					</div>
					<div>
						<label for="edit-old-password" class="block text-sm font-medium">Old Password</label>
						<input type="password" id="edit-old-password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
						<p class="error-msg text-red-500 text-sm" data-error-for="old_password"></p>
					</div>
					<div>
						<label for="edit-password" class="block text-sm font-medium">New Password</label>
						<input type="password" id="edit-password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
						<p class="error-msg text-red-500 text-sm" data-error-for="new_password"></p>
					</div>
					<div>
						<label for="edit-confirm-password" class="block text-sm font-medium">Confirm Password</label>
						<input type="password" id="edit-confirm-password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
						<p class="error-msg text-red-500 text-sm" data-error-for="confirm_password"></p>
					</div>
					<div>
						<button id="enable-2fs-btn" type="button" class="bg-hover hover:shadow-neon text-white w-full py-2 px-4 rounded-md">Enable 2FA</button>
						<div id="twofa-container" class="mt-4"></div>
					</div>
				</div>
			</div>
			<div class="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse gap-3">
				<button id="save-profile-btn" type="button" class="bg-hover hover:shadow-neon text-white py-2 px-4 rounded-md">Save</button>
				<button id="close-edit-modal" type="button" class="px-4 py-2 text-sm rounded-md border border-hover hover:text-hover">Close</button>
			</div>
		</div>
        `, this.parentId)],
            children: [new MountAwareComposite((context) =>
                new BuilderWidget((context) => new OtpScreen('twofa-container'))
            )]
        });
    }


}