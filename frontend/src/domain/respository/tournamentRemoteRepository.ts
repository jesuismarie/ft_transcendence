import type {Either} from "@/core/models/either";
import type {GeneralException} from "@/core/exception/exception";
import type {TournamentEntity} from "@/domain/entity/tournamentEntity";
import type {TournamentInfoEntity} from "@/domain/entity/tournamentInfoEntity";
import type {TournamentParticipantsEntity} from "@/domain/entity/tournamentParticipantsEntity";
import type {MatchEntity} from "@/domain/entity/matchEntity";

export interface TournamentRemoteRepository {
    createTournament(name: string, maxPlayerCount: number, createdBy: number): Promise<Either<GeneralException, TournamentEntity>>;
    getAllTournaments(offset: number, limit: number): Promise<Either<GeneralException, TournamentInfoEntity>>
    deleteTournament(id: number, createdBy: number): Promise<Either<GeneralException, void>>;
    startTournament(id: number, createdBy: number): Promise<Either<GeneralException, MatchEntity>>;
    getRelevantParticipants(id: number): Promise<Either<GeneralException, TournamentParticipantsEntity>>;
    registerToTournament(id: number, userId: number): Promise<Either<GeneralException, void>>;
    unregisterFromTournament(id: number, userId: number): Promise<Either<GeneralException, void>>;
}