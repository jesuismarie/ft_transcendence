import {type BuildContext} from "@/core/framework/core/buildContext";
// import type {Widget} from "@/core/framework/widget";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {type Widget} from "@/core/framework/core/base";
import {showModal} from "@/utils/modal_utils";
import {ModalConstants} from "@/core/constants/modalConstants";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import {ProfileState, ProfileStatus} from "@/presentation/features/profile/bloc/profileState";
import {BlocListener} from "@/core/framework/bloc/blocListener";
import {clearErrors, showError} from "@/utils/error_messages";
import {State, StatefulWidget} from "@/core/framework/widgets/statefulWidget";
import {isBoolean, isEqual} from "lodash";
import {Navigator} from "@/core/framework/widgets/navigator";
import {AppRoutes} from "@/core/constants/appRoutes";
import {Composite} from "@/core/framework/widgets/composite";
import {FriendBloc} from "@/presentation/features/friend/logic/friendBloc";
import {MountAwareComposite} from "@/core/framework/widgets/mountAwareComposite";
import {FriendState, FriendStatus} from "@/presentation/features/friend/logic/friendState";
import {SubmitButton} from "@/presentation/common/widget/submitButton";
import {ModalsBloc, ModalType} from "@/presentation/features/modals/bloc/modalsBloc";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {AuthState} from "@/presentation/features/auth/logic/auth_state";
import {BlocProvider} from "@/core/framework/bloc/blocProvider";


export class ProfileInfo extends StatefulWidget {
    constructor(public profileState: ProfileState, public userId?: number, public parentId?: string, ) {
        super();
    }

    createState(): State<StatefulWidget> {
        return new ProfileInfoContent();
    }

}

export class ProfileInfoContent extends State<ProfileInfo> {

    didMounted(context: BuildContext) {
        super.didMounted(context);
        console.log("ProfileAUDDDDD------")

        this.setup(context);
    }


    setup(context: BuildContext) {
        const profileBloc = context.read(ProfileBloc)
        const authBloc = context.read(AuthBloc)
        const modalBloc = context.read(ModalsBloc)

        console.log(`PROFILEEEE STATEEEE--------::: ${JSON.stringify(authBloc.state)}`)
        // const friendBloc =
        const editBtn = document.getElementById('edit-profile-btn');
        const friendRequestBtn = document.getElementById('friend-request-btn');
        const uploadBtn = document.getElementById('avatar-upload-btn')
        const avatarInput = document.getElementById('avatar-input') as HTMLInputElement | null;
        const openModalBtn = document.getElementById("friend-list-btn") as HTMLButtonElement;

        const openGameBtn = document.getElementById('open-game-btn');

        openGameBtn?.addEventListener('click', () => {
            Navigator.of(context).pushNamed(AppRoutes.game)
        })
        editBtn?.addEventListener('click', async (e) => {
            e.preventDefault()
            modalBloc.onOpenModal(ModalType.editProfile);
            showModal(ModalConstants.editProfileModalName)
        })
        console.log(`AVATARRRRR :::: ${avatarInput}`)
        // avatarInput?.click();
        uploadBtn?.addEventListener("click", (e) => {
            // e.preventDefault()
            // alert("CLIECCCCC")
            avatarInput?.click();
        });
        const friendBloc = context.read(FriendBloc)
        friendRequestBtn?.addEventListener('click', async () => {
            const userId = context.read(AuthBloc).state.user?.userId;
            // localStorage.removeItem('friendId');
            if (userId && this.widget.profileState.profile && !friendBloc.isClosed && !localStorage.getItem(`friendId${this.widget.profileState.profile!.id}`)) {
                await friendBloc.addFriend(userId, this.widget.profileState.profile!.id);
            }
        })
        openModalBtn?.addEventListener("click", () => {
            modalBloc.onOpenModal(ModalType.friends);
            showModal(ModalConstants.friendsModalName)
        })

        avatarInput?.addEventListener("input", async () => {
            console.log("CHANGEEEE")
            if (!avatarInput.files || avatarInput.files.length === 0)
                return;
            await profileBloc.selectAvatar(avatarInput?.files[0]);
            await profileBloc.uploadAvatar();
        });

    }


