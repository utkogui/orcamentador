import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { updateDiscipline } from "@/app/actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditDisciplinePage({ params }: Props) {
  const { id } = await params;
  const discipline = await prisma.discipline.findUnique({ where: { id } });
  if (!discipline) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">Editar disciplina</h2>
      <Card>
        <CardHeader>
          <CardTitle>{discipline.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateDiscipline.bind(null, id)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" defaultValue={discipline.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Valor/hora (R$)</Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                min={0}
                step={1}
                defaultValue={discipline.hourlyRate}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={discipline.description ?? ""}
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit">Salvar</Button>
              <Button variant="outline" asChild>
                <Link href="/disciplines">Voltar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
