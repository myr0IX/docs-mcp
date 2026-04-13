import { InsertChunk } from "../schema.js";
import fs from "node:fs";
import path from "node:path";

const HEADING_REGEX = /^(#{1,6})\s+(.+)/;

export function parseMarkdown(filePath: string): InsertChunk[] {
  const source = path.basename(filePath);
  const text = fs.readFileSync(filePath, "utf-8");

  const lines = text.split("\n");
  const chunks: InsertChunk[] = [];

  const hierarchy: string[] = [];
  let currentContent: string[] = [];

  function saveChunk() {
    const content = currentContent.join("\n").trim();
    if (content.length === 0) return null;

    const heading = hierarchy.join(" > ") || `${source} > Introduction`;

    chunks.push({
      source,
      heading,
      content,
    });

    currentContent = [];
  }

  for (const line of lines) {
    const headingMatch = line.match(HEADING_REGEX);

    if (headingMatch) {
      saveChunk();

      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      hierarchy.splice(level - 1); // Remove deeper levels
      hierarchy[level - 1] = title; // Set current level
    } else {
      currentContent.push(line);
    }
  }

  saveChunk();
  return chunks;
}
