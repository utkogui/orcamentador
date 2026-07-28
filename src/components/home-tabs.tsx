"use client";

import Link from "next/link";
import { Calculator, Layers, Sparkles, Users, Zap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function HomeTabs() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border bg-gradient-to-br from-matilha-yellow-muted to-card p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">POC interna</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Estime projetos digitais com clareza</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Combine módulos reutilizáveis, disciplinas, complexidade e multiplicadores de risco para
          chegar a um preço sugerido e faixa comercial em minutos.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/estimates/new/ai">Interpretar briefing com IA</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/estimates/new">Nova estimativa manual</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/estimates">Ver estimativas</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <FeatureCard
          icon={<Sparkles className="h-5 w-5" />}
          title="IA / Briefing"
          description="Interpreta briefings com a Matilha Knowledge Base de Building Blocks."
          href="/estimates/new/ai"
        />
        <FeatureCard
          icon={<Calculator className="h-5 w-5" />}
          title="Estimativas"
          description="Monte propostas com módulos, margem e multiplicadores."
          href="/estimates"
        />
        <FeatureCard
          icon={<Layers className="h-5 w-5" />}
          title="Módulos"
          description="Catálogo reutilizável com horas-base por disciplina."
          href="/modules"
        />
        <FeatureCard
          icon={<Users className="h-5 w-5" />}
          title="Disciplinas"
          description="Cadastre áreas e valor/hora para calcular custos."
          href="/disciplines"
        />
        <FeatureCard
          icon={<Zap className="h-5 w-5" />}
          title="Multiplicadores"
          description="Ajuste riscos como prazo curto, LGPD e legado."
          href="/multipliers"
        />
        <FeatureCard
          icon={<BookOpen className="h-5 w-5" />}
          title="Knowledge"
          description="Base de conhecimento de Building Blocks e Design Intelligence."
          href="/knowledge"
        />
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="ghost" className="px-0" asChild>
          <Link href={href}>Acessar →</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
