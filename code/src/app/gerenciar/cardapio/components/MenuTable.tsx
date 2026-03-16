import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Pencil, Trash2, ToggleLeft, ToggleRight, ImageIcon } from "lucide-react";
import type { RouterOutputs } from "~/trpc/react";
import Image from "next/image";

type MenuItem = RouterOutputs["item"]["getAll"][number];

interface MenuTableProps {
  items: MenuItem[];
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onToggleAvailability: (item: MenuItem) => void;
}

function formatPrice(price: number) {
  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export const CATEGORY_LABELS = {
  ENTRADAS: "Entradas",
  PRATOS_CASA: "Pratos da Casa",
  PEIXES: "Peixes",
  CARNES: "Carnes",
  BEBIDAS: "Bebidas",
  SOBREMESAS: "Sobremesas",
} as const;

export function getCategoryLabel(category: keyof typeof CATEGORY_LABELS) {
  return CATEGORY_LABELS[category];
}

export function MenuTable({
  items,
  onEdit,
  onDelete,
  onToggleAvailability,
}: MenuTableProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p className="text-lg">Nenhum item encontrado.</p>
        <p className="text-sm">
          Tente ajustar os filtros ou adicione um novo item.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Foto</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="hidden md:table-cell">Categoria</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[120px] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              className={item.disponivel ? "" : "opacity-50"}
            >
              <TableCell>
                {item.imageURL ? (
                  <Image 
                   src={item.imageURL}
                   alt={item.nome}
                   width={40}
                   height={40}
                   className="rounded object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </TableCell>

              <TableCell>
                <div>
                  <span className="font-medium">{item.nome}</span>
                  <p className="text-xs text-muted-foreground line-clamp-1 md:hidden">
                    {item.categoria}
                  </p>
                </div>
              </TableCell>

              <TableCell className="hidden md:table-cell">
                <Badge variant="secondary">
                  {CATEGORY_LABELS[item.categoria]}
                </Badge>
              </TableCell>

              <TableCell className="font-mono text-sm">
                {formatPrice(item.preco)}
              </TableCell>

              <TableCell>
                {item.disponivel ? (
                  <Badge className="bg-success text-success-foreground hover:bg-success/90">
                    Disponível
                  </Badge>
                ) : (
                  <Badge variant="destructive">Indisponível</Badge>
                )}
              </TableCell>

              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  
                  {/* Toggle disponibilidade */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onToggleAvailability(item)}
                  >
                    {item.disponivel ? (
                      <ToggleRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>

                  {/* Editar */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* Deletar */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}