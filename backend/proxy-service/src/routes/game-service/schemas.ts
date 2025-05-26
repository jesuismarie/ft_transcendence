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

export const getTournamentParticipantsSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "number" },
  },
};

export const getTournamentsInfoSchema = {
  type: "object",
  properties: {
    limit: { type: "number", default: 50 },
    offset: { type: "number", default: 0 },
  },
};

export const registerToTournamentSchema = {
  type: "object",
  required: ["username", "tournament_id"],
  properties: {
    username: { type: "string" },
    tournament_id: { type: "number" },
  },
  additionalProperties: false,
};
