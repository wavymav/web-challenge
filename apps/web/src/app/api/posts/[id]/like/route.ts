import { NextRequest } from "next/server";

import { getCurrentUserId } from "@/lib/current-user";
import { toggleLike } from "@/lib/mock-data";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: postId } = await params;
  const result = await toggleLike(postId, getCurrentUserId());
  return Response.json(result);
}
