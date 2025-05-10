const tournaments: Tournament[] = [
];

function initTournaments(username: string | null = null) {
	const previewContainer = document.getElementById("tournament-preview") as HTMLElement | null;
	const modalListContainer = document.getElementById("tournament-modal-list") as HTMLElement | null;
	const viewBtn = document.getElementById("view-tournament") as HTMLButtonElement | null;
	const closeModalBtn = document.getElementById("close-tournament-modal") as HTMLButtonElement | null;

	if (!previewContainer || !modalListContainer || !viewBtn || !closeModalBtn) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	const renderTournamentItem = (tournament: Tournament): string => {
		const regBtnClass = tournament.registered
			? "bg-green-50 text-green-800"
			: "bg-red-50 text-red-800";
		const regBtnText = tournament.registered ? "Registered" : "Register";

		return `
			<div class="px-4 py-5 sm:px-6 hover:bg-gray-50 cursor-pointer">
				<div class="flex flex-col sm:flex-row sm:justify-between">
					<div align="left">
						<p class="font-semibold">${tournament.name}</p>
						<p class="text-sm text-gray-600">${tournament.date}</p>
					</div>
					<button id="${tournament.id}" class="mt-2 sm:mt-0 px-3 py-1 text-xs font-semibold rounded-full ${regBtnClass}">
						${regBtnText}
					</button>
				</div>
			</div>
		`;
	};

	previewContainer.innerHTML = "";
	const previewTournaments = tournaments.slice(0, 3);
	previewTournaments.forEach(tournament => {
		previewContainer.insertAdjacentHTML("beforeend", renderTournamentItem(tournament));
	});

	modalListContainer.innerHTML = "";
	tournaments.forEach(tournament => {
		modalListContainer.insertAdjacentHTML("beforeend", renderTournamentItem(tournament));
	});

	if (tournaments.length == 0) {
		previewContainer.innerHTML = `<p class="text-gray-500 p-4">No tournaments yet.</p>`;
		return;
	}
	if (tournaments.length > 3) {
		viewBtn.classList.remove("hidden");
	}

	const checkRegistered = (tournamentId: number): boolean => {
		const tournament = tournaments.find(t => t.id === tournamentId);
		if (tournament) {
			tournament.registered = !tournament.registered;
			return tournament.registered;
		}
		return false;
	};

	const registerBtn = (tournamentId: number): void => {
		const tournament = tournaments.find(t => t.id === tournamentId);
		if (!tournament)
			return;
		const buttons = document.querySelectorAll(`button[id="${tournamentId}"]`);
		buttons.forEach(btn => {
			if (tournament.registered) {
				btn.classList.remove("bg-red-50", "text-red-800");
				btn.classList.add("bg-green-50", "text-green-800");
				btn.textContent = "Registered";
			} else {
				btn.classList.remove("bg-green-50", "text-green-800");
				btn.classList.add("bg-red-50", "text-red-800");
				btn.textContent = "Register";
			}
		});
	};

	const handleTournamentRegistration = (username: string | null): void => {
		const registerButtons = document.querySelectorAll("button[id]");
		registerButtons.forEach(button => {
			button.addEventListener("click", (event) => {
				const target = event.currentTarget as HTMLButtonElement;
				const tournamentId = parseInt(target.id);
				const isRegistered = checkRegistered(tournamentId);
				registerBtn(tournamentId);
				// if (username) {
				// 	const url = `/api/tournament/${tournamentId}/register`;
				// 	const method = isRegistered ? "POST" : "DELETE";
				// 	fetch(url, {
				// 		method: method,
				// 		headers: {
				// 			"Content-Type": "application/json",
				// 			"Authorization": `Bearer ${localStorage.getItem("access_token")}`
				// 		}
				// 	})
				// 		.then(response => {
				// 			if (!response.ok) {
				// 				throw new Error("Network response was not ok");
				// 			}
				// 			return response.json();
				// 		})
				// 		.then(data => {
				// 			if (data.success) {
				// 				console.log("Registration successful");
				// 			} else {
				// 				console.error("Registration failed");
				// 			}
				// 		})
				// 		.catch(error => {
				// 			console.error("There was a problem with the fetch operation:", error);
				// 		});
				// }
			});
		});
	}

	handleTournamentRegistration(username);

	viewBtn.addEventListener("click", () => {
		showModal("tournament-modal");
	});
	
	closeModalBtn.addEventListener("click", () => {
		hideModal("tournament-modal");
	});
}

function addTournament() {
	const addTournamentPreviewBtn = document.getElementById("add-tournament-preview-btn") as HTMLButtonElement | null;
	const closeTournamentModalBtn = document.getElementById("close-add-tournament-modal") as HTMLButtonElement | null;

	if (!addTournamentPreviewBtn || !closeTournamentModalBtn) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	addTournamentPreviewBtn.addEventListener("click", () => {
		showModal("add-tournament-modal");
	});

	closeTournamentModalBtn.addEventListener("click", () => {
		hideModal("add-tournament-modal");
	});
}
