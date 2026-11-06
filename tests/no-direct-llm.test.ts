import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";

// Scan executable code/config, including future scripts and CI. Documentation,
// test fixtures and installed/generated files are intentionally outside the guard.
const skipped = new Set(["node_modules", ".git", ".next", "tests"]);
const codeExtension = /\.(?:[cm]?[jt]sx?|py|sh|ps1|ya?ml|json)$/;
const directLLM = /(?:openrouter\.ai|integrate\.api\.nvidia\.com|api\.openai\.com|generativelanguage\.googleapis\.com|api\.anthropic\.com)|\b(?:OPENROUTER|OPENAI|ANTHROPIC|NVIDIA|NIM|GOOGLE|GEMINI)_(?:API_)?KEY\b|(?:from\s*|require\s*\(\s*|import\s*\(\s*)["'](?:openai|@anthropic-ai\/sdk|@google\/(?:generative-ai|genai)|@ai-sdk\/(?:openai|anthropic|google)|@openrouter\/[^"']+)["']/i;

function* codeFiles(dir: string): Generator<string> {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    if (skipped.has(item.name) || item.isSymbolicLink()) continue;
    const file = path.join(dir, item.name);
    if (item.isDirectory()) yield* codeFiles(file);
    else if (codeExtension.test(item.name)) yield file;
  }
}

test("no direct LLM endpoints, provider credentials or default SDKs in executable code", () => {
  const violations: string[] = [];
  let scanned = 0;
  for (const file of codeFiles(process.cwd())) {
    scanned++;
    readFileSync(file, "utf8").split(/\r?\n/).forEach((line, index) => {
      if (directLLM.test(line)) violations.push(`${path.relative(process.cwd(), file)}:${index + 1}`);
    });
  }
  assert.ok(scanned > 50, "Guard must scan the application sources");
  assert.deepEqual(violations, [], `Direct LLM access found at ${violations.join(", ")}`);
});

test("guard detects each known provider plus SDK defaults and provider keys", () => {
  for (const source of [
    'fetch("https://openrouter.ai/api/v1/chat/completions")',
    'fetch("https://integrate.api.nvidia.com/v1/chat/completions")',
    'fetch("https://api.openai.com/v1/responses")',
    'fetch("https://generativelanguage.googleapis.com/v1beta/models")',
    'fetch("https://api.anthropic.com/v1/messages")',
    'import OpenAI from "openai"',
    'const Anthropic = require("@anthropic-ai/sdk")',
    'import { GoogleGenAI } from "@google/genai"',
    'process.env.OPENROUTER_API_KEY',
    'process.env.NIM_API_KEY',
  ]) assert.ok(directLLM.test(source), source);
  assert.equal(directLLM.test('process.env.LLM_GATEWAY_KEY'), false);
});
