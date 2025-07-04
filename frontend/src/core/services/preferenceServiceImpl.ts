import type {PreferenceService} from "@/core/services/preference_service";
import {PreferenceKeys} from "@/core/services/preferenceKeys";
import {injectable} from "tsyringe";

@injectable()
export class PreferenceServiceImpl implements PreferenceService {
    getToken(): string | null {
        return localStorage.getItem(PreferenceKeys.token);
    }

    setToken(token: string): void {
        document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; secure; samesite=strict`;
        localStorage.setItem(PreferenceKeys.token, token);
    }

    setRefreshToken(token: string): void {
        document.cookie = `refresh_token=${encodeURIComponent(token)}; path=/; secure; samesite=strict`;
        localStorage.setItem(PreferenceKeys.refreshToken, token);
    }

    getRefreshToken(): string | null {
        return localStorage.getItem(PreferenceKeys.refreshToken);
    }

    unsetRefreshToken(): void {
        localStorage.removeItem(PreferenceKeys.refreshToken);
    }

    unsetToken(): void {
        localStorage.removeItem(PreferenceKeys.token);
    }

}