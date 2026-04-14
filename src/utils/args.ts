import { parseArgs } from "node:util";

export function parseCliArgs() {
  const { values } = parseArgs({
    allowPositionals: true,
    options: {
      docs: { type: "string", short: "d" },
    },
  });

  return { docsArg: values.docs };
}
