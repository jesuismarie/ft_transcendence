function initData(username: string | null = null, wins: number = 0, losses: number = 0) {
	const playerName = document.getElementById("player-name") as HTMLElement | null;
	const playerWins = document.getElementById("player-wins") as HTMLElement | null;
	const playerLosses = document.getElementById("player-losses") as HTMLElement | null;
	const onlineStatus = document.getElementById("online-status") as HTMLElement | null;

	if (!playerName || !playerWins || !playerLosses || !onlineStatus) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	playerName.innerHTML = username || "Player";
	playerWins.innerHTML = wins.toString();
	playerLosses.innerHTML = losses.toString();
	// onlineStatus.innerHTML = `
	// <div class="w-2 h-2 bg-red-500 rounded-full inline-block mr-1"></div>
	// <span class="text-red-500">Offline</span>
	// `;
	onlineStatus.innerHTML = `
		<div class="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></div>
		<span class="text-green-500">Online</span>
	`;
}

function initAvatarUpload(username: string | null = null) {
	const uploadBtn = document.getElementById("avatar-upload-btn");
	const fileInput = document.getElementById("avatar-input") as HTMLInputElement | null;
	const avatarImage = document.getElementById("avatar-image") as HTMLImageElement | null;

	if (!uploadBtn || !fileInput || !avatarImage)
		return;

	if ("me" !== username) {
		uploadBtn.remove();
		fileInput.remove();
		return;
	}

	uploadBtn.addEventListener("click", () => {
		fileInput?.click();
	});

	fileInput?.addEventListener("change", async () => {
		if (!fileInput.files || fileInput.files.length === 0) return;
		const file = fileInput.files[0];

		const reader = new FileReader();
		reader.onload = () => {
			avatarImage.src = reader.result as string;
		};
		reader.readAsDataURL(file);

		const formData = new FormData();
		formData.append("avatar", file);

		try {
			const res = await fetch("/api/upload-avatar", {
				method: "POST",
				body: formData,
			});
			if (!res.ok) throw new Error("Upload failed");

			const data = await res.json();
			console.log("Avatar uploaded:", data);
		} catch (err) {
			console.error("Avatar upload error:", err);
		}
	});
}

async function initPersonalData(username: string | null = null) {
	initWipeText();
	searchUsers();
	viewFriends(username);
	viewMatches(username);
	initData(username, 0, 0);

	const editProfileBtn = document.getElementById("edit-profile-btn") as HTMLButtonElement | null;
	const upcomingTournaments = document.getElementById("upcoming-tournaments") as HTMLElement | null;
	const friendRequestBtn = document.getElementById("friend-request-btn") as HTMLButtonElement | null;
	const friendRequestListBtn = document.getElementById("friend-request-list-btn") as HTMLButtonElement | null;
	const addTournamentPreviewBtn = document.getElementById("add-tournament-preview-btn") as HTMLButtonElement | null;

	if (!editProfileBtn || !upcomingTournaments || !friendRequestBtn || !friendRequestListBtn || !addTournamentPreviewBtn) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	try {
		const currentUsername = getCurrentUser();
		const targetUsername = username || currentUsername;

		if (!targetUsername) {
			throw new Error("Username is required to load user profile");
		}

		const res = await fetch(`/api/users/${targetUsername}`);
		if (!res.ok)
			throw new Error("Failed to load user profile");
		const user: UserProfile = await res.json();

		if (targetUsername === currentUsername) {
			initAvatarUpload(targetUsername);
			editProfileBtn.classList.remove("hidden");
			editProfile(user);
			upcomingTournaments.classList.remove("hidden");
			initFriendRequests(targetUsername);
			initTournaments(targetUsername);
			addTournament();
		} else {
			editProfileBtn.classList.add("hidden");
			upcomingTournaments.classList.add("hidden");
			friendRequestBtn.classList.remove("hidden");
			friendRequestListBtn.classList.add("hidden");
			addTournamentPreviewBtn.classList.add("hidden");
		}
	} catch (err) {
		console.error("Error loading personal data:", err);
	}
}
