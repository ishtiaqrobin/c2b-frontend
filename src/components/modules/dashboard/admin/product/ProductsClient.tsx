"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, RefreshCw } from "lucide-react";
import type { IProduct } from "@/types/product.type";
import type { ICategory } from "@/types/category.type";
import ProductTable from "./ProductTable";
import ProductDialog from "./ProductDialog";
import VariantSheet from "./VariantSheet";

const PAGE_SIZE = 10;

interface ProductsClientProps {
  products: IProduct[];
  categories: ICategory[];
  showInactiveDefault: boolean;
}

export default function ProductsClient({
  products,
  categories,
  showInactiveDefault,
}: ProductsClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  // Product dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  // Variant sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetProduct, setSheetProduct] = useState<IProduct | null>(null);

  const handleToggleInactive = (checked: boolean) => {
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set("isActive", "false");
    } else {
      params.delete("isActive");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setQuery("");
    setCategoryFilter("ALL");
    setPage(1);
    router.push(pathname);
  };

  const handleSuccess = () => router.refresh();

  const handleAdd = () => {
    setDialogMode("add");
    setSelectedProduct(null);
    setDialogOpen(true);
  };

  const handleEdit = (product: IProduct) => {
    setDialogMode("edit");
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleManageVariants = (product: IProduct) => {
    setSheetProduct(product);
    setSheetOpen(true);
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (categoryFilter !== "ALL") {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.slug.toLowerCase().includes(q) ||
          p.translations?.some((t) => t.name.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [products, categoryFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = useMemo(
    () => Math.min(page, totalPages),
    [page, totalPages],
  );
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  return (
    <div className="mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search products..."
            className="bg-white w-full md:w-[220px]"
          />
          <Select
            value={categoryFilter}
            onValueChange={(v) => {
              setCategoryFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="bg-white w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="ALL">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.translations?.[0]?.name ?? c.slug}
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
              <Plus size={16} className="mr-2" /> Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Inactive toggle */}
      <div className="flex items-center gap-2">
        <Switch
          id="show-inactive"
          checked={showInactiveDefault}
          onCheckedChange={handleToggleInactive}
          className="hover:cursor-pointer"
        />
        <label
          htmlFor="show-inactive"
          className="text-sm font-medium hover:cursor-pointer"
        >
          Show inactive products
        </label>
      </div>

      {/* Table */}
      <ProductTable
        products={paginatedProducts}
        searchQuery={query}
        onEdit={handleEdit}
        onManageVariants={handleManageVariants}
        onDeleteSuccess={handleSuccess}
        page={safePage}
        totalPages={totalPages}
        total={filteredProducts.length}
        limit={PAGE_SIZE}
        onPageChange={setPage}
      />

      {/* Product create / edit dialog */}
      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        mode={dialogMode}
        categories={categories}
        onSuccess={handleSuccess}
      />

      {/* Variant management sheet */}
      <VariantSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        product={sheetProduct}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
