import type { FastifyInstance } from "fastify";
import { MatchInvitationRequestRepo } from "../../repositories/matchInvitation.ts";

interface MatchInvitationRequestBody {
  user_id1: number;
  user_id2: number;
  date_time?: string; // Опциональное поле
}

export default async function matchInvitationRequestRoute(
  app: FastifyInstance
) {
  // Регистрируем репозиторий с базой данных
  const matchInvitationRequestRepo = new MatchInvitationRequestRepo(app);

  // Ручка для создания нового запроса на матч
  app.post("/create-match-invitation-request", async (request, reply) => {
    const body = request.body as MatchInvitationRequestBody;
    const { user_id1, user_id2, date_time } = body;

    // Валидация входных данных
    if (!user_id1 || !user_id2 || user_id1 <= 0 || user_id2 <= 0) {
      return reply
        .status(400)
        .send({ message: "User IDs must be greater than 0" });
    }

    try {
      // Проверка наличия существующего запроса
      const alreadyExists = matchInvitationRequestRepo.hasPendingRequestBetween(
        user_id1,
        user_id2
      );

      if (alreadyExists) {
        return reply.status(409).send({
          message: "A pending invitation already exists between these users",
        });
      }

      const currentDateTime = date_time || new Date().toISOString();

      // Создание новой заявки
      matchInvitationRequestRepo.add({
        user_id1,
        user_id2,
        date_time: currentDateTime,
      });

      return reply
        .status(201)
        .send({ message: "Match invitation request created" });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ message: "Internal Server Error" });
    }
  });
}
