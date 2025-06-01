import {clearErrors, showError } from "@/utils/error_messages";
import type {ApiError, AvatarElements } from "@/utils/types";
import { isValidAvatar } from "@/utils/validation";
import {currentUserId} from "@/utils/user";
import {ApiConstants} from "@/core/constants/apiConstants.ts";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function getAvatarElements(): AvatarElements | null {
	const uploadBtn = document.getElementById("avatar-upload-btn") as HTMLButtonElement | null;
	const fileInput = document.getElementById("avatar-input") as HTMLInputElement | null;
	const avatarImage = document.getElementById("avatar-image") as HTMLImageElement | null;

	if (!uploadBtn || !fileInput || !avatarImage)
		return null;

	return {
		uploadBtn,
		fileInput,
		avatarImage
	};
}

export function validateImageFile(file: File): string | null {
	if (file.size > MAX_FILE_SIZE)
		return "Image file size must be less than 5MB.";
	return null;
}

export function readImageFile(file: File): Promise<string | null> {
	return new Promise((resolve) => {
		const reader = new FileReader();
		
		reader.onload = () => {
			const result = reader.result as string;
			if (!isValidAvatar(result)) {
				showError("avatar", "Please select a valid image file (JPEG, PNG, GIF, or WebP).");
				resolve(null);
				return;
			}
			resolve(result);
		};

		reader.onerror = () => {
			showError("avatar", "Failed to read image file.");
			resolve(null);
		};

		reader.readAsDataURL(file);
	});
}

export async function uploadAvatar(id: number, file: File): Promise<boolean> {
	try {
		const formData = new FormData();
		formData.append("avatar", file);

		const response = await fetch(`${ApiConstants.users}/:${id}${ApiConstants.avatar}`, {
			method: "POST",
			body: formData,
			credentials: "include"
		});

		if (!response.ok) {
			const result: ApiError = await response.json();
			showError("old_password", result.message);
			return false;
		}

		// const data = await response.json();
		// console.log("Avatar uploaded:", data);
		return true;
	} catch (err) {
		showError("avatar", "Failed to connect to server");
		return false;
	}
}

export async function handleAvatarChange(id: number, elements: AvatarElements, file: File) {
	clearErrors();
	
	const validationError = validateImageFile(file);
	if (validationError) {
		showError("avatar", validationError);
		return;
	}

	const imageDataUrl = await readImageFile(file);
	if (!imageDataUrl)
		return;

	elements.avatarImage.src = imageDataUrl;
	await uploadAvatar(id, file);
}

export function initAvatarUpload(id: number) {
	clearErrors();

	const elements = getAvatarElements();
	if (!elements)
		return;

	if (id !== currentUserId) {
		elements.uploadBtn.remove();
		elements.fileInput.remove();
		return;
	}

	elements.uploadBtn.addEventListener("click", () => {
		elements.fileInput.click();
	});

	elements.fileInput.addEventListener("change", async () => {
		if (!elements.fileInput.files || elements.fileInput.files.length === 0)
			return;

		await handleAvatarChange(id, elements, elements.fileInput.files[0]);
	});
}
