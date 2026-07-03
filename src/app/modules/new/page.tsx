import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createModule } from "@/app/actions";

export default function NewModulePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Novo módulo</h2>
        <p className="text-muted-foreground">Depois de criar, defina as horas por disciplina.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do módulo</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createModule} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" />
            </div>
            <div className="flex gap-3">
              <Button type="submit">Criar módulo</Button>
              <Button variant="outline" asChild>
                <Link href="/modules">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
