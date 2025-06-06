export interface TournamentInfoDetailsEntity {
    id:						number;
    name:					string;
    created_by:				string;
    max_players_count:		number;
    current_players_count:	number;
    status:					string;
    participants:			string[];
}