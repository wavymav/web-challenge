"use client";

/**
 * Post hooks — TanStack Query (REST API).
 * Apollo Client version is commented below. Uncomment to switch back to Apollo + GraphQL.
 */

// import type { InfiniteData } from "@tanstack/react-query";
// import {
//   useInfiniteQuery,
//   useMutation,
//   useQuery,
//   useQueryClient,
// } from "@tanstack/react-query";

// import {
//   fetchAuthor,
//   fetchAuthorPosts,
//   fetchPosts,
//   likePost as likePostApi,
// } from "@/lib/api";
// import type { Post, PostsResponse } from "@/lib/api";
// import { getCurrentUserId } from "@/lib/current-user";

const PAGE_SIZE = 3;

// function updatePostLikesInPages(
//   pages: { posts: Post[]; hasMore: boolean; nextOffset: number | null }[],
//   postId: string,
//   currentUserId: string,
//   isLiked: boolean,
// ) {
//   const nextLikes = (likes: string[]) =>
//     isLiked
//       ? likes.filter((id) => id !== currentUserId)
//       : [...likes, currentUserId];

//   return pages.map((page) => ({
//     ...page,
//     posts: page.posts.map((p) =>
//       p.id === postId ? { ...p, likes: nextLikes(p.likes) } : p,
//     ),
//   }));
// }

// // =============================================================================
// // TanStack Query implementation (REST API)
// // =============================================================================

// export function useInfinitePosts() {
//   const {
//     data,
//     isLoading,
//     isError,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     refetch,
//   } = useInfiniteQuery({
//     queryKey: ["posts"],
//     queryFn: ({ pageParam }) => fetchPosts(pageParam ?? 0, PAGE_SIZE),
//     initialPageParam: 0 as number | null,
//     getNextPageParam: (lastPage) => lastPage.nextOffset,
//   });

//   return {
//     data,
//     isLoading,
//     isError,
//     error,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     refetch,
//   };
// }

// export function useAuthor(username: string) {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: ["author", username],
//     queryFn: () => fetchAuthor(username),
//     enabled: !!username,
//   });

//   return {
//     data,
//     isLoading,
//     isError,
//   };
// }

// export function useAuthorPosts(username: string) {
//   const {
//     data,
//     isLoading,
//     isError,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     refetch,
//   } = useInfiniteQuery({
//     queryKey: ["author", username, "posts"],
//     queryFn: ({ pageParam }) =>
//       fetchAuthorPosts(username, pageParam ?? 0, PAGE_SIZE),
//     initialPageParam: 0 as number | null,
//     getNextPageParam: (lastPage) => lastPage.nextOffset,
//     enabled: !!username,
//   });

//   return {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     isError,
//     refetch,
//   };
// }

// type LikeMutationVars = { postId: string; isLiked: boolean; likeCount: number };

// export function useLikePost() {
//   const queryClient = useQueryClient();
//   const currentUserId = getCurrentUserId();

//   const mutation = useMutation({
//     mutationFn: ({ postId }: LikeMutationVars) => likePostApi(postId),
//     onMutate: async ({ postId, isLiked }) => {
//       await queryClient.cancelQueries({ queryKey: ["posts"] });
//       await queryClient.cancelQueries({ queryKey: ["author"] });

//       const previousPosts = queryClient.getQueryData<
//         InfiniteData<PostsResponse>
//       >(["posts"]);
//       const previousAuthorQueries = queryClient.getQueriesData<
//         InfiniteData<PostsResponse>
//       >({
//         queryKey: ["author"],
//       });

//       queryClient.setQueryData<InfiniteData<PostsResponse>>(
//         ["posts"],
//         (old) => {
//           if (!old) return old;
//           return {
//             ...old,
//             pages: updatePostLikesInPages(
//               old.pages,
//               postId,
//               currentUserId,
//               isLiked,
//             ),
//           };
//         },
//       );

//       previousAuthorQueries.forEach(([queryKey, data]) => {
//         if (queryKey[2] === "posts" && data) {
//           queryClient.setQueryData<InfiniteData<PostsResponse>>(queryKey, {
//             ...data,
//             pages: updatePostLikesInPages(
//               data.pages,
//               postId,
//               currentUserId,
//               isLiked,
//             ),
//           });
//         }
//       });

//       return { previousPosts, previousAuthorQueries };
//     },
//     onError: (_err, _vars, context) => {
//       if (context?.previousPosts) {
//         queryClient.setQueryData(["posts"], context.previousPosts);
//       }
//       context?.previousAuthorQueries?.forEach(([queryKey, data]) => {
//         if (queryKey[2] === "posts" && data) {
//           queryClient.setQueryData(queryKey, data);
//         }
//       });
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ["posts"] });
//       queryClient.invalidateQueries({ queryKey: ["author"] });
//     },
//   });

//   const mutate = (postId: string, isLiked: boolean, likeCount: number) => {
//     const vars: LikeMutationVars = { postId, isLiked, likeCount };
//     return mutation.mutate(vars);
//   };

//   return {
//     mutate,
//     mutateAsync: (postId: string, isLiked: boolean, likeCount: number) =>
//       likePostApi(postId).then((r) => r),
//     isPending: mutation.isPending,
//   };
// }

// =============================================================================
// Apollo Client implementation (commented out — uncomment to switch back)
// =============================================================================

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { getCurrentUserId } from "@/lib/current-user";

