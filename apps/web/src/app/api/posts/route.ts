import { NextRequest } from "next/server";

import { getPaginatedPosts } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const offset = Number(searchParams.get("offset") ?? 0);
  const limit = Number(searchParams.get("limit") ?? 3);

  const result = await getPaginatedPosts(offset, limit);
  return Response.json(result);
}
