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
  Loader2,
  ExternalLink,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import type { IBanner } from "@/types/banner.type";
import { Badge } from "@/components/ui/badge";
import {
  updateBannerAction,
  deleteBannerAction,
} from "@/actions/banner.action";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";
import TablePagination from "@/components/modules/shared/TablePagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BannersTableProps {
  banners: IBanner[];
  loading?: boolean;
  searchQuery?: string;
  onEdit: (banner: IBanner) => void;
  onDeleteSuccess?: () => void;
  // pagination
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function BannersTable({
  banners,
  loading = false,
  searchQuery = "",
  onEdit,
  onDeleteSuccess,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: BannersTableProps) {
  const [deleting, setDeleting] = useState<{
    open: boolean;
    bannerId: string | null;
    title: string;
  }>({
    open: false,
    bannerId: null,
    title: "",
  });

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = async (banner: IBanner) => {
    setTogglingId(banner.id);

    const fd = new FormData();
    fd.append("isActive", String(!banner.isActive));

    try {
      const res = await updateBannerAction(banner.id, fd);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(
        `Banner marked as ${!banner.isActive ? "Active" : "Inactive"}`,
      );
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Toggle failed");
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = (banner: IBanner) => {
    setDeleting({
      open: true,
      bannerId: banner.id,
      title: `Banner #${banner.sortOrder}`,
    });
  };

  const cancelDelete = () => {
    setDeleting({ open: false, bannerId: null, title: "" });
  };

  const doDelete = async () => {
    if (!deleting.bannerId) return;
    try {
      const res = await deleteBannerAction(deleting.bannerId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("Banner deleted successfully");
      cancelDelete();
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  const bannerTitle = (b: IBanner) =>
    b.linkUrl || `Banner (order: ${b.sortOrder})`;

  return (
    <>
      <div className="bg-gray-100 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Link URL</TableHead>
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
                    <Skeleton className="w-20 h-12 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-9 rounded-md" />
                  </TableCell>
                </TableRow>
              ))
            ) : banners.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-600"
                >
                  {searchQuery
                    ? "No banners found matching your search"
                    : "No banners found"}
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner.id} className="align-middle">
                  <TableCell>
                    <div className="relative w-20 h-12 rounded overflow-hidden">
                      <Image
                        src={banner.imageUrl}
                        alt={bannerTitle(banner)}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {banner.category ? (
                      <Badge variant="outline" className="text-xs font-mono">
                        {banner.category.slug}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        General
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {banner.linkUrl ? (
                      <a
                        href={banner.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span className="truncate max-w-50">
                          {banner.linkUrl}
                        </span>
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No link
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {banner.sortOrder}
                    </span>
                  </TableCell>

                  {/* Status Toggle Button */}
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(banner)}
                      disabled={togglingId === banner.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                        banner.isActive
                          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 border border-green-200 hover:border-red-200"
                          : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700 border border-red-200 hover:border-green-200"
                      }`}
                    >
                      {togglingId === banner.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            banner.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      )}
                      {banner.isActive ? "Active" : "Inactive"}
                    </button>
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell>
                    <div className="text-right">
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
                          <DropdownMenuItem onClick={() => onEdit(banner)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => confirmDelete(banner)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
          pageCount={banners.length}
          label="banners"
          onPageChange={onPageChange}
        />
      </div>

      <DeleteDialog
        isOpen={deleting.open}
        onClose={cancelDelete}
        onConfirm={doDelete}
        title="Delete Banner?"
        description={
          <>
            This action cannot be undone. Are you sure you want to permanently
            delete this banner{" "}
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
