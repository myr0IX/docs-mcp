import { type Command } from "./types.js";
import { initCommand } from "./init.js";

export const commands: Record<string, Command> = {
  init: initCommand,
};
