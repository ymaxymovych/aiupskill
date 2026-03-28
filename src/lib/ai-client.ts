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

export async function callOpenRouter(params: {
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const messages: { role: string; content: string }[] = [];
  if (params.systemPrompt)
    messages.push({ role: "system", content: params.systemPrompt });
  messages.push({ role: "user", content: params.prompt });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3006",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages,
          max_tokens: params.maxTokens || 2000,
          temperature: params.temperature || 0.7,
        }),
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenRouter API error");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } finally {
    clearTimeout(timeout);
  }
}
