# Feed Coding Challenge

Build a post feed with infinite scroll, pagination, and like functionality.

## Setup

```bash
bun install
bun run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Requirements

**Implement data fetching** — Choose **TanStack Query (REST)** or **Apollo Client (GraphQL)**.

1. **REST API client** — Implement fetch functions in `apps/web/src/lib/data-fetch.ts` (if using REST)
2. **Feed** — Infinite scroll, offset pagination (`offset` + `limit`)
3. **Like / Unlike** — Optimistic updates (UI updates immediately, rollback on error)
4. **Profile** _(if time)_ — Author info + author posts with infinite scroll, like/unlike

---

## REST API

Base URL: same-origin (relative paths). All responses are JSON.

### Types

```ts
interface Post {
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
  likes: string[]; // user IDs who liked
  createdAt: string; // ISO 8601
}

interface PostsResponse {
  posts: Post[];
  hasMore: boolean;
  nextOffset: number | null; // use for next page, or null if no more
}

interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
}

interface LikeResponse {
  liked: boolean; // new state after toggle
  likeCount: number;
}
```

### Endpoints

#### `GET /api/posts`

Paginated feed. Use `nextOffset` from the response for the next page.

| Query param | Type   | Default | Description |
| ----------- | ------ | ------- | ----------- |
| `offset`    | number | 0       | Start index |
| `limit`     | number | 3       | Page size   |

**Response:** `PostsResponse`

**Example:** `GET /api/posts?offset=0&limit=3`

---

#### `GET /api/authors/:username`

Author profile by username.

**Response:** `{ author: Author }`  
**404:** `{ error: "Author not found" }`

**Example:** `GET /api/authors/alex_creates`

---

#### `GET /api/authors/:username/posts`

Author's posts with pagination.

| Query param | Type   | Default | Description |
| ----------- | ------ | ------- | ----------- |
| `offset`    | number | 0       | Start index |
| `limit`     | number | 3       | Page size   |

**Response:** `PostsResponse`  
**404:** `{ error: "Author not found" }`

**Example:** `GET /api/authors/alex_creates/posts?offset=0&limit=3`

---

#### `POST /api/posts/:id/like`

Toggle like on a post. Idempotent — calling again toggles back.

**Response:** `LikeResponse`

**Example:** `POST /api/posts/post-1/like`

---

## GraphQL API

Endpoint: `POST /api/graphql`

Request body: `{ query: string, variables?: object }`

### Schema

```graphql
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
  likes: [ID!]! # user IDs who liked
  createdAt: String!
}

type PostsConnection {
  posts: [Post!]!
  hasMore: Boolean!
  nextOffset: Int # use for next page, null if no more
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
```

### Example Queries & Mutations

**Feed (paginated):**

```graphql
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
# Variables: { "offset": 0, "limit": 3 }
```

**Author profile:**

```graphql
query GetAuthor($username: String!) {
  author(username: $username) {
    id
    username
    displayName
    avatarUrl
  }
}
# Variables: { "username": "alex_creates" }
```

**Author posts (paginated):**

```graphql
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
# Variables: { "username": "alex_creates", "offset": 0, "limit": 3 }
```

**Like / unlike:**

```graphql
mutation LikePost($postId: ID!) {
  likePost(postId: $postId) {
    liked
    likeCount
  }
}
# Variables: { "postId": "post-1" }
```

---

## Key Files

| Purpose                                           | Location                                |
| ------------------------------------------------- | --------------------------------------- |
| REST API client — TODO: implement fetch functions | `apps/web/src/lib/data-fetch.ts`        |
| Hooks to implement                                | `apps/web/src/hooks/use-posts.ts`       |
| Feed                                              | `apps/web/src/app/_components/feed.tsx` |
| Profile                                           | `apps/web/src/app/[username]/page.tsx`  |
| Post card                                         | `apps/web/src/components/post-card.tsx` |
| GraphQL schema                                    | `apps/web/src/lib/graphql/schema.ts`    |
| Mock data                                         | `apps/web/src/lib/mock-data.ts`         |
