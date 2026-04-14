import fs from "node:fs";
import path from "node:path";
import { z } from "zod/v4";

const CONFIG_FILE = "docs-mcp.config.json";

const DocsMcpConfigSchema = z.object({
  docs: z.string(),
});

type DocsMcpConfig = z.infer<typeof DocsMcpConfigSchema>;

export function readConfig(): DocsMcpConfig | null {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  if (!fs.existsSync(configPath)) {
    return null;
  }
  const raw = fs.readFileSync(configPath, "utf-8");
  return DocsMcpConfigSchema.parse(JSON.parse(raw));
}

export function writeConfig(config: DocsMcpConfig): void {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}
