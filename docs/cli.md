# CLI Reference

docs-mcp exposes three commands via the `docs-mcp` binary.

---

## init

Set up docs-mcp in the current project. Run this once at project setup.

```bash
npx @myr0ix/docs-mcp init [--docs <path>]
```

**Options**

| Flag | Default | Description |
|------|---------|-------------|
| `--docs`, `-d` | `docs` | Path to the docs folder to create and configure |

**What it does**

1. Creates the docs folder if it does not exist.
2. Writes `docs-mcp.config.json` at the project root, storing the docs path.
3. Creates `.mcp.json` so your MCP client can auto-start the server.
4. Adds `.docs-index/` to `.gitignore`.

**Generated files**

`docs-mcp.config.json`:
```json
{
  "docs": "./docs"
}
```

`.mcp.json`:
```json
{
  "mcpServers": {
    "docs": {
      "command": "npx",
      "args": ["@myr0ix/docs-mcp", "start"]
    }
  }
}
```

**Example — custom folder**

```bash
npx @myr0ix/docs-mcp init --docs ./wiki
```

The path is saved to `docs-mcp.config.json`. All subsequent commands (`start`, `index`) will use it without needing `--docs`.

---

## start

Start the MCP server. Indexes the docs folder on startup, then listens on stdio for JSON-RPC requests.

This command is called automatically by the MCP client via `.mcp.json`. You do not need to run it manually in normal usage.

```bash
npx @myr0ix/docs-mcp start [--docs <path>]
```

**Options**

| Flag | Default | Description |
|------|---------|-------------|
| `--docs`, `-d` | *(reads `docs-mcp.config.json`)* | Override the docs path |

**Notes**

- Requires `docs-mcp.config.json` at the current working directory, unless `--docs` is passed.
- The docs folder is re-indexed on every startup.
- All logs go to stderr. stdout is reserved for the MCP JSON-RPC protocol.

---

## index

Manually (re)index the docs folder without starting the server.

```bash
npx @myr0ix/docs-mcp index [--docs <path>]
```

**Options**

| Flag | Default | Description |
|------|---------|-------------|
| `--docs`, `-d` | *(reads `docs-mcp.config.json`)* | Override the docs path |

**When to use it**

`start` already indexes on every startup. Use `index` when you want to refresh the index without restarting the server — for example after adding many files while the server is not running, or to verify indexing works before the first `start`.
