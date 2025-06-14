import type {Either} from "@/core/models/either";
import type {GeneralException} from "@/core/exception/exception";
import type {MatchHistory} from "@/domain/entity/matchHistory";
import type {MatchValueObject} from "@/domain/value_objects/match_value_object";
import type {ActiveMatchEntity} from "@/domain/entity/activeMatchEntity";

export interface MatchRepository {
    fetchMatchList(userId: number, offset: number, limit: number): Promise<Either<GeneralException, MatchHistory>>;
    createMatch(match: MatchValueObject): Promise<Either<GeneralException, void>>;
    getActiveMatch(tournamentId: number): Promise<Either<GeneralException, ActiveMatchEntity>>;
}