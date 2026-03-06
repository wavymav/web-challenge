"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  fetchAuthor,
  fetchAuthorPosts,
  fetchPosts,
  likePost as apiLikePost,
  type Post,
} from "@/lib/api";
import { getCurrentUserId } from "@/lib/current-user";

const POSTS_QUERY_KEY = ["posts"] as const;
const AUTHOR_POSTS_QUERY_KEY = (username: string) =>
  ["posts", "author", username] as const;
const PAGE_SIZE = 3;

export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: POSTS_QUERY_KEY,
    queryFn: ({ pageParam }) => fetchPosts(pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
  });
}

export function useAuthor(username: string) {
  return useQuery({
    queryKey: ["author", username],
    queryFn: () => fetchAuthor(username),
    enabled: !!username,
  });
}

export function useAuthorPosts(username: string) {
  return useInfiniteQuery({
    queryKey: AUTHOR_POSTS_QUERY_KEY(username),
    queryFn: ({ pageParam }) => fetchAuthorPosts(username, pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset ?? undefined,
    enabled: !!username,
  });
}

function toggleLikeInPost(p: Post, postId: string, currentUserId: string): Post {
  if (p.id !== postId) return p;
  const hasLiked = p.likes.includes(currentUserId);
  return {
    ...p,
    likes: hasLiked
      ? p.likes.filter((id) => id !== currentUserId)
      : [...p.likes, currentUserId],
  };
}

function updatePostsInCache(
  old: { pages: Array<{ posts: Post[] }> } | undefined,
  postId: string,
  currentUserId: string
) {
  if (!old) return old;
  return {
    ...old,
    pages: old.pages.map((page) => ({
      ...page,
      posts: page.posts.map((p) => toggleLikeInPost(p, postId, currentUserId)),
    })),
  };
}

export function useLikePost() {
  const queryClient = useQueryClient();
  const currentUserId = getCurrentUserId();

  return useMutation({
    mutationFn: (postId: string) => apiLikePost(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: POSTS_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: ["posts", "author"] });

      const prevPosts = queryClient.getQueryData<{
        pages: Array<{ posts: Post[] }>;
      }>(POSTS_QUERY_KEY);

      queryClient.setQueryData(POSTS_QUERY_KEY, (old) =>
        updatePostsInCache(old as typeof prevPosts, postId, currentUserId)
      );

      queryClient.setQueriesData<{ pages: Array<{ posts: Post[] }> }>(
        { queryKey: ["posts", "author"] },
        (old) => (old ? updatePostsInCache(old, postId, currentUserId) : old)
      );

      return { prevPosts };
    },
    onError: (_err, _postId, context) => {
      if (context?.prevPosts) {
        queryClient.setQueryData(POSTS_QUERY_KEY, context.prevPosts);
      }
      queryClient.invalidateQueries({ queryKey: POSTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["posts", "author"] });
    },
  });
}
