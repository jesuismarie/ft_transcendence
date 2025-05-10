const friends: Friend[] = [
];

function viewFriends(username: string | null = null) {
	const previewContainer = document.getElementById("friends-preview") as HTMLElement | null;
	const modalListContainer = document.getElementById("friend-modal-list") as HTMLElement | null;
	const viewAllBtn = document.getElementById("friend-list-btn") as HTMLButtonElement | null;
	const closeModalBtn = document.getElementById("close-friends-modal") as HTMLButtonElement | null;

	if (!previewContainer || !modalListContainer || !viewAllBtn || !closeModalBtn) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	const renderFriendItem = (friend: Friend): string => {
		const targetHash = friend.username === currentUser ? "#profile" : `#profile/${friend.username}`;
		return `
			<div onclick="location.hash = '${targetHash}';" class="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
				<img src="${friend.avatar}" alt="${friend.username}'s avatar" class="w-10 h-10 rounded-full object-cover" />
				<span>${friend.username}</span>
			</div>
		`;
	};

	previewContainer.innerHTML = "";
	const previewFriends = friends.slice(0, 3);
	previewFriends.forEach(friend => {
		previewContainer.insertAdjacentHTML("beforeend", renderFriendItem(friend));
	});

	modalListContainer.innerHTML = "";
	friends.forEach(friend => {
		modalListContainer.insertAdjacentHTML("beforeend", renderFriendItem(friend));
	});

	if (friends.length == 0) {
		previewContainer.innerHTML = `<p class="text-gray-500 p-4">No friends yet.</p>`;
		return;
	}
	if (friends.length > 3) {
		viewAllBtn.classList.remove("hidden");
	}

	viewAllBtn.addEventListener("click", () => {
		showModal("friends-modal");
	});

	closeModalBtn.addEventListener("click", () => {
		hideModal("friends-modal");
	});
}
