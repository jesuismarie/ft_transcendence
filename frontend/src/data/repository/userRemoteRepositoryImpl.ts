import type {ApiError, SearchUserResponse, UserView} from "@/utils/types";
import type {UserRemoteRepository} from "@/domain/respository/userRemoteRepository";
import {type Either, Left, Right} from "@/core/models/either";
import {GeneralException} from "@/core/exception/exception";
import {inject, injectable} from "tsyringe";
import  {type ApiClient} from "@/core/network/apiClient";
import {ApiConstants} from "@/core/constants/apiConstants";
import {SEARCH_LIMIT} from "@/profile/search";
import {showError} from "@/utils/error_messages";

@injectable()
export class UserRemoteRepositoryImpl implements UserRemoteRepository {

    constructor(@inject('ApiClient') private apiClient: ApiClient) {}

    async getProfile(id: string): Promise<Either<GeneralException, UserView>> {
        const res = await this.apiClient.axiosClient().get(`${ApiConstants.users}/${id}`);
        try {
            if (res.status >= 200 && res.status < 400) {
                const user: UserView = {
                    id: res.data.userId,
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
        }
        catch (e) {
            return new Left(new GeneralException())
        }
    }

    async searchUser(query: string, offset: number): Promise<Either<GeneralException, SearchUserResponse>> {
        const res = await this.apiClient.axiosClient().get(`${ApiConstants.users}?q=${encodeURIComponent(query)}&limit=${SEARCH_LIMIT}&offset=${offset}`);
        try {
            if (res.status >= 200 && res.status < 400) {
                const user: SearchUserResponse = {
                    totalCount: res.data.totalCount,
                    users: res.data.users
                }
                return new Right(user);
            } else {
                return new Left(new GeneralException())
            }
        }
        catch (e) {
            return new Left(new GeneralException())
        }
    }

    async updateAvatar(id: number, data: FormData): Promise<Either<GeneralException, void>> {
       try {
           const response = await this.apiClient.axiosClient().post(`${ApiConstants.users}/:${id}${ApiConstants.avatar}`, {
               body: data,
           });

           if (response.status >= 200 && response.status < 400) {
               return new Right(undefined);
           } else {
               return new Left(new GeneralException());
           }
       }
       catch (e) {
           return new Left(new GeneralException(e?.toString()));
       }
    }
}