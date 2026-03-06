/**
 * REST API client for the feed.
 * Base URL is relative for same-origin requests.
 */

const BASE = "";

export interface Post {
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
}

export interface PostsResponse {
  posts: Post[];
  hasMore: boolean;
  nextOffset: number | null;
}

export interface LikeResponse {
  liked: boolean;
  likeCount: number;
}

export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
}

export async function fetchAuthor(username: string): Promise<{ author: Author }> {
  const res = await fetch(`${BASE}/api/authors/${encodeURIComponent(username)}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Author not found");
    throw new Error(`Failed to fetch author: ${res.status}`);
  }
  return res.json();
}

export async function fetchAuthorPosts(
  username: string,
  offset: number,
  limit = 3
): Promise<PostsResponse> {
  const url = `${BASE}/api/authors/${encodeURIComponent(username)}/posts?offset=${offset}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) throw new Error("Author not found");
    throw new Error(`Failed to fetch posts: ${res.status}`);
  }
  return res.json();
}

export async function fetchPosts(offset: number, limit = 3): Promise<PostsResponse> {
  const url = `${BASE}/api/posts?offset=${offset}&limit=${limit}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch posts: ${res.status}`);
  }
  return res.json();
}

export async function likePost(postId: string): Promise<LikeResponse> {
  const res = await fetch(`${BASE}/api/posts/${postId}/like`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(`Failed to like post: ${res.status}`);
  }
  return res.json();
}
