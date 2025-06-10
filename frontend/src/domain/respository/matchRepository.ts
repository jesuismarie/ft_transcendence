import {fetchMatchList} from "@/profile/matches";
import type {Either} from "@/core/models/either";
import type {GeneralException} from "@/core/exception/exception";
import type {MatchHistory} from "@/domain/entity/matchHistory";

export interface MatchRepository {
    fetchMatchList(userId: number, offset: number, limit: number): Promise<Either<GeneralException, MatchHistory>>;
}