const friendRequests: FriendRequest[] = [
	{ id: 1, fromUser: { id: 1, username: "Alice", avatar: "https://example.com/avatar1.jpg" }},
	{ id: 2, fromUser: { id: 2, username: "Bob", avatar: "https://example.com/avatar2.jpg" }},
	{ id: 3, fromUser: { id: 3, username: "Charlie", avatar: "https://example.com/avatar3.jpg" }},
	{ id: 4, fromUser: { id: 4, username: "David", avatar: "https://example.com/avatar4.jpg" }},
	{ id: 5, fromUser: { id: 5, username: "Eve", avatar: "https://example.com/avatar5.jpg" }},
];

function initRequests(username: string | null = null)
{
	const friendRequestListBtn = document.getElementById("friend-request-list-btn") as HTMLButtonElement | null;
	const modalRequestList = document.getElementById("friend-requests-list");
	const closeModalBtn = document.getElementById("close-friend-requests-modal");

	if (!modalRequestList || !closeModalBtn) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	modalRequestList.innerHTML = "";
	if (friendRequests.length === 0) {
		modalRequestList.innerHTML = `<p class="text-gray-500 p-4">No pending requests.</p>`;
	} else {
		friendRequests.forEach(req => {
			modalRequestList.insertAdjacentHTML("beforeend", `
				<div class="px-4 py-3 hover:bg-gray-50 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<img src="${req.fromUser.avatar}" alt="${req.fromUser.username}" class="w-10 h-10 rounded-full object-cover" />
						<span>${req.fromUser.username}</span>
					</div>
					<div class="flex gap-2">
						<button class="text-sm px-3 py-1 bg-green-100 text-green-800 rounded-full">Accept</button>
						<button class="text-sm px-3 py-1 bg-red-100 text-red-800 rounded-full">Decline</button>
					</div>
				</div>
			`);
		});
	}

	friendRequestListBtn?.addEventListener("click", () => {
		showModal("friend-requests-modal");
	});

	closeModalBtn.addEventListener("click", () => {
		hideModal("friend-requests-modal");
	});
}
