import {ApiConstants} from "@/core/constants/apiConstants";
import {type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig} from "axios";
import axios from "axios";

export class ApiClient {
    public axiosClient: AxiosInstance;

    constructor() {
        this.axiosClient = axios.create({
            baseURL: ApiConstants.baseUrlDev,
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer `,
            },
        });

        this._initializeRequestInterceptor();
        this._initializeResponseInterceptor();
    }

    private _initializeRequestInterceptor() {
        this.axiosClient.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                console.log('[Request]', config);
                return config;
            },
            (error) => {
                console.error('[Request Error]', error);
                return Promise.reject(error);
            }
        );
        this.axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            const base = config.baseURL ?? '';
            const path = config.url ?? '';
            const fullUrl = base.endsWith('/') || path.startsWith('/') ? base + path : `${base}/${path}`;

            console.log(`[REQUEST] ${config.method?.toUpperCase()} ${fullUrl}`);
            return config;
        });
    }

    private _initializeResponseInterceptor() {
        this.axiosClient.interceptors.response.use(
            (response: AxiosResponse) => {
                console.log('[Response]', response);
                return response;
            },
            (error) => {
                console.error('[Response Error]', error.response || error.message);
                return Promise.reject(error);
            }
        );
    }
}
