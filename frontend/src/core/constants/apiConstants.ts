export abstract class ApiConstants {
    // static baseUrl: string = import.meta.env.VITE_API_URL;
    static baseUrlDev: string = "http://localhost:5003";
    static websocketUrl = "ws://localhost:5002/users/ws";
    static authBaseUrl = `/auth-service`
    static userBaseUrl = `/user-service`
    static gameBaseUrl = `/game-service`
    static auth: string = `${ApiConstants.authBaseUrl}/auth/oauth/google`;
    static register: string = `${ApiConstants.authBaseUrl}/auth/register`;
    static friends: string = `${ApiConstants.userBaseUrl}/friends`;
    static username: string = `${ApiConstants.userBaseUrl}/users/username/`;
    static users: string = `${ApiConstants.userBaseUrl}/users`;
    static updatePassword: string = `/password`;
    static avatar: string = `/avatar`;
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
    static login: string = `${ApiConstants.authBaseUrl}/auth/login`;
    static twoFA:string = `${ApiConstants.authBaseUrl}/login/2fa`;
    static refresh: string = `${ApiConstants.authBaseUrl}/auth/refresh`;
    static logout: string = `${ApiConstants.authBaseUrl}/logout`;
    static twoFAEnable: string = `${ApiConstants.authBaseUrl}/auth/2fa/enable`;
    static twoFAVerify: string = `${ApiConstants.authBaseUrl}/auth/2fa/verify`;


}