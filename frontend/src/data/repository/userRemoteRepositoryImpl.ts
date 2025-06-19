import type {ApiError, SearchUserResponse, UserView} from "@/utils/types";
import type {UserRemoteRepository} from "@/domain/respository/userRemoteRepository";
import {type Either, Left, Right} from "@/core/models/either";
import {ApiException, GeneralException} from "@/core/exception/exception";
import {inject, injectable} from "tsyringe";
import {type ApiClient} from "@/core/network/apiClient";
import {ApiConstants} from "@/core/constants/apiConstants";
import {AxiosError} from "axios";
import type {SearchEntity} from "@/domain/entity/searchEntity";
import {type OnlineEntity} from "@/domain/entity/onlineStatus";
import {type User} from "@/domain/entity/user";

@injectable()
export class UserRemoteRepositoryImpl implements UserRemoteRepository {

    constructor(@inject('ApiClient') private apiClient: ApiClient) {
    }

    async getProfile(id: string): Promise<Either<GeneralException, User>> {
        try {
            const res = await this.apiClient.axiosClient().get(`${ApiConstants.users}/${id}`);
            if (res.status >= 200 && res.status < 400) {
                const user: User = {
                    online: res.data.online,
                    id: res.data.id,
                    is2FaEnabled: res.data.twofaEnabled,
                    username: res.data.username,
                    email: res.data.email,
                    wins: res.data.wins,
                    losses: res.data.losses,
                    avatar: res.data.avatarPath,
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
        try {
            const res = await this.apiClient.axiosClient().get(`${ApiConstants.users}?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`);

            if (res.status >= 200 && res.status < 400) {
                const user: SearchEntity = {
                    totalCount: res.data.total,
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
            // Construct the request body
            let requestBody = {};
            if (username) {
                requestBody = {...requestBody, username: username};
            }
            if (email) {
                requestBody = {...requestBody, email: email};
            }
            const response = await this.apiClient.axiosClient().put(`${ApiConstants.users}/${id}`, requestBody);

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
            const response = await this.apiClient.axiosClient().put(`${ApiConstants.users}/${id}${ApiConstants.updatePassword}`,
                {currentPwd: oldPassword, newPwd: newPassword}
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

    async getOnlineStatuses(users: number[]): Promise<Either<GeneralException, OnlineEntity>> {
        try {
            const response = await this.apiClient.axiosClient().post(`${ApiConstants.online}`, {users: users});

            if (response.status >= 200 && response.status < 400) {
                const online: OnlineEntity = Object.values(response.data)
                return new Right(online);
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


    async getUserNames(userIds: number[]): Promise<Either<GeneralException, string[]>> {
        try {
            const response = await this.apiClient.axiosClient().post(`${ApiConstants.getUserNames}`, {userIds: userIds});

            if (response.status >= 200 && response.status < 400) {
                const userNames: string[] = Object.values(response.data)
                console.log("UUUUUUUUUUUUUUUUUUUUUUUUUUUUUU");
                return new Right(userNames);
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

}