export interface Tournament {
  id: number;
  name: string;
  created_by: number;
  max_players_count: number;
  current_players_count: number;
  status: Status;
  participants: string[];
  winner: number | null;
}

export type Status = "created" | "in_progress" | "ended" | "error";
