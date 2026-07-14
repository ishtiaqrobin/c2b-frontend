"use client";

import { useState } from "react";
import Image from "next/image";
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
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { IBuybackFeature } from "@/types/buybackFeature.type";
import { deleteBuybackFeatureAction } from "@/actions/buybackFeature.action";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";
import TablePagination from "@/components/modules/shared/TablePagination";

interface BuybackFeaturesTableProps {
  features: IBuybackFeature[];
  loading?: boolean;
  searchQuery?: string;
  onEdit: (feature: IBuybackFeature) => void;
  onDeleteSuccess?: () => void;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function BuybackFeaturesTable({
  features,
  loading = false,
  searchQuery = "",
  onEdit,
  onDeleteSuccess,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: BuybackFeaturesTableProps) {
  const [deleting, setDeleting] = useState<{
    open: boolean;
    id: string | null;
    title: string;
  }>({
    open: false,
    id: null,
    title: "",
  });

  const confirmDelete = (feature: IBuybackFeature) => {
    setDeleting({
      open: true,
      id: feature.id,
      title: feature.title,
    });
  };

  const cancelDelete = () => {
    setDeleting({ open: false, id: null, title: "" });
  };

  const doDelete = async () => {
    if (!deleting.id) return;
    try {
      const res = await deleteBuybackFeatureAction(deleting.id);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Buyback feature deleted successfully");
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
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <TableRow key={`skeleton-${idx}`} className="align-middle">
                  <TableCell>
                    <Skeleton className="w-20 h-12 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-60" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-8" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-9 rounded-md ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : features.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-600"
                >
                  {searchQuery
                    ? "No features found matching your search"
                    : "No buyback features found"}
                </TableCell>
              </TableRow>
            ) : (
              features.map((feature) => (
                <TableRow key={feature.id} className="align-middle">
                  <TableCell>
                    <div className="relative w-20 h-12 border rounded overflow-hidden">
                      <Image
                        src={feature.imageUrl}
                        alt={feature.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium max-w-40 truncate">
                    {feature.title}
                  </TableCell>
                  <TableCell className="max-w-60 truncate text-sm text-muted-foreground">
                    {feature.description}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {feature.sortOrder}
                    </span>
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
                        <DropdownMenuItem onClick={() => onEdit(feature)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => confirmDelete(feature)}
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
          pageCount={features.length}
          label="features"
          onPageChange={onPageChange}
        />
      </div>

      <DeleteDialog
        isOpen={deleting.open}
        onClose={cancelDelete}
        onConfirm={doDelete}
        title="Delete Buyback Feature?"
        description={
          <>
            This action cannot be undone. Are you sure you want to permanently
            delete this feature{" "}
            <span className="font-semibold text-primary">
              &quot;{deleting.title}&quot;
            </span>
            ? The image will also be removed from Cloudinary.
          </>
        }
      />
    </>
  );
}
