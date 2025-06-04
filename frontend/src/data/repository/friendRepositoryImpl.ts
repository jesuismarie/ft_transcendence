import type {FriendRepository} from "@/domain/respository/friendRepository";
import {type Either, Left, Right} from "@/core/models/either";
import {ApiException, GeneralException} from "@/core/exception/exception";
import type {FriendEntity} from "@/domain/entity/friendEntity";
import {ApiConstants} from "@/core/constants/apiConstants";
import {AxiosError} from "axios";
import type {ApiError} from "@/utils/types";
import {inject, injectable} from "tsyringe";
import  {type ApiClient} from "@/core/network/apiClient";
import type {FriendAddResponse} from "@/domain/entity/friendAddResponse";
import type {FriendStatusEntity} from "@/domain/entity/friendStatusEntity";

@injectable()
export class FriendRepositoryImpl implements FriendRepository {
    constructor(@inject('ApiClient') private readonly apiClient: ApiClient) {
    }

    async getFriendList(id: number, offset: number, limit: number): Promise<Either<GeneralException, FriendEntity>> {
        try {
            const res = await this.apiClient.axiosClient().get(`${ApiConstants.friends}/${id}&limit=${limit}&offset=${offset}&limit=${limit}`);
            if (res.status >= 200 && res.status < 400) {
                const user: FriendEntity = {
                    totalCount: res.data.userId,
                    friends: res.data.friends
                }
                return new Right(user);
            }
            return new Left(new GeneralException());
        } catch (e) {
            if (e instanceof AxiosError) {
                const error: ApiError = e.response?.data
                return new Left(new ApiException(500, error.message, error));
            } else {
                return new Left(new ApiException(500, e?.toString()));
            }
        }
    }

    async addFriend(id: number, friendId: number): Promise<Either<GeneralException, FriendAddResponse>> {
        try {
            const res = await this.apiClient.axiosClient().post(`${ApiConstants.friends}`, {
                data: {
                    userId: id,
                    friendId: friendId
                }
            });
            if (res.status >= 200 && res.status < 400) {
                const response: FriendAddResponse = {
                    status: res.data.status,
                }
                return new Right(response);
            }
            return new Left(new GeneralException());
        } catch (e) {
            if (e instanceof AxiosError) {
                const error: ApiError = e.response?.data
                return new Left(new ApiException(500, error.message, error));
            } else {
                return new Left(new ApiException(500, e?.toString()));
            }
        }
    }

    async checkFriendShip(id: number, friendId: number): Promise<Either<GeneralException, FriendStatusEntity>> {
        try {
            const res = await this.apiClient.axiosClient().get(`${ApiConstants.users}/${id}${ApiConstants.relationships}/${friendId}`);
            if (res.status >= 200 && res.status < 400) {
                const response: FriendStatusEntity = {
                    status: res.data.status,
                }
                return new Right(response);
            }
            return new Left(new GeneralException());
        } catch (e) {
            if (e instanceof AxiosError) {
                const error: ApiError = e.response?.data
                return new Left(new ApiException(500, error.message, error));
            } else {
                return new Left(new ApiException(500, e?.toString()));
            }
        }
    }

    async removeFriend(id: number, friendId: number): Promise<Either<GeneralException, void>> {
        try {
            const res = await this.apiClient.axiosClient().post(`${ApiConstants.friends}`, {
                data: {
                    userId: id,
                    friendId: friendId
                }
            });
            if (res.status >= 200 && res.status < 400) {
                return new Right(undefined);
            }
            return new Left(new GeneralException());
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