import type {TournamentInfoDetailsEntity} from "@/domain/entity/tournamentInfoDetailsEntity";

export interface TournamentInfoEntity {
    totalCount:	number;
    tournaments: TournamentInfoDetailsEntity[];
}