import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createMultiplier } from "@/app/actions";

export default function NewMultiplierPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold">Novo multiplicador</h2>
      <Card>
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createMultiplier} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug (opcional)</Label>
              <Input id="slug" name="slug" placeholder="gerado-automaticamente" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="factor">Fator</Label>
                <Input id="factor" name="factor" type="number" min={1} step={0.05} defaultValue={1.1} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Aplicar sobre</Label>
                <select
                  id="target"
                  name="target"
                  defaultValue="HOURS"
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
                <Link href="/multipliers">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
