"use client";

import { MoreHorizontal, Pin } from "lucide-react";
import Link from "next/link";

import { ModeToggle } from "./mode-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background">
      <div className="flex flex-row items-center justify-between px-4 py-3">
        <h1 className="text-2xl font-bold">Feed</h1>
        <div className="flex flex-1 items-center justify-end gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
