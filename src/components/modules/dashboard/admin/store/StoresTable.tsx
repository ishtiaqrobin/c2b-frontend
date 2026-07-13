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
  Loader2,
  MoreHorizontal,
  Pencil,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import type { IStore } from "@/types/store.type";
import {
  updateStoreAction,
  deleteStoreAction,
} from "@/actions/store.action";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";
import TablePagination from "@/components/modules/shared/TablePagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StoresTableProps {
  stores: IStore[];
  loading?: boolean;
  searchQuery?: string;
  onEdit: (store: IStore) => void;
  onDeleteSuccess?: () => void;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function StoresTable({
  stores,
  loading = false,
  searchQuery = "",
  onEdit,
  onDeleteSuccess,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: StoresTableProps) {
  const [deleting, setDeleting] = useState<{
    open: boolean;
    storeId: string | null;
    name: string;
  }>({ open: false, storeId: null, name: "" });

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = async (store: IStore) => {
    setTogglingId(store.id);
    try {
      const res = await updateStoreAction(store.id, {
        isActive: !store.isActive,
      });
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(
        `Store marked as ${!store.isActive ? "Active" : "Inactive"}`,
      );
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Toggle failed");
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = (store: IStore) => {
    setDeleting({ open: true, storeId: store.id, name: store.name });
  };

  const cancelDelete = () =>
    setDeleting({ open: false, storeId: null, name: "" });

  const doDelete = async () => {
    if (!deleting.storeId) return;
    try {
      const res = await deleteStoreAction(deleting.storeId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Store deleted successfully");
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
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-center">Orders</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <TableRow key={`skeleton-${idx}`} className="align-middle">
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-9 rounded-md ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : stores.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-600"
                >
                  {searchQuery
                    ? "No stores found matching your search"
                    : "No stores found"}
                </TableCell>
              </TableRow>
            ) : (
              stores.map((store) => (
                <TableRow key={store.id} className="align-middle">
                  <TableCell>
                    <p className="font-medium line-clamp-1">{store.name}</p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 font-mono">
                      {store.slug}
                    </span>
                  </TableCell>
                  <TableCell>
                    {store.address ? (
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-40">
                          {store.address}
                        </span>
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-medium">
                      {store._count?.orders ?? 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(store)}
                      disabled={togglingId === store.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                        store.isActive
                          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 border border-green-200 hover:border-red-200"
                          : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700 border border-red-200 hover:border-green-200"
                      }`}
                    >
                      {togglingId === store.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            store.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      )}
                      {store.isActive ? "Active" : "Inactive"}
                    </button>
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
                        <DropdownMenuItem onClick={() => onEdit(store)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => confirmDelete(store)}
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
          pageCount={stores.length}
          label="stores"
          onPageChange={onPageChange}
        />
      </div>

      <DeleteDialog
        isOpen={deleting.open}
        onClose={cancelDelete}
        onConfirm={doDelete}
        title="Delete Store?"
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
