import type { Metadata } from "next";
import { AppNav } from "@/components/app-nav";
import { moderat } from "@/lib/fonts/moderat";
import "./globals.css";

export const metadata: Metadata = {
  title: "Estimador de Projetos | Matilha Estúdio",
  description: "POC interna para estimar preço de projetos digitais",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={moderat.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <AppNav />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
