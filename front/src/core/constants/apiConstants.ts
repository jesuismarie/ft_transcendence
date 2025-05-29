export abstract class ApiConstants {
    // static baseUrl: string = import.meta.env.VITE_API_URL;
    static baseUrlDev: string = "http://localhost:5003";
    static authBaseUrl = "/auth-service"
    static auth: string = `${ApiConstants.authBaseUrl}/auth/oauth/google`;
    static register: string = `${ApiConstants.authBaseUrl}/auth/register`;
}