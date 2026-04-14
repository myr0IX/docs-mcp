# Architecture

## Overview

docs-mcp is a local MCP server that indexes Markdown files and exposes a full-text search tool over the Model Context Protocol.

```
your project/
├── docs/                    ← your Markdown files (path is configurable)
├── .docs-index/             ← SQLite database (gitignored)
├── docs-mcp.config.json     ← docs-mcp configuration (committed)
└── .mcp.json                ← MCP client configuration (committed)
```

## Configuration

`docs-mcp.config.json` is created by `init` and stores the docs path:

```json
{
  "docs": "./docs"
}
```

`start` and `index` read this file automatically when no `--docs` flag is passed. This means `.mcp.json` only needs `["@myr0ix/docs-mcp", "start"]` — no path argument required.

## How indexing works

When `start` or `index` runs, it:

1. Scans the docs folder recursively for `.md` files.
2. Parses each file into chunks split by headings.
3. Wipes the previous index (`DELETE FROM chunks_fts`).
4. Inserts all new chunks into the SQLite FTS5 table in a single transaction.

Each chunk stores:
- `source` — relative file path
- `heading` — the heading under which the content appears
- `content` — the text content of that section

## How search works

The `search_docs` MCP tool runs a SQLite FTS5 `MATCH` query against the indexed chunks. Results are ranked by relevance using the built-in FTS5 rank function.

Each call also writes a row to the `stats` table in SQLite, recording: timestamp, query, number of chunks sent, estimated tokens sent, estimated tokens for the full source files, and response time.

## Transport

The MCP server communicates over **stdio** (standard input/output). The MCP client (e.g. Claude Code) spawns the process and exchanges JSON-RPC 2.0 messages on stdin/stdout.

**stdout is reserved for the MCP protocol.** Any write to stdout would corrupt the JSON-RPC stream. All internal logs use stderr via the `logger` utility (`src/utils/logger.ts`).

## Index location

The SQLite database is stored in `.docs-index/` relative to the **parent directory** of the docs folder.

| Docs path | Index location |
|-----------|---------------|
| `./docs` | `./.docs-index/` |
| `./wiki` | `./.docs-index/` |
| `./packages/app/docs` | `./packages/app/.docs-index/` |

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
    ├── args.ts             ← centralized CLI argument parsing
    ├── config.ts           ← reads/writes docs-mcp.config.json
    ├── logger.ts           ← stderr-safe logger
    ├── parse-markdown.ts   ← markdown to chunks
    ├── get-all-markdown-files.ts
    └── estimate-tokens.ts
```
