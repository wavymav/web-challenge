"use client";

import { Gift, Heart, Loader2, MoreHorizontal, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Post } from "@/lib/api";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useLikePost } from "@/hooks/use-posts";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { id: currentUserId } = useCurrentUser();
  const likeMutation = useLikePost();
  const isLiked = post.likes.includes(currentUserId);
  const likeCount = post.likes.length;

  return (
    <Card className="overflow-hidden border-0 bg-transparent shadow-none ring-0">
      <CardHeader className="flex flex-row items-center gap-3 px-4 py-3">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border">
          <Image
            src={post.author.avatarUrl}
            alt={post.author.displayName}
            fill
            className="object-cover"
            sizes="36px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={`/${post.author.username}`}
            className="flex items-center gap-1 truncate text-sm font-medium hover:underline"
          >
            {post.author.username}
            <span className="text-primary" aria-hidden>
              ✓
            </span>
          </Link>
        </div>
        <button
          type="button"
          className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="More options"
        >
          <MoreHorizontal className="size-5" />
        </button>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative aspect-square w-full bg-muted">
          <Image
            src={post.imageUrl}
            alt={post.caption || "Post image"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 448px"
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch gap-3 border-t border-border/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className={`size-9 rounded-full ${isLiked ? "text-red-500" : "text-foreground"}`}
              onClick={() => likeMutation.mutate(post.id, isLiked, likeCount)}
              disabled={likeMutation.isPending}
            >
              {likeMutation.isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Heart
                  className={`size-5 ${isLiked ? "fill-current" : ""}`}
                  aria-label={isLiked ? "Unlike" : "Like"}
                />
              )}
            </Button>
            <span className="text-sm text-foreground">{likeCount}</span>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 rounded-full text-foreground"
              aria-label="Share"
            >
              <Send className="size-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded p-1.5 text-primary hover:bg-muted"
              aria-label="Gift"
            >
              <Gift className="size-5" />
            </button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full border-border px-4 text-sm font-medium"
            >
              Message
            </Button>
          </div>
        </div>

        {post.caption && (
          <p className="text-sm leading-relaxed">
            <Link
              href={`/${post.author.username}`}
              className="font-medium hover:underline"
            >
              {post.author.username}
            </Link>{" "}
            {post.caption}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
