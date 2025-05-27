import type { FastifyInstance } from "fastify";
import loginRoute from "./login";
import logoutRoute from "./logout";
import registerRoute from "./register";
import refreshRoute from "./refresh";
import googleOauthRoute from "./oauth-google";
import totpRoutes from "./totp";

export default async function authServiceRoutes(app: FastifyInstance) {
  await loginRoute(app);
  await logoutRoute(app);
  await registerRoute(app);
  await refreshRoute(app);
  await googleOauthRoute(app);
  await totpRoutes(app);
}
