import { NextRequest } from "next/server";

import { getPaginatedPostsByAuthor, getUserByUsername } from "@/lib/mock-data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const author = getUserByUsername(username);

  if (!author) {
    return Response.json({ error: "Author not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const offset = Number(searchParams.get("offset") ?? 0);
  const limit = Number(searchParams.get("limit") ?? 3);

  const result = await getPaginatedPostsByAuthor(author.id, offset, limit);
  return Response.json(result);
}
