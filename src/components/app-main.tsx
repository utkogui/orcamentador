"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isSharedProposal = pathname.startsWith("/p/");

  return (
    <main
      className={cn(
        isSharedProposal
          ? "min-h-screen w-full max-w-none p-0"
          : "mx-auto max-w-6xl px-4 py-8"
      )}
    >
      {children}
    </main>
  );
}
