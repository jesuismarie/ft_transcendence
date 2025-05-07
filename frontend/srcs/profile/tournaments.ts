const tournaments: Tournament[] = [
	{ id: 1, name: "Masters Tournament", date: "2025-10-15", capacity: 64, registered: false },
	{ id: 2, name: "Legends Cup", date: "2025-11-30", capacity: 128, registered: false },
	{ id: 3, name: "Grand Finals", date: "2025-12-25", capacity: 256, registered: false },
	{ id: 4, name: "Battle Royale", date: "2025-01-01", capacity: 512, registered: false },
	{ id: 5, name: "Ultimate Showdown", date: "2025-02-14", capacity: 1024, registered: false },
	{ id: 6, name: "Spring Cup", date: "2025-05-05", capacity: 8, registered: false },
	{ id: 7, name: "Summer Showdown", date: "2025-06-01", capacity: 16, registered: false },
	{ id: 8, name: "Autumn Arena", date: "2025-07-10", capacity: 4, registered: false },
	{ id: 9, name: "Winter Clash", date: "2025-08-20", capacity: 12, registered: false },
	{ id: 10, name: "Champions League", date: "2025-09-01", capacity: 32, registered: false },
];

function initTournaments(username: string | null = null) {
	const previewContainer = document.getElementById("tournament-preview")!;
	const modalListContainer = document.getElementById("tournament-modal-list")!;
	const viewBtn = document.getElementById("view-tournament")!;
	const closeModalBtn = document.getElementById("close-tournament-modal")!;

	if (!previewContainer || !modalListContainer || !viewBtn) {
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
