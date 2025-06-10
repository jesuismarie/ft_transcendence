import {ApiConstants} from "@/core/constants/apiConstants";
import {type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig} from "axios";
import axios from "axios";
import {inject, injectable} from "tsyringe";
import type {PreferenceService} from "@/core/services/preference_service";

@injectable()
export class ApiClient {
    private _axiosClient?: AxiosInstance;

    constructor(@inject("PreferenceService") private preferenceService: PreferenceService) {}

    public axiosClient(): AxiosInstance {
        const token: string = this.preferenceService.getToken() ?? ''

        this._axiosClient = axios.create({
            baseURL: ApiConstants.baseUrlDev,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        this._initializeRequestInterceptor();
        this._initializeResponseInterceptor();
        return this._axiosClient;
    }

    public get(url: string) {
        const token: string = this.preferenceService.getToken() ?? ''
        return fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,

            }
        })
    }


    public putForm(url: string, data: FormData) {
        const token: string = this.preferenceService.getToken() ?? ''
        return fetch(`${ApiConstants.baseUrlDev}${url}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            body: data,
        })
    }

    public put(url: string, data: string) {
        const token: string = this.preferenceService.getToken() ?? ''
        return fetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: data,
        })
    }

    private _initializeRequestInterceptor() {
        this._axiosClient?.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                console.log('[Request]', config);
                return config;
            },
            (error) => {
                console.error('[Request Error]', error);
                return Promise.reject(error);
            }
        );
        this._axiosClient?.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            const base = config.baseURL ?? '';
            const path = config.url ?? '';
            const fullUrl = base.endsWith('/') || path.startsWith('/') ? base + path : `${base}/${path}`;

            console.log(`[REQUEST] ${config.method?.toUpperCase()} ${fullUrl}`);
            return config;
        });
    }

    private _initializeResponseInterceptor() {
        this._axiosClient?.interceptors.response.use(
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
