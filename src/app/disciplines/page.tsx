import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/calculations";
import { deleteDiscipline } from "@/app/actions";

export default async function DisciplinesPage() {
  const disciplines = await prisma.discipline.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Disciplinas</h2>
          <p className="text-muted-foreground">Áreas de atuação e valor/hora para cálculo de custo.</p>
        </div>
        <Button asChild>
          <Link href="/disciplines/new">
            <Plus className="h-4 w-4" />
            Nova disciplina
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-6 py-4 font-medium">Nome</th>
                  <th className="px-6 py-4 font-medium">Valor/hora</th>
                  <th className="px-6 py-4 font-medium">Descrição</th>
                  <th className="px-6 py-4 font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {disciplines.map((discipline) => (
                  <tr key={discipline.id} className="border-b last:border-0">
                    <td className="px-6 py-4 font-medium">{discipline.name}</td>
                    <td className="px-6 py-4">{formatCurrency(discipline.hourlyRate)}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {discipline.description ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/disciplines/${discipline.id}/edit`}>Editar</Link>
                        </Button>
                        <form action={deleteDiscipline.bind(null, discipline.id)}>
                          <Button variant="destructive" size="sm" type="submit">
                            Excluir
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
