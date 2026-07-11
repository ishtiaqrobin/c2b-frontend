"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
  PackageX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { IProduct, IProductVariant } from "@/types/product.type";
import { deleteVariantAction, updateVariantAction } from "@/actions/product.action";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";
import VariantDialog from "./VariantDialog";
import { env } from "@/env";

interface VariantSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: IProduct | null;
  onSuccess?: () => void;
}

const fmt = (val: number | null | undefined, currency = "BDT") =>
  val != null ? `${currency} ${val.toLocaleString()}` : "—";

export default function VariantSheet({
  open,
  onOpenChange,
  product,
  onSuccess,
}: VariantSheetProps) {
  const [variants, setVariants] = useState<IProductVariant[]>([]);
  const [loading, setLoading] = useState(false);

  // Variant dialog state
  const [variantDialogOpen, setVariantDialogOpen] = useState(false);
  const [variantDialogMode, setVariantDialogMode] = useState<"add" | "edit">(
    "add",
  );
  const [selectedVariant, setSelectedVariant] =
    useState<IProductVariant | null>(null);

  // Delete dialog state
  const [deleting, setDeleting] = useState<{
    open: boolean;
    variantId: string | null;
    label: string;
  }>({ open: false, variantId: null, label: "" });

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadVariants = useCallback(async () => {
    if (!product?.id) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/products/variants?productId=${product.id}&limit=50`,
      );
      if (!res.ok) throw new Error("Failed to load variants");
      const data = await res.json();
      setVariants(data.data ?? []);
    } catch {
      toast.error("Could not load variants");
    } finally {
      setLoading(false);
    }
  }, [product?.id]);

  useEffect(() => {
    if (open && product?.id) {
      loadVariants();
    } else {
      setVariants([]);
    }
  }, [open, product?.id, loadVariants]);

  const handleAddVariant = () => {
    setVariantDialogMode("add");
    setSelectedVariant(null);
    setVariantDialogOpen(true);
  };

  const handleEditVariant = (variant: IProductVariant) => {
    setVariantDialogMode("edit");
    setSelectedVariant(variant);
    setVariantDialogOpen(true);
  };

  const handleVariantSuccess = () => {
    loadVariants();
    onSuccess?.();
  };

  const handleToggleStatus = async (variant: IProductVariant) => {
    setTogglingId(variant.id);
    try {
      const res = await updateVariantAction(variant.id, {
        isActive: !variant.isActive,
      });
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(
        `Variant marked as ${!variant.isActive ? "Active" : "Inactive"}`,
      );
      await loadVariants();
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Toggle failed");
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = (variant: IProductVariant) => {
    const label =
      [variant.storage, variant.color, variant.sku]
        .filter(Boolean)
        .join(" / ") || "this variant";
    setDeleting({ open: true, variantId: variant.id, label });
  };

  const cancelDelete = () =>
    setDeleting({ open: false, variantId: null, label: "" });

  const doDelete = async () => {
    if (!deleting.variantId) return;
    try {
      const res = await deleteVariantAction(deleting.variantId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Variant deleted");
      cancelDelete();
      await loadVariants();
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const productName =
    product?.translations?.find((t) => t.locale === "EN")?.name ??
    product?.slug ??
    "Product";

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-3xl overflow-y-auto"
        >
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="text-xl">
              Variants —{" "}
              <span className="text-primary font-semibold">{productName}</span>
            </SheetTitle>
            <SheetDescription>
              Manage storage, color, pricing, and limits per variant.
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {variants.length} variant{variants.length !== 1 ? "s" : ""}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadVariants}
                  disabled={loading}
                  className="cursor-pointer"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 mr-1 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddVariant}
                  disabled={!product?.id}
                  className="cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Variant
                </Button>
              </div>
            </div>

            {/* Variants table */}
            <div className="border rounded-md bg-gray-50">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Storage / Color</TableHead>
                    <TableHead>New Price</TableHead>
                    <TableHead>Used Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        {[...Array(6)].map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-20" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : variants.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-gray-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <PackageX className="h-8 w-8 text-gray-300" />
                          <p>No variants yet</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleAddVariant}
                            className="cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add First Variant
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    variants.map((variant) => (
                      <TableRow key={variant.id} className="align-middle">
                        <TableCell>
                          <span className="font-mono text-xs">
                            {variant.sku ?? "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            {variant.storage && (
                              <p className="text-sm">{variant.storage}</p>
                            )}
                            {variant.color && (
                              <p className="text-xs text-muted-foreground">
                                {variant.color}
                              </p>
                            )}
                            {!variant.storage && !variant.color && (
                              <span className="text-gray-400 text-sm">—</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {fmt(variant.newPrice, variant.currency)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {fmt(variant.usedPrice, variant.currency)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleToggleStatus(variant)}
                            disabled={togglingId === variant.id}
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                              variant.isActive
                                ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 border border-green-200"
                                : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700 border border-red-200"
                            }`}
                          >
                            {togglingId === variant.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${variant.isActive ? "bg-green-500" : "bg-red-500"}`}
                              />
                            )}
                            {variant.isActive ? "Active" : "Inactive"}
                          </button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 cursor-pointer"
                              onClick={() => handleEditVariant(variant)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => confirmDelete(variant)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Variant create/edit dialog */}
      {product?.id && (
        <VariantDialog
          open={variantDialogOpen}
          onOpenChange={setVariantDialogOpen}
          productId={product.id}
          variant={selectedVariant}
          mode={variantDialogMode}
          onSuccess={handleVariantSuccess}
        />
      )}

      {/* Delete confirmation */}
      <DeleteDialog
        isOpen={deleting.open}
        onClose={cancelDelete}
        onConfirm={doDelete}
        title="Delete Variant?"
        description={
          <>
            Are you sure you want to permanently delete{" "}
            <span className="font-semibold text-primary">
              &quot;{deleting.label}&quot;
            </span>
            ?
          </>
        }
      />
    </>
  );
}
