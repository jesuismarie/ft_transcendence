import fp from 'fastify-plugin';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { FastifyInstance } from 'fastify';

export type DB = Database.Database;

export default fp(async function dbPlugin(app: FastifyInstance) {
    // Path either from ENV or default to root/data
    const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'data', 'users.db');
    // Make sure the directory exists
    const dbDir = path.dirname(dbPath);
    fs.mkdirSync(dbDir, { recursive: true });
    const db = new Database(dbPath);
    // Check if the database is new or existing
    const isNewDb = !fs.existsSync(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // If database is new, create with the schema
    if (isNewDb){
        app.log.info('Creating new SQLite DB at:', dbPath);
        const ddl = fs.readFileSync(path.join(__dirname, '../../migrations/schema_v1.sql'), 'utf8');
        db.exec(ddl);
    }
    app.decorate('db', db);

    app.addHook('onClose', (instance, done) => {
        instance.log.info('Closing SQLite DB');
        db.close();
        done();
    });
});

declare module 'fastify' {
    interface FastifyInstance {
        db: DB;
    }
}