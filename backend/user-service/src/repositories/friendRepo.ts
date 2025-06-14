import { FastifyInstance } from 'fastify';

export interface Friend {
    id: number;
    userId: number;
    friendId: number;
}

interface FriendRepoInterface {
    add(userId: number, friendId: number): void;
    delete(userId: number, friendId: number): number;
    list(userId: number, opts?: { offset: number; limit: number; q?: string }): any;
    getRelationship(userId: number, friendId: number): boolean;
}

export class FriendRepo implements FriendRepoInterface {
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
            SELECT u.id, u.username, u.avatarPath
            FROM friends f
            JOIN users u ON f.friendId = u.id
            WHERE f.userId = ?
            AND
            u.username LIKE ? COLLATE NOCASE
            ORDER BY u.username COLLATE NOCASE
            LIMIT ? OFFSET ?`);
        return stmt.all(userId, `%${q ?? ''}%`, limit, offset);
    }

    getRelationship(userId: number, friendId: number) {
        const stmt = this.app.db.prepare(`
            SELECT 1 FROM friends
            WHERE (userId = ? AND friendId = ?) OR (userId = ? AND friendId = ?)
            LIMIT 1`
        );
        return !!stmt.get(userId, friendId, friendId, userId);
    }

    getTotalFriends(userId: number, q?: string) : number {
        const stmt = this.app.db.prepare(`
            SELECT COUNT(*) as total
            FROM friends f
            JOIN users u ON f.friendId = u.id
            WHERE f.userId = ?
            AND u.username LIKE ? COLLATE NOCASE`);
        const result = stmt.get(userId, `%${q ?? ''}%`) as { total: number };
        return result ? result.total : 0;
    }
}