import path from "node:path";
import { createDb } from "../db/db.js";
import { indexDocs } from "../indexer.js";
import { parseCliArgs } from "../utils/args.js";
import { type Command } from "./types.js";

export const indexCommand: Command = {
  description: "Index (or re-index) the docs folder",
  run() {
    const { docsPath } = parseCliArgs();
    const indexPath = path.join(path.dirname(docsPath), ".docs-index");
    const db = createDb(indexPath);
    indexDocs(docsPath, db);
  },
};
