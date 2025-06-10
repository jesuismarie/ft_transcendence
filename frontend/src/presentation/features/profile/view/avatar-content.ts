import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import  {type BuildContext} from "@/core/framework/core/buildContext";
import type {Widget} from "@/core/framework/core/base";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {EmptyWidget} from "@/core/framework/widgets/emptyWidget";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";

export class AvatarContent extends StatelessWidget {
    constructor(public isHidden: boolean = false) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);
        const uploadBtn = document.getElementById('avatar-upload-btn')
        const avatarInput = document.getElementById('avatar-input') as HTMLInputElement | null;

        console.log(`AVATARRRRR :::: ${avatarInput}`)
        uploadBtn?.addEventListener("click", (e) => {
            avatarInput?.click();
        });

        const profileBloc = context.read(ProfileBloc);
        avatarInput?.addEventListener("input", async () => {
            console.log("CHANGEEEE")
            if (!avatarInput.files || avatarInput.files.length === 0)
                return;
            await profileBloc.selectAvatar(avatarInput?.files[0]);
            await profileBloc.uploadAvatar();
        });
    }

    build(context: BuildContext): Widget {
        return !this.isHidden ? new HtmlWidget(`<button id="avatar-upload-btn" class="absolute bottom-0 right-0 bg-hover rounded-full p-2 text-white hover:shadow-neon focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        <input type="file" id="avatar-input" class="hidden" accept="image/*" />`) : new EmptyWidget();
    }
}