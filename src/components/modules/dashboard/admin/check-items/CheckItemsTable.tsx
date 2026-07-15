"use client";

import { useState } from "react";
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
import {
  Trash2,
  MoreHorizontal,
  Pencil,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import type { ICategoryCheckItem } from "@/types/checkItem.type";
import { deleteCheckItemAction } from "@/actions/checkItem.action";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";
import TablePagination from "@/components/modules/shared/TablePagination";

interface CheckItemsTableProps {
  items: ICategoryCheckItem[];
  loading?: boolean;
  searchQuery?: string;
  onEdit: (item: ICategoryCheckItem) => void;
  onDeleteSuccess?: () => void;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function CheckItemsTable({
  items,
  loading = false,
  searchQuery = "",
  onEdit,
  onDeleteSuccess,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: CheckItemsTableProps) {
  const [deleting, setDeleting] = useState<{
    open: boolean;
    id: string | null;
    content: string;
  }>({
    open: false,
    id: null,
    content: "",
  });

  const confirmDelete = (item: ICategoryCheckItem) => {
    setDeleting({
      open: true,
      id: item.id,
      content: item.content,
    });
  };

  const cancelDelete = () => {
    setDeleting({ open: false, id: null, content: "" });
  };

  const doDelete = async () => {
    if (!deleting.id) return;
    try {
      const res = await deleteCheckItemAction(deleting.id);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Check item deleted successfully");
      cancelDelete();
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  return (
    <>
      <div className="bg-gray-100 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <TableRow key={`skeleton-${idx}`} className="align-middle">
                  <TableCell>
                    <Skeleton className="h-4 w-6" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-80" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-9 rounded-md ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-600"
                >
                  {searchQuery
                    ? "No check items found matching your search"
                    : "No check items found"}
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, idx) => (
                <TableRow key={item.id} className="align-middle">
                  <TableCell className="text-muted-foreground text-sm">
                    {(page - 1) * limit + idx + 1}
                  </TableCell>
                  <TableCell className="font-medium max-w-32 truncate">
                    {item.category?.name || "—"}
                  </TableCell>
                  <TableCell className="max-w-md truncate text-sm text-muted-foreground">
                    {item.content}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {item.sortOrder}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {item.isActive ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-1 h-3 w-3" /> Inactive
                        </>
                      )}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => onEdit(item)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => confirmDelete(item)}
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
          pageCount={items.length}
          label="check items"
          onPageChange={onPageChange}
        />
      </div>

      <DeleteDialog
        isOpen={deleting.open}
        onClose={cancelDelete}
        onConfirm={doDelete}
        title="Delete Check Item?"
        description={
          <>
            This action cannot be undone. Are you sure you want to permanently
            delete this check item{" "}
            {/* <span className="font-semibold text-primary">
              &quot;{deleting.content}&quot;
            </span> */}
            ?
          </>
        }
      />
    </>
  );
}
