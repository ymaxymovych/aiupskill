import assert from "node:assert/strict";
import { after, afterEach, before, beforeEach, mock, test } from "node:test";

// Real route handlers and real AI client; only HTTP, persistence and captcha are isolated.
const writes: unknown[] = [];
const model = () => ({
  findUnique: async () => null,
  findFirst: async () => null,
  create: async (input: unknown) => { writes.push(input); return input; },
});
Object.assign(globalThis, {
  prisma: { b2BAutomation: model(), b2BIndustryHub: model(), b2BRolePage: model() },
});

type Handler = (req: Request) => Promise<Response>;
let audit: Handler;
let content: Handler;
let automations: Handler;
let cleanupInterval: ReturnType<typeof setInterval>;

before(async () => {
  // Avoid retaining the audit route's rate-limit cleanup timer in the test process.
  const original = globalThis.setInterval;
  const intervalMock = mock.method(globalThis, "setInterval", (...args: Parameters<typeof setInterval>) => {
    cleanupInterval = original(...args);
    cleanupInterval.unref();
    return cleanupInterval;
  });
  ({ POST: audit } = await import("../src/app/api/ai-audit/route"));
  intervalMock.mock.restore();
  ({ POST: content } = await import("../src/app/api/generate/content/route"));
  ({ POST: automations } = await import("../src/app/api/generate/automations/route"));
});

after(() => clearInterval(cleanupInterval));
beforeEach(() => {
  process.env.LLM_GATEWAY_URL = "http://127.0.0.1:4000/llm";
  process.env.LLM_GATEWAY_KEY = "test-aiupskill-consumer";
  process.env.GENERATION_API_SECRET = "test-generation-secret";
  process.env.ADAPTIVE_CAPTCHA_DISABLED = "1";
  writes.length = 0;
});
afterEach(() => mock.restoreAll());

let requestId = 0;
function request(body: object) {
  return new Request("https://aiupskill.live/api/test", {
    method: "POST",
    headers: { "content-type": "application/json", "x-real-ip": `192.0.2.${++requestId}` },
    body: JSON.stringify({ secret: "test-generation-secret", batchSize: 1, ...body }),
  });
}

const paths = [
  { name: "AI audit classification", handler: () => audit, body: { industry: "agency", employee_count: 10 }, tokens: 1000, temperature: 0.5, persists: false },
  { name: "industry hubs", handler: () => content, body: { type: "industry_hubs" }, tokens: 3000, temperature: 0.7, persists: true },
  { name: "role pages", handler: () => content, body: { type: "role_pages" }, tokens: 3000, temperature: 0.7, persists: true },
  { name: "automations", handler: () => automations, body: {}, tokens: 2000, temperature: 0.7, persists: true },
];

for (const path of paths) {
  test(`${path.name}: actual handler sends only gateway URL/group/consumer key`, async () => {
    const fetchMock = mock.method(globalThis, "fetch", async (url: Parameters<typeof fetch>[0], init?: RequestInit) => {
      assert.equal(url, "http://127.0.0.1:4000/llm/v1/chat/completions");
      assert.equal(new Headers(init?.headers).get("authorization"), "Bearer test-aiupskill-consumer");
      const body = JSON.parse(String(init?.body));
      assert.equal(body.model, "nemotron-super");
      assert.equal(body.max_tokens, path.tokens);
      assert.equal(body.temperature, path.temperature);
      assert.deepEqual(body.response_format, { type: "json_object" });
      return Response.json({ choices: [{ message: { content: JSON.stringify({ name: "Test company", industry_code: "agency", problem: "Test content" }) } }] });
    });
    const response = await path.handler()(request(path.body));
    assert.equal(response.status, 200);
    const body = await response.json();
    if (path.persists) {
      assert.equal(body.processed[0].status, "created");
      assert.equal(writes.length, 1);
    } else {
      assert.equal(body.company.name, "Test company");
    }
    assert.equal(fetchMock.mock.callCount(), 1);
  });

  for (const failure of ["http", "network", "missing-config"] as const) {
    test(`${path.name}: ${failure} fails loudly and never uses a direct provider`, async () => {
      if (failure === "missing-config") delete process.env.LLM_GATEWAY_KEY;
      const fetchMock = mock.method(globalThis, "fetch", async () => {
        if (failure === "network") throw new Error("offline");
        return new Response("upstream unavailable", { status: 503 });
      });
      const errorMock = mock.method(console, "error", () => {});
      const response = await path.handler()(request(path.body));
      const body = await response.json();
      if (path.persists) {
        assert.match(body.processed[0].status, /^error: /);
      } else {
        assert.equal(response.status, 500);
        assert.equal(body.status, "error");
      }
      assert.equal(writes.length, 0);
      assert.equal(fetchMock.mock.callCount(), failure === "missing-config" ? 0 : 1);
      assert.equal(errorMock.mock.callCount(), 1);
    });
  }
}

for (const name of ["content", "automations"]) {
  for (const state of ["missing-server-secret", "both-secrets-missing", "missing-request-secret", "wrong-secret"] as const) {
    test(`${name}: generation authorization fails closed (${state})`, async () => {
      if (state === "missing-server-secret" || state === "both-secrets-missing") delete process.env.GENERATION_API_SECRET;
      const fetchMock = mock.method(globalThis, "fetch", async () => { throw new Error("unexpected HTTP"); });
      const response = await (name === "content" ? content : automations)(request({
        secret: state === "missing-request-secret" || state === "both-secrets-missing" ? undefined : "wrong-secret",
      }));
      assert.equal(response.status, 401);
      assert.equal(fetchMock.mock.callCount(), 0);
      assert.equal(writes.length, 0);
    });
  }
}
