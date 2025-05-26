export const createTournamentSchema = {
  type: "object",
  required: ["name", "max_players_count", "created_by"],
  properties: {
    name: { type: "string" },
    max_players_count: { type: "number" },
    created_by: { type: "string" },
  },
};

export const deleteTournamentSchema = {
  type: "object",
  required: ["tournament_id", "created_by"],
  properties: {
    tournament_id: { type: "number" },
    created_by: { type: "string" },
  },
};
