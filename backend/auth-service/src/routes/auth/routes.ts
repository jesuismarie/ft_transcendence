import {FastifyInstance} from "fastify";
import loginRoutes from './loginRoutes';
import logoutRoutes from './logoutRoutes';
import googleOauthRoutes from "./oauth-google";
import totpRoutes from './totp';
import internalTokenRoutes from "./internalRoutes";


export default async function authRoutes(app: FastifyInstance) {
	await loginRoutes(app);
	await logoutRoutes(app);
	await googleOauthRoutes(app);
	await totpRoutes(app);
	await internalTokenRoutes(app);
}