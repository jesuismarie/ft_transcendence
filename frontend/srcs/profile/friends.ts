let currentFriendOffset = 0;
const FRIENDS_LIMIT = 25;

function viewFriends(username: string | null = null, offset: number = 0, limit: number = FRIENDS_LIMIT) {
	const previewContainer = document.getElementById("friends-preview") as HTMLElement | null;
	const modalListContainer = document.getElementById("friend-modal-list") as HTMLElement | null;
	const viewAllBtn = document.getElementById("friend-list-btn") as HTMLButtonElement | null;
	const closeModalBtn = document.getElementById("close-friends-modal") as HTMLButtonElement | null;
	const prevPageBtn = document.getElementById("prev-friends-page") as HTMLButtonElement | null;
	const nextPageBtn = document.getElementById("next-friends-page") as HTMLButtonElement | null;
	const pageInfo = document.getElementById("friend-page-info") as HTMLElement | null;
	const paginatioBtns = document.getElementById("friend-pagination") as HTMLButtonElement | null;

	if (!previewContainer || !modalListContainer || !viewAllBtn || !closeModalBtn || !prevPageBtn || !nextPageBtn || !pageInfo || !paginatioBtns) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	const friends: Friend[] = [];

	const renderFriendItem = (friend: Friend): string => {
		const targetHash = friend.username === currentUser ? "#profile" : `#profile/${friend.username}`;
		return `
			<div onclick="location.hash = '${targetHash}'; initPersonalData('${friend.username}');" class="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
				<img src="${friend.avatar}" alt="${friend.username}'s avatar" class="w-10 h-10 rounded-full object-cover" />
				<span>${friend.username}</span>
			</div>
		`;
	};

	previewContainer.innerHTML = "";
	const previewFriends = friends.slice(0, 3);
	if (previewFriends.length === 0) {
		previewContainer.innerHTML = `<p class="text-gray-500 p-4">No friends yet.</p>`;
	} else {
		previewFriends.forEach(friend => {
			previewContainer.insertAdjacentHTML("beforeend", renderFriendItem(friend));
		});
	}

	if (friends.length > 3) {
		viewAllBtn.classList.remove("hidden");
	}

	const paginatedFriends = friends.slice(offset, offset + limit);
	modalListContainer.innerHTML = "";
	paginatedFriends.forEach(friend => {
		modalListContainer.insertAdjacentHTML("beforeend", renderFriendItem(friend));
	});

	if (friends.length > FRIENDS_LIMIT) {
		paginatioBtns.classList.remove("hidden");
	}
	const totalPages = Math.ceil(friends.length / limit);
	const currentPage = Math.floor(offset / limit) + 1;
	pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

	prevPageBtn.disabled = offset === 0;
	nextPageBtn.disabled = offset + limit >= friends.length;

	prevPageBtn.onclick = () => {
		currentFriendOffset = Math.max(0, currentFriendOffset - limit);
		viewFriends(null, currentFriendOffset, limit);
	};

	nextPageBtn.onclick = () => {
		if (currentFriendOffset + limit < friends.length) {
			currentFriendOffset += limit;
			viewFriends(null, currentFriendOffset, limit);
		}
	};

	viewAllBtn.onclick = () => {
		showModal("friends-modal");
		viewFriends(null, currentFriendOffset, limit);
	};

	closeModalBtn.onclick = () => {
		hideModal("friends-modal");
	};
}
