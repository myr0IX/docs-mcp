# docs-mcp

A local MCP server that indexes your Markdown documentation and exposes a full-text search tool to any MCP-compatible client (Claude Code, Claude Desktop, etc.).

The index is stored locally in `.docs-index/` (SQLite FTS5). Nothing leaves your machine.

## How it works

1. You run `npx @myr0ix/docs-mcp init` in your project.
2. It creates a `docs/` folder and a `.mcp.json` config file.
3. Your MCP client (e.g. Claude Code) picks up the server via `.mcp.json`.
4. When your AI assistant needs context, it calls the `search_docs` tool to search your docs.

## Installation

```bash
npx @myr0ix/docs-mcp init
```

That's it. This command:

- Creates a `docs/` folder if it doesn't exist.
- Generates a `.mcp.json` pointing to the server.
- Adds `.docs-index/` to your `.gitignore`.

## Usage

Add Markdown files to your `docs/` folder:

```text
docs/
├── architecture.md
├── api.md
└── getting-started.md
```

Your MCP client will call `search_docs` automatically when it needs to look something up.

You can also trigger it explicitly in your assistant, for example:

> "Search the docs for authentication flow"

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
        "description": "Full‑text search query"
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

Results are ranked by relevance and returned as structured text chunks (title, path, snippet, score).

## Requirements

- Node.js >= 18
- An MCP-compatible client (Claude Code, Claude Desktop, or any other MCP host)

See the MCP docs for example clients:  
https://modelcontextprotocol.io/clients

## Under the hood

- Standard Model Context Protocol (MCP) server
- SQLite + FTS5 for local full‑text search
- Written in TypeScript, using `better-sqlite3`, `zod`, and the official MCP TypeScript SDK

## License

MIT
