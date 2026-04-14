# Architecture

## Overview

docs-mcp is a local MCP server that indexes Markdown files and exposes a full-text search tool over the Model Context Protocol.

```
your project/
├── docs/              ← your Markdown files
├── .docs-index/       ← SQLite database (gitignored)
└── .mcp.json          ← MCP client configuration
```

## How indexing works

When `start` or `index` runs, it:

1. Scans the docs folder recursively for `.md` files.
2. Parses each file into chunks split by headings.
3. Inserts all chunks into a SQLite FTS5 table (`chunks_fts`).
4. The previous index is wiped before each full re-index.

Each chunk stores:
- `source` — relative file path
- `heading` — the heading under which the content appears
- `content` — the text content of that section

## How search works

The `search_docs` MCP tool runs a SQLite FTS5 `MATCH` query against the indexed chunks. Results are ranked by relevance using the built-in FTS5 rank function and returned as structured objects.

## Transport

The MCP server communicates over **stdio** (standard input/output). The MCP client (e.g. Claude Code) spawns the process and exchanges JSON-RPC 2.0 messages on stdin/stdout.

**stdout is reserved for the MCP protocol.** Any accidental write to stdout (e.g. a `console.log`) would corrupt the JSON-RPC stream and break the connection. All internal logs use stderr via the `logger` utility (`src/utils/logger.ts`).

## Project structure

```
src/
├── cli.ts                  ← binary entry point, command dispatcher
├── server.ts               ← MCP server setup, exports startMcpServer()
├── indexer.ts              ← markdown indexing and FTS search logic
├── schema.ts               ← Zod schemas for DB rows
├── cmd/
│   ├── index.ts            ← command registry
│   ├── init.ts             ← init command
│   ├── start.ts            ← start command
│   ├── index-docs.ts       ← index command
│   └── types.ts            ← Command type
├── db/
│   ├── db.ts               ← SQLite connection and table setup
│   └── schemas/            ← table schemas
├── tools/
│   └── search.ts           ← search_docs MCP tool definition
└── utils/
    ├── args.ts             ← CLI argument parsing
    ├── logger.ts           ← stderr-safe logger
    ├── parse-markdown.ts   ← markdown to chunks
    ├── get-all-markdown-files.ts
    └── estimate-tokens.ts
```

## Index location

The SQLite database is stored at `.docs-index/` relative to the parent of the docs folder.

For `--docs ./docs`, the index is at `./.docs-index/`.  
For `--docs ./packages/app/docs`, the index is at `./packages/app/.docs-index/`.
