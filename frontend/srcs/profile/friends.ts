interface Friend {
	id: number;
	name: string;
	avatar?: string;
}

const friends: Friend[] = [
	{ id: 1, name: "Alice", avatar: "https://example.com/avatar1.png" },
	{ id: 2, name: "Bob", avatar: "https://example.com/avatar2.png" },
	{ id: 3, name: "Charlie", avatar: "https://example.com/avatar3.png" },
	{ id: 4, name: "Diana", avatar: "https://example.com/avatar4.png" },
	{ id: 5, name: "Edward", avatar: "https://example.com/avatar5.png" },
	{ id: 6, name: "Fiona", avatar: "https://example.com/avatar6.png" },
	{ id: 7, name: "George", avatar: "https://example.com/avatar7.png" },
	{ id: 8, name: "Hannah", avatar: "https://example.com/avatar8.png" },
	{ id: 9, name: "Ian", avatar: "https://example.com/avatar9.png" },
	{ id: 10, name: "Judy", avatar: "https://example.com/avatar10.png" },
];

function viewFriends() {
	const previewContainer = document.getElementById("friends-preview") as HTMLElement | null;
	const modalListContainer = document.getElementById("friend-modal-list") as HTMLElement | null;
	const viewAllBtn = document.getElementById("friend-list-btn") as HTMLElement | null;
	const closeModalBtn = document.getElementById("close-friends-modal") as HTMLElement | null;

	if (!previewContainer || !modalListContainer || !viewAllBtn || !closeModalBtn) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	const renderFriendItem = (friend: Friend): string => {
		return `
			<div class="px-4 py-3 hover:bg-gray-50 flex items-center gap-3">
				<div class="w-10 h-10 rounded-full bg-gray-300"></div>
				<span>${friend.name}</span>
			</div>
		`;
	};

	previewContainer.innerHTML = "";
	const previewFriends = friends.slice(0, 5);
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
	if (friends.length > 5) {
		viewAllBtn.classList.remove("hidden");
	}

	viewAllBtn.addEventListener("click", () => {
		showModal("friends-modal");
	});

	closeModalBtn.addEventListener("click", () => {
		hideModal("friends-modal");
	});
}
