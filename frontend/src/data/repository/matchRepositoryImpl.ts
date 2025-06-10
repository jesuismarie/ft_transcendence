import {type Either, Left, Right} from "@/core/models/either";
import {ApiException, GeneralException} from "@/core/exception/exception";
import type {MatchHistory} from "@/domain/entity/matchHistory";
import type {MatchRepository} from "@/domain/respository/matchRepository";
import {ApiConstants} from "@/core/constants/apiConstants";
import type {FriendEntity} from "@/domain/entity/friendEntity";
import {AxiosError} from "axios";
import type {ApiError} from "@/utils/types";
import {inject, injectable} from "tsyringe";
import type {ApiClient} from "@/core/network/apiClient";

@injectable()
export class MatchRepositoryImpl implements MatchRepository {

    constructor(@inject('ApiClient') private apiClient: ApiClient) {}

    async fetchMatchList(userId: number, offset: number, limit: number): Promise<Either<GeneralException, MatchHistory>> {
        try {
            const res = await this.apiClient.axiosClient().get(`${ApiConstants.matchHistoryByUser}?user_id${userId}offset=${offset}&limit=${limit}`);
            if (res.status >= 200 && res.status < 400) {
                const match: MatchHistory = {
                    totalCount: res.data.totalCount,
                    matches: res.data.matches
                }
                return new Right(match);
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