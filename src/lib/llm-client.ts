// Provider abstraction for LLM calls.
// Set LLM_PROVIDER in .env.local: gemini | openai | ollama | anthropic
// Set LLM_MODEL to override the default model for the active provider.

import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

type Provider = "gemini" | "openai" | "ollama" | "anthropic";

const PROVIDER_DEFAULTS: Record<Provider, string> = {
  gemini: "gemini-2.0-flash",
  openai: "gpt-4o-mini",
  ollama: "llama3.2",
  anthropic: "claude-haiku-4-5-20251001",
};

const OPENAI_BASE_URLS: Record<string, string> = {
  gemini: "https://generativelanguage.googleapis.com/v1beta/openai/",
  ollama: "http://localhost:11434/v1",
};

function getProvider(): Provider {
  const p = process.env.LLM_PROVIDER ?? "gemini";
  if (!["gemini", "openai", "ollama", "anthropic"].includes(p)) {
    throw new Error(`Unknown LLM_PROVIDER: "${p}". Must be gemini | openai | ollama | anthropic`);
  }
  return p as Provider;
}

function getModel(provider: Provider): string {
  return process.env.LLM_MODEL ?? PROVIDER_DEFAULTS[provider];
}

function getApiKey(provider: Provider): string {
  const keys: Record<Provider, string | undefined> = {
    gemini: process.env.GEMINI_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    ollama: "ollama",
    anthropic: process.env.ANTHROPIC_API_KEY,
  };
  const key = keys[provider];
  if (!key) throw new Error(`Missing API key for provider "${provider}"`);
  return key;
}

async function completeWithOpenAICompat(
  provider: "gemini" | "openai" | "ollama",
  system: string,
  user: string
): Promise<string> {
  const model = getModel(provider);
  const apiKey = getApiKey(provider);
  const baseURL = OPENAI_BASE_URLS[provider];

  const client = new OpenAI({ apiKey, ...(baseURL ? { baseURL } : {}) });

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
  });

  return response.choices[0]?.message?.content ?? "";
}

async function completeWithAnthropic(system: string, user: string): Promise<string> {
  const model = getModel("anthropic");
  const client = new Anthropic({ apiKey: getApiKey("anthropic") });

  const response = await client.messages.create({
    model,
    max_tokens: 1024,
    system,
    messages: [{ role: "user", content: user }],
  });

  const block = response.content[0];
  return block.type === "text" ? block.text : "";
}

// Single entry point for all LLM calls in llm.ts.
// Returns raw text — caller is responsible for JSON.parse.
export async function complete(system: string, user: string): Promise<string> {
  const provider = getProvider();

  if (provider === "anthropic") {
    return completeWithAnthropic(system, user);
  }
  return completeWithOpenAICompat(provider, system, user);
}
