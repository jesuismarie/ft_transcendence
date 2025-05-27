function getEditProfileElements(): EditProfileElements | null {
	const usernameInput = document.getElementById("edit-username") as HTMLInputElement | null;
	const emailInput = document.getElementById("edit-email") as HTMLInputElement | null;
	const oldPasswordInput = document.getElementById("edit-old-password") as HTMLInputElement | null;
	const passwordInput = document.getElementById("edit-password") as HTMLInputElement | null;
	const confirmPasswordInput = document.getElementById("edit-confirm-password") as HTMLInputElement | null;

	if (!usernameInput || !emailInput || !oldPasswordInput || !passwordInput || !confirmPasswordInput)
		return null;

	return {
		usernameInput,
		emailInput,
		oldPasswordInput,
		passwordInput,
		confirmPasswordInput
	};
}

function getEditProfileModalInfo(): ModalInfo | null {
	const openModalBtn = document.getElementById("edit-profile-btn") as HTMLButtonElement | null;
	const closeModalBtn = document.getElementById("close-edit-modal") as HTMLButtonElement | null;
	const saveBtn = document.getElementById("save-profile-btn") as HTMLButtonElement | null;

	if (!openModalBtn || !closeModalBtn || !saveBtn)
		return null;

	return {
		openModalBtn,
		closeModalBtn,
		saveBtn
	};
}

function clearFormInputs(elements: EditProfileElements, currentUser: User) {
	elements.usernameInput.value = currentUser.username;
	elements.emailInput.value = currentUser.email;
	elements.oldPasswordInput.value = "";
	elements.passwordInput.value = "";
	elements.confirmPasswordInput.value = "";
	clearErrors();
}

function validateForm(elements: EditProfileElements, currentUser: User): boolean {
	const updatedUsername = elements.usernameInput.value.trim();
	const updatedEmail = elements.emailInput.value.trim();
	const oldPassword = elements.oldPasswordInput.value;
	const updatedPassword = elements.passwordInput.value;
	const confirmPassword = elements.confirmPasswordInput.value;

	let hasError = false;

	if (!updatedUsername) {
		showError("edit_username", "Username is required.");
		hasError = true;
	} else if (!isValidUsername(updatedUsername)) {
		showError("edit_username", "Invalid username.");
		hasError = true;
	}

	if (!updatedEmail) {
		showError("edit_email", "Email is required.");
		hasError = true;
	} else if (!isValidEmail(updatedEmail)) {
		showError("edit_email", "Invalid email.");
		hasError = true;
	}

	if (oldPassword && !updatedPassword) {
		showError("new_password", "New password is required.");
		hasError = true;
	} else if (!oldPassword && updatedPassword) {
		showError("old_password", "Old password is required.");
		hasError = true;
	} else if (oldPassword && oldPassword === updatedPassword) {
		showError("new_password", "New password can't be the same as old password.");
		hasError = true;
	} else if (updatedPassword || confirmPassword) {
		if (!isValidPassword(updatedPassword)) {
			showError("new_password", "Password must be at least 8 characters, include a capital letter and a symbol.");
			hasError = true;
		}
		if (updatedPassword !== confirmPassword) {
			showError("confirm_password", "Passwords do not match.");
			hasError = true;
		}
	}
	return !hasError;
}

async function updateProfile(elements: EditProfileElements, currentUser: User) {
	const updatedUsername = elements.usernameInput.value.trim();
	const updatedEmail = elements.emailInput.value.trim();
	const oldPassword = elements.oldPasswordInput.value;
	const updatedPassword = elements.passwordInput.value;

	try {
		if (updatedUsername !== currentUser.username || updatedEmail !== currentUser.email) {
			const patchRequest: PatchUserRequest = {};
			if (updatedUsername !== currentUser.username)
				patchRequest.displayName = updatedUsername;
			if (updatedEmail !== currentUser.email)
				patchRequest.email = updatedEmail;

			const response = await fetch("/api/profile/update", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(patchRequest),
				credentials: "include"
			});

			if (!response.ok) {
				const result = await response.json();
				if (result?.field && result?.message) {
					showError(result.field, result.message);
				} else {
					showError("edit_username", "An error occurred updating profile.");
				}
				return false;
			}
		}

		if (oldPassword && updatedPassword) {
			const passwordRequest: ChangePasswordRequest = {
				currentPwd: oldPassword,
				newPwd: updatedPassword
			};

			const response = await fetch("/api/profile/password", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(passwordRequest),
				credentials: "include"
			});

			if (!response.ok) {
				const result = await response.json();
				if (result?.field && result?.message) {
					showError(result.field, result.message);
				} else {
					showError("old_password", "Failed to update password.");
				}
				return false;
			}
		}

		currentUser.username = updatedUsername;
		currentUser.email = updatedEmail;
		return true;
	} catch (err) {
		console.error("Update failed:", err);
		showError("edit_username", "Failed to connect to server.");
		return false;
	}
}

function editProfile(currentUser: User) {
	const modalInfo = getEditProfileModalInfo();
	const elements = getEditProfileElements();

	if (!modalInfo || !elements)
		return;

	addModalEvents(modalInfo, "edit-profile-modal");
	clearFormInputs(elements, currentUser);
	if (modalInfo.saveBtn) {
		modalInfo.saveBtn.addEventListener("click", async () => {
			clearErrors();

			if (!validateForm(elements, currentUser))
				return;

			const success = await updateProfile(elements, currentUser);
			if (success)
				hideModal("edit-profile-modal");
		});
	}
}
