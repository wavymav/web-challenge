/**
 * Mock data for the Instagram/Fanfix clone.
 * Used by both REST and GraphQL APIs.
 */

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  imageUrl: string;
  caption: string;
  likes: string[]; // user IDs who liked
  createdAt: string;
}

const USERS: User[] = [
  {
    id: "user-1",
    username: "alex_creates",
    displayName: "Alex Chen",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/png?seed=alex",
  },
  {
    id: "user-2",
    username: "jordan_art",
    displayName: "Jordan Lee",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/png?seed=jordan",
  },
  {
    id: "user-3",
    username: "sam_photos",
    displayName: "Sam Rivera",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/png?seed=sam",
  },
  {
    id: "user-4",
    username: "taylor_visuals",
    displayName: "Taylor Kim",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/png?seed=taylor",
  },
  {
    id: "user-5",
    username: "casey_designs",
    displayName: "Casey Morgan",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/png?seed=casey",
  },
];

const POSTS: Post[] = [
  {
    id: "post-1",
    authorId: "user-1",
    author: USERS[0]!,
    imageUrl: "https://picsum.photos/seed/post1/600/600",
    caption: "Golden hour vibes 🌅 So grateful for this view today.",
    likes: ["user-2", "user-3"],
    createdAt: "2025-03-04T09:00:00Z",
  },
  {
    id: "post-2",
    authorId: "user-2",
    author: USERS[1]!,
    imageUrl: "https://picsum.photos/seed/post2/600/600",
    caption: "New project drop! What do you think?",
    likes: ["user-1", "user-4", "user-5"],
    createdAt: "2025-03-04T11:30:00Z",
  },
  {
    id: "post-3",
    authorId: "user-3",
    author: USERS[2]!,
    imageUrl: "https://picsum.photos/seed/post3/600/600",
    caption: "Weekend mood 📸",
    likes: [],
    createdAt: "2025-03-04T14:00:00Z",
  },
  {
    id: "post-4",
    authorId: "user-4",
    author: USERS[3]!,
    imageUrl: "https://picsum.photos/seed/post4/600/600",
    caption: "Behind the scenes of today's shoot",
    likes: ["user-1", "user-2", "user-3"],
    createdAt: "2025-03-04T15:00:00Z",
  },
  {
    id: "post-5",
    authorId: "user-5",
    author: USERS[4]!,
    imageUrl: "https://picsum.photos/seed/post5/600/600",
    caption: "Minimalism ✨",
    likes: ["user-1"],
    createdAt: "2025-03-05T08:00:00Z",
  },
  {
    id: "post-6",
    authorId: "user-1",
    author: USERS[0]!,
    imageUrl: "https://picsum.photos/seed/post6/600/600",
    caption: "Throwback to last summer",
    likes: ["user-3", "user-4"],
    createdAt: "2025-03-05T09:30:00Z",
  },
  {
    id: "post-7",
    authorId: "user-2",
    author: USERS[1]!,
    imageUrl: "https://picsum.photos/seed/post7/600/600",
    caption: "Experimenting with new techniques",
    likes: ["user-5"],
    createdAt: "2025-03-05T10:00:00Z",
  },
  {
    id: "post-8",
    authorId: "user-3",
    author: USERS[2]!,
    imageUrl: "https://picsum.photos/seed/post8/600/600",
    caption: "Coffee and creativity ☕",
    likes: ["user-1", "user-2"],
    createdAt: "2025-03-05T11:00:00Z",
  },
];

const API_DELAY_MS = 1200;
const API_ERROR_RATE = 0; // Set to 0.1 to simulate 10% errors for testing

function delay(ms: number = API_DELAY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function maybeFail(): void {
  if (Math.random() < API_ERROR_RATE) {
    throw new Error("Simulated API error");
  }
}

// In-memory mutable state for likes (resets on server restart)
const likesByPost = new Map<string, Set<string>>();

function initState() {
  POSTS.forEach((post) => {
    likesByPost.set(post.id, new Set(post.likes));
  });
}
initState();

export function getMockPosts(): Post[] {
  return POSTS;
}

export function getUserByUsername(username: string): User | null {
  return USERS.find((u) => u.username === username) ?? null;
}

export async function getPaginatedPostsByAuthor(
  authorId: string,
  offset: number,
  limit: number
): Promise<{
  posts: Post[];
  hasMore: boolean;
  nextOffset: number | null;
}> {
  await delay();
  maybeFail();

  const authorPosts = POSTS.filter((p) => p.authorId === authorId);
  const end = offset + limit;
  const paginated = authorPosts.slice(offset, end);

  const posts = paginated.map((p) => {
    const likes = likesByPost.get(p.id) ?? new Set(p.likes);
    return {
      ...p,
      likes: Array.from(likes),
    };
  });

  return {
    posts,
    hasMore: end < authorPosts.length,
    nextOffset: end < authorPosts.length ? end : null,
  };
}

export async function getPaginatedPosts(offset: number, limit: number): Promise<{
  posts: Post[];
  hasMore: boolean;
  nextOffset: number | null;
}> {
  await delay();
  maybeFail();

  const end = offset + limit;
  const paginated = POSTS.slice(offset, end);

  const posts = paginated.map((p) => {
    const likes = likesByPost.get(p.id) ?? new Set(p.likes);
    return {
      ...p,
      likes: Array.from(likes),
    };
  });

  return {
    posts,
    hasMore: end < POSTS.length,
    nextOffset: end < POSTS.length ? end : null,
  };
}

export async function toggleLike(postId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
  await delay(800);
  maybeFail();

  const likes = likesByPost.get(postId) ?? new Set<string>();
  const hadLiked = likes.has(userId);
  if (hadLiked) {
    likes.delete(userId);
  } else {
    likes.add(userId);
  }
  likesByPost.set(postId, likes);
  return { liked: !hadLiked, likeCount: likes.size };
}
