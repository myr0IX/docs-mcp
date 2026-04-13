import { parseArgs } from "node:util";
import path from "node:path";

export type Args = {
  docsPath: string;
};

export function parseCliArgs(): Args {
  const { values } = parseArgs({
    options: {
      docs: {
        type: "string",
        short: "d",
      },
    },
  });

  if (!values.docs) {
    console.error("Usage: docs-mcp --docs <path-to-docs>");
    process.exit(1);
  }

  return {
    docsPath: path.resolve(values.docs),
  };
}
