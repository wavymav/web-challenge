import { getCurrentUserId } from "@/lib/current-user";
import { getPaginatedPosts, toggleLike } from "@/lib/mock-data";

export const rootValue = {
  posts: async (_: unknown, args: { offset?: number; limit?: number }) => {
    const offset = args.offset ?? 0;
    const limit = args.limit ?? 3;
    return getPaginatedPosts(offset, limit);
  },
  likePost: async (_: unknown, args: { postId: string }) => {
    return toggleLike(args.postId, getCurrentUserId());
  },
};
