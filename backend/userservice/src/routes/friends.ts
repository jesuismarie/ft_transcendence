import { FastifyInstance } from "fastify";
import { UserRepo } from "../repositories/userRepo";
import { FriendRepo } from "../repositories/friendRepo";
import { addFriendSchema } from "../schemas/friendSchemas";

/* --- Friends --- */
export default async function friendRoutes(app: FastifyInstance) {
    const userRepo = new UserRepo(app);
    const friendRepo = new FriendRepo(app);

    app.post('/friends', { schema: { body: addFriendSchema } }, async (req, reply) => {
        const { userId, friendId } = req.body as { userId: number; friendId: number };
        if (userId === friendId) return reply.code(400).send({ error: 'Cannot friend yourself' });

        const userExists = await userRepo.findById(userId);
        const friendExists = await userRepo.findById(friendId);
        if (!userExists || !friendExists) {
            return reply.code(404).send({ error: 'User not found' });
        }

        await friendRepo.add(userId, friendId);
        reply.code(201).send({ status: 'friend_added' });
    });

    app.get('/users/:id/friends', async (req, reply) => {
        const id = Number((req.params as any).id);
        if (!userRepo.findById(id)) return reply.code(404).send({ error: 'User not found' });
        return friendRepo.list(id);
    });
}