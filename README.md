# Feed Coding Challenge

Build a post feed with infinite scroll, pagination, and like functionality.

## Setup

```bash
bun install
bun run dev
```

Open [http://localhost:3001](http://localhost:3001).

---

## Requirements

Choose **REST (TanStack Query)** or **GraphQL (Apollo Client)**. Implement data fetching to complete the app.

| Priority | Requirement | Notes |
|----------|-------------|-------|
| 1 | **Feed** | Infinite scroll, offset pagination. Home page shows posts. |
| 2 | **Like / Unlike** | Optimistic updates — UI updates immediately, rollback on error. |
| 3 | **REST API client** | Only if using REST — implement fetch functions in `data-fetch.ts`. |
| 4 | **Profile** _(if time)_ | Author header + author posts with infinite scroll, like/unlike. |

---

## Where to Implement

| File | What to do |
|------|------------|
| `apps/web/src/lib/data-fetch.ts` | **REST only.** Implement `fetchPosts`, `fetchAuthor`, `fetchAuthorPosts`, `likePost`. |
| `apps/web/src/hooks/use-posts.ts` | Implement `useInfinitePosts`, `useAuthor`, `useAuthorPosts`, `useLikePost`. Use `data-fetch.ts` (REST) or GraphQL. |
| `apps/web/src/app/_components/feed.tsx` | Already wired to `useInfinitePosts`. No changes needed. |
| `apps/web/src/app/[username]/_components/profile-header.tsx` | Uses `useAuthor`. No changes needed. |
| `apps/web/src/app/[username]/_components/profile-feed.tsx` | Uses `useAuthorPosts`. No changes needed. |
| `apps/web/src/components/post-card.tsx` | Uses `useLikePost`. No changes needed. |

**Suggested order (REST):** `data-fetch.ts` → `use-posts.ts`. The UI components are ready.

---

## REST API

Base: same-origin. All responses JSON.

### Types

```ts
interface Post {
  id: string;
  authorId: string;
  author: { id: string; username: string; displayName: string; avatarUrl: string };
  imageUrl: string;
  caption: string;
  likes: string[];  // user IDs
  createdAt: string;
}

interface PostsResponse {
  posts: Post[];
  hasMore: boolean;
  nextOffset: number | null;  // use for next page
}

interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
}

interface LikeResponse {
  liked: boolean;
  likeCount: number;
}
```

### Endpoints

| Method | Path | Params | Response |
|--------|------|--------|----------|
| GET | `/api/posts` | `offset`, `limit` (default 0, 3) | `PostsResponse` |
| GET | `/api/authors/:username` | — | `{ author: Author }` (404 if not found) |
| GET | `/api/authors/:username/posts` | `offset`, `limit` | `PostsResponse` |
| POST | `/api/posts/:id/like` | — | `LikeResponse` (toggle) |

---

## GraphQL API

Endpoint: `POST /api/graphql`  
Body: `{ query: string, variables?: object }`

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
  likes: [ID!]!
  createdAt: String!
}

type PostsConnection {
  posts: [Post!]!
  hasMore: Boolean!
  nextOffset: Int
}

type Query {
  posts(offset: Int, limit: Int): PostsConnection!
  author(username: String!): User
  authorPosts(username: String!, offset: Int, limit: Int): PostsConnection!
}

type LikeResponse {
  liked: Boolean!
  likeCount: Int!
}

type Mutation {
  likePost(postId: ID!): LikeResponse!
}
```

### Examples

**Feed:**
```graphql
query GetPosts($offset: Int, $limit: Int) {
  posts(offset: $offset, limit: $limit) {
    posts { id authorId author { id username displayName avatarUrl } imageUrl caption likes createdAt }
    hasMore
    nextOffset
  }
}
# Variables: { "offset": 0, "limit": 3 }
```

**Author:**
```graphql
query GetAuthor($username: String!) {
  author(username: $username) { id username displayName avatarUrl }
}
# Variables: { "username": "alex_creates" }
```

**Author posts:**
```graphql
query GetAuthorPosts($username: String!, $offset: Int, $limit: Int) {
  authorPosts(username: $username, offset: $offset, limit: $limit) {
    posts { id authorId author { id username displayName avatarUrl } imageUrl caption likes createdAt }
    hasMore
    nextOffset
  }
}
# Variables: { "username": "alex_creates", "offset": 0, "limit": 3 }
```

**Like:**
```graphql
mutation LikePost($postId: ID!) {
  likePost(postId: $postId) { liked likeCount }
}
# Variables: { "postId": "post-1" }
```

---

## Reference

| File | Purpose |
|------|---------|
| `apps/web/src/lib/data-fetch.ts` | REST client (implement fetches) |
| `apps/web/src/hooks/use-posts.ts` | Data hooks (implement) |
| `apps/web/src/lib/graphql/schema.ts` | GraphQL schema |
| `apps/web/src/lib/mock-data.ts` | Mock data source |
