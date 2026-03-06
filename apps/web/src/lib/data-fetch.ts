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

// TODO: Implement — GET /api/authors/:username → { author: Author }, 404 if not found
export async function fetchAuthor(): Promise<{ author: Author }> {
  throw new Error("TODO: implement fetchAuthor");
}

// TODO: Implement — GET /api/authors/:username/posts?offset=&limit= → PostsResponse
export async function fetchAuthorPosts(): Promise<PostsResponse> {
  throw new Error("TODO: implement fetchAuthorPosts");
}

// TODO: Implement — GET /api/posts?offset=&limit= → PostsResponse
export async function fetchPosts(): Promise<PostsResponse> {
  throw new Error("TODO: implement fetchPosts");
}

// TODO: Implement — POST /api/posts/:id/like → LikeResponse (toggle like)
export async function likePost(): Promise<LikeResponse> {
  throw new Error("TODO: implement likePost");
}
