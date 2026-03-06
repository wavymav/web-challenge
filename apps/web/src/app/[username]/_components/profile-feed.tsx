"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

import Loader from "@/components/loader";
import { PostCard } from "@/components/post-card";
import { useAuthorPosts } from "@/hooks/use-posts";

// TODO: Implement useAuthorPosts in use-posts.ts — infinite scroll + like/unlike
export function ProfileFeed({ username }: { username: string }) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useAuthorPosts(username);

  const sentinelRef = useRef<HTMLDivElement>(null);

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

  const posts = data?.pages.flatMap((p) => p.posts) ?? [];

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 p-8">
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
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted-foreground">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/50">
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
    </div>
  );
}
