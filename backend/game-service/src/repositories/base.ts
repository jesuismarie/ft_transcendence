import type { FastifyInstance } from "fastify";
import type { Database, Transaction } from "better-sqlite3";

export class BaseRepo {
  protected app: FastifyInstance & { db: Database };
  protected db: Database;

  constructor(app: FastifyInstance & { db: Database }) {
    this.app = app;
    this.db = app.db;
  }

  protected useTx(tx?: Database | Transaction): Database | Transaction {
    return tx ?? this.db;
  }
}
