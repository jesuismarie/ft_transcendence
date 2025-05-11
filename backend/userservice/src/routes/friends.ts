import {FastifyInstance, FastifyReply} from "fastify";
import { UserRepo } from "../repositories/userRepo";
import { FriendRepo } from "../repositories/friendRepo";
import { addFriendSchema, removeFriendSchema } from "../schemas/friendSchemas";
import { listFriendsQuery } from "../schemas/friendSchemas";


/* --- Friends --- */
export default async function friendRoutes(app: FastifyInstance) {
    const userRepo = new UserRepo(app);
    const friendRepo = new FriendRepo(app);

    app.post('/friends', { schema: { body: addFriendSchema } }, async (req, reply: FastifyReply) => {
        const { userId, friendId } = req.body as { userId: number; friendId: number };
        if (userId === friendId) return reply.sendError({ statusCode: 400, message: 'Cannot friend yourself' });

        const userExists = await userRepo.findById(userId);
        const friendExists = await userRepo.findById(friendId);
        if (!userExists || !friendExists) {
            return reply.sendError({ statusCode: 404, message: 'User or friend not found' });
        }
        friendRepo.add(userId, friendId);
        reply.code(201).send({ status: 'friend_added' });
    });
    
    app.delete('/friends', { schema: {body: removeFriendSchema} }, async (req, reply: FastifyReply) => {
        const { userId, friendId } = req.body as { userId: number; friendId: number };
        
        const userExists = await userRepo.findById(userId);
        const friendExists = await userRepo.findById(friendId);
        if (!userExists || !friendExists) {
            return reply.sendError({ statusCode: 404, message: 'User or friend not found' });
        }
        friendRepo.delete(userId, friendId);
        reply.code(204).send();
    });

    app.get('/users/:id/friends', { schema: { querystring: listFriendsQuery } }, async (req, reply: FastifyReply) => {
        const id = Number((req.params as any).id);
		const { offset = 0, limit = 10, q } = req.query as any;
        if (!userRepo.findById(id)) return reply.sendError({ statusCode: 404, message: 'User not found' });
        return friendRepo.list(id, { offset, limit, q});
    });
}