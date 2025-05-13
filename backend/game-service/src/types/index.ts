export interface Tournament {
  id: number;
  createdBy: number;
  maxPlayersCount: number;
  currentPlayersCount: number;
  status: Status;
  created_at: string;
  started_at?: string;
  ended_at?: string;
}

export type Status = "created" | "in_progress" | "ended" | "error";

export interface Match {
  id: number;
  player_1: number | null;
  player_2: number | null;
  score_1: number | null;
  score_2: number | null;
  started_at?: string;
  ended_at?: string;
  gameLevel: number;
  group_id: string;
  status: Status;
}
