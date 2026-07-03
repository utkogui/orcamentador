"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Início" },
  { href: "/estimates", label: "Estimativas" },
  { href: "/modules", label: "Módulos" },
  { href: "/disciplines", label: "Disciplinas" },
  { href: "/multipliers", label: "Multiplicadores" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="space-y-0.5">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Matilha Estúdio</p>
          <h1 className="text-lg font-semibold">Estimador de Projetos</h1>
        </Link>
        <nav className="flex flex-wrap gap-1">
          {links.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

            return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
                isActive && "bg-accent text-accent-foreground"
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
