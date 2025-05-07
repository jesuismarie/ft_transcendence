const friends: Friend[] = [
	{ id: 1, username: "friend1", avatar: "https://example.com/avatar1.jpg", status: true },
	{ id: 2, username: "friend2", avatar: "https://example.com/avatar2.jpg", status: true },
	{ id: 3, username: "friend3", avatar: "https://example.com/avatar3.jpg", status: true },
	{ id: 4, username: "friend4", avatar: "https://example.com/avatar4.jpg", status: true },
	{ id: 5, username: "friend5", avatar: "https://example.com/avatar5.jpg", status: true },
	{ id: 6, username: "friend6", avatar: "https://example.com/avatar6.jpg", status: true },
	{ id: 7, username: "friend7", avatar: "https://example.com/avatar7.jpg", status: true },
	{ id: 8, username: "friend8", avatar: "https://example.com/avatar8.jpg", status: true },
	{ id: 9, username: "friend9", avatar: "https://example.com/avatar9.jpg", status: true },
	{ id: 10, username: "friend10", avatar: "https://example.com/avatar10.jpg", status: true },
];

function viewFriends(username: string | null = null) {
	const previewContainer = document.getElementById("friends-preview") as HTMLElement | null;
	const modalListContainer = document.getElementById("friend-modal-list") as HTMLElement | null;
	const viewAllBtn = document.getElementById("friend-list-btn") as HTMLElement | null;
	const closeModalBtn = document.getElementById("close-friends-modal") as HTMLElement | null;

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
