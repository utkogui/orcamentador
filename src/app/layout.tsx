import type { Metadata } from "next";
import { AppMain } from "@/components/app-main";
import { AppNav } from "@/components/app-nav";
import { moderat } from "@/lib/fonts/moderat";
import "./globals.css";

// App depende do banco em runtime (Turso/SQLite). Evita pré-render no build do Netlify.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Estimador de Projetos | Matilha Estúdio",
  description: "POC interna para estimar preço de projetos digitais",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={moderat.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <AppNav />
        <AppMain>{children}</AppMain>
      </body>
    </html>
  );
}
