import type { FastifyInstance } from "fastify";
import respondToMatchInvitationRequestRoute from "./matchInvitationRespond.ts";
import matchInvitationRequestRoute from "./matchInvitationRequest.ts";

export default async function matchInvitationRoutes(app: FastifyInstance) {
  await respondToMatchInvitationRequestRoute(app);
  await matchInvitationRequestRoute(app);
}
