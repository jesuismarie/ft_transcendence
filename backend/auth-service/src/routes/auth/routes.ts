import {FastifyInstance} from "fastify";
import loginRoutes from './loginRoutes';
import logoutRoutes from './logoutRoutes';
import googleOauthRoutes from "./oauth-google";
import totpRoutes from './totp';
import internalTokenRoutes from "./internalRoutes";
import claimRoute from "./claimRoute";


export default async function authRoutes(app: FastifyInstance) {
	await loginRoutes(app);
	await claimRoute(app);
	await logoutRoutes(app);
	await googleOauthRoutes(app);
	await totpRoutes(app);
	await internalTokenRoutes(app);
}