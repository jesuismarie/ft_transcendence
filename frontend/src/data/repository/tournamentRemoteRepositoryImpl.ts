import type {TournamentRemoteRepository} from "@/domain/respository/tournamentRemoteRepository";
import {type Either, Left, Right} from "@/core/models/either";
import {ApiException, GeneralException} from "@/core/exception/exception";
import type {TournamentEntity} from "@/domain/entity/tournamentEntity";
import {inject, injectable} from "tsyringe";
import {type ApiClient} from "@/core/network/apiClient";
import {AxiosError} from "axios";
import type {ApiError} from "@/utils/types";
import {ApiConstants} from "@/core/constants/apiConstants";
import {TOURNAMENTS_LIMIT} from "@/profile/tournaments";
import type {TournamentInfoEntity} from "@/domain/entity/tournamentInfoEntity";
import {showError} from "@/utils/error_messages";


@injectable()
export class TournamentRemoteRepositoryImpl implements TournamentRemoteRepository {
    constructor(@inject('ApiClient') private readonly apiClient: ApiClient) {
    }

    async createTournament(name: string, maxPlayerCount: number, createdBy: string): Promise<Either<GeneralException, TournamentEntity>> {
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

    async deleteTournament(id: number, createdBy: string): Promise<Either<GeneralException, void>> {
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
            const res = await this.apiClient.axiosClient().get(`${ApiConstants.getTournamentInfo}?offset=${offset}&limit=${TOURNAMENTS_LIMIT}`);
            if (res.status >= 200 && res.status < 400) {
                const entity: TournamentInfoEntity = {
                    totalCount: res.data.totalCount,
                    tournaments: res.data.tournaments,
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

    async startTournament(id: number): Promise<Either<GeneralException, void>> {
        try {
            const res = await this.apiClient.axiosClient().post(ApiConstants.startTournament, {
                body: id,
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

}