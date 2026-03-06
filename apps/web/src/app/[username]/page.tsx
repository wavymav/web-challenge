"use client";

import { useParams } from "next/navigation";

import { Profile } from "@/app/[username]/_components/profile";

export default function ProfilePage() {
  const params = useParams();
  const username = (params?.username as string) ?? "";

  if (!username) {
    return null;
  }

  return <Profile username={username} />;
}
