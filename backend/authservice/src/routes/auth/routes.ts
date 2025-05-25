import {FastifyInstance} from "fastify";
import loginRoutes from './loginRoutes';
import logoutRoutes from './logoutRoutes';


export default async function authRoutes(app: FastifyInstance) {
	await loginRoutes(app);
	await logoutRoutes(app);
}