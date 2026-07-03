import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { deleteModule, saveModuleHours, updateModule } from "@/app/actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ModuleDetailPage({ params }: Props) {
  const { id } = await params;

  const mod = await prisma.module.findUnique({
    where: { id },
    include: {
      disciplineHours: true,
    },
  });

  if (!mod) notFound();

  const disciplines = await prisma.discipline.findMany({ orderBy: { name: "asc" } });
  const hoursMap = new Map(mod.disciplineHours.map((h) => [h.disciplineId, h.baseHours]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{mod.name}</h2>
          <p className="text-muted-foreground">Edite o módulo e horas-base por disciplina</p>
        </div>
        <form action={deleteModule.bind(null, id)}>
          <Button variant="destructive" type="submit">
            Excluir módulo
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados gerais</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateModule.bind(null, id)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" defaultValue={mod.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" defaultValue={mod.description ?? ""} />
            </div>
            <Button type="submit">Salvar dados</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Horas-base por disciplina</CardTitle>
          <CardDescription>Deixe em branco ou zero para disciplinas não aplicáveis</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveModuleHours.bind(null, id)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {disciplines.map((discipline) => (
                <div key={discipline.id} className="space-y-2">
                  <Label htmlFor={`hours_${discipline.id}`}>{discipline.name}</Label>
                  <Input
                    id={`hours_${discipline.id}`}
                    name={`hours_${discipline.id}`}
                    type="number"
                    min={0}
                    step={0.5}
                    defaultValue={hoursMap.get(discipline.id) ?? ""}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <Button type="submit">Salvar horas</Button>
          </form>
        </CardContent>
      </Card>

      <Button variant="outline" asChild>
        <Link href="/modules">Voltar</Link>
      </Button>
    </div>
  );
}
