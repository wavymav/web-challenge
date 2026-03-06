"use client";

/**
 * TODO: Implement data fetching hooks.
 * Choose one: TanStack Query (REST) or Apollo Client (GraphQL).
 * - REST: Implement api.ts fetch functions first, then use them here.
 * - GraphQL: /api/graphql (posts, authorPosts, author, likePost)
 */

import type { Author, Post } from "@/lib/data-fetch";

type InfinitePostsData = {
  pages: Array<{ posts: Post[]; nextOffset?: number | null }>;
};
type AuthorData = { author: Author };

// TODO: useInfinitePosts — fetch feed with pagination, infinite scroll
export function useInfinitePosts() {
  return {
    data: undefined as InfinitePostsData | undefined,
    isLoading: false,
    isError: false,
    error: null as Error | null,
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch: () => {},
  };
}

// TODO: useAuthor — fetch author by username (for profile page)
export function useAuthor(_username: string) {
  return {
    data: undefined as AuthorData | undefined,
    isLoading: true,
    isError: false,
  };
}

// TODO: useAuthorPosts — fetch author's posts with pagination, infinite scroll
export function useAuthorPosts(_username: string) {
  return {
    data: undefined as InfinitePostsData | undefined,
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: true,
    isError: false,
    refetch: () => {},
  };
}

// TODO: useLikePost — like/unlike with optimistic updates
export function useLikePost() {
  return {
    mutate: (_postId: string, _isLiked: boolean, _likeCount: number) => {},
    mutateAsync: async (
      _postId: string,
      _isLiked: boolean,
      _likeCount: number,
    ) => ({}) as { liked: boolean; likeCount: number },
    isPending: false,
  };
}
