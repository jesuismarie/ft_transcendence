import type { FastifyInstance } from "fastify";
import createUserRoute from "./createUser";
import getUserByIdRoute from "./getUserById";
import getUserByUsernameRoute from "./getUserByUsername";
import updateUserRoute from "./updateUser";
import updateUserPasswordRoute from "./updateUserPassword";
import updateUserAvatarRoute from "./updateUserAvatar";
import deleteUserRoute from "./deleteUser";
import getUsersRoute from "./getUsers";

export default async function userServiceRoutes(app: FastifyInstance) {
  await createUserRoute(app);
  await getUserByIdRoute(app);
  await getUserByUsernameRoute(app);
  await updateUserRoute(app);
  await updateUserPasswordRoute(app);
  await updateUserAvatarRoute(app);
  await deleteUserRoute(app);
  await getUsersRoute(app);
}
