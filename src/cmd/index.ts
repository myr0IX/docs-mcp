import { type Command } from "./types.js";
import { initCommand } from "./init.js";
import { startCommand } from "./start.js";
import { indexCommand } from "./index-docs.js";

export const commands: Record<string, Command> = {
  init: initCommand,
  start: startCommand,
  index: indexCommand,
};
