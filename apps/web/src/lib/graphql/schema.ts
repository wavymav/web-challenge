import { buildSchema } from "graphql";

export const schema = buildSchema(`
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
  }

  type Mutation {
    likePost(postId: ID!): LikeResponse!
  }
`);
