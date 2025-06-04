import {ApiException, GeneralException} from "@/core/exception/exception";
import type {UserEntity} from "@/domain/entity/user_entity";
import type {RemoteAuthRepository} from "@/domain/respository/remote_auth_repository";
import {type Either, Left, Right} from "@/core/models/either";
import {inject, injectable} from "tsyringe";
import type {ApiClient} from "@/core/network/apiClient";
import {ApiConstants} from "@/core/constants/apiConstants";
import {AxiosError} from "axios";
import type {ApiError} from "@/utils/types";


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
                }
                return new Right(user);
            }
            return new Left(new GeneralException());
        }
        catch (e) {
            if (e instanceof AxiosError) {
                const error: ApiError = e.response?.data
                return new Left(new ApiException(500, error.message, error))
            }
            return new Left(new GeneralException(e?.toString()));
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
                return new Left(new ApiException(500, error.message, error))
            }
            return new Left(new GeneralException(e?.toString()))
        }
    }
}