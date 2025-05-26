function registerToTournament(tournamentId: number, username: string) {
	return fetch("/api/regturnir", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ tournament_id: tournamentId, username }),
	}).then((res) => {
		if (!res.ok)
			throw new Error("Failed to register");
	});
}

function unregisterFromTournament(tournamentId: number, username: string) {
	return fetch("/api/unregister", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ tournament_id: tournamentId, username }),
	}).then((res) => {
		if (!res.ok)
			throw new Error("Failed to unregister");
	});
}

function updateTournamentUI(tournaments: TournamentInfo[], username: string | null) {
	const previewContainer = document.getElementById("tournament-preview");
	const modalListContainer = document.getElementById("tournament-modal-list");

	if (!previewContainer || !modalListContainer)
		return;

	const renderTournamentItem = (tournament: TournamentInfo): string => {
		const isRegistered = tournament.participants.includes(username ?? "");
		const isCreator = tournament.created_by === username;

		const regBtnClass = isRegistered
			? "bg-red-100 text-red-800"
			: "bg-green-100 text-green-800";
		const regBtnText = isRegistered ? "Unregister" : "Register";

		return `
			<div class="px-4 py-5 sm:px-6 hover:bg-gray-50 cursor-pointer">
				<div class="flex flex-col sm:flex-row sm:justify-between">
					<div align="left">
						<p class="font-semibold">${tournament.name}</p>
					</div>
					<div align="right">
						${isCreator ? `
							<button data-id="${tournament.id}" class="start-tournament-btn mt-2 sm:mt-0 px-3 py-1 text-xs font-semibold rounded-full bg-hover text-white">Start</button>
							<button data-id="${tournament.id}" onclick="deleteTournament(${tournament.id}, ${username})" class="start-tournament-btn mt-2 sm:mt-0 px-3 py-1 text-xs font-semibold rounded-full bg-hover text-white">Delete</button>
						` : ""}
						<button data-id="${tournament.id}" class="register-btn mt-2 sm:mt-0 px-3 py-1 text-xs font-semibold rounded-full ${regBtnClass}">
							${regBtnText}
						</button>
					</div>
				</div>
			</div>
		`;
	};

	previewContainer.innerHTML = "";
	tournaments.slice(0, 3).forEach(t => {
		previewContainer.insertAdjacentHTML("beforeend", renderTournamentItem(t));
	});

	modalListContainer.innerHTML = "";
	tournaments.forEach(t => {
		modalListContainer.insertAdjacentHTML("beforeend", renderTournamentItem(t));
	});

	handleTournamentRegistration(username, tournaments);
}

function handleTournamentRegistration(username: string | null, tournaments: TournamentInfo[]) {
	const registerButtons = document.querySelectorAll<HTMLButtonElement>(".register-btn");

	registerButtons.forEach((button) => {
		button.addEventListener("click", async () => {
			clearErrors();
			if (!username) {
				showError("tournament1", "You must be logged in to register.");
				showError("tournament2", "You must be logged in to register.");
				return;
			}

			const tournamentId = Number(button.getAttribute("data-id"));
			const tournament = tournaments.find(t => t.id === tournamentId);
			if (!tournament) {
				showError("tournament1", "Tournament not found.");
				showError("tournament2", "Tournament not found.");
				return;
			}

			const isRegistered = tournament.participants.includes(username);
			const isFull = tournament.participants.length >= tournament.max_players_count;

			if (!isRegistered && isFull) {
				showError("tournament1", "Tournament is full.");
				showError("tournament2", "Tournament is full.");
				return;
			}

			try {
				const response = await fetch("/api/regturnir", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						username,
						tournament_id: tournamentId,
					}),
				});
				// if (response.status === 400)
				// {
				// 	showError("tournament1", response.body.message || "Registration failed.");
				// 	showError("tournament2", response.body.message || "Registration failed.");
				// }
				if (!response.ok) {
					const err = await response.json();
					showError("tournament1", err.message || "Registration failed.");
					showError("tournament2", err.message || "Registration failed.");
					return;
				}

				if (isRegistered) {
					tournament.participants = tournament.participants.filter(p => p !== username);
				} else {
					tournament.participants.push(username);
				}

				initTournaments(username);

			} catch (error) {
				console.error("Registration error:", error);
				showError("tournament1", "Server error during registration.");
				showError("tournament2", "Server error during registration.");
			}
		});
	});
}
