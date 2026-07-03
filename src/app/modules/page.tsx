import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { deleteModule } from "@/app/actions";
import { MODULE_LAYER_LABELS } from "@/lib/calculations";
import { Badge } from "@/components/ui/badge";

export default async function ModulesPage() {
  const modules = await prisma.module.findMany({
    include: {
      _count: { select: { disciplineHours: true, estimateModules: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Módulos</h2>
          <p className="text-muted-foreground">
            Catálogo em camadas: plataforma, capacidades reutilizáveis e pacotes de domínio.
          </p>
        </div>
        <Button asChild>
          <Link href="/modules/new">
            <Plus className="h-4 w-4" />
            Novo módulo
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((mod) => (
          <Card key={mod.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                <Link href={`/modules/${mod.id}`} className="hover:underline">
                  {mod.name}
                </Link>
              </CardTitle>
              <CardDescription>{mod.description ?? "Sem descrição"}</CardDescription>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline">{MODULE_LAYER_LABELS[mod.layer]}</Badge>
                {mod.reuseGroup && (
                  <Badge variant="secondary">
                    Reuso {Math.round(mod.reuseFactor * 100)}% · {mod.reuseGroup}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {mod._count.disciplineHours} disciplina(s) · usado em {mod._count.estimateModules} estimativa(s)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/modules/${mod.id}`}>Editar</Link>
                </Button>
                <form action={deleteModule.bind(null, mod.id)}>
                  <Button variant="destructive" size="sm" type="submit">
                    Excluir
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
