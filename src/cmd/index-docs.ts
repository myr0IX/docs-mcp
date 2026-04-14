import path from "node:path";
import { createDb } from "../db/db.js";
import { indexDocs } from "../indexer.js";
import { parseCliArgs } from "../utils/args.js";
import { readConfig } from "../utils/config.js";
import { type Command } from "./types.js";

export const indexCommand: Command = {
  description: "Index (or re-index) the docs folder",
  run() {
    const { docsArg } = parseCliArgs();
    const docsFolder = docsArg ?? readConfig()?.docs;

    if (!docsFolder) {
      console.error(
        "No docs path found. Run `docs-mcp init` first, or pass --docs <path>.",
      );
      process.exit(1);
    }

    const docsPath = path.resolve(docsFolder);
    const indexPath = path.join(path.dirname(docsPath), ".docs-index");
    const db = createDb(indexPath);
    indexDocs(docsPath, db);
  },
};
