import type {ModalInfo} from "./types";

export function showModal(modalId: string) {
	const modal = document.getElementById(modalId) as HTMLElement | null;
	if (modal) {
		modal.classList.remove("hidden");
	}
}

export function hideModal(modalId: string) {
	const modal = document.getElementById(modalId) as HTMLElement | null;
	if (modal) {
		modal.classList.add("hidden");
	}
}

export function addModalEvents(modalInfo: ModalInfo, modalName: string) {
	modalInfo.openModalBtn.addEventListener("click", () => {
		showModal(modalName);
	});
	modalInfo.closeModalBtn.addEventListener("click", () => {
		hideModal(modalName);
	});
}
