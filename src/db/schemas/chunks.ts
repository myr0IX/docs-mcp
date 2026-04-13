import { z } from "zod/v4";
import Database from "better-sqlite3";

export const ChunkSchema = z.object({
  id: z.number().int(),
  source: z.string(),
  heading: z.string(),
  content: z.string(),
});

export const InsertChunkSchema = z.object({
  source: z.string(),
  heading: z.string(),
  content: z.string(),
});

export type Chunk = z.infer<typeof ChunkSchema>;
export type InsertChunk = z.infer<typeof InsertChunkSchema>;

export function searchChunks(
  db: Database.Database,
  query: string,
  limit: number = 5,
): InsertChunk[] {
  const rows = db
    .prepare(
      `
    SELECT source, heading, content
    FROM chunks_fts
    WHERE chunks_fts MATCH ?
    ORDER BY rank
    LIMIT ?
  `,
    )
    .all(query, limit);

  return rows.map((row) => InsertChunkSchema.parse(row));
}

export function estimateFullTokens(
  db: Database.Database,
  chunks: InsertChunk[],
  estimateFn: (text: string) => number,
): number {
  const sources = [...new Set(chunks.map((c) => c.source))];
  const stmt = db.prepare(`
    SELECT content FROM chunks_fts WHERE source = ?
  `);

  let total = 0;
  for (const source of sources) {
    const rows = stmt.all(source) as { content: string }[];
    total += estimateFn(rows.map((r) => r.content).join("\n"));
  }

  return total;
}
