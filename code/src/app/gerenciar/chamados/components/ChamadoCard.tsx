"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Clock } from "lucide-react";
import { timeSince } from "../../pedidos/utils/format";

type Chamado = {
  id: string;
  dataChamado: Date;
  comanda: {
    numeroMesa: number;
  };
};

export function ChamadoCard({
  chamado,
  onFinalizar,
}: {
  chamado: Chamado;
  onFinalizar: () => void;
}) {
  return (
    <Card className="overflow-hidden border-neutral-200 bg-white shadow-sm">

      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Mesa {chamado.comanda.numeroMesa}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Clock className="h-4 w-4" />
          <span>{timeSince(chamado.dataChamado)}</span>
        </div>
      </CardContent>

      <CardFooter>
        <Button className="w-full cursor-pointer" onClick={onFinalizar}>
          Atender
        </Button>
      </CardFooter>

    </Card>
  );
}