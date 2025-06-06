import { addModalEvents } from "@/utils/modal_utils";
import { updatePaginationControls } from "@/utils/pagination";
import type {FriendResponse, ModalInfo, PaginationInfo, QuickUserResponse } from "@/utils/types";
import {Resolver} from "@/di/resolver";
import type {BuildContext} from "@/core/framework/core/buildContext";
import {ProfileBloc} from "@/presentation/features/profile/bloc/profileBloc";
// import { currentUser } from "@/utils/user";

export const FRIENDS_LIMIT = 10;
let currentFriendOffset = 0;
let totalFriendResults = 0;

export function viewFriends(context: BuildContext, id: number) {
	const elements = getFriendElements();
	if (!elements)
		return;

	const { modalInfo, paginationInfo } = elements;

	addModalEvents(modalInfo, "friends-modal");
	addFriendPaginationEvents(context, id, paginationInfo, modalInfo);
	fetchFriendList(context, id, currentFriendOffset, modalInfo, paginationInfo);
}

export function getFriendElements(): {
	modalInfo: ModalInfo;
	paginationInfo: PaginationInfo;
} | null {
	const previewContainer = document.getElementById("friends-preview") as HTMLElement;
	const listContainer = document.getElementById("friend-modal-list") as HTMLElement;
	const openModalBtn = document.getElementById("friend-list-btn") as HTMLButtonElement;
	const closeModalBtn = document.getElementById("close-friends-modal") as HTMLButtonElement;
	const prevPageBtn = document.getElementById("prev-friends-page") as HTMLButtonElement;
	const nextPageBtn = document.getElementById("next-friends-page") as HTMLButtonElement;
	const pageInfo = document.getElementById("friend-page-info") as HTMLElement;
	const paginatioBtns = document.getElementById("friend-pagination") as HTMLElement;

	if (!previewContainer || !listContainer || !openModalBtn || !closeModalBtn || !prevPageBtn || !nextPageBtn || !pageInfo || !paginatioBtns)
		return null;

	return {
		modalInfo: {
			previewContainer,
			openModalBtn,
			listContainer,
			closeModalBtn,
		},
		paginationInfo: {
			pageInfo,
			paginatioBtns,
			prevPageBtn,
			nextPageBtn,
		}
	};
}

export function renderFriendItem(context: BuildContext, friend: QuickUserResponse): string {
	const profileBloc = context.read(ProfileBloc);
	const currentUser = profileBloc.state.profile?.username
	const targetHash = friend.username === currentUser ? "#profile" : `#profile/${friend.username}`;
	return `
		<div onclick="location.hash = '${targetHash}'; initPersonalData(${friend.id});" class="px-4 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
			<img src="${friend.avatarPath}" alt="${friend.username}'s avatar" class="w-10 h-10 rounded-full object-cover" />
			<span>${friend.username}</span>
		</div>
	`;
}

export function renderFriendResults(context: BuildContext, data: FriendResponse, modalInfo: ModalInfo, offset: number) {
	if (data.totalCount === 0 && modalInfo.previewContainer) {
		modalInfo.previewContainer.innerHTML = `<p class="text-gray-500 p-4">No friends yet.</p>`;
		return;
	}

	if (offset === 0 && modalInfo.previewContainer) {
		modalInfo.previewContainer.innerHTML = "";
		const previewFriends = data.friends.slice(0, 3);
		previewFriends.forEach(friend => {
			modalInfo.previewContainer!.insertAdjacentHTML("beforeend", renderFriendItem(context, friend));
		});
	}

	if (data.totalCount > 3)
		modalInfo.openModalBtn.classList.remove("hidden");
	if (modalInfo.listContainer)
		modalInfo.listContainer.innerHTML = data.friends.map((e) => renderFriendItem(context, e)).join("");
}

export async function fetchFriendList(
	context: BuildContext,
	id: number,
	offset: number,
	modalInfo: ModalInfo,
	paginationInfo: PaginationInfo
) {
	try {
		const res = await fetch(`friend/:${id}?offset=${offset}&limit=${FRIENDS_LIMIT}`, {
			method: 'GET',
			credentials: 'include'
		});
		if (!res.ok)
			throw new Error("Failed to fetch friends");

		const data: FriendResponse = await res.json();

		renderFriendResults(context, data, modalInfo, offset);
		totalFriendResults = data.totalCount;
		currentFriendOffset = offset;

		updatePaginationControls(paginationInfo, totalFriendResults, currentFriendOffset, FRIENDS_LIMIT);

		if (data.totalCount > FRIENDS_LIMIT)
			paginationInfo.paginatioBtns.classList.remove("hidden");
		else
			paginationInfo.paginatioBtns.classList.add("hidden");
	} catch (err) {
		console.error("Error loading friends:", err);
		if (modalInfo.listContainer)
			modalInfo.listContainer.innerHTML = `<p class="text-red-500 p-4">Failed to load friends list.</p>`;
	}
}

export function addFriendPaginationEvents(
	context: BuildContext,
	id: number,
	paginationInfo: PaginationInfo,
	modalInfo: ModalInfo
) {
	paginationInfo.prevPageBtn.addEventListener("click", () => {
		if (currentFriendOffset >= FRIENDS_LIMIT) {
			fetchFriendList(context, id, currentFriendOffset - FRIENDS_LIMIT, modalInfo, paginationInfo);
		}
	});
	paginationInfo.nextPageBtn.addEventListener("click", () => {
		if (currentFriendOffset + FRIENDS_LIMIT < totalFriendResults) {
			fetchFriendList(context, id, currentFriendOffset + FRIENDS_LIMIT, modalInfo, paginationInfo);
		}
	});
}
