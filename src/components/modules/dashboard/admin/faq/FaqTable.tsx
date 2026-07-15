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
} from "lucide-react";
import { toast } from "sonner";
import type { IFaq } from "@/types/faq.type";
import {
  updateFaqAction,
  deleteFaqAction,
} from "@/actions/faq.action";
import DeleteDialog from "@/components/modules/shared/DeleteDialog";
import TablePagination from "@/components/modules/shared/TablePagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FaqTableProps {
  faqs: IFaq[];
  loading?: boolean;
  searchQuery?: string;
  onEdit: (faq: IFaq) => void;
  onDeleteSuccess?: () => void;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function FaqTable({
  faqs,
  loading = false,
  searchQuery = "",
  onEdit,
  onDeleteSuccess,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: FaqTableProps) {
  const [deleting, setDeleting] = useState<{
    open: boolean;
    faqId: string | null;
    title: string;
  }>({
    open: false,
    faqId: null,
    title: "",
  });

  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggleStatus = async (faq: IFaq) => {
    setTogglingId(faq.id);

    try {
      const res = await updateFaqAction(faq.id, { isActive: !faq.isActive });
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success(
        `FAQ marked as ${!faq.isActive ? "Active" : "Inactive"}`,
      );
      onDeleteSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Toggle failed");
    } finally {
      setTogglingId(null);
    }
  };

  const confirmDelete = (faq: IFaq) => {
    setDeleting({
      open: true,
      faqId: faq.id,
      title: faq.question,
    });
  };

  const cancelDelete = () => {
    setDeleting({ open: false, faqId: null, title: "" });
  };

  const doDelete = async () => {
    if (!deleting.faqId) return;
    try {
      const res = await deleteFaqAction(deleting.faqId);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      toast.success("FAQ deleted successfully");
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
              <TableHead className="w-12">#</TableHead>
              <TableHead>Question</TableHead>
              <TableHead className="max-w-md">Answer</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <TableRow key={`skeleton-${idx}`} className="align-middle">
                  <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-9 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : faqs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-600"
                >
                  {searchQuery
                    ? "No FAQs found matching your search"
                    : "No FAQs found"}
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((faq, idx) => (
                <TableRow key={faq.id} className="align-middle">
                  <TableCell className="text-sm text-muted-foreground">
                    {(page - 1) * limit + idx + 1}
                  </TableCell>
                  <TableCell className="font-medium max-w-xs truncate">
                    {faq.question}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-md truncate">
                    {faq.answer}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium">
                      {faq.sortOrder}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(faq)}
                      disabled={togglingId === faq.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                        faq.isActive
                          ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 border border-green-200 hover:border-red-200"
                          : "bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700 border border-red-200 hover:border-green-200"
                      }`}
                    >
                      {togglingId === faq.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            faq.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      )}
                      {faq.isActive ? "Active" : "Inactive"}
                    </button>
                  </TableCell>
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
                          <DropdownMenuItem onClick={() => onEdit(faq)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => confirmDelete(faq)}
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
          pageCount={faqs.length}
          label="faqs"
          onPageChange={onPageChange}
        />
      </div>

      <DeleteDialog
        isOpen={deleting.open}
        onClose={cancelDelete}
        onConfirm={doDelete}
        title="Delete FAQ?"
        description={
          <>
            This action cannot be undone. Are you sure you want to permanently
            delete this FAQ{" "}
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
