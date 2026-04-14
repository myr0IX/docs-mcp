# docs-mcp

A local MCP server that indexes your Markdown documentation and exposes a full-text search tool to any MCP-compatible client (Claude Code, Claude Desktop, etc.).

The index is stored locally in `.docs-index/` (SQLite FTS5). Nothing leaves your machine.

## How it works

1. Run `npx @myr0ix/docs-mcp init` in your project — creates the docs folder and `.mcp.json`.
2. Add Markdown files to your docs folder.
3. Your MCP client picks up the server via `.mcp.json` and launches it automatically.
4. When your AI assistant needs context, it calls the `search_docs` tool.

## Quick start

```bash
npx @myr0ix/docs-mcp init
```

This command:

- Creates a `docs/` folder (or the path you specify with `--docs`).
- Generates a `.mcp.json` pointing to the MCP server.
- Adds `.docs-index/` to your `.gitignore`.

Custom docs folder:

```bash
npx @myr0ix/docs-mcp init --docs ./documentation
```

## CLI commands

### `init`

Set up docs-mcp in the current project.

```bash
npx @myr0ix/docs-mcp init [--docs <path>]
```

| Option | Default | Description |
|--------|---------|-------------|
| `--docs`, `-d` | `docs` | Path to the docs folder to create and configure |

### `start`

Start the MCP server. Called automatically by your MCP client via `.mcp.json`.

```bash
npx @myr0ix/docs-mcp start --docs <path>
```

| Option | Required | Description |
|--------|----------|-------------|
| `--docs`, `-d` | yes | Path to the docs folder to index and serve |

### `index`

Manually (re)index a docs folder without starting the server. Useful after bulk edits.

```bash
npx @myr0ix/docs-mcp index --docs <path>
```

| Option | Required | Description |
|--------|----------|-------------|
| `--docs`, `-d` | yes | Path to the docs folder to index |

## The `search_docs` tool

```json
{
  "name": "search_docs",
  "description": "Full-text search over your local Markdown documentation",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Full-text search query"
      },
      "limit": {
        "type": "number",
        "minimum": 1,
        "maximum": 20,
        "default": 5,
        "description": "Number of chunks to return"
      }
    },
    "required": ["query"]
  }
}
```

Results are ranked by relevance and returned as structured text chunks (heading, source path, content).

## Requirements

- Node.js >= 18
- An MCP-compatible client (Claude Code, Claude Desktop, or any other MCP host)

See the MCP docs for example clients:  
https://modelcontextprotocol.io/clients

## Under the hood

- Standard Model Context Protocol (MCP) over stdio
- SQLite + FTS5 for local full-text search
- Written in TypeScript, using `better-sqlite3`, `zod`, and the official MCP TypeScript SDK

## License

MIT
