"use client";

import { ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";

import Loader from "@/components/loader";
import { PostCard } from "@/components/post-card";
import { useAuthor, useAuthorPosts } from "@/hooks/use-posts";

export default function ProfilePage() {
  const params = useParams();
  const usernameParam = params?.username as string | undefined;
  const username = usernameParam ?? "";

  const {
    data: authorData,
    isLoading: authorLoading,
    isError: authorError,
  } = useAuthor(username);
  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: postsLoading,
    isError: postsError,
    refetch,
  } = useAuthorPosts(username);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const paramsReady = !!usernameParam;

  useEffect(() => {
    document.getElementById("main-scroll")?.scrollTo(0, 0);
  }, [usernameParam]);

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const el = sentinelRef.current;
    const scrollRoot = document.getElementById("main-scroll");
    if (!el || !scrollRoot) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) fetchNextPage();
      },
      { root: scrollRoot, rootMargin: "100px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!paramsReady || authorLoading) {
    return (
      <main className="flex min-h-screen flex-col gap-4 pb-20 pt-4">
        <Link
          href="/"
          className="px-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to feed
        </Link>
        <div className="flex flex-1 items-center justify-center">
          <Loader />
        </div>
      </main>
    );
  }

  if (authorError || !authorData?.author) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 pb-20">
        <p className="text-center text-muted-foreground">
          This account doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="rounded-full border border-border bg-transparent px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Back to feed
        </Link>
      </main>
    );
  }

  const author = authorData.author;
  const posts = postsData?.pages.flatMap((p) => p.posts) ?? [];

  if (postsError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 pb-20">
        <p className="text-center text-destructive">
          Failed to load posts. Please try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-full border border-border bg-transparent px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="border-b border-border/50 px-4 py-6">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
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

      <div className="divide-y divide-border/50">
        {postsLoading && posts.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <p className="text-muted-foreground">No posts yet</p>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}

            <div ref={sentinelRef} className="h-4" aria-hidden />

            {isFetchingNextPage && (
              <div className="flex justify-center py-8">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {!hasNextPage && posts.length > 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                You&apos;ve reached the end
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
