import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";

export function createDb(docsIndexPath: string): Database.Database {
  fs.mkdirSync(docsIndexPath, { recursive: true });

  const db = new Database(path.join(docsIndexPath, "index.db"));
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
      source,
      heading,
      content,
      tokenize = 'porter unicode61'
    );

    CREATE TABLE IF NOT EXISTS stats (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp   TEXT    NOT NULL,
      query       TEXT    NOT NULL,
      chunks_sent INTEGER NOT NULL,
      tokens_sent INTEGER NOT NULL,
      tokens_full INTEGER NOT NULL,
      response_ms INTEGER NOT NULL
    );
  `);

  return db;
}
