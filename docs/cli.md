# CLI Reference

docs-mcp exposes three commands via the `docs-mcp` binary.

## init

Set up docs-mcp in the current project. Run once at project setup.

```bash
npx @myr0ix/docs-mcp init [--docs <path>]
```

**Options**

| Flag | Default | Description |
|------|---------|-------------|
| `--docs`, `-d` | `docs` | Path to the docs folder to create and configure |

**What it does**

- Creates the docs folder if it does not already exist.
- Generates a `.mcp.json` file that points the MCP client to the `start` command.
- Adds `.docs-index/` to `.gitignore`.

**Example — custom folder**

```bash
npx @myr0ix/docs-mcp init --docs ./documentation
```

Generated `.mcp.json`:

```json
{
  "mcpServers": {
    "docs": {
      "command": "npx",
      "args": ["@myr0ix/docs-mcp", "start", "--docs", "./documentation"]
    }
  }
}
```

---

## start

Start the MCP server. Indexes the docs folder on startup, then listens on stdio for JSON-RPC requests from the MCP client.

This command is called automatically by the MCP client via `.mcp.json`. You do not need to run it manually in normal usage.

```bash
npx @myr0ix/docs-mcp start --docs <path>
```

**Options**

| Flag | Required | Description |
|------|----------|-------------|
| `--docs`, `-d` | yes | Path to the docs folder to index and serve |

**Notes**

- The docs folder is re-indexed on every startup.
- All logs go to stderr. stdout is reserved for the MCP JSON-RPC protocol.

---

## index

Manually (re)index a docs folder without starting the server.

```bash
npx @myr0ix/docs-mcp index --docs <path>
```

**Options**

| Flag | Required | Description |
|------|----------|-------------|
| `--docs`, `-d` | yes | Path to the docs folder to index |

**When to use it**

The `start` command already indexes on startup. Use `index` when you want to refresh the index without restarting — for example after adding many files while the server is not running, or to verify that indexing works before the first `start`.
