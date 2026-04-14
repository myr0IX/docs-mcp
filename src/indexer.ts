import fs from "node:fs";
import Database from "better-sqlite3";
import { InsertChunk, InsertChunkSchema } from "./schema.js";
import { estimateTokens } from "./utils/estimate-tokens.js";
import { parseMarkdown } from "./utils/parse-markdown.js";
import { getAllMarkdownFiles } from "./utils/get-all-markdown-files.js";
import { logger } from "./utils/logger.js";

export function indexDocs(docsPath: string, db: Database.Database): void {
  const files = getAllMarkdownFiles(docsPath);

  if (files.length === 0) {
    logger.error(`No markdown file found in ${docsPath}`);
    return;
  }

  db.exec("DELETE FROM chunks_fts");

  const insert = db.prepare(`
    INSERT INTO chunks_fts (source, heading, content)
    VALUES (@source, @heading, @content)
  `);

  const insertAll = db.transaction((allChunks: InsertChunk[]) => {
    for (const chunk of allChunks) {
      insert.run(chunk);
    }
  });

  const allChunks: InsertChunk[] = [];
  let totalSourceTokens = 0;

  for (const file of files) {
    const fileContent = fs.readFileSync(file, "utf-8");
    totalSourceTokens += estimateTokens(fileContent);
    allChunks.push(...parseMarkdown(file));
  }

  insertAll(allChunks);
}

export function searchChunks(
  query: string,
  db: Database.Database,
  limit: number = 5,
): InsertChunk[] {
  const stmt = db.prepare(`
    SELECT source, heading, content
    FROM chunks_fts
    WHERE chunks_fts MATCH ?
    ORDER BY rank
    LIMIT ?
  `);

  const rows = stmt.all(query, limit);
  return rows.map((row) => InsertChunkSchema.parse(row));
}

export function estimateFullTokens(
  chunks: InsertChunk[],
  db: Database.Database,
): number {
  const sources = [...new Set(chunks.map((c) => c.source))];

  const stmt = db.prepare(`
    SELECT content FROM chunks_fts WHERE source = ?
  `);

  let total = 0;
  for (const source of sources) {
    const rows = stmt.all(source) as { content: string }[];
    total += estimateTokens(rows.map((r) => r.content).join("\n"));
  }

  return total;
}
