// src/routes/respondToMatchInvitationRequest.ts
import type { FastifyInstance } from "fastify";
import { MatchInvitationRequestRepo } from "../../repositories/matchInvitation.ts";

interface RespondMatchInvitationRequestBody {
  request_id: number;
  is_accepted: boolean;
}

export default async function respondToMatchInvitationRequestRoute(
  app: FastifyInstance
) {
  const matchInvitationRequestRepo = new MatchInvitationRequestRepo(app);

  // Ручка для ответа на запрос на матч
  app.patch("/respond-to-match-invitation-request", async (request, reply) => {
    const body = request.body as RespondMatchInvitationRequestBody;

    const { request_id, is_accepted } = body;

    // Валидация
    if (!request_id || request_id <= 0) {
      return reply.status(400).send({ message: "Invalid match invitation ID" });
    }
    if (typeof is_accepted !== "boolean") {
      return reply
        .status(400)
        .send({ message: "isAccepted must be a boolean" });
    }

    try {
      const existing = matchInvitationRequestRepo.getById(request_id);
      if (!existing) {
        return reply.status(404).send({ message: "Invitation not found" });
      }

      matchInvitationRequestRepo.update(request_id, {
        is_accepted: is_accepted,
      });

      return reply
        .status(200)
        .send({ message: "Invitation response recorded" });
    } catch (error) {
      app.log.error(error);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
