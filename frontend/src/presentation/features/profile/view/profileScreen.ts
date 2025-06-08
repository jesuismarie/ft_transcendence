import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import {State, StatefulWidget} from "@/core/framework/widgets/statefulWidget";
import {AuthGuard} from "@/presentation/features/auth/view/authGuard";
import {Composite} from "@/core/framework/widgets/composite";
import {ProfileInfo} from "@/presentation/features/profile/view/profile-info";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
import {ProfileState} from "@/presentation/features/profile/bloc/profileState";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {type Widget} from "@/core/framework/core/base";
import {Navigator} from "@/core/framework/widgets/navigator";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import {MountAwareComposite} from "@/core/framework/widgets/mountAwareComposite";
import {AddTournament} from "@/presentation/features/tournaments/view/addTournament";
import {UpcomingTournaments} from "@/presentation/features/tournaments/view/upcomingTournaments";
import {MatchHistory} from "@/presentation/features/match/view/matchHistory";
import {FriendsView} from "@/presentation/features/friend/view/friends_view";
import {EditProfile} from "@/presentation/features/profile/view/editProfile";
import {UpcomingTournamentsModal} from "@/presentation/features/tournaments/view/upcomingTournamentsModal";
import {MatchHistoryModal} from "@/presentation/features/match/view/matchHistoryModal";
import {NavigationMenu} from "@/presentation/features/navigation/view/navigationMenu";
import {SearchUserModal} from "@/presentation/features/search/view/search_user_modal";
import {isEqual} from "lodash";
import {hideModal, showModal} from "@/utils/modal_utils";
import {ModalConstants} from "@/core/constants/modalConstants";
import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {MultiBlocProvider} from "@/core/framework/bloc/multiBlocProvider";
import {BlocProvider} from "@/core/framework/bloc/blocProvider";
import {FriendBloc} from "@/presentation/features/friend/logic/friendBloc";
import {Resolver} from "@/di/resolver";
import {SearchBloc} from "@/presentation/features/search/logic/searchBloc";
import {Constants} from "@/core/constants/constants";
import {TournamentBloc} from "@/presentation/features/tournaments/logic/tournamentBloc";
import {ModalsBloc} from "@/presentation/features/modals/bloc/modalsBloc";
import {EmptyWidget} from "@/core/framework/widgets/emptyWidget";
import {WidgetBinding} from "@/core/framework/core/widgetBinding";


export class ProfileScreen extends StatelessWidget {
    constructor(public userId?: string) {
        super();
    }

    build(context: BuildContext): Widget {
        return new MultiBlocProvider({
            providers: [
                new BlocProvider({
                    create: () => new TournamentBloc(Resolver.tournamentRepository()),
                }),
                new BlocProvider({
                    create: () => new SearchBloc(Resolver.userRepository()),
                }),
                new BlocProvider(
                    {
                        create: () => new FriendBloc(Resolver.friendRepository()),
                    },
                )],
            child: new ProfileScreenContent()
        })
    }

}


export class ProfileScreenContent extends StatefulWidget {
    constructor(public userId?: string) {
        super();
    }

    createState(): State<ProfileScreenContent> {
        return new ProfileScreenContentState();
    }
}

export class ProfileScreenContentState extends State<ProfileScreenContent> {


    didMounted(context: BuildContext) {
        super.didMounted(context);
        console.log("PROFILLEEE MOUNTEEDDDD")
        // const authGuard = new AuthGuard('/profile', false, true);
        // authGuard.guard(context)
        WidgetBinding.getInstance().postFrameCallback(() => {

        })
        const friendBloc = context.read(FriendBloc);
        const authBloc = context.watch(AuthBloc);



        // if (authBloc.state.user) {
        console.log(`STATEEEE:::: ${JSON.stringify(authBloc.state)}`)


        // }

        const id = this.widget.userId ? Number.parseInt(this.widget.userId) : undefined;

        const userId = id ?? authBloc.state.user?.userId;
        if (userId) {
            context.read(ProfileBloc).getUserProfile(userId.toString(), false).then(profile => {})
            // friendBloc.onSearch(userId, 0, Constants.friends_limit).then(r => r);
        }
        // const authBloc = context.read(AuthBloc);
        // const profileBloc = context.read(ProfileBloc);
        // if (!authBloc.state.user?.userId) {
        //     Navigator.of(context).pushNamed('/login')
        // }
        // console.log(`AAAAAZXXXXXXXXXXXXXXX ${authBloc.state.user?.userId}`);
        // if (!authBloc.state.user?.userId) {
        //     Navigator.of(context).pushNamed('/login');
        // }
        // if (profileBloc.state.status != ProfileStatus.Loading) {
        //     context.read(ProfileBloc).getUserProfile(authBloc.state.user!.userId.toString()).then(r => r)
        // }
    }

