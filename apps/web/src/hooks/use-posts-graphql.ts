/**
 * Apollo Client hooks for the feed (GraphQL API).
 * Uncomment and use these hooks if the candidate chooses the GraphQL + Apollo Client approach.
 * Requires: apollo-client.ts, ApolloProvider in providers.tsx, and switching Feed/PostCard to use these hooks.
 */

// import { gql, useMutation, useQuery } from "@apollo/client";

// const POSTS_QUERY = gql`
//   query GetPosts($offset: Int, $limit: Int) {
//     posts(offset: $offset, limit: $limit) {
//       posts {
//         id
//         authorId
//         author { id username displayName avatarUrl }
//         imageUrl
//         caption
//         likes
//         createdAt
//       }
//       hasMore
//       nextOffset
//     }
//   }
// `;

// const LIKE_POST_MUTATION = gql`
//   mutation LikePost($postId: ID!) {
//     likePost(postId: $postId) { liked likeCount }
//   }
// `;

// const PAGE_SIZE = 3;

// export function useInfinitePostsGraphQL() {
//   // Apollo Client doesn't have built-in useInfiniteQuery.
//   // Use useQuery with fetchMore for infinite scroll, or implement with multiple useQuery calls.
//   const { data, loading, error, fetchMore } = useQuery(POSTS_QUERY, {
//     variables: { offset: 0, limit: PAGE_SIZE },
//   });
//
//   const loadMore = () => {
//     const nextOffset = data?.posts?.nextOffset;
//     if (nextOffset == null) return;
//     fetchMore({
//       variables: { offset: nextOffset, limit: PAGE_SIZE },
//       updateQuery: (prev, { fetchMoreResult }) => {
//         if (!fetchMoreResult?.posts) return prev;
//         return {
//           posts: {
//             ...fetchMoreResult.posts,
//             posts: [
//               ...(prev.posts?.posts ?? []),
//               ...(fetchMoreResult.posts.posts ?? []),
//             ],
//           },
//         };
//       },
//     });
//   };
//
//   return {
//     data: data?.posts ? { pages: [{ posts: data.posts.posts, nextOffset: data.posts.nextOffset }] } : undefined,
//     isLoading: loading,
//     isError: !!error,
//     error,
//     fetchNextPage: loadMore,
//     hasNextPage: data?.posts?.hasMore ?? false,
//     isFetchingNextPage: false, // Apollo doesn't expose this directly
//     refetch: () => {},
//   };
// }

// export function useLikePostGraphQL() {
//   const [likePost, result] = useMutation(LIKE_POST_MUTATION);
//   return {
//     mutate: (postId: string) => likePost({ variables: { postId } }),
//     isPending: result.loading,
//   };
// }