    build(context: BuildContext): Widget {
        console.log("BUILTTTTTTT PROFFF")

        // this.setup(context);
        // const authBloc = context.read(AuthBloc);
        const authBloc = BlocProvider.of<AuthBloc>(context, AuthBloc)
        const profileBloc = BlocProvider.of<ProfileBloc>(context, ProfileBloc);
        // const authBloc = context.read(AuthBloc);
        console.log(`AAAAAAAAAA::::: ${authBloc.state.user?.userId}`)
        // const currentUserId = authBloc.state.user?.userId;
        // const username = profileBloc.state.profile?.username
        // const targetUserId = id || currentUserId;
        let isCurrentUser: boolean = true;
        if (this.widget.userId && authBloc.state.user?.userId) {
            isCurrentUser = authBloc.state.user?.userId === this.widget.profileState.profile?.id;
        }

        console.log(`AVATARRRRRRRRR ${this.widget.profileState.selectedAvatarUrl}`);


        const showAddFriendButton = !(this.widget.userId || this.widget.userId === this.widget.profileState.profile?.id)
        return new BlocListener<ProfileBloc, ProfileState>({
            listener: (context, state) => {
                // if (state.selectedAvatarUrl) {
                //     await profileBloc.uploadAvatar();
                // }
                // this.setup(context);
            },
            blocType: ProfileBloc,
            child: new BlocBuilder<FriendBloc, FriendState>({
                blocType: FriendBloc,
                buildWhen: (oldState, newState) => !isEqual(oldState.results, newState.results),
                builder: (context, friendState) => new BlocListener<ProfileBloc, ProfileState>(
                    {
                        blocType: ProfileBloc,
                        listener: (context, profileState) => {
                            // this.setup(context);
                            if (!profileState.isValid || profileState.status == ProfileStatus.Error) {
                                showError('avatar', profileState.errorMessage?.toString() ?? 'Unknown error');
                                profileBloc.resetStatus().then();
                            }
                            if (profileState.status == ProfileStatus.Uploaded) {
                                clearErrors();
                                profileBloc.resetStatus().then();
                            }
                        },
                        child: new Composite([new HtmlWidget(`
        <div class="rounded-md border border-hover">
            <div class="bg-hover h-24"></div>
            <div class="px-4 pb-6 relative">
                <div class="flex justify-center -mt-12">
                    <div class="relative">
                        <img id="avatar-image" class="h-24 w-24 rounded-full border-4 border-primary" src="${this.widget.profileState.profile?.avatar ?? "/images/background1.jpg"}" alt="User avatar">
                       ${ isCurrentUser ?
                            `<button id="avatar-upload-btn" class="absolute bottom-0 right-0 bg-hover rounded-full p-2 text-white hover:shadow-neon focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                        <input type="file" id="avatar-input" class="hidden" accept="image/*" />`
                            : ""}
                    </div>
                </div>
                <p class="error-msg text-red-500 text-sm" data-error-for="avatar"></p>
                <div class="text-center mt-4">
                    <h2 id="player-name" class="text-[0.6rem] sm:text-[0.7rem] md:text-[0.8rem] font-semibold text-gray-900">
                        <!-- Player Username -->
                    </h2>
                    <div id="online-status" class="flex items-center justify-center mt-2">
                        <!-- Online Status -->
                    </div>
                </div>
                <div class="mt-6 grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p class="text-gray-600">Wins</p>
                        <p id="player-wins" class="text-black font-bold">0</p>
                    </div>
                    <div>
                        <p class="text-gray-600">Losses</p>
                        <p id="player-losses" class="text-black font-bold">0</p>
                    </div>
                </div>
                <button id="open-game-btn" class="mt-6 w-full bg-hover hover:shadow-neon text-white py-2 px-4 rounded-[20px]">Play</button>
                <button id="friend-request-btn" class="${showAddFriendButton ? "hidden" : ""} mt-6 w-full bg-hover hover:shadow-neon text-white py-2 px-4 rounded-[20px]">Add Friend</button>
                <button id="edit-profile-btn" class="${(this.widget.userId || this.widget.userId === this.widget.profileState.profile?.id) ? "hidden" : ""} mt-6 w-full bg-hover hover:shadow-neon text-white py-2 px-4 rounded-[20px]">Edit Profile</button>
            </div>
        </div>
        <div class="px-4 py-3 rounded-md border border-hover">
            <h3 class="text-lg border-b border-hover">
                Friends
            </h3>
            <div id="friends-preview" class="divide-y divide-gray-200">
            </div>
            <div id="friend-list-btn-content"></div>
            <button id="friend-list-btn" class="${friendState.results.totalCount > 3 ? "" : "hidden"} px-4 py-3 text-sm rounded-[20px] border border-hover hover:text-hover">View All Friends</button>
        </div>`, this.widget.parentId),
                            new MountAwareComposite((context) => new SubmitButton({
                                className: "px-4 py-3 text-sm rounded-[20px] border border-hover hover:text-hover",
                                id: "friend-list-btn",
                                isHidden: (friendState.results?.totalCount ?? 0) < 3,
                                parentId: "friend-list-btn-content",
                                label: "All Friends",
                            }))

                        ])

                    })
            })
        })
    }
    ;

}