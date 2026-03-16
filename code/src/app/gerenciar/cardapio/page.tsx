'use client'
import { useState, useMemo } from "react";
import Button from "../../_components/button";
import { Plus } from "lucide-react";
import { useMenuItems } from "./hooks/useMenuItems";
import { MenuFilters } from "./components/MenuFilters";
import { MenuTable } from "./components/MenuTable";
import { MenuItemModal } from "./components/MenuItemModal";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import type { RouterOutputs } from "~/trpc/react";
import { NavBar } from "~/app/_components/navbar";

type MenuItem = RouterOutputs["item"]["getAll"][number];

const Index = () => {
  const { items, addItem, updateItem, deleteItem, setDisponivel } =
    useMenuItems();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.nome
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || item.categoria === categoryFilter;

      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && item.disponivel) ||
        (availabilityFilter === "unavailable" && !item.disponivel);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [items, search, categoryFilter, availabilityFilter]);

  const handleNewItem = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSave = (data: Omit<MenuItem, "id">) => {
    if (editingItem) {
      updateItem(editingItem.id, data);
    } else {
      addItem(data);
    }
  };

  const handleDeleteClick = (item: MenuItem) => {
    setDeletingItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingItem) {
      deleteItem(deletingItem.id);
    }
    setDeleteDialogOpen(false);
    setDeletingItem(null);
  };

  const handleToggleAvailability = (item: MenuItem) => {
    setDisponivel(item.id, !item.disponivel);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-foreground">
            Gerenciar Cardápio
          </h1>

          <Button onClick={handleNewItem}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Item
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <MenuFilters
            search={search}
            onSearchChange={setSearch}
            category={categoryFilter}
            onCategoryChange={setCategoryFilter}
            availability={availabilityFilter}
            onAvailabilityChange={setAvailabilityFilter}
          />
        </div>

        {/* Table */}
        <MenuTable
          items={filteredItems}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onToggleAvailability={handleToggleAvailability}
        />

        {/* Item count */}
        <p className="mt-3 text-sm text-muted-foreground">
          {filteredItems.length} item(ns) encontrado(s)
        </p>
      </div>

      {/* Modals */}
      <MenuItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        item={deletingItem}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Index;