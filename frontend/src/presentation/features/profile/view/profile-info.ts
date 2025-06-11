import {type BuildContext} from "@/core/framework/core/buildContext";
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
import {Navigator} from "@/core/framework/widgets/navigator";
import {AppRoutes} from "@/core/constants/appRoutes";
import {FriendBloc} from "@/presentation/features/friend/logic/friendBloc";
import {FriendState, FriendStatus} from "@/presentation/features/friend/logic/friendState";
import {SubmitButton} from "@/presentation/common/widget/submitButton";
import {ModalsBloc, ModalType} from "@/presentation/features/modals/bloc/modalsBloc";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {BlocProvider} from "@/core/framework/bloc/blocProvider";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {AvatarContent} from "@/presentation/features/profile/view/avatar-content";
import type {AuthState} from "@/presentation/features/auth/logic/auth_state";
import {Bindings} from "@/presentation/features/bindings";
import {Status} from "@/core/models/status";
import {OnlineBloc} from "@/presentation/features/online/onlineBloc";


export class ProfileInfo extends StatefulWidget {
    constructor(public profileState: ProfileState, public userId?: number, public parentId?: string,) {
        super();
    }

    createState(): State<StatefulWidget> {
        return new ProfileInfoContent();
    }

}

export class ProfileInfoContent extends State<ProfileInfo> {

    didMounted(context: BuildContext) {
        super.didMounted(context);

        this.setup(context);
    }


    setup(context: BuildContext) {
        const profileBloc = context.read(ProfileBloc)
        const authBloc = context.read(AuthBloc)
        const modalBloc = context.read(ModalsBloc)

        // const friendBloc =
        const editBtn = document.getElementById('edit-profile-btn');
        // const friendRequestBtn = document.getElementById('friend-request-btn');
        // const uploadBtn = document.getElementById('avatar-upload-btn')
        // const avatarInput = document.getElementById('avatar-input') as HTMLInputElement | null;
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
        // console.log(`AVATARRRRR :::: ${avatarInput}`)
        // uploadBtn?.addEventListener("click", (e) => {
        //     avatarInput?.click();
        // });

        const friendBloc = context.read(FriendBloc)

        const userId = context.read(AuthBloc).state.user?.userId;
        if (userId && this.widget.profileState.profile && userId != this.widget.profileState.profile.id) {
            friendBloc.checkFriendStatus(userId, this.widget.profileState.profile!.id).then(() => {
            });
        }
        // friendRequestBtn?.addEventListener('click', async () => {
        //     const userId = context.read(AuthBloc).state.user?.userId;
        //     // localStorage.removeItem('friendId');
        //     if (userId && this.widget.profileState.profile && !friendBloc.isClosed && !localStorage.getItem(`friendId${this.widget.profileState.profile!.id}`)) {
        //         await friendBloc.addFriend(userId, this.widget.profileState.profile!.id);
        //     }
        // })
        openModalBtn?.addEventListener("click", () => {
            modalBloc.onOpenModal(ModalType.friends);
            showModal(ModalConstants.friendsModalName)
        })

        // avatarInput?.addEventListener("input", async () => {
        //     console.log("CHANGEEEE")
        //     if (!avatarInput.files || avatarInput.files.length === 0)
        //         return;
        //     await profileBloc.selectAvatar(avatarInput?.files[0]);
        //     await profileBloc.uploadAvatar();
        // });

    }


