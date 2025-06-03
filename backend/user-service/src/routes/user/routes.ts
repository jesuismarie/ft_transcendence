import { UserRepo } from "../../repositories/userRepo";
import { FastifyInstance } from "fastify";

import getUserByIdRoute from "./getUserByIdRoute";
import getUserByUsernameRoute from './getUserByUsernameRoute';
import getUsersRoute from "./getUsersRoute";
import updateUserAvatarRoute from "./updateUserAvatarRoute";
import updateUserPasswordRoute from "./updateUserPasswordRoute";
import updateUserRoute from "./updateUserRoute";
import verifyPasswordRoute from "./verifyPasswordRoute";
import {registerPresenceRoute} from "./presenceRoute";


export default async function userRoutes(app: FastifyInstance, userRepo: UserRepo) {
    await getUsersRoute(app, userRepo);
    await getUserByIdRoute(app, userRepo);
    await updateUserPasswordRoute(app, userRepo);
    await updateUserRoute(app, userRepo);
    await getUserByUsernameRoute(app, userRepo);
    await updateUserAvatarRoute(app, userRepo);
    await verifyPasswordRoute(app, userRepo);
    await registerPresenceRoute(app, userRepo);
}