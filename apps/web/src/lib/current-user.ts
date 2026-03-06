/**
 * Mock current user for development.
 * In a real app, this would come from auth/session.
 * Use getCurrentUserId() (server) or useCurrentUser() (client) — never hardcode the ID.
 */

export const MOCK_CURRENT_USER_ID = "user-1";

export function getCurrentUserId(): string {
  return MOCK_CURRENT_USER_ID;
}
