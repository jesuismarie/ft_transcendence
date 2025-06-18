import { FastifyInstance } from 'fastify';
import { UserTypes } from '@KarenDanielyan/ft-transcendence-api-types';
import {UserView} from "@KarenDanielyan/ft-transcendence-api-types/dist/user-types";


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
	toView(user: User): Promise<UserTypes.UserView>;
}

export class UserRepo implements UserRepoInterface {
	private app: FastifyInstance;
	constructor(app: FastifyInstance) {
		this.app = app;
	}
	
	create(email: string, username: string, passwordHash: string | null, authProvider?: string, providerSub?: string): User | null {
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

	getUsersTotalCount(q?: string): number {
		const stmt = this.app.db.prepare(`
			SELECT COUNT(*) as count
			FROM users
			WHERE username LIKE ? COLLATE NOCASE`);
		const result = stmt.get(`%${q ?? ''}%`) as { count: number };
		return result.count;
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
	
	async toView(user: User): Promise<UserView> {
		// avatarURL is domain name + user.avatarPath
		// Assuming the avatarPath is a relative path, we can construct the full URL.
		let wins = 0, losses = 0, online = false, twofaEnabled = false;
		try {
			console.log('Reached game service to get gamestats for user', user.id);
			const res = await this.app.gameService.getGamestats({ Params: { user: user.id.toString() } });
			wins = res.wins;
			losses = res.losses;
		}
		catch (err) {
			console.error('Error fetching gamestats for user:', user.username, err);
			wins = 0;
			losses = 0;
		}
		try {
			console.log(`Is user ${user.id} online?`, this.app.isUserOnline(user.id));
			online = this.app.isUserOnline(user.id);
		}
		catch (err) { console.error(err) }
		const avatarURL = user.avatarPath ? `${process.env.PROXY_SERVICE_URL}/user-service${user.avatarPath}` : null;
		return {
			id: user.id,
			email: user.email,
			username: user.username,
			avatarPath: avatarURL,
			wins,
			losses,
			online,
			twofaEnabled,
		};
	}
	toQuickView(user: User): UserTypes.QuickUserResponse {
		const avatarURL = user.avatarPath ? `${process.env.PROXY_SERVICE_URL}/user-service${user.avatarPath}` : null;
		return {
			id: user.id,
			username: user.username,
			avatarPath: avatarURL,
		};
	}
}