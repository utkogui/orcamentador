import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { deleteMultiplier } from "@/app/actions";

export default async function MultipliersPage() {
  const multipliers = await prisma.multiplier.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Multiplicadores</h2>
          <p className="text-muted-foreground">Fatores globais de risco aplicados às estimativas.</p>
        </div>
        <Button asChild>
          <Link href="/multipliers/new">
            <Plus className="h-4 w-4" />
            Novo multiplicador
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {multipliers.map((multiplier) => (
          <Card key={multiplier.id}>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-lg">{multiplier.name}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {multiplier.description ?? "Sem descrição"}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">×{multiplier.factor}</Badge>
                  <Badge variant="secondary">
                    {multiplier.target === "HOURS" ? "Horas" : "Custo"}
                  </Badge>
                  <Badge variant="outline">{multiplier.slug}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/multipliers/${multiplier.id}/edit`}>Editar</Link>
                </Button>
                <form action={deleteMultiplier.bind(null, multiplier.id)}>
                  <Button variant="destructive" size="sm" type="submit">
                    Excluir
                  </Button>
                </form>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
