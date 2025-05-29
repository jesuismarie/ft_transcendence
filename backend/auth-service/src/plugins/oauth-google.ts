import fp from "fastify-plugin";
import oauthPlugin, { OAuth2Namespace } from "@fastify/oauth2";

// Google OAuth 2.0 plugin – registers `googleOAuth2` namespace on Fastify.
export default fp(async (app) => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } =
    process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
    app.log.warn("[google-oauth] Missing env vars – plugin skipped");
    return;
  }

  app.register(oauthPlugin, {
    name: "googleOAuth2",
    scope: ["profile", "email"],
    credentials: {
      client: {
        id: GOOGLE_CLIENT_ID,
        secret: GOOGLE_CLIENT_SECRET,
      },
      auth: oauthPlugin.GOOGLE_CONFIGURATION,
    },
    callbackUri: GOOGLE_CALLBACK_URL,
    startRedirectPath: "/auth/oauth/google",
  });
});

declare module "fastify" {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}
