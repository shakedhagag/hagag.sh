import { transformerNotationWordHighlight } from "@shikijs/transformers";
import type { ShikiTransformer } from "shiki";

type Commands = {
  bun: string;
  npm: string;
  pnpm: string;
  yarn: string;
};

export function getPackageManagerCommands(rawCommand: string): Commands | null {
  const raw = rawCommand.trim();

  if (raw.startsWith("npm install")) {
    return {
      bun: raw.replace("npm install", "bun add"),
      npm: raw,
      pnpm: raw.replace("npm install", "pnpm add"),
      yarn: raw.replace("npm install", "yarn add"),
    };
  }

  if (raw.startsWith("npx create-")) {
    return {
      bun: raw.replace("npx", "bunx --bun"),
      npm: raw,
      pnpm: raw.replace("npx create-", "pnpm create "),
      yarn: raw.replace("npx create-", "yarn create "),
    };
  }

  if (raw.startsWith("npm create")) {
    return {
      bun: raw.replace("npm create", "bun create"),
      npm: raw,
      pnpm: raw.replace("npm create", "pnpm create"),
      yarn: raw.replace("npm create", "yarn create"),
    };
  }

  if (raw.startsWith("npx")) {
    return {
      bun: raw.replace("npx", "bunx --bun"),
      npm: raw,
      pnpm: raw.replace("npx", "pnpm dlx"),
      yarn: raw.replace("npx", "yarn dlx"),
    };
  }

  if (raw.startsWith("npm run")) {
    return {
      bun: raw.replace("npm run", "bun"),
      npm: raw,
      pnpm: raw.replace("npm run", "pnpm"),
      yarn: raw.replace("npm run", "yarn"),
    };
  }

  return null;
}

export const markdownCodeTransformers = [
  {
    code(node) {
      if (node.tagName !== "code") {
        return;
      }

      const raw = this.source;
      node.properties.__raw__ = raw;
      node.properties["data-line-numbers"] = "";

      const commands = getPackageManagerCommands(raw);

      if (!commands) {
        return;
      }

      node.properties.__npm__ = commands.npm;
      node.properties.__yarn__ = commands.yarn;
      node.properties.__pnpm__ = commands.pnpm;
      node.properties.__bun__ = commands.bun;
    },
  },
  transformerNotationWordHighlight(),
] as Array<ShikiTransformer>;
