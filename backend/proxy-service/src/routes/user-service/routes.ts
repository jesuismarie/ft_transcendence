import type { FastifyInstance } from "fastify";
import createUserRoute from "./user/createUser";
import getUserByIdRoute from "./user/getUserById";
import getUserByUsernameRoute from "./user/getUserByUsername";
import updateUserRoute from "./user/updateUser";
import updateUserPasswordRoute from "./user/updateUserPassword";
import updateUserAvatarRoute from "./user/updateUserAvatar";
import deleteUserRoute from "./user/deleteUser";
import getUsersRoute from "./user/getUsers";
import addFriendRoute from "./friend/addFriendRoute";
import removeFriendRoute from "./friend/removeFriendRoute";
import getUserFriendsRoute from "./friend/getUserFriendsRoute";
import getRelationshipRoute from "./friend/getRelationshipRoute";

export default async function userServiceRoutes(app: FastifyInstance) {
  await createUserRoute(app);
  await getUserByIdRoute(app);
  await getUserByUsernameRoute(app);
  await updateUserRoute(app);
  await updateUserPasswordRoute(app);
  await updateUserAvatarRoute(app);
  await deleteUserRoute(app);
  await getUsersRoute(app);
  await addFriendRoute(app);
  await removeFriendRoute(app);
  await getUserFriendsRoute(app);
  await getRelationshipRoute(app);
}
