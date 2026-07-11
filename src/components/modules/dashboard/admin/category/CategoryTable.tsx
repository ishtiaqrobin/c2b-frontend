"use client";

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
import { Trash2, Loader2, MoreHorizontal, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ICategory } from "@/types/category.type";
import { updateCategory, deleteCategory } from "@/actions/category.action";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";
import TablePagination from "@/components/modules/shared/TablePagination";

interface CategoryTableProps {
  categories: ICategory[];
  loading?: boolean;
  searchQuery?: string;
  onEdit: (category: ICategory) => void;
  onDeleteSuccess?: () => void;
  // pagination
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function CategoryTable({
  categories,
  loading = false,
  searchQuery = "",
  onEdit,
  onDeleteSuccess,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: CategoryTableProps) {
  const [deleting, setDeleting] = useState<{
    open: boolean;
    categoryId: string | null;
    name: string;
  }>({
    open: false,
    categoryId: null,
    name: "",
  });

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = async (category: ICategory) => {
    setTogglingId(category.id);
    try {
      const res = await updateCategory(category.id, {
        isActive: !category.isActive,
      });
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(
        `Category marked as ${!category.isActive ? "Active" : "Inactive"}`,
      );
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Toggle failed");
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = (category: ICategory) => {
    const name =
      category.translations?.[0]?.name || category.slug || "this category";
    setDeleting({ open: true, categoryId: category.id, name });
  };

  const cancelDelete = () => {
    setDeleting({ open: false, categoryId: null, name: "" });
  };

  const doDelete = async () => {
    if (!deleting.categoryId) return;
    try {
      const res = await deleteCategory(deleting.categoryId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Category deleted successfully");
      cancelDelete();
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  const categoryName = (cat: ICategory) =>
    cat.translations?.[0]?.name || cat.slug || "—";

  return (
    <>
      <div className="bg-gray-100 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(6)].map((_, idx) => (
                <TableRow key={`skeleton-${idx}`} className="align-middle">
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="">
                    <Skeleton className="h-4 w-64" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-14 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-9 rounded-md ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-600"
                >
                  {searchQuery
                    ? "No categories found matching your search"
                    : "No categories found"}
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} className="align-middle">
                  <TableCell>
                    <span className="font-medium">
                      {categoryName(category)}
                    </span>
                  </TableCell>
                  <TableCell className="">
                    <span className="text-gray-700 text-sm">
                      {category.slug || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(category)}
                      disabled={togglingId === category.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                        category.isActive
                          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 border border-green-200 hover:border-red-200"
                          : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700 border border-red-200 hover:border-green-200"
                      }`}
                    >
                      {togglingId === category.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            category.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      )}
                      {category.isActive ? "Active" : "Inactive"}
                    </button>
                  </TableCell>

                  {/* Action Dropdown */}
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
                        <DropdownMenuItem onClick={() => onEdit(category)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => confirmDelete(category)}
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
          pageCount={categories.length}
          label="categories"
          onPageChange={onPageChange}
        />
      </div>

      <DeleteDialog
        isOpen={deleting.open}
        onClose={cancelDelete}
        onConfirm={doDelete}
        title="Delete Category?"
        description={
          <>
            This action cannot be undone. Are you sure you want to permanently
            delete this category{" "}
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
