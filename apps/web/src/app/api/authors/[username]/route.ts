import { NextRequest } from "next/server";

import { getUserByUsername } from "@/lib/mock-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const author = getUserByUsername(username);

  if (!author) {
    return Response.json({ error: "Author not found" }, { status: 404 });
  }

  return Response.json({ author });
}
