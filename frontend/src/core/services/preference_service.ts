export interface PreferenceService {
    getToken(): string | null;
    setToken(token: string): void;
    getRefreshToken(): string | null;
    setRefreshToken(token: string): void;
    unsetToken(): void;
    unsetRefreshToken(): void;
}