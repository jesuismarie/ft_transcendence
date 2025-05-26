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

export const startTournamentSchema = {
  type: "object",
  required: ["tournament_id", "created_by"],
  properties: {
    tournament_id: { type: "number" },
    created_by: { type: "string" },
  },
};

export const getMatchHistoryByUserSchema = {
  type: "object",
  required: ["username"],
  properties: {
    username: { type: "string" },
    limit: { type: "number", default: 50 },
    offset: { type: "number", default: 0 },
  },
};

export const saveMatchResultSchema = {
  type: "object",
  required: ["match_id", "winner", "score"],
  properties: {
    match_id: { type: "number" },
    winner: { type: "string" },
    score: {
      type: "object",
      required: ["score_1", "score_2"],
      properties: {
        score_1: { type: "number" },
        score_2: { type: "number" },
      },
    },
  },
};

export const tournamentNextStepSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "number" },
  },
};

export const unregisterFromTournamentSchema = {
  type: "object",
  required: ["username", "tournament_id"],
  properties: {
    username: { type: "string" },
    tournament_id: { type: "number" },
  },
  additionalProperties: false,
};
