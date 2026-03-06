"use client";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";

import { getCurrentUserId } from "@/lib/current-user";

const PAGE_SIZE = 3;

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
