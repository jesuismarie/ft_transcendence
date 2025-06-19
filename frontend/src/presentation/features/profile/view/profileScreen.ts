import {HtmlWidget} from "@/core/framework/widgets/htmlWidget";
import {type BuildContext} from "@/core/framework/core/buildContext";
import {State, StatefulWidget} from "@/core/framework/widgets/statefulWidget";
import {ProfileInfo} from "@/presentation/features/profile/view/profile-info";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
import {ProfileState, ProfileStatus} from "@/presentation/features/profile/bloc/profileState";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {type Widget} from "@/core/framework/core/base";
import {BlocBuilder} from "@/core/framework/bloc/blocBuilder";
import {AddTournament} from "@/presentation/features/tournaments/view/addTournament";
import {MatchHistory} from "@/presentation/features/match/view/matchHistory";
import {EditProfile} from "@/presentation/features/profile/view/editProfile";
import {UpcomingTournamentsModal} from "@/presentation/features/tournaments/view/upcomingTournamentsModal";
import {MatchHistoryModal} from "@/presentation/features/match/view/matchHistoryModal";
import {NavigationMenu} from "@/presentation/features/navigation/view/navigationMenu";
import {SearchUserModal} from "@/presentation/features/search/view/search_user_modal";
import {isEqual} from "lodash";
import {StatelessWidget} from "@/core/framework/widgets/statelessWidget";
import {MultiBlocProvider} from "@/core/framework/bloc/multiBlocProvider";
import {BlocProvider} from "@/core/framework/bloc/blocProvider";
import {FriendBloc} from "@/presentation/features/friend/logic/friendBloc";
import {Resolver} from "@/di/resolver";
import {SearchBloc} from "@/presentation/features/search/logic/searchBloc";
import {Constants} from "@/core/constants/constants";
import {TournamentBloc} from "@/presentation/features/tournaments/logic/tournamentBloc";
import {BlocListener} from "@/core/framework/bloc/blocListener";
import type {AuthState} from "@/presentation/features/auth/logic/auth_state";
import {DependComposite} from "@/core/framework/widgets/dependComposite";
import {TextController} from "@/core/framework/controllers/textController";
import {UpcomingTournamentWidget} from "@/presentation/features/tournaments/view/upcomingTournamentWidget";
import {Bindings} from "@/presentation/features/bindings";
import {initWipeText} from "@/animation/animation";
import {MatchBloc} from "@/presentation/features/match/bloc/match_bloc";


export class ProfileScreen extends StatelessWidget {
    constructor(public userId?: string) {
        super();
    }

    didMounted(context: BuildContext) {
        super.didMounted(context);
        initWipeText();
    }

    build(context: BuildContext): Widget {

        return new MultiBlocProvider({
            providers: [
                new BlocProvider({
                    create: () => new TournamentBloc(
                        Resolver.tournamentRepository(),
                        Resolver.userRepository(),
                        Resolver.matchRepository()
                    ),
                }),
                new BlocProvider({
                    create: () => new SearchBloc(Resolver.userRepository()),
                }),
                new BlocProvider(
                    {
                        create: () => new FriendBloc(Resolver.friendRepository()),
                    },
                ),

                new BlocProvider(
                    {
                        create: () => new MatchBloc(
                            Resolver.matchRepository(),
                            Resolver.tournamentRepository(),
                            Resolver.userRepository()
                        ),
                    },
                ),
            ],
            child: new ProfileScreenContent(this.userId)
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

    searchController: TextController = new TextController();

    didMounted(context: BuildContext) {
        super.didMounted(context);

        if (!Bindings.isBounded) {
            const authBloc = context.read(AuthBloc);
            const id = this.widget.userId ? Number.parseInt(this.widget.userId) : undefined;

            const userId = id ?? authBloc.state.user?.userId;
            if (userId) {
                context.read(ProfileBloc).getUserProfile(userId.toString()).then(profile => {
                })
            }
            const friendBloc = context.read(FriendBloc);
            if (userId && !friendBloc.isClosed) {
                friendBloc.onSearch(userId, 0, Constants.friends_limit).then(r => r);
            }
            const searchBloc = context.read(SearchBloc);
            if (!this.searchController.isClosed()) {
                this.searchController.addListener((e) => {

                    if (e.length > 3 && !searchBloc.isClosed) {
                        searchBloc.searchUser(e, searchBloc.state.offset, Constants.search_limit).then(r => r)
                    }
                })
            }
            Bindings.isBounded = true
            Bindings.isTournamentBounded = false;
        }
    }


    build(context: BuildContext): Widget {

        return new BlocListener<AuthBloc, AuthState>({
            blocType: AuthBloc,
            listener: (context, state) => {
                if (state.isRefresh && state.user?.userId) {
                    context.read(ProfileBloc).getUserProfile(state.user.userId.toString()).then(profile => {
                    });
                }
            },
            child: new DependComposite({
                dependWidgets: [
                    new HtmlWidget(`
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
                           <div id="upcoming-tournaments-content-container"></div>
						
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
<!--<input type="file" id="avatar-input" class="" accept="image/*" />-->
		<!-- Add Tournament -->
		<div id="add-tournament-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
		</div>`)],

                children: [
                    // new HtmlWidget(`HELOORRRR`),
                    new AddTournament('add-tournament-modal'),
                    new DependComposite({
                        dependWidgets: [
                            new BlocBuilder<AuthBloc, AuthState>({
                                buildWhen: (oldState, newState) => !oldState.equals(newState),
                                blocType: AuthBloc,
                                builder: (context, authState) => {
                                        let isHidden = !this.widget.userId;
                                        if (this.widget.userId && authState.user?.userId) {
                                            isHidden = authState.user.userId == (Number.parseInt(this.widget.userId!));
                                        }
                                        return new UpcomingTournamentWidget(isHidden, 'upcoming-tournaments-content-container')
                                    }
                            })
                        ],
                        children: [
                            new DependComposite({
                                dependWidgets: [
                                    new BlocBuilder<ProfileBloc, ProfileState>(
                                        {
                                            buildWhen: (oldState, newState) => !isEqual(oldState.profile, newState.profile),
                                            blocType: ProfileBloc,
                                            builder: (context, state) =>
                                                new ProfileInfo(state, this.widget.userId ? Number.parseInt(this.widget.userId) : undefined, 'profile-information-details'),
                                        }),
                                ],
                                children: [
                                    new EditProfile('edit-profile-modal'),
                                    new BlocBuilder<ProfileBloc, ProfileState>({
                                        blocType: ProfileBloc,
                                        buildWhen: (oldState, newState) => !oldState.equals(newState),
                                        builder: (_, state) => {
                                            if (state.status == ProfileStatus.Loading) {
                                                return new HtmlWidget(`<p>Loading Matches</p>`)
                                            }
                                            return new MatchHistory(state.profile?.id ? Number.parseInt(state.profile!.id.toString()) : undefined)},
                                        parentId: 'match-history-details'
                                    }),

                                    new UpcomingTournamentsModal('tournament-modal'),
                                    new MatchHistoryModal('matches-modal'),
                                    new NavigationMenu('profile-navigation'),
                                    new SearchUserModal(this.searchController, 'search-users-modal')


                                ]
                            },),
                            // new UpcomingTournaments('upcoming-tournaments'),
                        ]
                    }),
                ],
            })
        })


    }
}