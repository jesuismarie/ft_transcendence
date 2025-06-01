import { clearErrors, showError } from "@/utils/error_messages";
import { addModalEvents, hideModal } from "@/utils/modal_utils";
import type {ApiError, ChangePasswordRequest, EditProfileElements, ModalInfo, UpdateUserRequest, UserView } from "@/utils/types";
import {isValidEmail, isValidPassword, isValidUsername } from "@/utils/validation";
import {ApiConstants} from "@/core/constants/apiConstants";

export function getEditProfileElements(): EditProfileElements | null {
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

export function getEditProfileModalInfo(): ModalInfo | null {
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

export function clearFormInputs(elements: EditProfileElements, currentUser: UserView) {
	elements.usernameInput.value = currentUser.username;
	elements.emailInput.value = currentUser.email;
	elements.oldPasswordInput.value = "";
	elements.passwordInput.value = "";
	elements.confirmPasswordInput.value = "";
	clearErrors();
}

export function validateForm(elements: EditProfileElements, currentUser: UserView): boolean {
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

export async function updateProfile(elements: EditProfileElements, currentUser: UserView) {
	const updatedUsername = elements.usernameInput.value.trim();
	const updatedEmail = elements.emailInput.value.trim();
	const oldPassword = elements.oldPasswordInput.value;
	const updatedPassword = elements.passwordInput.value;

	try {
		if (updatedUsername !== currentUser.username || updatedEmail !== currentUser.email) {
			const updateUser: UpdateUserRequest = {};
			if (updatedUsername !== currentUser.username)
				updateUser.displayName = updatedUsername;
			if (updatedEmail !== currentUser.email)
				updateUser.email = updatedEmail;

			const response = await fetch(`${ApiConstants.users}/:${currentUser.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(updateUser),
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

			const response = await fetch(`${ApiConstants.users}/:${currentUser.id}${ApiConstants.updatePassword}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(passwordRequest),
				credentials: "include"
			});

			if (!response.ok) {
				const result: ApiError = await response.json();
				showError("old_password", result.message);
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

export function editProfile(currentUser: UserView) {
	console.log("edit_profile", currentUser);
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
