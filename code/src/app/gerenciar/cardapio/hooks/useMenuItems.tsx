import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/react";
import { toast } from "sonner";

type MenuItem = RouterOutputs["item"]["getAll"][number];

export function useMenuItems() {
  const utils = api.useUtils();

  const { data: items = [] } = api.item.getAll.useQuery();

  const createMutation = api.item.create.useMutation({
    onSuccess: () => utils.item.getAll.invalidate(),
  });

  const updateMutation = api.item.update.useMutation({
    onSuccess: () => utils.item.getAll.invalidate(),
  });

  const deleteMutation = api.item.delete.useMutation({
  onSuccess: () => {
    void utils.item.getAll.invalidate();
    toast.success("Item removido com sucesso.");
  },

  onError: () => {
    toast.error(
      "Não é possível excluir este item pois ele está presente em um pedido. Cancele o item do pedido primeiro."
    );
  },
});

  const setDisponivelMutation = api.item.update.useMutation({
    onSuccess: () => utils.item.getAll.invalidate(),
  });

  function addItem(item: Omit<MenuItem, "id">) {
    createMutation.mutate(item);
  }

  function updateItem(id: string, data: Partial<Omit<MenuItem, "id">>) {
    updateMutation.mutate({ id, ...data });
  }

  function deleteItem(id: string) {
    deleteMutation.mutate(id);
  }

  function setDisponivel(id: string, disponivel: boolean) {
    setDisponivelMutation.mutate({
      id,
      disponivel,
    });
  }

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    setDisponivel,
  };
}