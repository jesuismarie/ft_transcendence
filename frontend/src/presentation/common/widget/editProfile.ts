import {StatelessWidget} from "@/core/framework/statelessWidget";
import  {type BuildContext} from "@/core/framework/buildContext";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import type {Widget} from "@/core/framework/base";
import {hideModal, showModal} from "@/utils/modal_utils";
import {ModalConstants} from "@/core/constants/modalConstants";

export class EditProfile extends StatelessWidget {
    constructor(public parentId?: string) {
        super();
    }

    afterMounted(context: BuildContext) {
        super.afterMounted(context);

        const closeBtn = document.getElementById('close-edit-modal');
        closeBtn?.addEventListener('click', () => {
            hideModal(ModalConstants.editProfileModalName)
        })

    }

    build(context: BuildContext): Widget {
        return new HtmlWidget(`
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
        `, this.parentId);
    }


}