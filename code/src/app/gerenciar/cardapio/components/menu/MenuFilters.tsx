import { Input } from "../../../../_components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import { Search } from "lucide-react";
import { CATEGORY_LABELS } from "./MenuTable";

const CATEGORIES = [
"ENTRADAS",
"PRATOS_CASA",
"PEIXES",
"CARNES",
"BEBIDAS",
"SOBREMESAS"
] as const;

interface MenuFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  availability: string;
  onAvailabilityChange: (value: string) => void;
}

export function MenuFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  availability,
  onAvailabilityChange,
}: MenuFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={availability} onValueChange={onAvailabilityChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Disponibilidade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="available">Disponível</SelectItem>
          <SelectItem value="unavailable">Indisponível</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