interface PostsConnection {
  posts: Array<{
    id: string;
    authorId: string;
    author: {
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string;
    };
    imageUrl: string;
    caption: string;
    likes: string[];
    createdAt: string;
  }>;
  hasMore: boolean;
  nextOffset: number | null;
}

const POSTS_QUERY = gql`
  query GetPosts($offset: Int, $limit: Int) {
    posts(offset: $offset, limit: $limit) {
      posts {
        id
        authorId
        author {
          id
          username
          displayName
          avatarUrl
        }
        imageUrl
        caption
        likes
        createdAt
      }
      hasMore
      nextOffset
    }
  }
`;

const AUTHOR_QUERY = gql`
  query GetAuthor($username: String!) {
    author(username: $username) {
      id
      username
      displayName
      avatarUrl
    }
  }
`;

const AUTHOR_POSTS_QUERY = gql`
  query GetAuthorPosts($username: String!, $offset: Int, $limit: Int) {
    authorPosts(username: $username, offset: $offset, limit: $limit) {
      posts {
        id
        authorId
        author {
          id
          username
          displayName
          avatarUrl
        }
        imageUrl
        caption
        likes
        createdAt
      }
      hasMore
      nextOffset
    }
  }
`;

const LIKE_POST_MUTATION = gql`
  mutation LikePost($postId: ID!) {
    likePost(postId: $postId) {
      liked
      likeCount
    }
  }
`;

export function useInfinitePosts() {
  const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery<{
    posts: PostsConnection;
  }>(POSTS_QUERY, {
    variables: { offset: 0, limit: PAGE_SIZE },
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const connection = data?.posts;
  const posts = connection?.posts ?? [];
  const hasMore = connection?.hasMore ?? false;
  const nextOffset = connection?.nextOffset ?? null;

  const fetchNextPage = () => {
    if (!hasMore || nextOffset == null) return;
    fetchMore({
      variables: { offset: nextOffset, limit: PAGE_SIZE },
    });
  };

  return {
    data: connection ? { pages: [{ posts, nextOffset }] } : undefined,
    isLoading: loading,
    isError: !!error,
    error,
    fetchNextPage,
    hasNextPage: hasMore,
    isFetchingNextPage: networkStatus === 3,
    refetch,
  };
}

export function useAuthor(username: string) {
  const { data, loading, error } = useQuery<{
    author: {
      id: string;
      username: string;
      displayName: string;
      avatarUrl: string;
    } | null;
  }>(AUTHOR_QUERY, {
    variables: { username },
    skip: !username,
    fetchPolicy: "cache-first",
  });

  return {
    data: data?.author ? { author: data.author } : undefined,
    isLoading: loading,
    isError: !!error,
  };
}

export function useAuthorPosts(username: string) {
  const { data, loading, error, fetchMore, refetch, networkStatus } = useQuery<{
    authorPosts: PostsConnection;
  }>(AUTHOR_POSTS_QUERY, {
    variables: { username: username, offset: 0, limit: PAGE_SIZE },
    skip: !username,
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const connection = data?.authorPosts;
  const posts = connection?.posts ?? [];
  const hasMore = connection?.hasMore ?? false;
  const nextOffset = connection?.nextOffset ?? null;

  const fetchNextPage = () => {
    if (!hasMore || nextOffset == null) return;
    fetchMore({
      variables: { offset: nextOffset, limit: PAGE_SIZE },
    });
  };

  return {
    data: connection ? { pages: [{ posts, nextOffset }] } : undefined,
    fetchNextPage,
    hasNextPage: hasMore,
    isFetchingNextPage: networkStatus === 3,
    isLoading: loading,
    isError: !!error,
    refetch,
  };
}

export function useLikePost() {
  const currentUserId = getCurrentUserId();

  const [likePost, result] = useMutation<{
    likePost: { liked: boolean; likeCount: number };
  }>(LIKE_POST_MUTATION, {
    update(cache, { data: mutationData }, { variables }) {
      const postId = variables?.postId as string | undefined;
      if (!postId || !mutationData?.likePost) return;

      const shouldBeLiked = mutationData.likePost.liked;

      cache.modify({
        id: cache.identify({ __typename: "Post", id: postId }),
        fields: {
          likes(existing) {
            const arr = Array.isArray(existing) ? existing : [];
            const hasLiked = arr.includes(currentUserId);
            if (shouldBeLiked && !hasLiked) return [...arr, currentUserId];
            if (!shouldBeLiked && hasLiked)
              return arr.filter((id) => id !== currentUserId);
            return arr;
          },
        },
      });
    },
  });

  const mutate = (postId: string, isLiked: boolean, likeCount: number) => {
    const optimisticLiked = !isLiked;
    const optimisticCount = isLiked ? likeCount - 1 : likeCount + 1;
    return likePost({
      variables: { postId },
      optimisticResponse: {
        likePost: {
          __typename: "LikeResponse",
          liked: optimisticLiked,
          likeCount: optimisticCount,
        },
      } as { likePost: { liked: boolean; likeCount: number } },
    });
  };

  return {
    mutate,
    mutateAsync: (postId: string, isLiked: boolean, likeCount: number) =>
      mutate(postId, isLiked, likeCount).then((r) => r.data),
    isPending: result.loading,
  };
}
