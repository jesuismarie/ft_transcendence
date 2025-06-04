import type {Either} from "@/core/models/either";
import type {GeneralException} from "@/core/exception/exception";
import type {TournamentEntity} from "@/domain/entity/tournamentEntity";

export interface TournamentRemoteRepository {
    createTournament(name: string, maxPlayerCount: number, createdBy: string): Promise<Either<GeneralException, TournamentEntity>>;
}