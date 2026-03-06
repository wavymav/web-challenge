"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Loader from "@/components/loader";
import type { Author } from "@/lib/data-fetch";
import { useAuthor } from "@/hooks/use-posts";

// TODO: Implement useAuthor in use-posts.ts — fetches author by username
export function ProfileHeader({ username }: { username: string }) {
  const { data, isLoading, isError } = useAuthor(username);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col gap-4 pb-20 pt-4">
        <Link
          href="/"
          className="px-4 inline-flex gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to feed
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (isError || !data?.author) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 pb-20">
        <p className="text-center text-muted-foreground">
          This account doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="rounded-full border border-border bg-transparent px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Back to feed
        </Link>
      </div>
    );
  }

  const author = data.author as Author;

  return (
    <div className="border-b border-border/50 px-4 py-6">
      <div className="mb-4">
        <Link
          href="/"
          className="inline-flex gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to feed
        </Link>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-border">
          <Image
            src={author.avatarUrl}
            alt={author.displayName}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-semibold">{author.displayName}</h1>
          <p className="text-sm text-muted-foreground">@{author.username}</p>
        </div>
      </div>
    </div>
  );
}
