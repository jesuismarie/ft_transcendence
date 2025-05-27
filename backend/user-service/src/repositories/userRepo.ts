import { FastifyInstance } from 'fastify';
import { UserTypes } from '@ft-transcendence/api-types';
import {UserView} from "@ft-transcendence/api-types/dist/user-types";


// This is not a view model, but a repository interface for user data.
export interface User {
	id:				number,
	email:			string;
	passwordHash?:	string;
	authProvider?:	string;
	providerSub?:	string;
	username:		string;
	avatarPath:		string | null;
	createdAt:		Date;
}

interface UserRepoInterface {
	create(email: string, username: string, passwordHash: string): User | null;
	findByEmail(email: string): User | null;
	findById(id: number): User | null;
	findByUsername(username: string): User | null;
	findAll({ offset, limit, q }: UserTypes.PaginationQuery): User[];
	update(
		id: number,
		fields: {
			username?: string;
			email?: string;
			passwordHash?: string;
			avatarPath?: string;
		},
	): boolean
	delete(id: number): number;
	toView(user: User): UserTypes.UserView;
}

export class UserRepo implements UserRepoInterface {
	private app: FastifyInstance;
	constructor(app: FastifyInstance) {
		this.app = app;
	}
	
	create(email: string, username: string, passwordHash: string, authProvider?: string, providerSub?: string): User | null {
		const stmt = this.app.db.prepare(
			'INSERT INTO users (email, passwordHash, authProvider, providerSub, username) VALUES (?,?,?,?,?)'
		);
		const info = stmt.run(email, passwordHash, authProvider, providerSub, username);
		return this.findById(info.lastInsertRowid as number);
	}
	
	findByEmail(email: string): User | null {
		const stmt = this.app.db.prepare(`
            SELECT id, email, passwordHash, authProvider, providerSub, username, avatarPath, createdAt
            FROM users
            WHERE email = ?`);
		return stmt.get(email) as User ?? null;
	}
	
	findById(id: number): User | null {
		const stmt = this.app.db.prepare(`
            SELECT id, email, passwordHash, authProvider, providerSub, username, avatarPath, createdAt
            FROM users
            WHERE id = ?`);
		return stmt.get(id) as User ?? null;
	}
	
	findByUsername(username: string): User | null {
		const stmt = this.app.db.prepare(`
            SELECT id, email, passwordHash, authProvider, providerSub, username, avatarPath, createdAt
            FROM users
            WHERE username = ? COLLATE NOCASE`);
		return stmt.get(username) as User ?? null;
	}
	
	findAll({ offset, limit, q }: UserTypes.PaginationQuery): User[] {
		const stmt = this.app.db.prepare(`
			SELECT id, email, passwordHash, authProvider, providerSub, username, avatarPath, createdAt
			FROM users
			WHERE username LIKE ? COLLATE NOCASE
			ORDER BY username COLLATE NOCASE
			LIMIT ? OFFSET ?`);
		return stmt.all(`%${q ?? ''}%`, limit, offset) as User[];
	}
	
	update(
		id: number,
		fields: {
			username?: string;
			email?: string;
			passwordHash?: string;
			avatarPath?: string;
		},
	): boolean
	{
		const updates: string [] = [];
		const vals: any[] = [];
		
		if (fields.username) 	{ updates.push('username = ?'); vals.push(fields.username); }
		if (fields.email)       { updates.push('email = ?');       vals.push(fields.email); }
		if (fields.passwordHash){ updates.push('passwordHash = ?'); vals.push(fields.passwordHash); }
		if (fields.avatarPath)  { updates.push('avatarPath = ?'); vals.push(fields.avatarPath);     }
		
		if (updates.length === 0)
			return false;
		
		vals.push(id);                                // WHERE id = ?
		const stmt = this.app.db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`);
		return (stmt.run(...vals).changes > 0);
	}
	
	delete(id: number) {
		return this.app.db.prepare('DELETE FROM users WHERE id = ?').run(id).changes;
	}
	
	toView(user: User): UserView {
		return {
			id: user.id,
			email: user.email,
			username: user.username,
			avatarPath: user.avatarPath,
			wins: 0,
			losses: 0,
			online: false
		};
	}
}