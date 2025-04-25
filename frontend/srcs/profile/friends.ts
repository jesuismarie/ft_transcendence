interface Friend {
	id: number;
	name: string;
}

const friends: Friend[] = [
	{ id: 1, name: "Alice" },
	{ id: 2, name: "Bob" },
	{ id: 3, name: "Charlie" },
	{ id: 4, name: "Diana" },
	{ id: 5, name: "Edward" },
];

function viewFriends() {
	const profileTemplate = document.getElementById("profile-template") as HTMLTemplateElement | null;

	if (!profileTemplate) {
		console.error("Profile template not found.");
		return;
	}

	const wrapper = document.getElementById("wrapper");
	if (!wrapper) {
		console.error("Wrapper element not found.");
		return;
	}
	wrapper.innerHTML = "";
	wrapper.appendChild(profileTemplate.content.cloneNode(true));

	const previewContainer = document.getElementById("friends-preview") as HTMLElement | null;
	const modalListContainer = document.getElementById("friend-modal-list") as HTMLElement | null;
	const viewAllBtn = document.getElementById("friend-list-btn") as HTMLElement | null;
	const modal = document.getElementById("friends-modal") as HTMLElement | null;
	const closeModalBtn = document.getElementById("close-friends-modal") as HTMLElement | null;

	if (!previewContainer || !modalListContainer || !viewAllBtn || !modal || !closeModalBtn) {
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
	const previewFriends = friends.slice(0, 3);
	previewFriends.forEach(friend => {
		previewContainer.insertAdjacentHTML("beforeend", renderFriendItem(friend));
	});

	modalListContainer.innerHTML = "";
	friends.forEach(friend => {
		modalListContainer.insertAdjacentHTML("beforeend", renderFriendItem(friend));
	});

	if (friends.length === 0) {
		previewContainer.innerHTML = `<p class="text-gray-500 p-4">No friends yet.</p>`;
		modalListContainer.innerHTML = `<p class="text-gray-500 p-4">You don’t have any friends added.</p>`;
		return;
	}
	if (friends.length > 3) {
		viewAllBtn.classList.remove("hidden");
	}

	viewAllBtn.addEventListener("click", () => {
		modal.classList.remove("hidden");
	});

	closeModalBtn.addEventListener("click", () => {
		modal.classList.add("hidden");
	});
	console.log(wrapper.innerHTML);
}
