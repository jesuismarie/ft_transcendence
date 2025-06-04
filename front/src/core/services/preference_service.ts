export interface PreferenceService {
    getToken(): string | null;
    setToken(token: string): void;
}