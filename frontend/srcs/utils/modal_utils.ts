function showModal(modalId: string) {
	const modal = document.getElementById(modalId) as HTMLElement | null;
	if (modal) {
		modal.classList.remove("hidden");
	}
}

function hideModal(modalId: string) {
	const modal = document.getElementById(modalId) as HTMLElement | null;
	if (modal) {
		modal.classList.add("hidden");
	}
}

function addModalEvents(modalInfo: ModalInfo, modalName: string) {
	modalInfo.openModalBtn.addEventListener("click", () => {
		showModal(modalName);
	});
	modalInfo.closeModalBtn.addEventListener("click", () => {
		hideModal(modalName);
	});
}
