import {container} from "tsyringe";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository";
import {AuthLogic} from "@/presentation/features/oauth/logic/auth_logic";
import {HtmlWidget} from "@/core/framework/htmlWidget";
import type {BuildContext} from "@/core/framework/buildContext";
import type {Widget} from "@/core/framework/widget";
import {State, StatefulWidget} from "@/core/framework/statefulWidget";
import {initPersonalData} from "@/profile/profile";
import {currentUserId} from "@/presentation/templates/templates";

export function logoutCallback() {
    const googleLogoutButton = document.getElementById('logout-btn');
    if (!googleLogoutButton)
        return;

    googleLogoutButton.addEventListener('click', async () => {
        const authRepository = container.resolve<RemoteAuthRepository>('RemoteAuthRepository');
        const authLogic = new AuthLogic(authRepository);
        await authLogic.logout();
        // loadHomePage();
    });
}



export class ProfileScreen extends  StatefulWidget {
    createState(): State<ProfileScreen> {
        return new ProfileScreenState();
    }
}

export class  ProfileScreenState extends State<ProfileScreen> {

    afterMounted(context: BuildContext) {
        super.afterMounted(context);
        initPersonalData(currentUserId).then(r => r);
        // const btn = document.getElementById('to-sign-in');
        // // context.logWidgetTree(context);
        // btn?.addEventListener('click', e => {
        //     e.preventDefault();
        //     const navigator = context.navigator();
        //     navigator.pushNamed(context, '/login')
        // })
    }

