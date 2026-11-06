import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "node:test";
import { callGateway, LLMGatewayError, parseJSONFromAI } from "../src/lib/ai-client";

beforeEach(() => {
  process.env.LLM_GATEWAY_URL = "http://127.0.0.1:4000/llm";
  process.env.LLM_GATEWAY_KEY = "test-consumer-key";
});

afterEach(() => mock.restoreAll());

function success(content = '{"ok":true}') {
  return Response.json({ choices: [{ message: { content }, finish_reason: "stop" }] });
}

for (const base of [
  "http://127.0.0.1:4000/llm",
  "http://127.0.0.1:4000/llm/",
  "https://course.aiadvisoryboard.me/llm/v1/",
]) {
  test(`gateway URL, group, key and JSON mode: ${base}`, async () => {
    process.env.LLM_GATEWAY_URL = base;
    const fetchMock = mock.method(globalThis, "fetch", async (url: Parameters<typeof fetch>[0], init?: RequestInit) => {
      assert.equal(url, `${base.replace(/\/+$/, "").replace(/\/v1$/, "")}/v1/chat/completions`);
      assert.equal(init?.method, "POST");
      assert.equal(new Headers(init?.headers).get("authorization"), "Bearer test-consumer-key");
      assert.equal(init?.redirect, "error");
      assert.ok(init?.signal instanceof AbortSignal);
      assert.deepEqual(JSON.parse(String(init?.body)), {
        model: "nemotron-super",
        messages: [{ role: "system", content: "System" }, { role: "user", content: "Prompt" }],
        max_tokens: 123,
        temperature: 0,
        response_format: { type: "json_object" },
        stream: false,
        reasoning: { enabled: false },
        chat_template_kwargs: { enable_thinking: false },
      });
      return success();
    });
    assert.equal(await callGateway({ prompt: "Prompt", systemPrompt: "System", maxTokens: 123, temperature: 0 }), '{"ok":true}');
    assert.equal(fetchMock.mock.callCount(), 1);
  });
}

test("gateway defaults and user-only message", async () => {
  mock.method(globalThis, "fetch", async (_url: Parameters<typeof fetch>[0], init?: RequestInit) => {
    const body = JSON.parse(String(init?.body));
    assert.equal(body.max_tokens, 2000);
    assert.equal(body.temperature, 0.7);
    assert.deepEqual(body.messages, [{ role: "user", content: "Prompt" }]);
    return success();
  });
  await callGateway({ prompt: "Prompt" });
});

for (const variable of ["LLM_GATEWAY_URL", "LLM_GATEWAY_KEY"]) {
  test(`missing ${variable} fails before HTTP`, async () => {
    delete process.env[variable];
    const fetchMock = mock.method(globalThis, "fetch", async () => success());
    await assert.rejects(callGateway({ prompt: "Prompt" }), LLMGatewayError);
    assert.equal(fetchMock.mock.callCount(), 0);
  });
}

for (const status of [401, 429, 500, 503]) {
  test(`HTTP ${status} throws without fallback or exposing upstream body`, async () => {
    const fetchMock = mock.method(globalThis, "fetch", async () =>
      new Response("sensitive upstream details", { status }),
    );
    await assert.rejects(callGateway({ prompt: "Prompt" }), {
      message: `LLM gateway HTTP ${status}`,
    });
    assert.equal(fetchMock.mock.callCount(), 1);
  });
}

test("network failure throws without fallback", async () => {
  const fetchMock = mock.method(globalThis, "fetch", async () => { throw new Error("network error"); });
  await assert.rejects(callGateway({ prompt: "Prompt" }), { message: "LLM gateway request failed" });
  assert.equal(fetchMock.mock.callCount(), 1);
});

test("60-second timeout aborts the gateway request without fallback", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const fetchMock = mock.method(globalThis, "fetch", async (_url: Parameters<typeof fetch>[0], init?: RequestInit) => {
    return await new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
    });
  });
  const pending = assert.rejects(callGateway({ prompt: "Prompt" }), { message: "LLM gateway request timed out" });
  t.mock.timers.tick(60_000);
  await pending;
  assert.equal(fetchMock.mock.callCount(), 1);
});

for (const body of [
  {},
  { choices: [{ message: { content: "" } }] },
  { choices: [{ message: { content: [] } }] },
  { choices: [{ message: { content: "{}" }, finish_reason: "length" }] },
]) {
  test(`invalid or truncated response fails: ${JSON.stringify(body)}`, async () => {
    mock.method(globalThis, "fetch", async () => Response.json(body));
    await assert.rejects(callGateway({ prompt: "Prompt" }), LLMGatewayError);
  });
}

test("non-JSON gateway response fails", async () => {
  mock.method(globalThis, "fetch", async () => new Response("<html>bad gateway</html>"));
  await assert.rejects(callGateway({ prompt: "Prompt" }), LLMGatewayError);
});

test("existing JSON parsing accepts fenced JSON and rejects invalid output", () => {
  assert.deepEqual(parseJSONFromAI('```json\n{"ok":true}\n```'), { ok: true });
  assert.deepEqual(parseJSONFromAI('Result: [{"ok":true}]'), [{ ok: true }]);
  assert.throws(() => parseJSONFromAI("invalid"));
});
