# docs-mcp

A local MCP server that indexes your Markdown documentation and exposes a full-text search tool to any MCP-compatible client (Claude Code, Claude Desktop, etc.).

The index is stored locally in `.docs-index/` (SQLite FTS5). Nothing leaves your machine.

## How it works

1. Run `npx @myr0ix/docs-mcp init` in your project — creates the docs folder, `docs-mcp.config.json`, and `.mcp.json`.
2. Add Markdown files to your docs folder.
3. Your MCP client picks up the server via `.mcp.json` and launches it automatically.
4. When your AI assistant needs context, it calls the `search_docs` tool.

## Quick start

```bash
npx @myr0ix/docs-mcp init
```

This command:

- Creates a `docs/` folder (or the path you specify with `--docs`).
- Saves the docs path to `docs-mcp.config.json` at the project root.
- Generates a `.mcp.json` so your MCP client can auto-start the server.
- Adds `.docs-index/` to your `.gitignore`.

Custom docs folder:

```bash
npx @myr0ix/docs-mcp init --docs ./wiki
```

The path is saved once. You never need to specify it again.

## CLI commands

### `init`

Set up docs-mcp in the current project. Run once.

```bash
npx @myr0ix/docs-mcp init [--docs <path>]
```

| Option | Default | Description |
|--------|---------|-------------|
| `--docs`, `-d` | `docs` | Path to the docs folder to create and configure |

### `start`

Start the MCP server. Called automatically by your MCP client via `.mcp.json`.

```bash
npx @myr0ix/docs-mcp start
```

Reads the docs path from `docs-mcp.config.json`. Pass `--docs <path>` to override.

### `index`

Manually re-index the docs folder without restarting the server.

```bash
npx @myr0ix/docs-mcp index
```

Reads the docs path from `docs-mcp.config.json`. Pass `--docs <path>` to override.

## The `search_docs` tool

The MCP tool exposed to your AI assistant:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | yes | Full-text search query |
| `limit` | number (1–20) | no | Number of chunks to return (default: 5) |

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
