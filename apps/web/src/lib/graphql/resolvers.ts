import { getCurrentUserId } from "@/lib/current-user";
import {
  getPaginatedPosts,
  getPaginatedPostsByAuthor,
  getUserByUsername,
  toggleLike,
} from "@/lib/mock-data";

export const rootValue = {
  posts: async (
    _: unknown,
    args?: { offset?: number; limit?: number }
  ) => {
    const offset = args?.offset ?? 0;
    const limit = args?.limit ?? 3;
    return getPaginatedPosts(offset, limit);
  },
  author: async (_: unknown, args?: { username?: string }) => {
    const username = args?.username ?? "";
    const raw = username.startsWith("@") ? username.slice(1) : username;
    const user = getUserByUsername(raw);
    return user;
  },
  authorPosts: async (
    _: unknown,
    args?: { username?: string; offset?: number; limit?: number }
  ) => {
    const username = args?.username ?? "";
    const raw = username.startsWith("@") ? username.slice(1) : username;
    const user = getUserByUsername(raw);
    if (!user)
      return { posts: [], hasMore: false, nextOffset: null };
    return getPaginatedPostsByAuthor(
      user.id,
      args?.offset ?? 0,
      args?.limit ?? 3
    );
  },
  likePost: async (_: unknown, args?: { postId?: string }) => {
    const postId = args?.postId ?? "";
    return toggleLike(postId, getCurrentUserId());
  },
};
