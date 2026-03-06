import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "/api/graphql",
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: false,
            merge(existing, incoming, context) {
              const args = context?.args;
              const offset = (args?.offset as number) ?? 0;
              if (!incoming?.posts) return incoming ?? existing;
              if (!existing?.posts || offset === 0) return incoming;
              return {
                ...incoming,
                posts: [...existing.posts, ...incoming.posts],
              };
            },
          },
          authorPosts: {
            keyArgs: ["username"],
            merge(existing, incoming, context) {
              const args = context?.args;
              const offset = (args?.offset as number) ?? 0;
              if (!incoming?.posts) return incoming ?? existing;
              if (!existing?.posts || offset === 0) return incoming;
              return {
                ...incoming,
                posts: [...existing.posts, ...incoming.posts],
              };
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
  },
});
