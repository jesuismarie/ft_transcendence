function getAddTournamentElements(): {
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

function addTournament() {
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

async function fetchAddTournament(
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
		const response = await fetch("/create-tournament", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ currentUser, name, capacity }),
			credentials: "include",
		});

		if (!response.ok)
			throw new Error(`Server responded with status ${response.status}`);
		hideModal("add-tournament-modal");
	} catch (err) {
		console.error("Error adding tournament:", err);
		showError("tournament1", "Failed to add tournament. Please try again.");
		showError("tournament2", "Failed to add tournament. Please try again.");
	}
	nameInput.value = "";
	capacityInput.selectedIndex = 0;
}

async function deleteTournament(id: number, createdBy: string) {
	try {
		const response = await fetch("/delete-tournament", {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tournament_id: id, created_by: createdBy }),
			credentials: "include"
		});
		
		if (!response.ok)
			throw new Error(`Server responded with status ${response.status}`);
	} catch (err) {
		console.error("Error deleting tournament:", err);
		showError("tournament1", "Failed to delete tournament. Please try again.");
		showError("tournament2", "Failed to delete tournament. Please try again.");
	}
}

async function startTournament(tournamentId: number) {
	const response = await fetch("/start-tournament", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ tournament_id: tournamentId }),
		credentials: "include"
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to start tournament");
	}
}
