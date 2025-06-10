import type {ApiError, SearchUserResponse, UserView} from "@/utils/types";
import type {UserRemoteRepository} from "@/domain/respository/userRemoteRepository";
import {type Either, Left, Right} from "@/core/models/either";
import {ApiException, GeneralException} from "@/core/exception/exception";
import {inject, injectable} from "tsyringe";
import {type ApiClient} from "@/core/network/apiClient";
import {ApiConstants} from "@/core/constants/apiConstants";
import {AxiosError} from "axios";
import type {SearchEntity} from "@/domain/entity/searchEntity";

@injectable()
export class UserRemoteRepositoryImpl implements UserRemoteRepository {

    constructor(@inject('ApiClient') private apiClient: ApiClient) {
    }

    async getProfile(id: string): Promise<Either<GeneralException, UserView>> {
        const res = await this.apiClient.axiosClient().get(`${ApiConstants.users}/${id}`);
        try {
            if (res.status >= 200 && res.status < 400) {
                const user: UserView = {
                    id: res.data.id,
                    username: res.data.username,
                    email: res.data.email,
                    wins: res.data.wins,
                    losses: res.data.losses,
                    avatar: res.data.avatar,
                }

                return new Right(user);
            } else {
                return new Left(new GeneralException())
            }
        } catch (e) {
            if (e instanceof AxiosError) {
                const error: ApiError = e.response?.data
                return new Left(new ApiException(500, error.message, error));
            } else {
                return new Left(new ApiException(500, e?.toString()));
            }
        }
    }

    async searchUser(query: string, offset: number, limit: number): Promise<Either<GeneralException, SearchEntity>> {
        const res = await this.apiClient.axiosClient().get(`${ApiConstants.users}?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);
        try {
            if (res.status >= 200 && res.status < 400) {
                const user: SearchEntity = {
                    totalCount: res.data.totalCount,
                    users: res.data.users
                }
                return new Right(user);
            } else {
                return new Left(new GeneralException())
            }
        } catch (e) {
            if (e instanceof AxiosError) {
                const error: ApiError = e.response?.data
                return new Left(new ApiException(500, error.message, error));
            } else {
                return new Left(new ApiException(500, e?.toString()));
            }
        }
    }

    async updateAvatar(id: number, data: FormData): Promise<Either<GeneralException, void>> {
        try {
            const response = await this.apiClient.putForm(`${ApiConstants.users}/${id}${ApiConstants.avatar}`,
                data,
            );
            if (response.status >= 200 && response.status < 400) {
                return new Right(undefined);
            } else {
                return new Left(new GeneralException());
            }
        } catch (e) {
            if (e instanceof AxiosError) {
                const error: ApiError = e.response?.data
                return new Left(new ApiException(500, error.message, error));
            } else {
                return new Left(new ApiException(500, e?.toString()));
            }
        }
    }


    async updateProfile(id: number, username: string, email: string): Promise<Either<GeneralException, void>> {
        try {
            const response = await this.apiClient.axiosClient().put(`${ApiConstants.users}/${id}`, {
                data: {username: username, email: email}
            });

            if (response.status >= 200 && response.status < 400) {
                return new Right(undefined);
            } else {
                return new Left(new GeneralException());
            }
        } catch (e) {
            if (e instanceof AxiosError) {
                const error: ApiError = e.response?.data
                return new Left(new ApiException(500, error.message, error));
            } else {
                return new Left(new ApiException(500, e?.toString()));
            }
        }
    }

    async updatePassword(id: number, oldPassword: string, newPassword: string): Promise<Either<GeneralException, void>> {
        try {
            const data = {currentPwd: oldPassword, newPwd: newPassword};
            const response = await this.apiClient.put(`${ApiConstants.users}/${id}${ApiConstants.updatePassword}`,
                JSON.stringify(data),
            );

            if (response.status >= 200 && response.status < 400) {
                return new Right(undefined);
            } else {
                return new Left(new GeneralException());
            }
        } catch (e) {
            alert(e)
            if (e instanceof AxiosError) {
                const error: ApiError = e.response?.data
                return new Left(new ApiException(500, error.message, error));
            } else {
                return new Left(new ApiException(500, e?.toString()));
            }
        }
    }
}