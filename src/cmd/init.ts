import fs from "node:fs";
import path from "node:path";
import { type Command } from "./types.js";

export const initCommand: Command = {
  description: "Initialize docs-mcp in the current project",
  run() {
    const cwd = process.cwd();
    const docsDir = path.join(cwd, "docs");
    const mcpFile = path.join(cwd, ".mcp.json");
    const gitignore = path.join(cwd, ".gitignore");

    if (fs.existsSync(docsDir)) {
      console.log("docs/ folder already exists, skipping.");
    } else {
      fs.mkdirSync(docsDir);
      console.log("Created docs/");
    }

    if (fs.existsSync(mcpFile)) {
      console.log(".mcp.json already exists, skipping.");
    } else {
      const config = {
        mcpServers: {
          docs: {
            command: "npx",
            args: ["@myr0ix/docs-mcp", "--docs", "./docs"],
          },
        },
      };
      fs.writeFileSync(mcpFile, JSON.stringify(config, null, 2));
      console.log("Created .mcp.json");
    }

    if (fs.existsSync(gitignore)) {
      const content = fs.readFileSync(gitignore, "utf-8");
      if (content.includes(".docs-index")) {
        console.log(".gitignore already contains .docs-index/, skipping.");
      } else {
        fs.appendFileSync(gitignore, "\n# docs-mcp\n.docs-index/\n");
        console.log("Added .docs-index/ to .gitignore");
      }
    } else {
      fs.writeFileSync(gitignore, "# docs-mcp\n.docs-index/\n");
      console.log("Created .gitignore with .docs-index/");
    }

    console.log(
      "\ndocs-mcp initialized. Add your documentation to docs/ and start Claude Code.",
    );
  },
};