    build(context: BuildContext): Widget {

        const authBloc = BlocProvider.of<AuthBloc>(context, AuthBloc)
        const profileBloc = BlocProvider.of<ProfileBloc>(context, ProfileBloc);



        const showAddFriendButton = !(this.widget.userId || this.widget.userId === this.widget.profileState.profile?.id)
        // return new HtmlWidget(`Hello World`, this.widget.parentId)
        return new BlocListener<ProfileBloc, ProfileState>(
            {

                blocType: ProfileBloc,
                listener: (context, profileState) => {
                    if (!profileState.isValid || profileState.status == ProfileStatus.Error) {
                        showError('avatar', profileState.errorMessage?.toString() ?? 'Unknown error');
                        profileBloc.resetStatus().then();
                    }
                    if (profileState.status == ProfileStatus.Uploaded) {
                        clearErrors();
                        profileBloc.resetStatus().then();
                    }
                },
                child: new DependComposite({
                    dependWidgets: [new HtmlWidget(`
        <div class="rounded-md border border-hover">
            <div class="bg-hover h-24"></div>
            <div class="px-4 pb-6 relative">
                <div class="flex justify-center -mt-12">
                    <div class="relative">
                        <img id="avatar-image" class="h-24 w-24 rounded-full border-4 border-primary" src="${this.widget.profileState.profile?.avatar ?? "/images/background1.jpg"}" alt="User avatar">
                        <div id="avatar-content-container"></div>
                      
                    </div>
                </div>
                <p class="error-msg text-red-500 text-sm" data-error-for="avatar"></p>
                <div class="text-center mt-4">
                    <h2 id="player-name" class="text-[0.6rem] sm:text-[0.7rem] md:text-[0.8rem] font-semibold text-gray-900">
                        <div id="online-status" class="mt-6 grid grid-cols-2 gap-4 text-center"></div>
                    
                        <!-- Player Username -->
                    </h2>
                    <div id="username-container" class="flex items-center justify-center mt-2">
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
                <div id="friend-request-btn-container"></div>
                <div id="edit-profile-btn-container"></div>
            </div>
        </div>
        <div class="px-4 py-3 rounded-md border border-hover">
            <h3 class="text-lg border-b border-hover">
                Friends
            </h3>
            <div id="friends-preview" class="divide-y divide-gray-200">
            </div>
            <div id="friend-list-btn-content"></div>
        </div>`, this.widget.parentId)],

                    children: [
                        new BlocBuilder<AuthBloc, AuthState>({
                            buildWhen: (oldState, newState) => !oldState.equals(newState),
                            blocType: AuthBloc,
                        builder: (context, state) => new BlocBuilder<FriendBloc, FriendState>({
                            blocType: FriendBloc,
                            buildWhen: (oldState, newState) => oldState.isFriend != newState.isFriend,
                            builder: (_, friendState) => {
                                console.log(`IIIIIIIIII:::: ${friendState.isFriend}`)

                                let isHidden = !this.widget.userId;
                                if (this.widget.userId && state.user?.userId) {
                                    isHidden = state.user.userId == (this.widget.userId)
                                }

                                return new BlocBuilder<ProfileBloc, ProfileState>(
                                    {
                                        blocType: ProfileBloc,
                                        buildWhen: (oldState, newState) => !oldState.equals(newState),
                                        builder: (_, profileState) => {
                                            return new SubmitButton({
                                                onClick:  () => {

                                                    if (friendState.status != FriendStatus.Loading) {
                                                        const userId = context.read(AuthBloc).state.user?.userId;
                                                        const friendBloc = context.read(FriendBloc)
                                                        // localStorage.removeItem('friendId');
                                                        if (!Bindings.addFriendSimpleRequest && userId && profileState.profile && !friendBloc.isClosed && !localStorage.getItem(`friendId${this.widget.profileState.profile!.id}`)) {
                                                            friendBloc.addFriend(userId, profileState.profile!.id).then(r => r);
                                                            Bindings.addFriendSimpleRequest = true;
                                                        }
                                                    }
                                                },
                                                className: `mt-6 w-full bg-hover hover:shadow-neon text-white py-2 px-4 rounded-[20px]`,
                                                id: "friend-request-btn",
                                                isHidden: isHidden || friendState.isFriend,
                                                label: "Add Friend",
                                            })
                                        }
                                    }
                                )
                            },
                            parentId: "friend-request-btn-container",

                        })}),
                        new BlocBuilder<AuthBloc, AuthState>({
                            blocType: AuthBloc,
                            buildWhen: (oldState, newState) => !oldState.equals(newState),
                            builder: (context, state) => {

                                let isHidden = !this.widget.userId;
                                if (this.widget.userId && state.user?.userId) {
                                    isHidden = state.user.userId == (this.widget.userId)
                                }
                                return new AvatarContent(!isHidden)
                            },
                            parentId: 'avatar-content-container'
                        }, ),
                        new BlocBuilder<FriendBloc, FriendState>({
                            blocType: FriendBloc,
                            buildWhen: (oldState, newState) => !oldState.equals(newState),
                            builder: (context, friendState) =>
                                new SubmitButton({
                                    className: "px-4 py-3 text-sm rounded-[20px] border border-hover hover:text-hover",
                                    id: "friend-list-btn",
                                    isHidden: (friendState.results?.totalCount ?? 0) < 3,
                                    parentId: "friend-list-btn-content",
                                    label: "All Friends",
                                })
                        }),
                        new BlocBuilder<AuthBloc, AuthState>({
                            blocType: AuthBloc,
                            buildWhen: (oldState, newState) => !oldState.equals(newState),
                            builder: (context, state) => {
                                let isHidden = !this.widget.userId;
                                if (this.widget.userId && state.user?.userId) {
                                    isHidden = state.user.userId == (this.widget.userId)
                                }
                                return new SubmitButton({
                                    className: "mt-6 w-full bg-hover hover:shadow-neon text-white py-2 px-4 rounded-[20px]",
                                    isHidden: !isHidden,
                                    id: "edit-profile-btn",
                                    label: "Edit Profile",

                                })
                            },
                            parentId: "edit-profile-btn-container"
                        }),
                        new BlocBuilder<ProfileBloc, ProfileState>({
                            blocType: ProfileBloc,
                            buildWhen: (oldState, newState) => !oldState.equals(newState),
                            builder: (context, state) => new HtmlWidget(`<p class="text-gray-600">${state.profile?.username}</p>`),
                            parentId: 'username-container'
                        }),
                        new HtmlWidget(`<p class="text-gray-600">${context.read(OnlineBloc).getCurrentStatus() == Status.Online ? "Online" : "Offline"}</p>`, 'online-status'),




                    ],
                }, )

            })
    }

}