import {clearErrors, showError } from "@/utils/error_messages";
import {addModalEvents, hideModal } from "@/utils/modal_utils";
import type { ApiError, ModalInfo } from "@/utils/types";
import { currentUser } from "@/utils/user";
import {ApiConstants} from "@/core/constants/apiConstants";

export function getAddTournamentElements(): {
	modalInfo: ModalInfo,
	nameInput: HTMLInputElement;
	capacityInput: HTMLSelectElement;
} | null {
	const openModalBtn = document.getElementById("add-tournament-preview-btn") as HTMLButtonElement | null;
	const closeModalBtn = document.getElementById("close-add-tournament-modal") as HTMLButtonElement | null;
	const saveBtn = document.getElementById("add-tournament-btn") as HTMLButtonElement | null;
	const nameInput = document.getElementById("tournament-name") as HTMLInputElement | null;
	const capacityInput = document.getElementById("tournament-capacity") as HTMLSelectElement | null;


	if (!openModalBtn || !closeModalBtn || !saveBtn || !nameInput || !capacityInput)
		return null;

	return { 
		modalInfo: {
			openModalBtn,
			closeModalBtn,
			saveBtn,
		},
		nameInput,
		capacityInput,
	}
}

export function addTournament() {
	const elements = getAddTournamentElements();
	if (!elements)
		return;

	const { modalInfo, nameInput, capacityInput } = elements;

	addModalEvents(modalInfo, "add-tournament-modal");
	if (modalInfo.saveBtn) {
		modalInfo.saveBtn.addEventListener("click", () => {
			clearErrors();
			fetchAddTournament(nameInput, capacityInput);
		});
	}
}

export async function fetchAddTournament(
	nameInput: HTMLInputElement,
	capacityInput: HTMLSelectElement
) {
	const name = nameInput.value.trim();
	const capacity = parseInt(capacityInput.value);
	if (!name) {
		showError("add_tournament", "Please enter a tournament name.");
		return ;
	}
	try {
		const response = await fetch(`${ApiConstants.createTournament}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, capacity, currentUser }),
			credentials: "include",
		});

		if (!response.ok) {
			const result: ApiError = await response.json();
			showError("add_tournament", result.message);
			return;
		}
		hideModal("add-tournament-modal");
	} catch (err) {
		console.error("Error adding tournament:", err);
		showError("tournament1", "Failed to add tournament. Please try again.");
		showError("tournament2", "Failed to add tournament. Please try again.");
	}
	nameInput.value = "";
	capacityInput.selectedIndex = 0;
}

export async function deleteTournament(id: number, createdBy: string) {
	try {
		const response = await fetch(`${ApiConstants.deleteTournament}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id, createdBy }),
			credentials: "include"
		});
		
		if (!response.ok) {
			const result: ApiError = await response.json();
			showError("tournament1", result.message);
			showError("tournament2", result.message);
			return;
		}
	} catch (err) {
		console.error("Error deleting tournament:", err);
		showError("tournament1", "Failed to delete tournament. Please try again.");
		showError("tournament2", "Failed to delete tournament. Please try again.");
	}
}

export async function startTournament(tournamentId: number) {
	const response = await fetch(ApiConstants.startTournament, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ tournamentId }),
		credentials: "include"
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to start tournament");
	}
}
