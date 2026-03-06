"use client";

import { useEffect } from "react";

import { useAuthor } from "@/hooks/use-posts";

import { ProfileFeed } from "./profile-feed";
import { ProfileHeader } from "./profile-header";

export function Profile({ username }: { username: string }) {
  const { data: authorData } = useAuthor(username);

  useEffect(() => {
    document.getElementById("main-scroll")?.scrollTo(0, 0);
  }, [username]);

  return (
    <main className="min-h-screen pb-20">
      <ProfileHeader username={username} />
      {authorData?.author && <ProfileFeed username={username} />}
    </main>
  );
}
