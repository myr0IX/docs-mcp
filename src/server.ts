import path from "node:path";
import { createRequire } from "node:module";
import { createDb } from "./db/db.js";
import { indexDocs } from "./indexer.js";
import { parseCliArgs } from "./utils/args.js";
import Database from "better-sqlite3";
import { toolRegistrars } from "./tools/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import z from "zod/v4";

const require = createRequire(import.meta.url);
const { version } = z.object({ version: z.string() }).parse(require("../package.json"));

async function startServer(db: Database.Database): Promise<void> {
  const server = new McpServer({
    name: "docs-mcp",
    version,
  });

  toolRegistrars.forEach((register) => register(server, db));

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP-DOCS Server running on stdio");
}

async function main() {
  const { docsPath } = parseCliArgs();
  const indexPath = path.join(path.dirname(docsPath), ".docs-index");
  const db = createDb(indexPath);

  try {
    indexDocs(docsPath, db);
  } catch (err) {
    console.error("Indexing error:", err);
    process.exit(1);
  }
  await startServer(db);
}

main().catch((err) => {
  console.error("Error starting MCP server:", err);
  process.exit(1);
});
