"use client";
import useProject from "@/app/hooks/use-project";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import React from "react";

const CommitLog = () => {
  const { projectId } = useProject();
  const { data: commits } = api.project.getCommits.useQuery({ projectId });

  return (
    <ul className="space-y-6">
      {commits?.map((commit, index) => (
        <li key={commit.id} className="relative flex gap-x-4">
          {/* vertical line */}
          <div
            className={cn(
              index === commits.length - 1 ? "h-6" : "-bottom-6",
              "absolute top-0 left-0 flex w-6 justify-center",
            )}
          >
            <div className="w-px translate-x-1 bg-gray-200" />
          </div>

          {/* avatar */}
          <img
            src={commit.commitAuthorAvatar}
            alt={commit.commitAuthorName}
            className="relative mt-4 size-8 flex-none rounded-full bg-gray-50"
          />

          {/* content */}
          <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-gray-200 ring-inset">
            <div className="flex justify-between gap-x-4">
              <p className="text-xs text-gray-500">
                <span className="font-medium text-gray-900">
                  {commit.commitAuthorName}
                </span>{" "}
                committed
              </p>
              <time className="flex-none text-xs text-gray-500">
                {new Date(commit.commitDate).toLocaleDateString()}
              </time>
            </div>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {commit.commitMessage}
            </p>
            {commit.summary && commit.summary !== "Request failed." && (
  <p className="mt-1 text-xs text-gray-600 whitespace-pre-wrap">
    {commit.summary}
  </p>
)}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CommitLog;
