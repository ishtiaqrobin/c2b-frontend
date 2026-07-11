"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Loader2, MoreHorizontal, Pencil } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { INews } from "@/types/news.type";
import { updateNewsAction, deleteNewsAction } from "@/actions/news.action";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";
import TablePagination from "@/components/modules/shared/TablePagination";

interface NewsTableProps {
  news: INews[];
  loading?: boolean;
  searchQuery?: string;
  onEdit: (news: INews) => void;
  onDeleteSuccess?: () => void;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function NewsTable({
  news,
  loading = false,
  searchQuery = "",
  onEdit,
  onDeleteSuccess,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: NewsTableProps) {
  const [deleting, setDeleting] = useState<{
    open: boolean;
    newsId: string | null;
    title: string;
  }>({ open: false, newsId: null, title: "" });

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = async (item: INews) => {
    setTogglingId(item.id);
    try {
      const res = await updateNewsAction(item.id, { isActive: !item.isActive });
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(`News marked as ${!item.isActive ? "Active" : "Inactive"}`);
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Toggle failed");
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = (item: INews) => {
    const title =
      item.translations?.find((t) => t.locale === "EN")?.title ||
      item.translations?.[0]?.title ||
      "this news";
    setDeleting({ open: true, newsId: item.id, title });
  };

  const cancelDelete = () =>
    setDeleting({ open: false, newsId: null, title: "" });

  const doDelete = async () => {
    if (!deleting.newsId) return;
    try {
      const res = await deleteNewsAction(deleting.newsId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("News deleted successfully");
      cancelDelete();
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  const newsTitle = (item: INews) =>
    item.translations?.find((t) => t.locale === "EN")?.title ||
    item.translations?.[0]?.title ||
    "—";

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <div className="bg-gray-100 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Published At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(6)].map((_, idx) => (
                <TableRow key={`skeleton-${idx}`} className="align-middle">
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-14 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-9 rounded-md ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : news.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-600"
                >
                  {searchQuery
                    ? "No news found matching your search"
                    : "No news found"}
                </TableCell>
              </TableRow>
            ) : (
              news.map((item) => (
                <TableRow key={item.id} className="align-middle">
                  <TableCell>
                    <span className="font-medium line-clamp-1">
                      {newsTitle(item)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-700 text-sm">
                      {formatDate(item.publishedAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(item)}
                      disabled={togglingId === item.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                        item.isActive
                          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 border border-green-200 hover:border-red-200"
                          : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700 border border-red-200 hover:border-green-200"
                      }`}
                    >
                      {togglingId === item.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      )}
                      {item.isActive ? "Active" : "Inactive"}
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
          pageCount={news.length}
          label="news"
          onPageChange={onPageChange}
        />
      </div>

      <DeleteDialog
        isOpen={deleting.open}
        onClose={cancelDelete}
        onConfirm={doDelete}
        title="Delete News?"
        description={
          <>
            This action cannot be undone. Are you sure you want to permanently
            delete{" "}
            <span className="font-semibold text-primary">
              &quot;{deleting.title}&quot;
            </span>
            ?
          </>
        }
      />
    </>
  );
}
