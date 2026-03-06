/**
 * Apollo Client setup for GraphQL API.
 * Uncomment and use this file if the candidate chooses the GraphQL + Apollo Client approach.
 * Also uncomment ApolloProvider in providers.tsx and use use-posts-graphql.ts hooks.
 */

// import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

// const httpLink = new HttpLink({
//   uri: "/api/graphql",
// });

// export const apolloClient = new ApolloClient({
//   link: httpLink,
//   cache: new InMemoryCache(),
//   defaultOptions: {
//     watchQuery: {
//       fetchPolicy: "cache-and-network",
//       errorPolicy: "all",
//     },
//   },
// });
