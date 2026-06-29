import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { summariseCode, generateEmbedding } from "./gemini";
import { db } from "@/server/db";
import { env } from "@/env";

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
) => {
  const token = githubToken || env.GITHUB_TOKEN;
  try {
    const loader = new GithubRepoLoader(githubUrl, {
      accessToken: token,
      branch: "main",
      ignoreFiles: [
        "package-lock.json",
        "yarn.lock",
        "pnpm-lock.yaml",
        "bun.lockb",
      ],
      recursive: true,
      unknown: "warn",
      maxConcurrency: 5,
    });
    const docs = await loader.load();
    return filterDocs(docs);
  } catch {
    const loader = new GithubRepoLoader(githubUrl, {
      accessToken: token,
      branch: "master",
      ignoreFiles: [
        "package-lock.json",
        "yarn.lock",
        "pnpm-lock.yaml",
        "bun.lockb",
      ],
      recursive: true,
      unknown: "warn",
      maxConcurrency: 5,
    });
    const docs = await loader.load();
    return filterDocs(docs);
  }
};

const filterDocs = (docs: Document[]) => {
  return docs.filter((doc) => {
    const file = doc.metadata.source;
    return (
      !file.endsWith(".svg") &&
      !file.endsWith(".png") &&
      !file.endsWith(".jpg") &&
      !file.endsWith(".jpeg") &&
      !file.endsWith(".ico") &&
      !file.endsWith(".md") &&
      !file.endsWith(".mdx") &&
      !file.endsWith(".json") &&
      !file.endsWith(".css") &&
      !file.endsWith(".lock") &&
      !file.endsWith(".sum") &&
      !file.endsWith(".proto") &&
      !file.endsWith(".yaml") &&
      !file.endsWith(".yml") &&
      !file.endsWith(".toml") &&
      !file.endsWith(".sql") &&
      !file.endsWith(".mod") &&
      !file.endsWith(".pb.go") &&
      !file.endsWith(".tpl") &&
      !file.endsWith(".txt")
    );
  });
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  console.log("TOKEN RECEIVED IN LOADER:", githubToken);
  const docs = await loadGithubRepo(githubUrl, githubToken);
  console.log("Docs after filtering:", docs.length);
  const allEmbeddings = await generateEmbeddings(docs);
  console.log(
    "Total embeddings generated:",
    allEmbeddings.filter((e) => e !== null).length,
  );
  await Promise.allSettled(
    allEmbeddings.map(async (embedding) => {
      if (!embedding) return;
      console.log("saving embedding for:", embedding.fileName);
      const id = crypto.randomUUID();
      await db.$executeRaw`
        INSERT INTO "SourceCodeEmbedding" ("id", "sourceCode", "fileName", "summary", "projectId")
        VALUES (${id}, ${embedding.sourceCode}, ${embedding.fileName}, ${embedding.summary}, ${projectId})
      `;
      await db.$executeRaw`
        UPDATE "SourceCodeEmbedding"
        SET "summaryEmbedding" = ${embedding.embedding}::vector
        WHERE "id" = ${id}
      `;
    }),
  );
};

const generateEmbeddings = async (docs: Document[]) => {
  const results: any[] = [];
  for (let i = 0; i < docs.length; i += 10) {
    const batch = docs.slice(i, i + 10);
    const batchResults = await Promise.all(
      batch.map(async (doc) => {
        const summary = await summariseCode(doc);
        console.log(
          "summary for",
          doc.metadata.source,
          ":",
          summary?.slice(0, 80),
        );
        if (!summary || summary.trim() === "") return null;
        const embedding = await generateEmbedding(summary);
        return {
          summary,
          embedding,
          sourceCode: JSON.parse(JSON.stringify(doc.pageContent)),
          fileName: doc.metadata.source,
        };
      }),
    );
    results.push(...batchResults);
  }
  return results;
};
