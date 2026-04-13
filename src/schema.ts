import z from "zod/v4";

export const ChunkSchema = z.object({
  id: z.string(),
  source: z.string(),
  heading: z.string(),
  content: z.string(),
});

export type Chunk = z.infer<typeof ChunkSchema>;

export const InsertChunkSchema = z.object({
  source: z.string(),
  heading: z.string(),
  content: z.string(),
});

export type InsertChunk = z.infer<typeof InsertChunkSchema>;

export const SearchStatSchema = z.object({
  query: z.string(),
  chunks_sent: z.number().int(),
  tokens_sent: z.number().int(),
  tokens_full: z.number().int(),
  response_ms: z.number().int(),
});

export type SearchStat = z.infer<typeof SearchStatSchema>;
