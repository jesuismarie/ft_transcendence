import type {MatchEntity} from "@/domain/entity/matchEntity";
import type {ActiveMatchEntity} from "@/domain/entity/activeMatchEntity";

export interface TournamentInfoDetailsEntity {
    id:						number;
    name:					string;
    created_by:				number;
    createdName:            string;
    max_players_count:		number;
    current_players_count:	number;
    status:					string;
    participants:			number[];
    activeMatch?: ActiveMatchEntity;
}