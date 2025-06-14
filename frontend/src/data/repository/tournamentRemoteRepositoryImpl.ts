import type {TournamentRemoteRepository} from "@/domain/respository/tournamentRemoteRepository";
import {type Either, Left, Right} from "@/core/models/either";
import {ApiException, GeneralException} from "@/core/exception/exception";
import type {TournamentEntity} from "@/domain/entity/tournamentEntity";
import {inject, injectable} from "tsyringe";
import {type ApiClient} from "@/core/network/apiClient";
import {AxiosError} from "axios";
import type {ApiError} from "@/utils/types";
import {ApiConstants} from "@/core/constants/apiConstants";
import type {TournamentInfoEntity} from "@/domain/entity/tournamentInfoEntity";
import type {TournamentParticipantsEntity} from "@/domain/entity/tournamentParticipantsEntity";
import type {MatchEntity} from "@/domain/entity/matchEntity";
import type {TournamentInfoDetailsEntity} from "@/domain/entity/tournamentInfoDetailsEntity";


@injectable()
export class TournamentRemoteRepositoryImpl implements TournamentRemoteRepository {
    constructor(@inject('ApiClient') private readonly apiClient: ApiClient) {
    }

    async registerToTournament(id: number, userId: number): Promise<Either<GeneralException, void>> {
        try {
            const res = await this.apiClient.axiosClient().post(ApiConstants.registerToTournament, {
                user_id: userId,
                tournament_id: id,
            });
            if (res.status >= 200 && res.status < 400) {
                return new Right(undefined);
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

    async unregisterFromTournament(id: number, userId: number): Promise<Either<GeneralException, void>> {
        try {
            const res = await this.apiClient.axiosClient().post(ApiConstants.unregisterFromTournament, {
                user_id: userId,
                tournament_id: id,
            });
            if (res.status >= 200 && res.status < 400) {
                return new Right(undefined);
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

    async createTournament(name: string, maxPlayerCount: number, createdBy: number): Promise<Either<GeneralException, TournamentEntity>> {
        try {
            const res = await this.apiClient.axiosClient().post(ApiConstants.createTournament, {
                name: name,
                max_players_count: maxPlayerCount,
                created_by: createdBy
            });
            if (res.status >= 200 && res.status < 400) {
                const entity: TournamentEntity = {
                    message: res.data.message,
                    tournamentId: res.data.tournament_id,
                    name: res.data.name,
                }
                return new Right(entity);
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

    async deleteTournament(id: number, createdBy: number): Promise<Either<GeneralException, void>> {
        try {
            const res = await this.apiClient.axiosClient().delete(`${ApiConstants.deleteTournament}`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                data: {tournament_id: id, created_by: createdBy},
            });

            if (res.status >= 200 && res.status < 400) {
                return new Right(undefined);
            } else {
                return new Left(new GeneralException())
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                const error: ApiError = err.response?.data
                return new Left(new ApiException(500, error.message, error));
            } else {
                return new Left(new ApiException(500, err?.toString()));
            }
        }
    }

    async getAllTournaments(offset: number, limit: number): Promise<Either<GeneralException, TournamentInfoEntity>> {
        try {
            const res = await this.apiClient.axiosClient().get(`${ApiConstants.getTournamentInfo}?offset=${offset}&limit=${limit}`);
            if (res.status >= 200 && res.status < 400) {


                const tournaments = res.data.tournaments.map((e: TournamentInfoDetailsEntity) => {
                    const tournament: TournamentInfoDetailsEntity = {
                        id: e.id,
                        name: e.name,
                        created_by: e.created_by,
                        createdName: '',
                        max_players_count: e.current_players_count,
                        current_players_count: e.current_players_count,
                        status: e.status,
                        participants: e.participants,
                        activeMatch: e.activeMatch
                    };
                    return tournament;
                });
                const entity: TournamentInfoEntity = {
                    totalCount: res.data.totalCount,
                    tournaments: tournaments,
                }
                return new Right(entity);
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

    async startTournament(id: number, createdBy: number): Promise<Either<GeneralException, MatchEntity>> {
        try {
            const res = await this.apiClient.axiosClient().post(ApiConstants.startTournament, {
                tournament_id: id,
                created_by: createdBy
            });
            if (res.status >= 200 && res.status < 400) {
                const match: MatchEntity = {
                    matchId: res.data.match_id,
                    player1Id: res.data.player_1,
                    player2Id: res.data.player_2,
                    participants: res.data.participants,
                    status: res.data.status,
                }
                return new Right(match);
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

    async getRelevantParticipants(id: number): Promise<Either<GeneralException, TournamentParticipantsEntity>> {
        try {
            const res = await this.apiClient.axiosClient().get(`${ApiConstants.getTournament}?id=${id}`, {
            });
            if (res.status >= 200 && res.status < 400) {
                const participants: TournamentParticipantsEntity = {
                    maxPlayersCount: res.data.maxPlayersCount,
                    currentPlayersCount: res.data.currentPlayersCount,
                    participants: res.data.participants,
                }
                return new Right(participants);
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

}