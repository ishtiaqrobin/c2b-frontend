"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, RefreshCw } from "lucide-react";
import type { ICategoryCheckItem } from "@/types/checkItem.type";
import type { ICategory } from "@/types/category.type";
import CheckItemsTable from "./CheckItemsTable";
import CheckItemsDialog from "./CheckItemsDialog";

const PAGE_SIZE = 10;

interface CheckItemsClientProps {
  items: ICategoryCheckItem[];
  categories: ICategory[];
}

export default function CheckItemsClient({
  items,
  categories,
}: CheckItemsClientProps) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] =
    useState<ICategoryCheckItem | null>(null);

  const handleReset = () => {
    setQuery("");
    setCategoryFilter("all");
    setPage(1);
  };

  const handleSuccess = () => {
    router.refresh();
  };

  const handleAdd = () => {
    setDialogMode("add");
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (item: ICategoryCheckItem) => {
    setDialogMode("edit");
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (categoryFilter !== "all") {
      filtered = filtered.filter((i) => i.categoryId === categoryFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter((i) =>
        i.content?.toLowerCase().includes(q),
      );
    }
    return filtered;
  }, [items, query, categoryFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredItems.length / PAGE_SIZE),
  );
  const safePage = useMemo(
    () => Math.min(page, totalPages),
    [page, totalPages],
  );
  const paginatedItems = filteredItems.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-3xl font-bold">Check Items</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items..."
            className="bg-white w-full md:w-[250px]"
          />
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="bg-white w-full md:w-[220px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="hover:cursor-pointer"
              onClick={handleReset}
            >
              <RefreshCw size={16} className="mr-2" /> Reset
            </Button>
            <Button className="hover:cursor-pointer" onClick={handleAdd}>
              <Plus size={16} className="mr-2" /> Add Item
            </Button>
          </div>
        </div>
      </div>

      <CheckItemsTable
        items={paginatedItems}
        searchQuery={query}
        onEdit={handleEdit}
        onDeleteSuccess={handleSuccess}
        page={safePage}
        totalPages={totalPages}
        total={filteredItems.length}
        limit={PAGE_SIZE}
        onPageChange={setPage}
      />

      <CheckItemsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={selectedItem}
        categories={categories}
        mode={dialogMode}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
