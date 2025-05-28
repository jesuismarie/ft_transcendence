import { FastifyInstance } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import { FriendRepo } from "../../repositories/friendRepo";

// Routes
import addFriendRoute from "./addFriendRoute";
import removeFriendRoute from "./removeFriendRoute";
import getUserFriendsRoute from "./getUserFriendsRoute";
import getRelationshipRoute from "./getRelationshipRoute";

export default async function friendRoutes(app: FastifyInstance, userRepo: UserRepo, friendRepo: FriendRepo) {
    await addFriendRoute(app, userRepo, friendRepo);
    await removeFriendRoute(app, userRepo, friendRepo);
    await getUserFriendsRoute(app, userRepo, friendRepo);
    await getRelationshipRoute(app, userRepo, friendRepo);
}