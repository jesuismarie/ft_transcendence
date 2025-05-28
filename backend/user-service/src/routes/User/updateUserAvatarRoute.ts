import sharp from "sharp";
import { FastifyInstance, FastifyReply } from "fastify";
import { UserRepo } from "../../repositories/userRepo";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";


export default async function updateUserAvatarRoute(app: FastifyInstance, userRepo: UserRepo) {
	app.put(
		'/users/:id/avatar',
		async (req, reply: FastifyReply) => {
			const id = Number((req.params as any).id);
			const user = userRepo.findById(id);
			if (!user)
				return reply.sendError({ statusCode: 404, message: 'User not found' });
			
			// get the file
			const file = await (req as any).file();          // plugin guarantees type
			if (!file)
				return reply.sendError({ statusCode: 400, message: 'No file field' });
			
			// read into buffer
			let buf = await file.toBuffer();
			
			// verify dimensions (must be 200×200)
			const meta = await sharp(buf).metadata();
			if (meta.width !== 200 || meta.height !== 200) {
				// Resize to 200x200
				buf = await sharp(buf)
					.resize(200, 200, { fit: 'cover' })
					.toBuffer();
			}
			// store under public/avatars
			const filename = `${randomUUID()}.png`;
			const absPath  = path.join(process.cwd(), 'public', 'avatars');
			fs.mkdirSync(absPath, { recursive: true });
			await sharp(buf).png().toFile(path.join(absPath, filename));
			// update DB
			const avatarUrl = `/static/avatars/${filename}`;
			const updated = userRepo.update(id, { avatarPath: avatarUrl });
			return reply.send({"modified": updated});
		}
	);
}