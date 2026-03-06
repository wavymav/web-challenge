import { graphql } from "graphql";
import { NextRequest } from "next/server";

import { rootValue } from "@/lib/graphql/resolvers";
import { schema } from "@/lib/graphql/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, variables } = body;

    if (!query || typeof query !== "string") {
      return Response.json(
        { errors: [{ message: "Query is required" }] },
        { status: 400 },
      );
    }

    const result = await graphql({
      schema,
      source: query as string,
      rootValue,
      variableValues: variables ?? undefined,
    });

    if (result.errors && result.errors.length > 0) {
      return Response.json(result, { status: 200 });
    }

    return Response.json(result);
  } catch (err) {
    console.error("GraphQL error:", err);
    return Response.json(
      {
        errors: [
          {
            message:
              err instanceof Error ? err.message : "Internal server error",
          },
        ],
      },
      { status: 500 },
    );
  }
}
