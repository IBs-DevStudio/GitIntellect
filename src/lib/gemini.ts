import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const aiSummariseCommit = async (diff: string) => {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "nvidia/nemotron-3-ultra-550b-a55b:free",
        messages: [
          {
            role: "user",
            content: `You are a senior software engineer reviewing a Git commit.

Analyse the provided Git diff and generate a concise, professional commit summary.

Rules:
- Do NOT repeat raw diff.
- Do NOT mention line numbers.
- Focus on WHAT changed and WHY it matters.
- If only documentation changed, mention that clearly.
- If feature added, describe the feature.
- If refactor, explain improvement.
- Keep summary under 120 words.

Git Diff:
${diff}

Format:
Title: <one line>
Details:
- bullet
- bullet`,
          },
        ],
      }),
    },
  );

  const data = await response.json();
  console.log("RAW:", JSON.stringify(data).slice(0, 200))
 if (!response.ok) {
    console.error("OpenRouter error:", response.status, JSON.stringify(data));
    return "Request failed.";
  }
  if (!data.choices?.length) return "No summary generated.";
  return data.choices[0].message.content;
};

export const summariseCode = async (doc: Document) => {
  console.log("getting summary for", doc.metadata.source);
  const code = doc.pageContent.slice(0, 10000);

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          {
            role: "user",
            content: `You are an intelligent senior software engineer who specialises in onboarding junior software engineers onto projects.
You are onboarding a junior software engineer and explaining to them the purpose of the ${doc.metadata.source} file.
Here is the code:
---
${code}
---
Give a summary no more than 100 words of the code above.`,
          },
        ],
      }),
    },
  );

  const data = await response.json();
  if (!data.choices?.length) return "";
  return data.choices[0].message.content as string;
};

export const generateEmbedding = async (summary: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await model.embedContent(summary);
  return result.embedding.values;
};