import { FastifyInstance } from 'fastify';

export interface User {
    id: number;
    email: string;
    displayName: string;
    createdAt: string;
}

export class UserRepo {
    private app: FastifyInstance;
    constructor(app: FastifyInstance) {
        this.app = app;
    }

    create(email: string, displayName: string, passwordHash: string) {
        const stmt = this.app.db.prepare(
            'INSERT INTO users (email, displayName, passwordHash) VALUES (?,?,?)'
        );
        const info = stmt.run(email, displayName, passwordHash);
        return this.findById(info.lastInsertRowid as number);
    }

    findByEmail(email: string) {
        const stmt = this.app.db.prepare('SELECT * FROM users WHERE email = ?');
        return (stmt.get(email));
    }

    findById(id: number) {
        return this.app.db
            .prepare('SELECT id,email,displayName,createdAt FROM users WHERE id = ?')
            .get(id);
    }
    
    findAll({ offset, limit, q }: { offset: number; limit: number; q?: string }) {
        const stmt = this.app.db.prepare(`
            SELECT id, email, displayName, avatarPath, rating, createdAt
            FROM users
            WHERE displayName LIKE ? COLLATE NOCASE
            ORDER BY displayName COLLATE NOCASE
            LIMIT ? OFFSET ?`);
        return stmt.all(`%${q ?? ''}%`, limit, offset);
    }

    update(id: number, displayName: string) {
        const res = this.app.db
            .prepare('UPDATE users SET displayName = ? WHERE id = ?')
            .run(displayName, id);
        return res.changes > 0 ? this.findById(id) : undefined;
    }

    delete(id: number) {
        return this.app.db.prepare('DELETE FROM users WHERE id = ?').run(id).changes;
    }
}