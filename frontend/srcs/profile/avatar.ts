const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getAvatarElements(): AvatarElements | null {
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

function validateImageFile(file: File): string | null {
	if (file.size > MAX_FILE_SIZE)
		return "Image file size must be less than 5MB.";
	return null;
}

function readImageFile(file: File): Promise<string | null> {
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

async function uploadAvatar(file: File): Promise<boolean> {
	try {
		const formData = new FormData();
		formData.append("avatar", file);

		const response = await fetch("/api/upload-avatar", {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			showError("avatar", "Failed to upload avatar");
			return false;
		}

		const data = await response.json();
		console.log("Avatar uploaded:", data);
		return true;
	} catch (err) {
		showError("avatar", "Failed to connect to server");
		console.error("Avatar upload error:", err);
		return false;
	}
}

async function handleAvatarChange(elements: AvatarElements, file: File) {
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
	await uploadAvatar(file);
}

function initAvatarUpload(id: number) {
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

		await handleAvatarChange(elements, elements.fileInput.files[0]);
	});
}
