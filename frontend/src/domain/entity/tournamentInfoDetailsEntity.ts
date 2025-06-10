export interface TournamentInfoDetailsEntity {
    id:						number;
    name:					string;
    created_by:				number;
    max_players_count:		number;
    current_players_count:	number;
    status:					string;
    participants:			number[];
}