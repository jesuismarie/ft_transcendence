import type { FastifyInstance } from "fastify";
import respondToMatchInvitationRequestRoute from "./matchInvitationRespond";
import matchInvitationRequestRoute from "./matchInvitationRequest";

export default async function matchInvitationRoutes(app: FastifyInstance) {
  await respondToMatchInvitationRequestRoute(app);
  await matchInvitationRequestRoute(app);
}
