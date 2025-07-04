import {type Either, Left, Right} from "@/core/models/either";
import {ApiException, GeneralException} from "@/core/exception/exception";
import type {MatchHistory} from "@/domain/entity/matchHistory";
import type {MatchRepository} from "@/domain/respository/matchRepository";
import {ApiConstants} from "@/core/constants/apiConstants";
import {AxiosError} from "axios";
import type {ApiError} from "@/utils/types";
import {inject, injectable} from "tsyringe";
import  {type ApiClient} from "@/core/network/apiClient";
import type {MatchValueObject} from "@/domain/value_objects/match_value_object";
import type {ActiveMatchEntity} from "@/domain/entity/activeMatchEntity";
import {isArray} from "lodash";
import type {MatchHistoryItem} from "@/domain/entity/matchHistoryItem";

@injectable()
export class MatchRepositoryImpl implements MatchRepository {

    constructor(@inject('ApiClient') private apiClient: ApiClient) {}

    async fetchMatchList(userId: number, offset: number, limit: number): Promise<Either<GeneralException, MatchHistory>> {
        try {
            const res = await this.apiClient.axiosClient().get(`${ApiConstants.matchHistoryByUser}?user_id=${userId}&offset=${offset}&limit=${limit}`);
            if (res.status >= 200 && res.status < 400) {
                const match: MatchHistory = {
                    totalCount: res.data.totalCount,
                    matches: res.data.matches && isArray(res.data.matches)  ?
                        res.data.matches.map((e: MatchHistoryItem) => {
                            const match:  MatchHistoryItem = {
                                id: e.id,
                                opponent: e.opponent,
                                opponentName: '',
                                status: e.status,
                                is_won: e.is_won,
                                score: {
                                    opponent: e.score.opponent,
                                    user: e.score.user,
                                    opponentName: ''
                                },
                                date: e.date,
                            };
                            return match;
                            }
                        ) : []
                };


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

    async createMatch(match: MatchValueObject): Promise<Either<GeneralException, void>> {
        console.log(`UUUUUU:::: ${JSON.stringify(match)}`)
        try {
            const res = await this.apiClient.axiosClient().post(ApiConstants.createMatch, {
                match_id: match.matchId,
                player1_id: match.player1Id,
                player2_id: match.player2Id,
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

    async getActiveMatch(tournamentId: number): Promise<Either<GeneralException, ActiveMatchEntity>> {
        try {
            const res = await this.apiClient.axiosClient().get(`${ApiConstants.activeMatch}/${tournamentId}`);
            if (res.status >= 200 && res.status < 400) {
                const match: ActiveMatchEntity = {
                    matchId: res.data.match_id,
                    tournamentId: res.data.tournament_id,
                    status: res.data.status,
                    player1Id: res.data.player1,
                    player2Id: res.data.player2,
                };
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

    async getNextMatch(tournamentId: number): Promise<Either<GeneralException, ActiveMatchEntity>> {
        try {
            const res = await this.apiClient.axiosClient().post(`${ApiConstants.tournamentNextStep}`, {
                id: tournamentId
            });
            if (res.status >= 200 && res.status < 400) {
                const match: ActiveMatchEntity = {
                    matchId: res.data.match_id,
                    tournamentId: tournamentId,
                    status: res.data.status,
                    player1Id: res.data.player_1,
                    player2Id: res.data.player_2,
                    participants: res.data.participants
                };
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