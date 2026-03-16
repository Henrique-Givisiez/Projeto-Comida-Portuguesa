'use client'
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/app/_components/input";
import { Textarea } from "~/app/_components/TextArea";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import Image from "next/image";
import type { RouterOutputs } from "~/trpc/react";

type MenuItem = RouterOutputs["item"]["getAll"][number];

const CATEGORIES = [
  "ENTRADAS",
  "PRATOS_CASA",
  "PEIXES",
  "CARNES",
  "BEBIDAS",
  "SOBREMESAS",
] as const;

import { CATEGORY_LABELS } from "./MenuTable";

interface MenuItemModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<MenuItem, "id">) => void;
  item?: MenuItem | null;
}

const emptyForm: Omit<MenuItem, "id"> = {
  nome: "",
  descricao: "",
  preco: 0,
  categoria: "ENTRADAS",
  imageURL: "",
  disponivel: true,
};

export function MenuItemModal({ open, onClose, onSave, item }: MenuItemModalProps) {
  const [form, setForm] = useState<Omit<MenuItem, "id">>(emptyForm);

  useEffect(() => {
    if (open) {
      if (item) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id , ...rest } = item;
        setForm(rest);
      } else {
        setForm(emptyForm);
      }
    }
  }, [open, item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nome || !form.categoria || form.preco <= 0) return;

    let imagePath = form.imageURL;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      imagePath = data.path;
    }

    onSave({
      ...form,
      imageURL: imagePath,
    });

    onClose();
  };

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const preview = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      imageURL: preview, // apenas preview
    }));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{item ? "Editar Item" : "Novo Item"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do item *</Label>
            <Input
              id="nome"
              value={form.nome}
              onChange={(e) =>
                setForm((p) => ({ ...p, nome: e.target.value }))
              }
              placeholder="Ex: Filé Mignon"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={form.descricao}
              onChange={(e) =>
                setForm((p) => ({ ...p, descricao: e.target.value }))
              }
              placeholder="Descrição do prato..."
              rows={3}
            />
          </div>

          {/* Preço + Categoria */}
          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$) *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0.01"
                value={form.preco || ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    preco: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select
                value={form.categoria}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    categoria: v as MenuItem["categoria"],
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>

                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {CATEGORY_LABELS[cat]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Foto */}
          <div className="space-y-2">
            <Label htmlFor="image">Foto</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {form.imageURL && (
              <Image
                src={form.imageURL}
                alt="Preview"
                width={80}
                height={80}
                className="rounded object-cover mt-2"
              />
            )}
          </div>

          {/* Disponível */}
          <div className="flex items-center justify-between rounded-md border p-3">
            <Label htmlFor="disponivel" className="cursor-pointer">
              Disponível para clientes
            </Label>

            <Switch
              id="disponivel"
              checked={form.disponivel}
              onCheckedChange={(v) =>
                setForm((p) => ({ ...p, disponivel: v }))
              }
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>

            <Button type="submit">Salvar</Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}