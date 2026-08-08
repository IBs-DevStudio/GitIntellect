'use server'

import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateEmbedding } from '@/lib/gemini';
import { db } from '@/server/db';
import { env } from '@/env';

const openrouter = createOpenRouter({
    apiKey: env.OPENROUTER_API_KEY,
});

export async function generate(input: string, projectId: string) {
    const embedding = await generateEmbedding(input);
    const vectorQuery = `[${embedding.join(',')}]`;

    const result = await db.$queryRaw`
      SELECT "fileName", "sourceCode", summary,
        1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) as similarity
      FROM "SourceCodeEmbedding"
      WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > .5
      AND "projectId" = ${projectId}
      ORDER BY similarity DESC
      LIMIT 10;
    ` as { fileName: string, sourceCode: string, summary: string }[];

    let context = '';
    for (const r of result) {
        context += `source:${r.fileName}\ncode content:${r.sourceCode}\nsummary of file:${r.summary}\n\n`;
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'google/gemini-2.0-flash-001',
            messages: [{
                role: 'user',
                content: `You are an AI code assistant who answers questions about the codebase. Your target audience is a technical intern.
START CONTEXT BLOCK
${context}
END OF CONTEXT BLOCK

START QUESTION
${input}
END OF QUESTION

Answer in markdown syntax with code snippets if needed. Be as detailed as possible.`
            }],
        }),
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content ?? "I couldn't generate an answer.";

    return { output, filesReferenced: result };
}