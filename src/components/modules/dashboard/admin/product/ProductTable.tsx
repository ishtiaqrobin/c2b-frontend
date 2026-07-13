"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Trash2,
  Loader2,
  MoreHorizontal,
  Pencil,
  Layers,
  ImageOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IProduct } from "@/types/product.type";
import { updateProductAction, deleteProductAction } from "@/actions/product.action";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";
import TablePagination from "@/components/modules/shared/TablePagination";

interface ProductTableProps {
  products: IProduct[];
  loading?: boolean;
  searchQuery?: string;
  onEdit: (product: IProduct) => void;
  onManageVariants: (product: IProduct) => void;
  onDeleteSuccess?: () => void;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function ProductTable({
  products,
  loading = false,
  searchQuery = "",
  onEdit,
  onManageVariants,
  onDeleteSuccess,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: ProductTableProps) {
  const [deleting, setDeleting] = useState<{
    open: boolean;
    productId: string | null;
    name: string;
  }>({ open: false, productId: null, name: "" });

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = async (product: IProduct) => {
    setTogglingId(product.id);
    try {
      const fd = new FormData();
      fd.append("data", JSON.stringify({ isActive: !product.isActive }));
      const res = await updateProductAction(product.id, fd);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(
        `Product marked as ${!product.isActive ? "Active" : "Inactive"}`,
      );
      onDeleteSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Toggle failed");
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = (product: IProduct) => {
    setDeleting({ open: true, productId: product.id, name: product.name || product.slug });
  };

  const cancelDelete = () =>
    setDeleting({ open: false, productId: null, name: "" });

  const doDelete = async () => {
    if (!deleting.productId) return;
    try {
      const res = await deleteProductAction(deleting.productId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Product deleted successfully");
      cancelDelete();
      onDeleteSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const productName = (p: IProduct) => p.name || p.slug;

  const categoryName = (p: IProduct) => p.category?.name ?? p.category?.slug ?? "—";

  return (
    <>
      <div className="bg-gray-100 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-14">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Variants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i} className="align-middle">
                  <TableCell>
                    <Skeleton className="h-10 w-10 rounded-md" />
                  </TableCell>
                  {[...Array(5)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-9 rounded-md ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-600"
                >
                  {searchQuery
                    ? "No products found matching your search"
                    : "No products found"}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="align-middle">
                  {/* Image */}
                  <TableCell>
                    {product.imageUrl ? (
                      <div className="relative h-10 w-10 rounded-md overflow-hidden border bg-gray-50">
                        <Image
                          src={product.imageUrl}
                          alt={productName(product)}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-md border bg-gray-50 flex items-center justify-center">
                        <ImageOff className="h-4 w-4 text-gray-400" />
                      </div>
                    )}
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    <p className="font-medium line-clamp-1">
                      {productName(product)}
                    </p>
                  </TableCell>

                  {/* Slug */}
                  <TableCell>
                    <span className="text-sm text-gray-600 font-mono">
                      {product.slug}
                    </span>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {categoryName(product)}
                    </Badge>
                  </TableCell>

                  {/* Variants count */}
                  <TableCell className="text-center">
                    <span className="inline-flex items-center gap-1 text-sm font-medium">
                      <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                      {product._count?.variants ?? product.variants?.length ?? 0}
                    </span>
                  </TableCell>

                  {/* Status toggle */}
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(product)}
                      disabled={togglingId === product.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                        product.isActive
                          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 border border-green-200 hover:border-red-200"
                          : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700 border border-red-200 hover:border-green-200"
                      }`}
                    >
                      {togglingId === product.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            product.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      )}
                      {product.isActive ? "Active" : "Inactive"}
                    </button>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onManageVariants(product)}
                        >
                          <Layers className="mr-2 h-4 w-4" />
                          Manage Variants
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(product)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => confirmDelete(product)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          page={page}
          totalPages={totalPages}
          total={total}
          limit={limit}
          pageCount={products.length}
          label="products"
          onPageChange={onPageChange}
        />
      </div>

      <DeleteDialog
        isOpen={deleting.open}
        onClose={cancelDelete}
        onConfirm={doDelete}
        title="Delete Product?"
        description={
          <>
            This action cannot be undone. Are you sure you want to permanently
            delete{" "}
            <span className="font-semibold text-primary">
              &quot;{deleting.name}&quot;
            </span>
            ?
          </>
        }
      />
    </>
  );
}
