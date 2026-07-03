import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/prisma";
import { updateMultiplier } from "@/app/actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditMultiplierPage({ params }: Props) {
  const { id } = await params;
  const multiplier = await prisma.multiplier.findUnique({ where: { id } });
  if (!multiplier) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">Editar multiplicador</h2>
      <Card>
        <CardHeader>
          <CardTitle>{multiplier.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateMultiplier.bind(null, id)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" defaultValue={multiplier.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={multiplier.slug} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={multiplier.description ?? ""}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="factor">Fator</Label>
                <Input
                  id="factor"
                  name="factor"
                  type="number"
                  min={1}
                  step={0.05}
                  defaultValue={multiplier.factor}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Aplicar sobre</Label>
                <select
                  id="target"
                  name="target"
                  defaultValue={multiplier.target}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="HOURS">Horas</option>
                  <option value="COST">Custo</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit">Salvar</Button>
              <Button variant="outline" asChild>
                <Link href="/multipliers">Voltar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
