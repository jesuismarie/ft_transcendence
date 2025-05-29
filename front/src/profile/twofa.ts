import type {TwoFAEnableResponse, TwoFAVerifyRequest } from "@/utils/types";
import {ApiConstants} from "@/core/constants/apiConstants.ts";

export async function setup2FA() {
	const enable2faBtn = document.getElementById("enable-2fs-btn") as HTMLButtonElement | null;
	const twofaContainer = document.getElementById("twofa-container") as HTMLElement | null;

	if (!enable2faBtn || !twofaContainer) {
		console.error("Required 2FA elements not found in the DOM");
		return;
	}

	enable2faBtn.addEventListener("click", async () => {
		await initiate2FASetup(twofaContainer);
	});
}

export async function initiate2FASetup(container: HTMLElement) {
	container.innerHTML = "Loading QR code...";

	try {
		const qrCodeData = await requestQRCode();
		displayQRCode(container, qrCodeData);
		setupVerificationHandler(container);
	} catch (err) {
		console.error("Error setting up 2FA:", err);
		container.innerHTML = `<p class="text-red-500">Could not generate QR code. Please try again later.</p>`;
	}
}

export async function requestQRCode(): Promise<TwoFAEnableResponse> {
	const res = await fetch(`${ApiConstants.twoFaEnable}`, {
		method: "GET",
		credentials: "include"
	});

	if (!res.ok) {
		throw new Error("Failed to fetch QR code");
	}

	return await res.json();
}

export function displayQRCode(container: HTMLElement, data: TwoFAEnableResponse) {
	container.innerHTML = `
		<p class="mb-2 text-white">Scan this QR Code in your authenticator app:</p>
		<img src="${data.qrSvg}" alt="2FA QR Code" class="mb-4 w-48 h-48" />
		<input id="twofa-token-input" type="text" placeholder="Enter 6-digit code" 
			class="w-full px-2 py-1 rounded-md text-black mb-2" maxlength="6" pattern="[0-9]*" />
		<button id="verify-2fa-btn" class="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded">
			Verify 2FA
		</button>
	`;
}

export function setupVerificationHandler(container: HTMLElement) {
	const verifyBtn = document.getElementById("verify-2fa-btn");
	const tokenInput = document.getElementById("twofa-token-input") as HTMLInputElement;

	verifyBtn?.addEventListener("click", async () => {
		await verify2FAToken(container, tokenInput);
	});
}

export async function verify2FAToken(container: HTMLElement, tokenInput: HTMLInputElement) {
	const token = tokenInput?.value.trim();

	if (!isValidToken(token)) {
		container.innerHTML = `<p class="text-red-500">Please enter a valid 6-digit code.</p>`;
		return;
	}

	try {
		const verifyRes = await fetch(`${ApiConstants.twoFAVerify}`, {
			method: "POST",
			credentials: "include",
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ otp: token } as TwoFAVerifyRequest),
		});

		const verifyData = await verifyRes.json();

		if (verifyData.verified) {
			showSuccessAndDisableButton(container);
		} else {
			container.innerHTML = `<p class="text-red-500">Invalid verification code. Please try again.</p>`;
		}
	} catch (err) {
		console.error("2FA verification failed:", err);
		container.innerHTML = `<p class="text-red-500">Verification failed. Please try again.</p>`;
	}
}

export function isValidToken(token: string | undefined): boolean {
	return token !== undefined && token.length === 6 && /^\d+$/.test(token);
}

export function showSuccessAndDisableButton(container: HTMLElement) {
	container.innerHTML = `
		<p class="text-green-500">2FA enabled successfully!</p>
		`;
	// <button id="disable-2fa-btn" class="bg-red-600 hover:bg-red-700 text-white py-1 px-4 mt-2 rounded">
	// 	Disable 2FA
	// </button>
	// addDisable2FAHandler();
}

// function addDisable2FAHandler() {
// 	const disableBtn = document.getElementById("disable-2fa-btn") as HTMLButtonElement | null;
// 	if (!disableBtn) return;

// 	disableBtn.addEventListener("click", async () => {
// 		try {
// 			const res = await fetch("/2fa/disable", {
// 				method: "POST",
// 				credentials: "include"
// 			});
// 			const result = await res.json();
			
// 			if (result.success) {
// 				document.getElementById("twofa-container")!.innerHTML = 
// 					`<p class="text-yellow-500">2FA has been disabled.</p>`;
// 			}
// 		} catch (err) {
// 			console.error("Error disabling 2FA:", err);
// 		}
// 	});
// }
