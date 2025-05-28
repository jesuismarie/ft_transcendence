export interface Tournament {
  id: number;
  name: string;
  created_by: string;
  max_players_count: number;
  current_players_count: number;
  status: Status;
  participants: string[];
  winner: string | null;
}

export type Status = "created" | "in_progress" | "ended" | "error";
