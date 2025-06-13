import {ApiException, GeneralException} from "@/core/exception/exception";
import type {UserEntity} from "@/domain/entity/user_entity";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository";
import {type Either, Left, Right} from "@/core/models/either";
import {inject, injectable} from "tsyringe";
import {type ApiClient} from "@/core/network/apiClient";
import {ApiConstants} from "@/core/constants/apiConstants";
import {AxiosError} from "axios";
import type {ApiError} from "@/utils/types";
import {PreferenceKeys} from "@/core/services/preferenceKeys";
 import {data} from "autoprefixer";


@injectable()
export class RemoteAuthRepositoryImpl implements RemoteAuthRepository {

    constructor(@inject('ApiClient') private readonly apiClient: ApiClient) {}

    async register({email, username, password}: {
        email: string;
        username: string;
        password: string
    }): Promise<Either<GeneralException, UserEntity>> {
        try {
            const res = await this.apiClient.axiosClient().post(ApiConstants.register, {email, username, password});
            if (res.status >= 200 && res.status < 400) {
                const user: UserEntity = {
                    userId: res.data.userId,
                    accessToken: res.data.accessToken,
                    refreshToken: res.data.refreshToken,
                };
                return new Right(user);
            }
            return new Left(new GeneralException());
        }
        catch (e) {
            if (e instanceof AxiosError) {
                const error: ApiError = e.response?.data
                return new Left(new ApiException(500, error.message, error));
            } else {
                return new Left(new ApiException(500, e?.toString()));
            }
        }
    }

    async login({email, password}: {
        email: string,
        password: string
    }): Promise<Either<GeneralException, UserEntity>> {
        try {
            const res = await this.apiClient.axiosClient().post(ApiConstants.login, {email, password});
            if (res.status >= 200 && res.status < 400) {
                const user: UserEntity = {
                    userId: res.data.userId,
                    accessToken: res.data.accessToken,
                    refreshToken: res.data.refreshToken,
                }
                return new Right(user);
            }
            return new Left(new GeneralException());
        }
        catch (e) {
            if (e instanceof AxiosError) {
                const error: ApiError = e.response?.data
                return new Left(new ApiException(500, error.message, error));
            } else {
                return new Left(new ApiException(500, e?.toString()));
            }
        }
    }

    async oauth(ticket: string): Promise<Either<GeneralException, UserEntity>> {
        try {
            const response = await this.apiClient.axiosClient().post(`${ApiConstants.claim}`, {
                loginTicket: ticket
            });

            if (response.status >= 200 && response.status < 400) {
                const user: UserEntity = {
                    userId: response.data.userId,
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                };
                return new Right(user);
            }

            // Handle non-2xx responses
            return new Left(new GeneralException());
        } catch (e: any) {
            try {
                const error: ApiError = await e?.response?.json();
                return new Left(new ApiException(500, error.message, error));
            } catch (parseErr) {
                return new Left(new ApiException(500, e?.toString()));
            }
        }
    }

    async requestRefresh(accessToken: string): Promise<Either<GeneralException, UserEntity>> {
        try {
            const res = await this.apiClient.axiosClient().post(ApiConstants.refresh, {refreshToken: accessToken});
            if (res.status >= 200 && res.status < 400) {
                const user: UserEntity = {
                    userId: res.data.userId,
                    accessToken: res.data.accessToken,
                    refreshToken: res.data.refreshToken,
                }
                return new Right(user);
            }
            return new Left(new GeneralException());
        }
        catch (e) {
            if (e instanceof AxiosError) {
                const error: ApiError = e.response?.data
                return new Left(new ApiException(500, error.message, error));
            } else {
                return new Left(new ApiException(500, e?.toString()));
            }
        }
    }
}