// import {currentUser, getCurrentUserId} from "@/utils/user";
import {addFriend, checkIfFriend} from "./add_friend";
// import {editProfile} from "./edit";
import {initTournaments} from "./tournaments";
import {setup2FA} from "./twofa";
import {addTournament} from "./tournament_details";
// import {initAvatarUpload} from "./avatar";
import {viewFriends} from "./friends";
import {viewMatches} from "./matches";
// import {searchUsers} from "./search";
import type {UserView} from "@/utils/types";
import {initWipeText} from "@/animation/animation";
import {ApiConstants} from "@/core/constants/apiConstants";
import {Resolver} from "@/di/resolver";
import type {BuildContext} from "@/core/framework/core/buildContext";
import {AuthBloc} from "@/presentation/features/auth/logic/authBloc";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";

export function initData(user: UserView) {
    const playerName = document.getElementById("player-name") as HTMLElement | null;
    const playerWins = document.getElementById("player-wins") as HTMLElement | null;
    const playerLosses = document.getElementById("player-losses") as HTMLElement | null;
    const onlineStatus = document.getElementById("online-status") as HTMLElement | null;

    if (!playerName || !playerWins || !playerLosses || !onlineStatus) {
        console.error("One or more required elements are missing in the DOM.");
        return;
    }

    playerName.innerHTML = user.username || "Player";
    playerWins.innerHTML = user.wins.toString();
    playerLosses.innerHTML = user.losses.toString();
    // onlineStatus.innerHTML = `
    // <div class="w-2 h-2 bg-red-500 rounded-full inline-block mr-1"></div>
    // <span class="text-red-500">Offline</span>
    // `;
    onlineStatus.innerHTML = `
		<div class="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></div>
		<span class="text-green-500">Online</span>
	`;
}

export async function initPersonalData(context: BuildContext, id: number) {
    initWipeText();

    const editProfileBtn = document.getElementById("edit-profile-btn") as HTMLButtonElement | null;
    const upcomingTournaments = document.getElementById("upcoming-tournaments") as HTMLElement | null;
    const friendRequestBtn = document.getElementById("friend-request-btn") as HTMLButtonElement | null;
    const addTournamentPreviewBtn = document.getElementById("add-tournament-preview-btn") as HTMLButtonElement | null;
    console.warn("EEE:::: ", editProfileBtn)
    if (!editProfileBtn || !upcomingTournaments || !friendRequestBtn || !addTournamentPreviewBtn) {
        console.error("One or more required elements are missing in the DOM.");
        return;
    }

    try {
        const authBloc = context.read(AuthBloc);
        const profileBloc = context.read(ProfileBloc);
        const currentUserId = authBloc.state.user?.userId;
        const username = profileBloc.state.profile?.username
        const targetUserId = id || currentUserId;

        if (!username || !currentUserId || !targetUserId)
            throw new Error("Username is required to load user profile");

        // console.log(`CURRRRR:::: ${JSON.parse(currentUser!).accessToken}`);

        const user = profileBloc.state.profile;
        // const res = await fetch(`${ApiConstants.users}/:${targetUserId}`, {
        //     method: 'GET',
        //     headers: {Authorization: `Bearer ${JSON.parse(currentUser!).accessToken}`}
        //     // credentials: 'include'
        // });
        // console.log("LLLLLL", res instanceof HTMLElement);
        // if (!res.ok)
        //     throw new Error("Failed to load user profile");
        // const user: UserView = await res.json();

			// console.log("USSSSSSSS", user);
        // let targetUserId = 0;
        // let currentUserId = 0;
        // const user: UserView = {
        // 	id: 1,
        // 	email: "test@test.com",
        // 	username: "test",
        // 	wins: 10,
        // 	losses: 5,
        // 	avatar: "https://example.com/avatar.png"
        // };
        // searchUsers();
        viewFriends(context, user.id);
        viewMatches(user.id, user.username);
        initData(user);

        if (targetUserId === currentUserId) {
            // initAvatarUpload(context, targetUserId);
            // editProfileBtn.classList.remove("hidden");
            // editProfile(user);
            // await setup2FA();
            // upcomingTournaments.classList.remove("hidden");
            initTournaments(username);
            addTournament(context);
        } else {
            // editProfileBtn.classList.add("hidden");
            // upcomingTournaments.classList.add("hidden");
            const isAlreadyFriend = await checkIfFriend(currentUserId, targetUserId);
            if (!isAlreadyFriend) {
                friendRequestBtn.classList.remove("hidden");
                friendRequestBtn.addEventListener("click", () => {
                    addFriend(currentUserId, targetUserId, friendRequestBtn);
                });
            } else {
                friendRequestBtn.classList.add("hidden");
            }
            addTournamentPreviewBtn.classList.add("hidden");
        }
    } catch (err) {
        console.error("Error loading personal data:", err);
    }
}
