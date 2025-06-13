export const createTournamentSchema = {
  type: "object",
  required: ["name", "max_players_count", "created_by"],
  properties: {
    name: { type: "string" },
    max_players_count: { type: "number" },
    created_by: { type: "number" },
  },
};

export const deleteTournamentSchema = {
  type: "object",
  required: ["tournament_id", "created_by"],
  properties: {
    tournament_id: { type: "number" },
    created_by: { type: "number" },
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
    status: {
      type: "array",
      items: { type: "string", enum: ["created", "in_progress", "ended"] },
      default: [],
    },
  },
};

export const registerToTournamentSchema = {
  type: "object",
  required: ["user_id", "tournament_id"],
  properties: {
    user_id: { type: "number" },
    tournament_id: { type: "number" },
  },
  additionalProperties: false,
};

export const startTournamentSchema = {
  type: "object",
  required: ["tournament_id", "created_by"],
  properties: {
    tournament_id: { type: "number" },
    created_by: { type: "number" },
  },
};

export const getMatchHistoryByUserSchema = {
  type: "object",
  required: ["user_id"],
  properties: {
    user_id: { type: "number" },
    limit: { type: "number", default: 50 },
    offset: { type: "number", default: 0 },
  },
};

export const saveMatchResultSchema = {
  type: "object",
  required: ["match_id", "winner", "score"],
  properties: {
    match_id: { type: "number" },
    winner: { type: "number" },
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
  required: ["user_id", "tournament_id"],
  properties: {
    user_id: { type: "number" },
    tournament_id: { type: "number" },
  },
  additionalProperties: false,
};

export const gamestatsSchema = {
  type: "object",
  required: ["user"],
  properties: {
    user: { type: "integer" },
  },
};

export const getTournamentActiveMatchSchema = {
  type: "object",
  required: ["id"],
  properties: {
    id: { type: "integer" },
  },
};