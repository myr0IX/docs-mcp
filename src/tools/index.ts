import Database from "better-sqlite3";
import { registerSearchTool } from "./search.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// A tool registration function takes a server and a db
// and registers itself on the server
export type ToolRegistrar = (server: McpServer, db: Database.Database) => void;

export const toolRegistrars: ToolRegistrar[] = [registerSearchTool];
