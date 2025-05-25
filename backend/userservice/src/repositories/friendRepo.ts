import { FastifyInstance } from 'fastify';

export interface Friend {
    id: number;
    userId: number;
    friendId: number;
}

export class FriendRepo {
    private app: FastifyInstance;
    constructor(app: FastifyInstance) {
        this.app = app;
    }

    add(userId: number, friendId: number) {
        const insert = this.app.db.prepare('INSERT OR IGNORE INTO friends (userId, friendId) VALUES (?,?)');
        const tx = this.app.db.transaction((a: number, b: number) => {
            insert.run(a, b);
            insert.run(b, a);
        });
        tx(userId, friendId);
    }

    delete(userId: number, friendId: number) {
        const stmt = this.app.db.prepare('DELETE FROM friends WHERE userId = ? AND friendId = ?');
        const tx = this.app.db.transaction((a: number, b: number) => {
            const r1 = stmt.run(a, b);
            const r2 = stmt.run(b, a);
            return (r1.changes + r2.changes);
        });
        return tx(userId, friendId);
    }

    list(userId: number, opts?: { offset: number; limit: number; q?: string }) {
        const { offset = 0, limit = 10, q = '' } = opts ?? {};
        
        const stmt = this.app.db.prepare(`
            SELECT u.id, u.email, u.displayName, u.avatarPath, u.rating, u.createdAt
            FROM friends f
            JOIN users u ON f.friendId = u.id
            WHERE f.userId = ?
            AND
            u.displayName LIKE ? COLLATE NOCASE
            ORDER BY u.displayName COLLATE NOCASE
            LIMIT ? OFFSET ?`);
        return stmt.all(userId, `%${q ?? ''}%`, limit, offset);
    }
}