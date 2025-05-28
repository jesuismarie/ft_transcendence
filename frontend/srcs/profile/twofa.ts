async function setup2FA() {
	const enable2faBtn = document.getElementById("enable-2fs-btn") as HTMLButtonElement | null;
	const twofaContainer = document.getElementById("twofa-container") as HTMLElement | null;

	if (!enable2faBtn || !twofaContainer) {
		console.error("One or more required elements are missing in the DOM.");
		return;
	}

	const jwt = localStorage.getItem("jwt");
	if (!jwt) {
		console.error("You must be logged in.");
		return;
	}

	enable2faBtn.addEventListener("click", async () => {
		twofaContainer.innerHTML = "Loading QR code...";

		try {
			const res = await fetch("/2fa/setup", {
				method: "GET",
				headers: {
					"Authorization": `Bearer ${jwt}`,
				},
			});
			if (!res.ok)
				throw new Error("Failed to fetch QR code");
			const data = await res.json();

			twofaContainer.innerHTML = `
				<p class="mb-2 text-white">Scan this QR Code in your authenticator app:</p>
				<img src="${data.qrCodeDataURL}" alt="2FA QR Code" class="mb-4 w-48 h-48" />
				<input id="twofa-token-input" type="text" placeholder="Enter 6-digit code" class="w-full px-2 py-1 rounded-md text-black mb-2" />
				<button id="verify-2fa-btn" class="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded">Verify 2FA</button>
			`;

			document.getElementById("verify-2fa-btn")?.addEventListener("click", async () => {
				const tokenInput = document.getElementById("twofa-token-input") as HTMLInputElement;
				const token = tokenInput?.value.trim();

				if (!token || token.length !== 6) {
					alert("Please enter a valid 6-digit code.");
					return;
				}

				const verifyRes = await fetch("/2fa/verify", {
					method: "POST",
					headers: {
						"Authorization": `Bearer ${jwt}`,
					},
					body: JSON.stringify({ token }),
				});

				const verifyData = await verifyRes.json();

				if (verifyData.success) {
					twofaContainer.innerHTML = `<p class="text-green-500">2FA enabled.</p>
						<button id="disable-2fa-btn" class="bg-red-600 hover:bg-red-700 text-white py-1 px-4 mt-2 rounded">Disable 2FA</button>`;
					addDisable2FAHandler();
				} else {
					twofaContainer.innerHTML = `<p class="text-red-500">Verification failed. Try again.</p>`;
				}
			});
		} catch (err) {
			console.error("Error setting up 2FA:", err);
			twofaContainer.innerHTML = `<p class="text-red-500">Could not generate QR code.</p>`;
		}
	});
}

function addDisable2FAHandler() {
	const disableBtn = document.getElementById("disable-2fa-btn") as HTMLButtonElement | null;
	if (!disableBtn) return;

	disableBtn.addEventListener("click", async () => {
		const jwt = localStorage.getItem("jwt");
		if (!jwt) {
			alert("You must be logged in.");
			return;
		}

		try {
			const res = await fetch("/2fa/disable", {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${jwt}`,
				},
			});
			const result = await res.json();
			if (result.success) {
				document.getElementById("twofa-container")!.innerHTML = `<p class="text-yellow-500">2FA has been disabled.</p>`;
			} else {
				alert("Failed to disable 2FA.");
			}
		} catch (err) {
			console.error("Error disabling 2FA:", err);
			alert("Something went wrong.");
		}
	});
}