    build(context: BuildContext): Widget {
        const navigator = context.navigator();
        return new HtmlWidget(`
        <div class="w-[100dvw] h-[100dvh] flex flex-col justify-center items-center text-center">
			<h1 class="wipe-text neon-text flex gap-0 overflow-hidden text-[3rem] sm:text-[4rem] md:text-[5rem] font-bold select-none text-primary animate-neonGlow">
				Pong Profile!
			</h1>
			<div class="w-[80vw] h-[80vh] bg-white flex flex-col justify-center items-center text-center border rounded-[20px] shadow-div-glow p-2">
				<!-- Navigation Menu -->
				<div class="w-full h-14 flex justify-end items-center px-4 sm:px-6 lg:px-8 bg-white">
					<nav class="flex items-center space-x-2">
						<button id="search-modal-btn" class="flex items-center gap-2 h-[40px] px-4 rounded-full hover:bg-hover transition">
							<span class="text-sm font-medium">Search</span>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5">
								<path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
							</svg>
						</button>
						<button id="logout-btn" class="flex items-center justify-center w-[40px] h-[40px] rounded-full hover:bg-hover transition">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5">
								<path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/>
							</svg>
						</button>
					</nav>
				</div>
				<div class="w-full h-full overflow-y-auto grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
					<!-- Profile Information -->
					<div class="lg:col-span-1 space-y-6">
						<div class="rounded-md border border-hover">
							<div class="bg-hover h-24"></div>
							<div class="px-4 pb-6 relative">
								<div class="flex justify-center -mt-12">
									<div class="relative">
										<img id="avatar-image" class="h-24 w-24 rounded-full border-4 border-primary" src="/images/background1.jpg" alt="User avatar">
										<button id="avatar-upload-btn" class="absolute bottom-0 right-0 bg-hover rounded-full p-2 text-white hover:shadow-neon focus:outline-none">
											<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
												<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
											</svg>
										</button>
										<input type="file" id="avatar-input" class="hidden" accept="image/*" />
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
<!--								<button onclick="loadGamePage()" class="mt-6 w-full bg-hover hover:shadow-neon text-white py-2 px-4 rounded-[20px]">Play</button>-->
								<button id="friend-request-btn" class="hidden mt-6 w-full bg-hover hover:shadow-neon text-white py-2 px-4 rounded-[20px]">Add Friend</button>
								<button id="edit-profile-btn" class="mt-6 w-full bg-hover hover:shadow-neon text-white py-2 px-4 rounded-[20px]">Edit Profile</button>
							</div>
						</div>
						<div class="px-4 py-3 rounded-md border border-hover">
							<h3 class="text-lg border-b border-hover">
								Friends
							</h3>
							<div id="friends-preview" class="divide-y divide-gray-200">
							</div>
							<button id="friend-list-btn" class="hidden px-4 py-3 text-sm rounded-[20px] border border-hover hover:text-hover">View All Friends</button>
						</div>
					</div>
					<div class="lg:col-span-3 space-y-6">
						<!-- Match History -->
						<div class="rounded-md px-5 py-4 border border-hover">
							<h3 class="text-lg font-medium border-b border-hover">
								Match History
							</h3>
							<div id="matches-preview" class="divide-y divide-gray-200">
							</div>
							<button id="match-list-btn" class="hidden px-4 py-3 text-sm rounded-[20px] border border-hover hover:text-hover">View All Matches</button>
						</div>

						<!-- Upcoming Tournaments -->
						<div id="upcoming-tournaments" class="rounded-md px-5 py-4 border border-hover">
							<h3 class="text-lg font-medium border-b border-hover mb-4">
								Upcoming Tournaments
							</h3>
							<p class="error-msg text-red-500 text-sm" data-error-for="tournament2"></p>
							<div id="tournament-preview" class="divide-y divide-gray-200">
							</div>
							<button id="view-tournament" class="hidden mt-4 px-4 py-3 text-sm rounded-[20px] border border-hover hover:text-hover">
								Browse Tournaments
							</button>
							<button id="add-tournament-preview-btn" class="mt-4 px-4 py-3 text-sm rounded-[20px] border border-hover hover:text-hover">
								Add Tournament / Play with Friend
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Search Users -->
		<div id="search-users-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
			<div class="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden transform transition-all">
				<div class="px-4 pt-5 pb-4 sm:p-6">
					<h3 class="text-lg border-b border-hover pb-2">
						Search
					</h3>
					<div class="flex flex-col sm:flex-row gap-4 mt-4">
						<input type="text" id="search-people" name="tournament-name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:border-hover sm:text-sm">
						<button id="search-users-btn" class="bg-hover hover:shadow-neon text-white py-2 px-4 rounded-md">Search</button>
					</div>
					<div id="search-users-list" class="mt-4 max-h-[60vh] overflow-y-auto divide-y divide-gray-200">
					</div>
					<div id="search-pagination" class="hidden flex justify-between items-center p-4 border-t border-gray-200">
						<button id="prev-search-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Previous</button>
						<span id="search-page-info" class="text-sm"></span>
						<button id="next-search-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Next</button>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
					<button id="close-search-modal" class="px-4 py-2 text-sm rounded-md border border-hover hover:text-hover">Close</button>
				</div>
			</div>
		</div>

		<!-- Edit Profile Modal -->
		<div id="edit-profile-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
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
		</div>

		<!-- View Friends List -->
		<div id="friends-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
			<div class="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden transform transition-all">
				<div class="px-4 pt-5 pb-4 sm:p-6">
					<h3 class="text-lg border-b border-hover pb-2">
						All Friends
					</h3>
					<div id="friend-modal-list" class="mt-4 max-h-[60vh] overflow-y-auto divide-y divide-gray-200">
					</div>
				</div>
				<div id="friend-pagination" class="hidden flex justify-between items-center p-4 border-t border-gray-200">
					<button id="prev-friends-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Previous</button>
					<span id="friend-page-info" class="text-sm"></span>
					<button id="next-friends-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Next</button>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
					<button id="close-friends-modal" class="px-4 py-2 text-sm rounded-md border border-hover hover:text-hover">Close</button>
				</div>
			</div>
		</div>

		<!-- View Match History -->
		<div id="matches-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
			<div class="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden transform transition-all">
				<div class="px-4 pt-5 pb-4 sm:p-6">
					<h3 class="text-lg border-b border-hover pb-2">
						All Matches
					</h3>
					<div id="match-modal-list" class="mt-4 max-h-[60vh] overflow-y-auto divide-y divide-gray-200">
					</div>
				</div>
				<div id="match-pagination" class="hidden flex justify-between items-center p-4 border-t border-gray-200">
					<button id="prev-matches-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Previous</button>
					<span id="match-page-info" class="text-sm"></span>
					<button id="next-matches-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Next</button>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
					<button id="close-matches-modal" class="px-4 py-2 text-sm rounded-md border border-hover hover:text-hover">Close</button>
				</div>
			</div>
		</div>

		<!-- View Upcoming Tournament -->
		<div id="tournament-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
			<div class="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden transform transition-all">
				<div class="px-4 pt-5 pb-4 sm:p-6">
					<h3 class="text-lg border-b border-hover pb-2">
						All Tournaments
					</h3>
					<p class="error-msg text-red-500 text-sm" data-error-for="tournament1"></p>
					<div id="tournament-modal-list" class="mt-4 max-h-[60vh] overflow-y-auto divide-y divide-gray-200"></div>
				</div>
				<div id="tournament-pagination" class="hidden flex justify-between items-center p-4 border-t border-gray-200">
					<button id="prev-tournament-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Previous</button>
					<span id="tournament-page-info" class="text-sm"></span>
					<button id="next-tournament-page" class="text-sm px-3 py-1 border rounded disabled:opacity-50">Next</button>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:px-6 flex justify-end">
					<button id="close-tournament-modal" class="px-4 py-2 text-sm rounded-md border border-hover hover:text-hover">Close</button>
				</div>
			</div>
		</div>

		<!-- Add Tournament -->
		<div id="add-tournament-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60">
			<div class="w-full max-w-lg bg-white rounded-md shadow-xl overflow-hidden transform transition-all">
				<div class="px-4 pt-5 pb-4 sm:p-6">
					<h3 class="text-lg font-medium">
						Add Tournament
					</h3>
					<div class="mt-4 space-y-4">
						<label for="tournament-name" class="block text-sm font-medium">Tournament Name</label>
						<input type="text" id="tournament-name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
						<p class="error-msg text-red-500 text-sm" data-error-for="add_tournament"></p>
						<label for="tournament-capacity" class="block text-sm font-medium text-gray-700">Tournament Capacity</label>
						<select id="tournament-capacity" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
							<option value="2">2</option>
							<option value="4">4</option>
							<option value="8">8</option>
							<option value="16">16</option>
						</select>
					</div>
				</div>
				<div class="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row-reverse gap-3">
					<button id="add-tournament-btn" type="button" class="bg-hover hover:shadow-neon text-white py-2 px-4 rounded-md">Add</button>
					<button id="close-add-tournament-modal" type="button" class="px-4 py-2 text-sm rounded-md border border-hover hover:text-hover">Close</button>
				</div>
			</div>
		</div>`);
    }
}