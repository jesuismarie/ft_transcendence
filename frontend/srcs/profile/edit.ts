function editProfile(currentUser: { username: string; email: string }) {
	const editProfileBtn = document.getElementById("edit-profile-btn") as HTMLButtonElement | null;
	const closeEditModalBtn = document.getElementById("close-edit-modal") as HTMLButtonElement | null;
	const saveProfileBtn = document.getElementById("save-profile-btn") as HTMLButtonElement | null;

	const usernameInput = document.getElementById("edit-username") as HTMLInputElement | null;
	const emailInput = document.getElementById("edit-email") as HTMLInputElement | null;
	const passwordInput = document.getElementById("edit-password") as HTMLInputElement | null;
	const confirmPasswordInput = document.getElementById("edit-confirm-password") as HTMLInputElement | null;

	if (!editProfileBtn || !closeEditModalBtn || !saveProfileBtn || !usernameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	editProfileBtn.addEventListener("click", () => {
		usernameInput.value = currentUser.username;
		emailInput.value = currentUser.email;
		passwordInput.value = "";
		confirmPasswordInput.value = "";
		clearErrors();
		showModal("edit-profile-modal");
	});

	closeEditModalBtn.addEventListener("click", () => {
		hideModal("edit-profile-modal");
	});

	saveProfileBtn.addEventListener("click", async () => {
		clearErrors();

		const updatedUsername = usernameInput.value.trim();
		const updatedEmail = emailInput.value.trim();
		const updatedPassword = passwordInput.value;
		const confirmPassword = confirmPasswordInput.value;

		let hasError = false;

		if (!updatedUsername) {
			showError("username", "Username is required.");
			hasError = true;
		} else if (!isValidUsername(updatedUsername)) {
			showError("username", "Invalid username.");
			hasError = true;
		}

		if (!updatedEmail) {
			showError("email", "Email is required.");
			hasError = true;
		} else if (!isValidEmail(updatedEmail)) {
			showError("email", "Invalid email.");
			hasError = true;
		}

		if (updatedPassword || confirmPassword) {
			if (!isValidPassword(updatedPassword)) {
				showError("password", "Password must be at least 8 characters, include a capital letter and a symbol.");
				hasError = true;
			}
			if (updatedPassword !== confirmPassword) {
				showError("confirm_password", "Passwords do not match.");
				hasError = true;
			}
		}

		if (
			updatedUsername === currentUser.username &&
			updatedEmail === currentUser.email &&
			!updatedPassword
		) {
			showError("username", "No changes detected.");
			hasError = true;
		}

		if (hasError)
			return;

		try {
			const body: Record<string, string> = {};
			if (updatedUsername !== currentUser.username) body.username = updatedUsername;
			if (updatedEmail !== currentUser.email) body.email = updatedEmail;
			if (updatedPassword) body.password = updatedPassword;

			const response = await fetch("/api/profile/update", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			const result = await response.json();

			if (!response.ok) {
				if (result?.field && result?.message) {
					showError(result.field, result.message);
				} else {
					showError("username", "An error occurred.");
				}
				return;
			}

			currentUser.username = updatedUsername;
			currentUser.email = updatedEmail;
			hideModal("edit-profile-modal");
		} catch (err) {
			console.error("Update failed:", err);
			showError("username", "Failed to connect to server.");
		}
	});
}
