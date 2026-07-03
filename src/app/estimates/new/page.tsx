import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEstimate } from "@/app/actions";

export default function NewEstimatePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Nova estimativa</h2>
        <p className="text-muted-foreground">Defina os dados básicos do projeto.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados gerais</CardTitle>
          <CardDescription>Você poderá adicionar módulos e multiplicadores na próxima etapa.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createEstimate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da estimativa</Label>
              <Input id="name" name="name" required placeholder="Portal do Cliente v2" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientName">Cliente</Label>
              <Input id="clientName" name="clientName" placeholder="Nome do cliente" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" placeholder="Contexto do projeto" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="marginPct">Margem (%)</Label>
              <Input id="marginPct" name="marginPct" type="number" min={0} max={100} defaultValue={30} />
            </div>
            <div className="flex gap-3">
              <Button type="submit">Criar estimativa</Button>
              <Button variant="outline" asChild>
                <Link href="/estimates">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