    // afterMounted(context: BuildContext) {
    //     super.afterMounted(context);

    // WidgetBinding.getInstance().postFrameCallback(())
    //
    // const navigator = Navigator.of(context);
    // console.log("PROFILE MOUNTEEDDDD")
    // const authGuard = new AuthGuard(`/profile/${this.widget.username}`, false);
    // authGuard.guard(context)
    //
    //
    // console.log("PROFILE MOUNTEEDDDD 111111")
    // console.warn(`AUTHHHH::: ${authBloc.state.user?.userId}`)
    //
    //
    // const searchBtn = document.getElementById('search-users-modal');
    //
    // searchBtn?.addEventListener('click', (e) =>{
    //     console.log("SSSSSS")
    // })
    // const userId = authBloc.state.user?.userId
    // // if (userId) {
    // //     initPersonalData(context, userId).then(r => r);
    // // }
    // const googleLogoutButton = document.getElementById('logout-btn');
    // if (!googleLogoutButton)
    //     return;
    //
    // googleLogoutButton.addEventListener('click', async () => {
    //     await authBloc.logout();
    //     // loadHomePage();
    // });


    // const btn = document.getElementById('to-sign-in');
    // // context.logWidgetTree(context);
    // btn?.addEventListener('click', e => {
    //     e.preventDefault();
    //     navigator.pushNamed('/login')
    // })
    // }

    build(context: BuildContext): Widget {
        const modalState = context.watch(ModalsBloc).state
        const navigator = Navigator.of(context);
        // return new EmptyWidget()
        const authBloc = context.read(AuthBloc);
        return new BlocBuilder<ProfileBloc, ProfileState>(
            {
                buildWhen: (oldState, newState) => !oldState.equals(newState),
                blocType: ProfileBloc,
                builder: (context, state) => {
                    const currentId = state.profile?.id;
                    const otherId = authBloc.state.user?.userId;
                    return new Composite([
                        new MountAwareComposite((context) => new HtmlWidget(`
        <div class="w-[100dvw] h-[100dvh] flex flex-col justify-center items-center text-center">
			<h1 class="wipe-text neon-text flex gap-0 overflow-hidden text-[3rem] sm:text-[4rem] md:text-[5rem] font-bold select-none text-primary animate-neonGlow">
				Pong Profile!
			</h1>
			<div class="w-[80vw] h-[80vh] bg-white flex flex-col justify-center items-center text-center border rounded-[20px] shadow-div-glow p-2">
				<!-- Navigation Menu -->
				<div id="profile-navigation" class="w-full h-14 flex justify-end items-center px-4 sm:px-6 lg:px-8 bg-white">
				</div>
				<div class="w-full h-full overflow-y-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
					<!-- Profile Information -->
					<div id="profile-information-details" class="lg:col-span-1 space-y-6">
					</div>
					<div class="lg:col-span-3 space-y-6">
						<!-- Match History -->
						<div id="match-history-details" class="rounded-md px-5 py-4 border border-hover">
						</div>

						<!-- Upcoming Tournaments -->
						<div id="upcoming-tournaments" class="${otherId != currentId ? "hidden" : ""} rounded-md px-5 py-4 border border-hover">
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Search Users -->
		<div id="search-users-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
		</div>

		<!-- Edit Profile Modal -->
		<div id="edit-profile-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
		</div>

		<!-- View Friends List -->
		<div id="friends-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
		</div>

		<!-- View Match History -->
		<div id="matches-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
		</div>

		<!-- View Upcoming Tournament -->
		<div id="tournament-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
		</div>

		<!-- Add Tournament -->
		<div id="add-tournament-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
		</div>`)),

                        new MountAwareComposite((context) => new Composite([
                            // state.
                            ...(modalState.isTournamentModalOpen ?
                                [new MountAwareComposite((context) => new AddTournament('add-tournament-modal'))] : []),
                            new MountAwareComposite((context) => new UpcomingTournaments('upcoming-tournaments')),
                            new MountAwareComposite((context) => new MatchHistory('match-history-details')),
                            // new MountAwareComposite((context) => new FriendsView('friends-modal')),
                            ...(modalState.isEditProfileModalOpen ?
                                [new MountAwareComposite((context) => new EditProfile('edit-profile-modal'))] : []),
                            new MountAwareComposite((context) => new UpcomingTournamentsModal('tournament-modal')),
                            new MountAwareComposite((context) => new MatchHistoryModal('matches-modal')),
                            new MountAwareComposite((context) => new ProfileInfo(state, 'profile-information-details', otherId)),
                            new MountAwareComposite((context) => new NavigationMenu('profile-navigation')),
                            new MountAwareComposite((context) => new SearchUserModal('search-users-modal'))
                        ]))])
                }
            });
    }
}