#!/usr/bin/env node

import { parseArgs } from "node:util";
import { commands } from "./cmd/index.js";

const { positionals } = parseArgs({
  allowPositionals: true,
});

const commandName = positionals[0];

if (!commandName) {
  console.log("Available commands:");
  Object.entries(commands).forEach(([name, cmd]) => {
    console.log(`  ${name.padEnd(10)} ${cmd.description}`);
  });
  process.exit(0);
}

const command = commands[commandName];

if (!command) {
  console.error(`Unknown command: "${commandName}"`);
  console.error(`Available commands: ${Object.keys(commands).join(", ")}`);
  process.exit(1);
}

command.run();
