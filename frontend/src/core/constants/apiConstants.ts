export abstract class ApiConstants {
    static baseUrlDev: string = import.meta.env.VITE_BASE_URL_DEV;
    static baseUrlLocalDev: string = import.meta.env.VITE_BASE_URL_LOCAL_DEV;
    static gameWebsocketBaseUrl: string = import.meta.env.VITE_WS_GAME_URL;
    static websocketUrl = import.meta.env.VITE_WS_ONLINE_URL;
    static authBaseUrl = `/auth-service`
    static userBaseUrl = `/user-service`
    static gameBaseUrl = `/game-service`
    static pongBaseUrl = `/pong-service`
    // API endpoints
    // Auth endpoints
    static login: string = `${ApiConstants.authBaseUrl}/auth/login`;
    static claim: string = `${ApiConstants.authBaseUrl}/auth/login/claim`;
    static twoFA: string = `${ApiConstants.authBaseUrl}/auth/login/2fa`;
    static twoFAEnable: string = `${ApiConstants.authBaseUrl}/auth/2fa/enable`;
    static twoFAVerify: string = `${ApiConstants.authBaseUrl}/auth/2fa/verify`;
    static logout: string = `${ApiConstants.authBaseUrl}/logout`;
    static refresh: string = `${ApiConstants.authBaseUrl}/auth/refresh`;
    static loginTwoFa: string = `${ApiConstants.authBaseUrl}/auth/login/2fa`
    // OAuth endpoint
    static auth: string = `${ApiConstants.baseUrlLocalDev}${ApiConstants.authBaseUrl}/auth/oauth/google`;
    // User endpoints
    static getUserNames: string = `${ApiConstants.userBaseUrl}/users/usernames`;
    static activeMatch: string = `${ApiConstants.gameBaseUrl}/get-tournament-active-match`;
    static register: string = `${ApiConstants.authBaseUrl}/auth/register`;
    static friends: string = `${ApiConstants.userBaseUrl}/friends`;
    static username: string = `${ApiConstants.userBaseUrl}/users/username/`;
    static users: string = `${ApiConstants.userBaseUrl}/users`;
    static online: string = `${ApiConstants.userBaseUrl}/presence`;
    static updatePassword: string = `/password`;
    static avatar: string = `/avatar`;
    // Game endpoints
    static createMatch: string = `${ApiConstants.pongBaseUrl}/create-match`;
    static relationships: string = `/relationship`;
    static createTournament: string = `${ApiConstants.gameBaseUrl}/create-tournament`;
    static getTournament: string = `${ApiConstants.gameBaseUrl}/get-tournament-participants`;
    static getTournamentInfo: string = `${ApiConstants.gameBaseUrl}/get-tournaments-info`;
    static startTournament: string = `${ApiConstants.gameBaseUrl}/start-tournament`;
    static deleteTournament: string = `${ApiConstants.gameBaseUrl}/delete-tournament`;
    static registerToTournament: string = `${ApiConstants.gameBaseUrl}/register-to-tournament`;
    static tournamentNextStep: string = `${ApiConstants.gameBaseUrl}/tournament-next-step`;
    static unregisterFromTournament: string = `${ApiConstants.gameBaseUrl}/unregister-from-tournament`;
    static matchHistoryByUser: string = `${ApiConstants.gameBaseUrl}/get-match-history-by-user`;
    static saveMatchResults: string = `${ApiConstants.gameBaseUrl}/save-match-result`;
}