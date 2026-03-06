import { makeExecutableSchema } from "@graphql-tools/schema";

import { rootValue } from "./resolvers";

const typeDefs = `
  type User {
    id: ID!
    username: String!
    displayName: String!
    avatarUrl: String!
  }

  type Post {
    id: ID!
    authorId: ID!
    author: User!
    imageUrl: String!
    caption: String!
    likes: [ID!]!
    createdAt: String!
  }

  type PostsConnection {
    posts: [Post!]!
    hasMore: Boolean!
    nextOffset: Int
  }

  type LikeResponse {
    liked: Boolean!
    likeCount: Int!
  }

  type Query {
    posts(offset: Int, limit: Int): PostsConnection!
    author(username: String!): User
    authorPosts(username: String!, offset: Int, limit: Int): PostsConnection!
  }

  type Mutation {
    likePost(postId: ID!): LikeResponse!
  }
`;

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      posts: rootValue.posts,
      author: rootValue.author,
      authorPosts: rootValue.authorPosts,
    },
    Mutation: {
      likePost: rootValue.likePost,
    },
  },
});
