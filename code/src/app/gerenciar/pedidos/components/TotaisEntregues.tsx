// src/gerenciar/pedidos/components/TotaisEntregues.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { formatBRL } from "../utils/format";

export function TotaisEntregues({
  rows,
  totalGeral,
}: {
  rows: { numeroMesa: number; nomeCliente: string; total: number }[];
  totalGeral: number;
}) {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Totais por Mesa (Entregues hoje)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-neutral-600">
              <tr>
                <th className="py-2">Mesa</th>
                <th className="py-2">Cliente</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.numeroMesa} className="border-t">
                  <td className="py-2">Mesa {r.numeroMesa}</td>
                  <td className="py-2">{r.nomeCliente}</td>
                  <td className="py-2 text-right">{formatBRL(r.total)}</td>
                </tr>
              ))}
              <tr className="border-t font-semibold">
                <td className="py-2" colSpan={2}>Total do dia</td>
                <td className="py-2 text-right">{formatBRL(totalGeral)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
