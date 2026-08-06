"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MatilhaLogo } from "@/components/matilha-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Início", match: (pathname: string) => pathname === "/" },
  {
    href: "/estimates",
    label: "Estimativas",
    match: (pathname: string) =>
      pathname.startsWith("/estimates") && !pathname.startsWith("/estimates/new/ai"),
  },
  {
    href: "/estimates/new/ai",
    label: "IA / Briefing",
    match: (pathname: string) => pathname.startsWith("/estimates/new/ai"),
  },
  { href: "/modules", label: "Módulos", match: (pathname: string) => pathname.startsWith("/modules") },
  {
    href: "/disciplines",
    label: "Disciplinas",
    match: (pathname: string) => pathname.startsWith("/disciplines"),
  },
  {
    href: "/multipliers",
    label: "Multiplicadores",
    match: (pathname: string) => pathname.startsWith("/multipliers"),
  },
  {
    href: "/knowledge",
    label: "Knowledge",
    match: (pathname: string) => pathname.startsWith("/knowledge"),
  },
];

export function AppNav() {
  const pathname = usePathname();

  // Link público da proposta: sem menu interno do estimador
  if (pathname.startsWith("/p/")) {
    return null;
  }

  return (
    <header className="app-nav border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-4">
          <MatilhaLogo height={32} priority />
          <div className="hidden sm:block">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Estimador de Projetos
            </p>
          </div>
        </Link>
        <nav className="flex flex-wrap gap-1">
          {links.map((link) => {
            const isActive = link.match(pathname);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-matilha-yellow text-matilha-black"
                    : "text-foreground hover:bg-matilha-yellow-muted"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
