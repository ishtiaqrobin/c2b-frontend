"use client";

import { useState, useRef } from "react";
import {
  MoreHorizontal,
  Plus,
  Trash2,
  Pencil,
  ImageIcon,
  Loader2,
  ExternalLink,
  LayoutGrid,
  Eye,
  EyeOff,
  Upload,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { useCategories } from "@/hooks/useCategories";
import { bannerService } from "@/services/banner.service";
import type { IBanner } from "@/types/banner.type";

// ─── Types ────────────────────────────────────────────────────────────────────
interface BannersManagerProps {
  banners: IBanner[];
  onRefresh: () => void;
  isLoading?: boolean;
}

// ─── Field Label ──────────────────────────────────────────────────────────────
function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
    >
      {children}
    </Label>
  );
}

// ─── Image Upload Preview ─────────────────────────────────────────────────────
function ImageUploadPreview({
  previewUrl,
  onClear,
}: {
  previewUrl: string | null;
  onClear: () => void;
}) {
  if (!previewUrl) {
    return (
      <div className="flex items-center justify-center h-40 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/10">
        <div className="text-center text-muted-foreground">
          <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-xs">No image selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-40 rounded-xl overflow-hidden border">
      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
      <button
        type="button"
        onClick={onClear}
        className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
      >
        <X className="h-3 w-3 text-white" />
      </button>
    </div>
  );
}

// ─── Banner Form ──────────────────────────────────────────────────────────────
function BannerForm({
  item,
  previewUrl,
  onFileSelect,
  onClearPreview,
  categoryId,
  onCategoryChange,
}: {
  item: IBanner | null;
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onClearPreview: () => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { categories } = useCategories();

  return (
    <div className="space-y-4">
      {/* Image Upload */}
      <div className="space-y-1.5">
        <FieldLabel htmlFor="image">
          Banner Image {!item ? "*" : "(leave empty to keep current)"}
        </FieldLabel>
        <ImageUploadPreview previewUrl={previewUrl} onClear={onClearPreview} />
        <input
          ref={fileInputRef}
          id="image"
          name="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelect(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="w-full mt-1"
        >
          <Upload className="mr-2 h-4 w-4" />
          {previewUrl ? "Change Image" : "Select Image"}
        </Button>
      </div>

      {/* Link URL */}
      <div className="space-y-1.5">
        <FieldLabel htmlFor="linkUrl">Link URL (optional)</FieldLabel>
        <Input
          id="linkUrl"
          name="linkUrl"
          type="url"
          defaultValue={item?.linkUrl || ""}
          placeholder="https://example.com/promo"
          className="rounded-xl h-10"
        />
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <FieldLabel htmlFor="categoryId">Category (optional)</FieldLabel>
        <Select value={categoryId} onValueChange={onCategoryChange}>
          <SelectTrigger id="categoryId" className="rounded-xl h-10">
            <SelectValue placeholder="No category (general banner)" />
          </SelectTrigger>
          <SelectContent className="rounded-xl" position="popper">
            <SelectItem value="_none">No category (general banner)</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort Order */}
      <div className="space-y-1.5">
        <FieldLabel htmlFor="sortOrder">Sort Order</FieldLabel>
        <Input
          id="sortOrder"
          name="sortOrder"
          type="number"
          min={0}
          defaultValue={item?.sortOrder ?? 0}
          placeholder="0"
          className="rounded-xl h-10"
        />
      </div>

      {/* Active Status */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
        <Label
          htmlFor="isActive"
          className="flex items-center gap-2 cursor-pointer text-sm"
        >
          <Eye className="h-4 w-4 text-green-500" />
          Active
        </Label>
        <Switch
          id="isActive"
          name="isActive"
          defaultChecked={item ? item.isActive : true}
        />
      </div>
    </div>
  );
}

// ─── Main Manager ─────────────────────────────────────────────────────────────
export function BannersManager({
  banners,
  onRefresh,
  isLoading = false,
}: BannersManagerProps) {
  const [loading, setLoading] = useState(false);

  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<IBanner | null>(null);
  const [selectedItem, setSelectedItem] = useState<IBanner | null>(null);

  // File state for create/edit
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [createCategoryId, setCreateCategoryId] = useState("_none");
  const [editCategoryId, setEditCategoryId] = useState("_none");

  // ── Helpers ───────────────────────────────────────────────────────
  const buildFormData = (
    form: HTMLFormElement,
    hasFile: boolean,
    categoryId: string,
  ) => {
    const fd = new FormData(form);

    // Only append file if one was selected
    if (hasFile && selectedFile) {
      fd.set("image", selectedFile);
    } else if (!hasFile) {
      fd.delete("image");
    }

    // Append category if set (skip _none sentinel value)
    if (categoryId && categoryId !== "_none") {
      fd.set("categoryId", categoryId);
    }

    // Convert switch value to string "true"/"false" for backend
    const isActive = fd.get("isActive");
    if (isActive === "on") {
      fd.set("isActive", "true");
    } else {
      fd.set("isActive", "false");
    }

    return fd;
  };

  const resetFileState = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearPreview = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // ── Create ────────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) return toast.error("Banner image is required");

    setLoading(true);
    const formData = buildFormData(e.currentTarget, true, createCategoryId);
    const { error } = await bannerService.create(formData);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Banner created successfully");
      setCreateDialog(false);
      resetFileState();
      onRefresh();
    }
    setLoading(false);
  };

  // ── Edit ──────────────────────────────────────────────────────────
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedItem) return;

    setLoading(true);
    const formData = buildFormData(e.currentTarget, !!selectedFile, editCategoryId);
    const { error } = await bannerService.update(selectedItem.id, formData);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Banner updated successfully");
      setEditDialog(false);
      setSelectedItem(null);
      resetFileState();
      onRefresh();
    }
    setLoading(false);
  };

  // ── Delete ────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setLoading(true);
    const { error } = await bannerService.delete(deleteConfirm.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Banner deleted successfully");
      setDeleteConfirm(null);
      onRefresh();
    }
    setLoading(false);
  };

  // ── Skeleton ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  // ── Stats ─────────────────────────────────────────────────────────
  const activeCount = banners.filter((b) => b.isActive).length;
  const inactiveCount = banners.length - activeCount;

  // ── Render ────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total",
            value: banners.length,
            icon: <LayoutGrid className="h-4 w-4 text-primary" />,
          },
          {
            label: "Active",
            value: activeCount,
            icon: <Eye className="h-4 w-4 text-green-500" />,
          },
          {
            label: "Inactive",
            value: inactiveCount,
            icon: <EyeOff className="h-4 w-4 text-muted-foreground" />,
          },
        ].map((stat) => (
          <Card key={stat.label} className="rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                {stat.icon}
              </div>
              <div>
                <p className="text-xl font-bold leading-none">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              All Banners
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {banners.length} total · {activeCount} active
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              resetFileState();
              setCreateDialog(true);
            }}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Banner
          </Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sort Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b transition-colors hover:bg-muted/40"
                  >
                    {/* Image Preview */}
                    <TableCell>
                      <div className="relative h-14 w-24 rounded-lg overflow-hidden border shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt="Banner"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      {item.category ? (
                        <Badge variant="outline" className="text-xs font-mono">
                          {item.category.slug}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          General
                        </span>
                      )}
                    </TableCell>

                    {/* Sort Order */}
                    <TableCell className="font-medium">
                      {item.sortOrder}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant={item.isActive ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    {/* Link */}
                    <TableCell>
                      {item.linkUrl ? (
                        <a
                          href={item.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Link
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          None
                        </span>
                      )}
                    </TableCell>

                    {/* Actions Dropdown */}
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
                            onClick={() => {
                              setSelectedItem(item);
                              setEditCategoryId(item.categoryId || "_none");
                              resetFileState();
                              setEditDialog(true);
                            }}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirm(item)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}

                {banners.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p>No banners yet</p>
                      <p className="text-xs mt-1">
                        Click &quot;Add Banner&quot; to create one
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Create Dialog ──────────────────────────────────────────── */}
      <Dialog
        open={createDialog}
        onOpenChange={(open) => {
          if (!open) {
            resetFileState();
            setCreateCategoryId("_none");
          }
          setCreateDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Banner</DialogTitle>
            <DialogDescription>
              Upload a new homepage banner image.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4">
            <BannerForm
              item={null}
              previewUrl={previewUrl}
              onFileSelect={handleFileSelect}
              onClearPreview={handleClearPreview}
              categoryId={createCategoryId}
              onCategoryChange={setCreateCategoryId}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateDialog(false);
                  resetFileState();
                  setCreateCategoryId("_none");
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !selectedFile}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Banner
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ────────────────────────────────────────────── */}
      <Dialog
        open={editDialog}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null);
            resetFileState();
            setEditCategoryId("_none");
          }
          setEditDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>
              Update the banner details. Leave image empty to keep the current
              one.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEdit} className="space-y-4">
            <BannerForm
              item={selectedItem}
              previewUrl={previewUrl}
              onFileSelect={handleFileSelect}
              onClearPreview={handleClearPreview}
              categoryId={editCategoryId}
              onCategoryChange={setEditCategoryId}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditDialog(false);
                  setSelectedItem(null);
                  resetFileState();
                  setEditCategoryId("_none");
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Banner
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm Dialog ──────────────────────────────────── */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(open) => {
          if (!open) setDeleteConfirm(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this banner? The image will also
              be removed from Cloudinary. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteConfirm && (
            <div className="relative h-32 rounded-xl overflow-hidden border">
              <Image
                src={deleteConfirm.imageUrl}
                alt="Banner to delete"
                fill
                className="object-cover"
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
