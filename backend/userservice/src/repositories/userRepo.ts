import { FastifyInstance } from 'fastify';

export interface User {
    id: number;
    email: string;
    displayName: string;
    rating: number;
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

    findByEmail(email: string): User | null {
        const stmt = this.app.db.prepare(`
            SELECT id, email, displayName, avatarPath, rating, createdAt
            FROM users
            WHERE email = ?`);
        return (stmt.get(email) as User | undefined) ?? null;
    }

    findById(id: number): User | null {
        const stmt = this.app.db.prepare(`
            SELECT id, email, displayName, avatarPath, rating, createdAt
            FROM users
            WHERE id = ?`);
        return (stmt.get(id) as User | undefined) ?? null;
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

    update(
        id: number,
        fields: {
            displayName?: string;
            email?: string;
        },
    ) {
        const updates: string [] = [];
        const vals: any[] = [];
        
        if (fields.displayName) { updates.push('displayName = ?'); vals.push(fields.displayName);   }
        if (fields.email)       { updates.push('email = ?');       vals.push(fields.email);         }
        
        if (updates.length === 0)
            return ({"modified": false, "body": this.findById(id)});
        
        vals.push(id);                                // WHERE id = ?
        const stmt = this.app.db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
        return ({
            "modified": (stmt.run(...vals).changes > 0),
            "body": this.findById(id)
        });
    }
    
    delete(id: number) {
        return this.app.db.prepare('DELETE FROM users WHERE id = ?').run(id).changes;
    }
}