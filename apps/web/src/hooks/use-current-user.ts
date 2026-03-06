"use client";

import { getCurrentUserId } from "@/lib/current-user";

export function useCurrentUser() {
  return { id: getCurrentUserId() };
}
