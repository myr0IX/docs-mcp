import { z } from "zod/v4";
import Database from "better-sqlite3";

export const InsertStatSchema = z.object({
  query: z.string(),
  chunks_sent: z.number().int(),
  tokens_sent: z.number().int(),
  tokens_full: z.number().int(),
  response_ms: z.number().int(),
});

export const AggregatedStatsSchema = z.object({
  total_queries: z.number().int(),
  total_tokens_sent: z.number().int(),
  total_tokens_full: z.number().int(),
  avg_response_ms: z.number(),
});

export type InsertStat = z.infer<typeof InsertStatSchema>;
export type AggregatedStats = z.infer<typeof AggregatedStatsSchema>;

export function insertStat(db: Database.Database, stat: InsertStat): void {
  InsertStatSchema.parse(stat);

  db.prepare(
    `
    INSERT INTO stats (timestamp, query, chunks_sent, tokens_sent, tokens_full, response_ms)
    VALUES (@timestamp, @query, @chunks_sent, @tokens_sent, @tokens_full, @response_ms)
  `,
  ).run({
    timestamp: new Date().toISOString(),
    ...stat,
  });
}

export function getAggregatedStats(db: Database.Database): AggregatedStats {
  const row = db
    .prepare(
      `
    SELECT
      COUNT(*)         AS total_queries,
      SUM(tokens_sent) AS total_tokens_sent,
      SUM(tokens_full) AS total_tokens_full,
      AVG(response_ms) AS avg_response_ms
    FROM stats
  `,
    )
    .get();

  return AggregatedStatsSchema.parse(row);
}
