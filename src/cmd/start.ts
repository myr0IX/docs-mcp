import path from "node:path";
import { createDb } from "../db/db.js";
import { indexDocs } from "../indexer.js";
import { startMcpServer } from "../server.js";
import { parseCliArgs } from "../utils/args.js";
import { readConfig } from "../utils/config.js";
import { logger } from "../utils/logger.js";
import { type Command } from "./types.js";

export const startCommand: Command = {
  description: "Start the MCP server for a docs folder",
  async run() {
    const { docsArg } = parseCliArgs();
    const docsFolder = docsArg ?? readConfig()?.docs;

    if (!docsFolder) {
      logger.error(
        "No docs path found. Run `docs-mcp init` first, or pass --docs <path>.",
      );
      process.exit(1);
    }

    const docsPath = path.resolve(docsFolder);
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
