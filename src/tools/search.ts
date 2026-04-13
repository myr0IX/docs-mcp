import { z } from "zod/v4";
import Database from "better-sqlite3";
import { searchChunks, estimateFullTokens } from "../indexer.js";
import { estimateTokens } from "../utils/estimate-tokens.js";
import { type ToolRegistrar } from "./index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const registerSearchTool: ToolRegistrar = (
  server: McpServer,
  db: Database.Database,
) => {
  server.registerTool(
    "search_docs",
    {
      description: `Search the project documentation using full-text search.
      Use this tool BEFORE reading any .md file directly.
      Returns the most relevant documentation chunks for a given query.
      Prefer specific terms over vague ones (e.g. "JWT authentication" over "auth").`,
      inputSchema: z.object({
        query: z
          .string()
          .describe(
            "The search query. Use specific technical terms for better results. Example: 'JWT token expiration'",
          ),
        limit: z
          .number()
          .int()
          .min(1)
          .max(20)
          .default(5)
          .describe("Number of results to return"),
      }),
    },
    async ({ query, limit }) => {
      const chunks = searchChunks(query, db, limit);

      if (chunks.length === 0) {
        return {
          content: [
            {
              type: "text" as const,
              text: `No results found for "${query}". Try different terms.`,
            },
          ],
        };
      }

      const tokensSent = chunks.reduce(
        (acc, c) => acc + estimateTokens(c.content),
        0,
      );
      const tokensFull = estimateFullTokens(chunks, db);

      db.prepare(
        `
        INSERT INTO stats (timestamp, query, chunks_sent, tokens_sent, tokens_full, response_ms)
        VALUES (@timestamp, @query, @chunks_sent, @tokens_sent, @tokens_full, @response_ms)
      `,
      ).run({
        timestamp: new Date().toISOString(),
        query,
        chunks_sent: chunks.length,
        tokens_sent: tokensSent,
        tokens_full: tokensFull,
        response_ms: 0,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: chunks
              .map(
                (c) =>
                  `### ${c.heading}\n*source: ${c.source}*\n\n${c.content}`,
              )
              .join("\n\n---\n\n"),
          },
        ],
      };
    },
  );
};
