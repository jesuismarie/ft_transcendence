import type {Either} from "@/core/models/either";
import type {GeneralException} from "@/core/exception/exception";
import type {TournamentEntity} from "@/domain/entity/tournamentEntity";
import type {TournamentInfoEntity} from "@/domain/entity/tournamentInfoEntity";

export interface TournamentRemoteRepository {
    createTournament(name: string, maxPlayerCount: number, createdBy: number): Promise<Either<GeneralException, TournamentEntity>>;
    getAllTournaments(offset: number, limit: number): Promise<Either<GeneralException, TournamentInfoEntity>>
    deleteTournament(id: number, createdBy: number): Promise<Either<GeneralException, void>>;
    startTournament(id: number): Promise<Either<GeneralException, void>>;
    registerToTournament(id: number, userId: number): Promise<Either<GeneralException, void>>;
}