# docs-mcp

A local MCP server that indexes your Markdown documentation and exposes a full-text search tool to Claude.

## How it works

1. You run `npx docs-mcp init` in your project
2. It creates a `docs/` folder and a `.mcp.json` config file
3. Claude Code picks up the server automatically via `.mcp.json`
4. When you ask Claude a question, it uses the `search_docs` tool to search your docs

The index is stored locally in `.docs-index/` (SQLite FTS5 with a Porter stemmer). Nothing leaves your machine.

## Installation

```bash
npx docs-mcp init
```

That's it. This command:
- Creates a `docs/` folder if it doesn't exist
- Generates a `.mcp.json` pointing to the server
- Adds `.docs-index/` to your `.gitignore`

## Usage

Add Markdown files to your `docs/` folder:

```
docs/
├── architecture.md
├── api.md
└── getting-started.md
```

Claude will call `search_docs` automatically when it needs to look something up.

You can also call it explicitly:

> "Search the docs for authentication flow"

## The `search_docs` tool

| Parameter | Type   | Default | Description              |
|-----------|--------|---------|--------------------------|
| `query`   | string | —       | Full-text search query   |
| `limit`   | number | `5`     | Number of chunks returned (1–20) |

Results are ranked by relevance and returned as structured text chunks.

## Requirements

- Node.js >= 18
- Claude Code (or any MCP-compatible client)

## License

MIT
