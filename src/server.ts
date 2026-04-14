import { createRequire } from "node:module";
import Database from "better-sqlite3";
import { toolRegistrars } from "./tools/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { logger } from "./utils/logger.js";
import z from "zod/v4";

const require = createRequire(import.meta.url);
const { version } = z.object({ version: z.string() }).parse(require("../package.json"));

export async function startMcpServer(db: Database.Database): Promise<void> {
  const server = new McpServer({
    name: "docs-mcp",
    version,
  });

  toolRegistrars.forEach((register) => register(server, db));

  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("MCP-DOCS Server running on stdio");
}
