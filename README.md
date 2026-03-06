# Feed Coding Challenge

Build a post feed with infinite scroll, offset pagination, and like functionality.

## Setup

```bash
bun install
bun run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Requirements

1. **Post feed** — Infinite scrolling via offset pagination (`offset` + `limit`)
2. **Loading & error states** — Handle loading and show a retry option on error
3. **Like posts** — User can like/unlike a post
4. **Mock API** — REST and GraphQL endpoints with mock data and simulated delays

## API Choice

Pick one:

- **REST + TanStack Query** — Implement first (recommended)
- **GraphQL + Apollo Client** — Alternative; hooks are commented in `use-posts-graphql.ts`

## Key Files

| Purpose              | Location                                          |
| -------------------- | ------------------------------------------------- |
| Home page            | `apps/web/src/app/page.tsx`                       |
| Profile page         | `apps/web/src/app/[username]/page.tsx`            |
| REST API routes      | `apps/web/src/app/api/posts/`, `api/authors/`     |
| GraphQL API          | `apps/web/src/app/api/graphql/route.ts`           |
| Mock data            | `apps/web/src/lib/mock-data.ts`                   |
| REST client          | `apps/web/src/lib/api.ts`                         |
| TanStack Query hooks | `apps/web/src/hooks/use-posts.ts`                 |
| Feed component       | `apps/web/src/app/_components/feed.tsx`           |
| Post card            | `apps/web/src/components/post-card.tsx`          |

## REST Endpoints

- `GET /api/posts?offset=0&limit=3` — Paginated posts
- `POST /api/posts/[id]/like` — Toggle like
- `GET /api/authors/[username]` — Author profile
- `GET /api/authors/[username]/posts?offset=0&limit=3` — Author's posts

## GraphQL

- Query: `posts(offset: Int, limit: Int)`
- Mutation: `likePost(postId: ID!)`

## Scripts

- `bun run dev` — Start dev server (port 3001)
- `bun run build` — Build for production
