/**
 * Parse JSON from AI response that may contain markdown code blocks,
 * extra text before/after JSON, or other formatting artifacts.
 */
export function parseJSONFromAI<T = unknown>(text: string): T {
  let cleaned = text
    .replace(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/g, "$1")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Ignore, try other strategies
  }

  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(arrayMatch[0]);
    } catch {
      // Ignore
    }
  }

  const objectMatch = cleaned.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      return JSON.parse(objectMatch[0]);
    } catch {
      // Ignore
    }
  }

  throw new Error("Failed to parse JSON from AI response");
}

export class LLMGatewayError extends Error {}

export async function callGateway(params: {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const base = process.env.LLM_GATEWAY_URL?.trim().replace(/\/+$/, "");
  const apiKey = process.env.LLM_GATEWAY_KEY?.trim();
  if (!base || !apiKey) {
    throw new LLMGatewayError("LLM_GATEWAY_URL and LLM_GATEWAY_KEY are required");
  }
  const endpoint = `${base.endsWith("/v1") ? base : `${base}/v1`}/chat/completions`;

  const messages: { role: string; content: string }[] = [];
  if (params.systemPrompt)
    messages.push({ role: "system", content: params.systemPrompt });
  messages.push({ role: "user", content: params.prompt });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          // All current callers require structured JSON, including SEO content.
          model: "nemotron-super",
          messages,
          max_tokens: params.maxTokens ?? 2000,
          temperature: params.temperature ?? 0.7,
          response_format: { type: "json_object" },
          stream: false,
          reasoning: { enabled: false },
          chat_template_kwargs: { enable_thinking: false },
        }),
        signal: controller.signal,
        redirect: "error",
      }
    );

    if (!response.ok) {
      // Do not relay upstream bodies: they can contain credentials or prompts.
      throw new LLMGatewayError(`LLM gateway HTTP ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new LLMGatewayError("LLM gateway returned empty or invalid content");
    }
    if (data.choices[0].finish_reason === "length") {
      throw new LLMGatewayError("LLM gateway response was truncated");
    }
    return content;
  } catch (error) {
    if (error instanceof LLMGatewayError) throw error;
    throw new LLMGatewayError(
      controller.signal.aborted ? "LLM gateway request timed out" : "LLM gateway request failed",
    );
  } finally {
    clearTimeout(timeout);
  }
}
