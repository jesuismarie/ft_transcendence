// import { showError } from "@/utils/error_messages";
// import { addModalEvents } from "@/utils/modal_utils";
// import { updatePaginationControls } from "@/utils/pagination";
// import type {ApiError, GetTournamentsInfoResponse, ModalInfo, PaginationInfo, TournamentInfo } from "@/utils/types";
// import { startTournament } from "./tournament_details";
// import {ApiConstants} from "@/core/constants/apiConstants";
//
// export const TOURNAMENTS_LIMIT = 10;
// let currentTournamentOffset = 0;
// let totalTournamentResults = 0;
//
// export async function registerToTournament(tournamentId: number, username: string) {
// 	try {
// 		const response = await fetch(`${ApiConstants.registerToTournament}`, {
// 			method: "POST",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify({ username, tournamentId }),
// 			credentials: "include"
// 		});
//
// 		if (!response.ok) {
// 			const result: ApiError = await response.json();
// 			showError("tournament1", result.message);
// 			showError("tournament2", result.message);
// 		}
// 	} catch (error) {
// 		showError("tournament1", "An unexpected error occurred while registering.");
// 		showError("tournament2", "An unexpected error occurred while registering.");
//
// 	}
// }
//
// export async function unregisterFromTournament(tournamentId: number, username: string) {
// 	try {
// 		const response = await fetch(ApiConstants.unregisterFromTournament, {
// 			method: "POST",
// 			headers: { "Content-Type": "application/json" },
// 			body: JSON.stringify({ username, tournamentId }),
// 			credentials: "include"
// 		});
//
// 		if (!response.ok) {
// 			const result: ApiError = await response.json();
// 			showError("tournament1", result.message);
// 			showError("tournament2", result.message);
// 		}
// 	} catch (error) {
// 		showError("tournament1", "An unexpected error occurred while unregistering.");
// 		showError("tournament2", "An unexpected error occurred while unregistering.");
// 	}
// }
//
// export function initTournaments(username: string | null) {
// 	const elements = getTournamentElements();
// 	if (!elements)
// 		return;
//
// 	const { modalInfo, paginationInfo } = elements;
//
// 	addModalEvents(modalInfo, "tournament-modal");
// 	addTournamentPaginationEvents(username, paginationInfo, modalInfo);
// 	fetchTournamentList(username, currentTournamentOffset, modalInfo, paginationInfo);
// }
//
// export function getTournamentElements(): {
// 	modalInfo: ModalInfo;
// 	paginationInfo: PaginationInfo;
// } | null {
// 	const previewContainer = document.getElementById("tournament-preview") as HTMLElement;
// 	const listContainer = document.getElementById("tournament-modal-list") as HTMLElement;
// 	const openModalBtn = document.getElementById("view-tournament") as HTMLButtonElement;
// 	const closeModalBtn = document.getElementById("close-tournament-modal") as HTMLButtonElement;
// 	const prevPageBtn = document.getElementById("prev-tournament-page") as HTMLButtonElement;
// 	const nextPageBtn = document.getElementById("next-tournament-page") as HTMLButtonElement;
// 	const pageInfo = document.getElementById("tournament-page-info") as HTMLElement;
// 	const paginationBtns = document.getElementById("tournament-pagination") as HTMLElement;
//
// 	if (!previewContainer || !listContainer || !openModalBtn || !closeModalBtn ||
// 		!prevPageBtn || !nextPageBtn || !pageInfo || !paginationBtns)
// 		return null;
//
// 	return {
// 		modalInfo: {
// 			previewContainer,
// 			openModalBtn,
// 			listContainer,
// 			closeModalBtn,
// 		},
// 		paginationInfo: {
// 			pageInfo,
// 			paginatioBtns: paginationBtns,
// 			prevPageBtn,
// 			nextPageBtn,
// 		}
// 	};
// }
//
// export function renderTournamentItem(tournament: TournamentInfo, username: string | null): string {
// 	const isRegistered = tournament.participants.includes(username ?? "");
// 	const isCreator = tournament.created_by === username;
// 	const isFull = tournament.current_players_count >= tournament.max_players_count;
//
// 	const regBtnClass = isRegistered
// 		? "bg-red-100 text-red-800"
// 		: isFull ? "bg-gray-100 text-gray-800" : "bg-green-100 text-green-800";
// 	const regBtnText = isRegistered ? "Unregister" : isFull ? "Full" : "Register";
//
// 	const registerButton = (!isCreator) ? `
// 		<button data-id="${tournament.id}" class="register-tournament-btn px-3 py-1 text-xs font-semibold rounded-full ${regBtnClass}" ${isFull && !isRegistered ? 'disabled' : ''}>
// 			${regBtnText}
// 		</button>` : '';
//
// 	return `
// 		<div class="px-4 py-5 sm:px-6 hover:bg-gray-50">
// 			<div class="flex flex-col sm:flex-row sm:justify-between">
// 				<div align="left">
// 					<h3 class="text-lg font-medium">${tournament.name}</h3>
// 					<p class="mt-1 text-sm text-gray-500">
// 						Players: ${tournament.current_players_count}/${tournament.max_players_count}
// 					</p>
// 					<p class="mt-1 text-sm text-gray-500">
// 						Created by: ${tournament.created_by}
// 					</p>
// 				</div>
// 				<div align="right" class="mt-2 sm:mt-0 flex flex-col sm:flex-row gap-2 items-end sm:items-start">
// 					${isCreator ? `
// 						<button data-id="${tournament.id}" class="start-tournament-btn px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
// 							Start
// 						</button>
// 						<button data-id="${tournament.id}" onclick="deleteTournament(${tournament.id}, '${username}')" class="delete-tournament-btn px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
// 							Delete
// 						</button>
// 					` : ''}
// 					${registerButton}
// 				</div>
// 			</div>
// 		</div>
// 	`;
// }
//
// export function renderTournamentResults(data: GetTournamentsInfoResponse, modalInfo: ModalInfo, offset: number, username: string | null) {
// 	if (data.totalCount === 0 && modalInfo.previewContainer) {
// 		modalInfo.previewContainer.innerHTML = `<p class="text-gray-500 p-4">No tournaments available.</p>`;
// 		return;
// 	}
//
// 	if (offset === 0 && modalInfo.previewContainer) {
// 		modalInfo.previewContainer.innerHTML = "";
// 		const previewTournaments = data.tournament.slice(0, 3);
// 		previewTournaments.forEach(tournament => {
// 			modalInfo.previewContainer!.insertAdjacentHTML("beforeend", renderTournamentItem(tournament, username));
// 		});
// 	}
//
// 	if (data.totalCount > 3)
// 		modalInfo.openModalBtn.classList.remove("hidden");
// 	if (modalInfo.listContainer)
// 		modalInfo.listContainer.innerHTML = data.tournament.map(tournament => renderTournamentItem(tournament, username)).join("");
//
// 	addTournamentButtonListeners(username);
// }
//
// export async function fetchTournamentList(
// 	username: string | null,
// 	offset: number,
// 	modalInfo: ModalInfo,
// 	paginationInfo: PaginationInfo
// ) {
// 	try {
// 		const res = await fetch(`${ApiConstants.getTournamentInfo}?offset=${offset}&limit=${TOURNAMENTS_LIMIT}`, {
// 			credentials: 'include'
// 		});
// 		if (!res.ok)
// 			throw new Error("Failed to fetch tournaments");
//
// 		const data: GetTournamentsInfoResponse = await res.json();
//
// 		renderTournamentResults(data, modalInfo, offset, username);
// 		totalTournamentResults = data.totalCount;
// 		currentTournamentOffset = offset;
//
// 		updatePaginationControls(paginationInfo, totalTournamentResults, currentTournamentOffset, TOURNAMENTS_LIMIT);
//
// 		if (data.totalCount > TOURNAMENTS_LIMIT) {
// 			paginationInfo.paginatioBtns.classList.remove("hidden");
// 		} else {
// 			paginationInfo.paginatioBtns.classList.add("hidden");
// 		}
// 	} catch (err) {
// 		console.error("Error loading tournaments:", err);
// 		if (modalInfo.listContainer)
// 			modalInfo.listContainer.innerHTML = `<p class="text-red-500 p-4">Failed to load tournaments list.</p>`;
// 	}
// }
//
// export function addTournamentPaginationEvents(
// 	username: string | null,
// 	paginationInfo: PaginationInfo,
// 	modalInfo: ModalInfo
// ) {
// 	paginationInfo.prevPageBtn.onclick = () => {
// 		if (currentTournamentOffset >= TOURNAMENTS_LIMIT) {
// 			fetchTournamentList(username, currentTournamentOffset - TOURNAMENTS_LIMIT, modalInfo, paginationInfo);
// 		}
// 	};
//
// 	paginationInfo.nextPageBtn.onclick = () => {
// 		if (currentTournamentOffset + TOURNAMENTS_LIMIT < totalTournamentResults) {
// 			fetchTournamentList(username, currentTournamentOffset + TOURNAMENTS_LIMIT, modalInfo, paginationInfo);
// 		}
// 	};
// }
//
// export function addTournamentButtonListeners(username: string | null) {
// 	document.querySelectorAll('.register-tournament-btn').forEach(btn => {
// 		btn.addEventListener('click', async (e) => {
// 			const button = e.currentTarget as HTMLButtonElement;
// 			const tournamentId = Number(button.getAttribute('data-id'));
// 			const isRegistered = button.textContent?.trim() === 'Unregister';
//
// 			try {
// 				if (isRegistered) {
// 					await unregisterFromTournament(tournamentId, username ?? "");
// 				} else {
// 					await registerToTournament(tournamentId, username ?? "");
// 				}
// 				const elements = getTournamentElements();
// 				if (elements) {
// 					fetchTournamentList(username, currentTournamentOffset, elements.modalInfo, elements.paginationInfo);
// 				}
// 			} catch (error) {
// 				console.error('Tournament registration error:', error);
// 				showError("tournament1", "Failed to update tournament registration.");
// 				showError("tournament2", "Failed to update tournament registration.");
// 			}
// 		});
// 	});
//
// 	document.querySelectorAll('.start-tournament-btn').forEach(btn => {
// 		btn.addEventListener('click', async (e) => {
// 			const button = e.currentTarget as HTMLButtonElement;
// 			const tournamentId = Number(button.getAttribute('data-id'));
//
// 			try {
// 				await startTournament(tournamentId);
// 				const elements = getTournamentElements();
// 				if (elements) {
// 					fetchTournamentList(username, currentTournamentOffset, elements.modalInfo, elements.paginationInfo);
// 				}
// 			} catch (error) {
// 				console.error('Tournament start error:', error);
// 				showError("tournament1", "Failed to start tournament.");
// 				showError("tournament2", "Failed to start tournament.");
// 			}
// 		});
// 	});
// }
