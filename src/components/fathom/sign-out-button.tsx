"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleSignOut}>
      <LogOut className="size-4" />
      Sign out
    </Button>
  );
}
