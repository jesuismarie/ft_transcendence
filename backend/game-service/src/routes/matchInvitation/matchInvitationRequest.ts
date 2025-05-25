import type { FastifyInstance } from "fastify";
import { MatchInvitationRequestRepo } from "../../repositories/matchInvitation";

interface MatchInvitationRequestBody {
  user1: string;
  user2: string;
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
    const { user1, user2, date_time } = body;

    // Валидация входных данных
    if (!user1 || !user2) {
      return reply
        .status(400)
        .send({ message: "User IDs must be greater than 0" });
    }

    try {
      // Проверка наличия существующего запроса
      const alreadyExists = matchInvitationRequestRepo.hasPendingRequestBetween(
        user1,
        user2
      );

      if (alreadyExists) {
        return reply.status(409).send({
          message: "A pending invitation already exists between these users",
        });
      }

      const currentDateTime = date_time || new Date().toISOString();

      // Создание новой заявки
      matchInvitationRequestRepo.add({
        username1: user1,
        username2: user2,
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
