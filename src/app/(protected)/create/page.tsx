"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { Folder, Github, Key } from "lucide-react";
import { toast } from "sonner";
import useRefetch from "@/app/hooks/use-refetch";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const creatProject = api.project.createProject.useMutation();
  const refetch = useRefetch();

  function onSubmit(data: FormInput) {
    creatProject.mutate(
      {
        githubUrl: data.repoUrl,
        name: data.projectName,
        githubToken: data.githubToken,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully");
          reset();
          refetch();
        },
        onError: (error) => {
          toast.error("Failed to create project");
        },
      },
    );
    return true;
  }

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img
        src="/download-2.png"
        alt="GitHub illustration"
        className="h-80 w-auto"
      />

      <div>
        <div>
          <h1 className="text-2xl font-semibold">
            Link your GitHub Repository
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter the URL of your repository to link it to GitIntellect
          </p>
        </div>

        <div className="h-4"></div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Project Name */}
            <div className="relative">
              <Folder className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                {...register("projectName", { required: true })}
                placeholder="Project Name"
                className="pl-9"
                required
              />
            </div>

            {/* Repo URL */}
            <div className="relative">
              <Github className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                {...register("repoUrl", { required: true })}
                placeholder="GitHub Repository URL"
                type="url"
                className="pl-9"
                required
              />
            </div>

            {/* GitHub Token */}
            <div className="relative">
              <Key className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                {...register("githubToken")}
                placeholder="GitHub Token (Optional)"
                className="pl-9"
              />
            </div>

            <Button
              className="btn-gradient hover-glow w-full"
              type="submit"
              disabled={creatProject.isPending}
            >
              {creatProject.isPending ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
