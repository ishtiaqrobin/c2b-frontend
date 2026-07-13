"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Trash2,
  Loader2,
  RefreshCw,
  Undo2,
  AlertTriangle,
  ImageIcon,
  ArrowLeft,
} from "lucide-react";
import type { ICategory } from "@/types/category.type";
import {
  restoreCategoryAction,
  permanentlyDeleteCategoryAction,
} from "@/actions/category.action";

interface CategoryTrashClientProps {
  categories: ICategory[];
}

export default function CategoryTrashClient({
  categories,
}: CategoryTrashClientProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Restore state
  const [restoreTarget, setRestoreTarget] = useState<ICategory | null>(null);
  const [slugConflict, setSlugConflict] = useState(false);
  const [newSlug, setNewSlug] = useState("");

  // Permanent delete state
  const [permDeleteTarget, setPermDeleteTarget] = useState<ICategory | null>(
    null,
  );
  const [permDeleteConfirm, setPermDeleteConfirm] = useState(false);

  const handleRestore = async () => {
    if (!restoreTarget) return;
    setLoadingId(restoreTarget.id);
    const slug = slugConflict ? newSlug.trim() : undefined;
    const res = await restoreCategoryAction(restoreTarget.id, slug);
    setLoadingId(null);

    if (!res.success) {
      if (res.message?.toLowerCase().includes("slug")) {
        setSlugConflict(true);
        setNewSlug("");
        return;
      }
      toast.error(res.message);
      setRestoreTarget(null);
      setSlugConflict(false);
      return;
    }
    toast.success("Category restored");
    setRestoreTarget(null);
    setSlugConflict(false);
    setNewSlug("");
    router.refresh();
  };

  const handlePermanentDelete = async () => {
    if (!permDeleteTarget) return;
    setLoadingId(permDeleteTarget.id);
    const res = await permanentlyDeleteCategoryAction(permDeleteTarget.id);
    setLoadingId(null);

    if (!res.success) {
      toast.error(res.message);
      setPermDeleteTarget(null);
      setPermDeleteConfirm(false);
      return;
    }
    toast.success("Category permanently deleted");
    setPermDeleteTarget(null);
    setPermDeleteConfirm(false);
    router.refresh();
  };

  const openRestore = (cat: ICategory) => {
    setRestoreTarget(cat);
    setSlugConflict(false);
    setNewSlug("");
  };

  const closeRestore = () => {
    setRestoreTarget(null);
    setSlugConflict(false);
    setNewSlug("");
  };

  const openPermDelete = (cat: ICategory) => {
    setPermDeleteTarget(cat);
    setPermDeleteConfirm(false);
  };

  const closePermDelete = () => {
    setPermDeleteTarget(null);
    setPermDeleteConfirm(false);
  };

  const formatDate = (d: string | null | undefined) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin-dashboard/categories")}
            className="hover:cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Category Trash</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {categories.length} deleted {categories.length === 1 ? "category" : "categories"}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => router.refresh()}
          className="hover:cursor-pointer"
        >
          <RefreshCw size={16} className="mr-2" /> Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="bg-gray-100 border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Deleted At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-gray-600"
                >
                  <Trash2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>Trash is empty</p>
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat) => (
                <TableRow key={cat.id} className="align-middle">
                  {/* Image */}
                  <TableCell>
                    {cat.imageUrl ? (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border opacity-60">
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name || "Deleted category"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    <span className="font-medium">{cat.name || "—"}</span>
                  </TableCell>

                  {/* Slug */}
                  <TableCell>
                    <span className="text-sm text-muted-foreground font-mono">
                      {cat.slug || "—"}
                    </span>
                  </TableCell>

                  {/* Deleted At */}
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(cat.deletedAt)}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={loadingId === cat.id}
                        onClick={() => openRestore(cat)}
                        className="hover:cursor-pointer"
                      >
                        {loadingId === cat.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Undo2 className="h-4 w-4 mr-1" />
                        )}
                        Restore
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={loadingId === cat.id}
                        onClick={() => openPermDelete(cat)}
                        className="hover:cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Restore Dialog ── */}
      <Dialog
        open={!!restoreTarget}
        onOpenChange={(open) => {
          if (!open) closeRestore();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restore Category</DialogTitle>
            <DialogDescription>
              {slugConflict
                ? `The original slug "${restoreTarget?.slug}" is already taken. Provide a new slug to restore "${restoreTarget?.name}".`
                : `Restore "${restoreTarget?.name || restoreTarget?.slug}" to its original state?`}
            </DialogDescription>
          </DialogHeader>

          {slugConflict && (
            <div className="space-y-2">
              <Label
                htmlFor="new-slug"
                className="text-xs font-bold tracking-wider text-muted-foreground uppercase"
              >
                New Slug
              </Label>
              <Input
                id="new-slug"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
                placeholder="Enter a new unique slug"
                className="rounded-xl h-10 font-mono"
              />
            </div>
          )}

          {restoreTarget?.imageUrl && (
            <div className="relative h-32 rounded-xl overflow-hidden border opacity-70">
              <Image
                src={restoreTarget.imageUrl}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closeRestore}>
              Cancel
            </Button>
            <Button
              onClick={handleRestore}
              disabled={loadingId === restoreTarget?.id || (slugConflict && !newSlug.trim())}
            >
              {loadingId === restoreTarget?.id && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {slugConflict ? "Restore with New Slug" : "Restore"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Permanent Delete Dialog ── */}
      <Dialog
        open={!!permDeleteTarget}
        onOpenChange={(open) => {
          if (!open) closePermDelete();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Permanently Delete?
            </DialogTitle>
            <DialogDescription>
              {permDeleteConfirm
                ? `This will permanently delete "${permDeleteTarget?.name || permDeleteTarget?.slug}". The Cloudinary image will also be removed. This action cannot be undone.`
                : `Are you sure you want to permanently delete "${permDeleteTarget?.name || permDeleteTarget?.slug}"?`}
            </DialogDescription>
          </DialogHeader>

          {permDeleteTarget?.imageUrl && (
            <div className="relative h-32 rounded-xl overflow-hidden border opacity-60">
              <Image
                src={permDeleteTarget.imageUrl}
                alt=""
                fill
                className="object-cover"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closePermDelete}>
              Cancel
            </Button>
            {permDeleteConfirm ? (
              <Button
                variant="destructive"
                onClick={handlePermanentDelete}
                disabled={loadingId === permDeleteTarget?.id}
              >
                {loadingId === permDeleteTarget?.id && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Yes, Delete Forever
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => setPermDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Continue
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
