import path from "node:path";
import { createDb } from "../db/db.js";
import { indexDocs } from "../indexer.js";
import { parseCliArgs } from "../utils/args.js";
import { startMcpServer } from "../server.js";
import { logger } from "../utils/logger.js";
import { type Command } from "./types.js";

export const startCommand: Command = {
  description: "Start the MCP server for a docs folder",
  async run() {
    const { docsPath } = parseCliArgs();
    const indexPath = path.join(path.dirname(docsPath), ".docs-index");
    const db = createDb(indexPath);

    try {
      indexDocs(docsPath, db);
    } catch (err) {
      logger.error(`Indexing error: ${err}`);
      process.exit(1);
    }

    await startMcpServer(db);
  },
};
