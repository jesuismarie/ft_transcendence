import {type BuildContext} from "@/core/framework/core/buildContext";
import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {type Widget} from "@/core/framework/core/base";
import {showModal} from "@/utils/modal_utils";
import {ModalConstants} from "@/core/constants/modalConstants";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import {ProfileState, ProfileStatus} from "@/presentation/features/profile/bloc/profileState";
import {BlocListener} from "@/core/framework/bloc/blocListener";
import {State, StatefulWidget} from "@/core/framework/widgets/statefulWidget";
import {FriendBloc} from "@/presentation/features/friend/logic/friendBloc";
import {FriendState, FriendStatus} from "@/presentation/features/friend/logic/friendState";
import {SubmitButton} from "@/presentation/common/widget/submitButton";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {AvatarContent} from "@/presentation/features/profile/view/avatar-content";
import type {AuthState} from "@/presentation/features/auth/logic/auth_state";
import {Bindings} from "@/presentation/features/bindings";
import {FriendList} from "@/presentation/features/friend/view/friendList";
import {showFlushBar} from "@/presentation/common/widget/flushBar";
import {showError} from "@/utils/error_messages";


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

        const friendBloc = context.read(FriendBloc)

        const userId = context.read(AuthBloc).state.user?.userId;
        if (userId && this.widget.profileState.profile && userId != this.widget.profileState.profile.id) {
            friendBloc.checkFriendStatus(userId, this.widget.profileState.profile!.id).then(() => {
            });
        }

    }


    build(context: BuildContext): Widget {

        const profileBloc = context.read(ProfileBloc);
        return new BlocListener<ProfileBloc, ProfileState>(
            {

                blocType: ProfileBloc,
                listener: (context, profileState) => {
                    if (!profileState.isValid || profileState.status == ProfileStatus.Error) {
                        showFlushBar({message: profileState.errorMessage?.toString() ?? 'Unknown error'});
                        profileBloc.resetStatus().then();
                    }
                    if (profileState.status == ProfileStatus.ErrorSubmit) {
                        showError('new_password', profileState.errorMessage ?? "Unknown error");
                        profileBloc.resetStatus().then();
                    }
                    if (profileState.status == ProfileStatus.ErrorUpload) {
                        showFlushBar({message: profileState.errorMessage?.toString() ?? 'Unknown error'});
                        profileBloc.resetStatus().then();
                    }
                    if (profileState.status == ProfileStatus.Uploaded) {
                        // clearErrors();
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
                        <img id="avatar-image" crossOrigin="anonymous" class="h-24 w-24 rounded-full border-4 border-primary" src="${this.widget.profileState.profile?.avatar ?? "/images/background1.jpg"}" onerror="this.onerror=null; this.src='/images/background1.jpg';" alt="User avatar">
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
                     <div id="email-container" class="flex items-center justify-center mt-2">
                        <!-- Online Status -->
                    </div>
                </div>
                <div class="mt-6 grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p class="text-gray-600">Wins</p>
                        <p id="player-wins" class="text-black font-bold"></p>
                    </div>
                    <div>
                        <p class="text-gray-600">Losses</p>
                        <p id="player-losses" class="text-black font-bold"></p>
                    </div>
                </div>
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
                                buildWhen: (oldState, newState) => !oldState.equals(newState),
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
                                                    onClick: () => {

                                                        if (friendState.status != FriendStatus.Loading) {
                                                            const userId = context.read(AuthBloc).state.user?.userId;
                                                            const friendBloc = context.read(FriendBloc)
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

                            })
                        }),
                        new BlocBuilder<ProfileBloc, ProfileState>({
                            blocType: ProfileBloc,
                            parentId: "player-losses",
                            buildWhen: (oldState, newState) => !oldState.equals(newState),
                            builder: (context, state) => new HtmlWidget(`${state.profile?.losses ?? "0"}`)
                        }),
                        new BlocBuilder<ProfileBloc, ProfileState>({
                            blocType: ProfileBloc,
                            parentId: "player-wins",
                            buildWhen: (oldState, newState) => !oldState.equals(newState),
                            builder: (context, state) => new HtmlWidget(`${state.profile?.wins ?? "0"}`)
                        }),
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
                        },),
                        new BlocBuilder<FriendBloc, FriendState>({
                            blocType: FriendBloc,
                            buildWhen: (oldState, newState) => !oldState.equals(newState),
                            builder: (context, friendState) => {
                                console.log(`YYYYYYYYYY:::: ${friendState.results.totalCount}`);
                                return new SubmitButton({
                                    className: "px-4 py-3 text-sm rounded-[20px] border border-hover hover:text-hover",
                                    id: "friend-list-btn",
                                    onClick: () => {
                                        showModal(ModalConstants.friendsModalName);
                                    },
                                    isHidden: !friendState.results.totalCount || friendState.results.totalCount <= 3,
                                    label: "All Friends",
                                })
                            },
                            parentId: "friend-list-btn-content",

                        }),
                        new BlocBuilder<FriendBloc, FriendState>({
                            blocType: FriendBloc,
                            buildWhen: (oldState, newState) => !oldState.equals(newState),
                            builder: (context, friendState) => new FriendList('friends-preview')
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
                                    onClick: () => {
                                        console.log("EDDDDDDDDDDDDDDDDDDDDDD")
                                        showModal(ModalConstants.editProfileModalName)
                                    },
                                    id: "edit-profile-btn",
                                    label: "Edit Profile",

                                })
                            },
                            parentId: "edit-profile-btn-container"
                        }),
                        new BlocBuilder<ProfileBloc, ProfileState>({
                            blocType: ProfileBloc,
                            buildWhen: (oldState, newState) => !oldState.equals(newState),
                            builder: (context, state) => state.status == ProfileStatus.Loading ? new HtmlWidget(`<p>username</p>`) : new HtmlWidget(`<p class="text-gray-600">${state.profile?.username}</p>`),
                            parentId: 'username-container'
                        }),
                        new BlocBuilder<ProfileBloc, ProfileState>({
                            blocType: ProfileBloc,
                            buildWhen: (oldState, newState) => !oldState.equals(newState),
                            builder: (context, state) => state.status == ProfileStatus.Loading ? new HtmlWidget(`<p>email</p>`) : new HtmlWidget(`<p class="text-gray-600">${state.profile?.email}</p>`),
                            parentId: 'email-container'
                        }),
                        new BlocBuilder<ProfileBloc, ProfileState>({
                            blocType: ProfileBloc,
                            parentId: "online-status",
                            buildWhen: (oldState, newState) => !oldState.equals(newState),
                            builder: (context, state) =>
                                state.status == ProfileStatus.Loading ?
                                    new HtmlWidget(`<p>Loading Profile</p>`) :
                                    new HtmlWidget(`<p class="text-gray-600">${state.profile?.online ? "online" : "offline"}</p>`)
                        }),
                    ],
                },)

            })
    }

}