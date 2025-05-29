
export function getCurrentUserId(): number {
    return Number(localStorage.getItem("currentUserId"));
}

export function getCurrentUser(): string | null {
    return localStorage.getItem("currentUser");
}

export const currentUserId = getCurrentUserId();
export const currentUser = getCurrentUser();