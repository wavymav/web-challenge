"use client";

import { getCurrentUserId } from "@/lib/current-user";

/**
 * Returns the currently logged-in user's ID.
 * Use this to check likes, etc. — you don't need to know the actual ID.
 */
export function useCurrentUser() {
  return { id: getCurrentUserId() };
}
