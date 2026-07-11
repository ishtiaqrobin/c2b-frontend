"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Upload, X, Eye } from "lucide-react";

import { useImageUpload } from "@/hooks/useImageUpload";
import { buildBannerFormData } from "@/services/banner.service";
import {
  createBannerAction,
  updateBannerAction,
} from "@/actions/banner.action";
import { bannerFormSchema } from "@/validations/banner.validation";
import type { IBanner } from "@/types/banner.type";

interface BannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: IBanner | null;
  mode: "add" | "edit";
  onSuccess?: () => void;
}

interface FormState {
  linkUrl: string;
  sortOrder: number;
  isActive: boolean;
}

export default function BannerDialog({
  open,
  onOpenChange,
  banner,
  mode,
  onSuccess,
}: BannerDialogProps) {
  const [form, setForm] = useState<FormState>({
    linkUrl: "",
    sortOrder: 0,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const {
    file: imageFile,
    preview: imagePreview,
    isCompressing,
    handleFileChange,
    reset: resetImage,
    inputRef,
  } = useImageUpload({});

  // Sync form when mode/banner changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && banner) {
        setForm({
          linkUrl: banner.linkUrl || "",
          sortOrder: banner.sortOrder ?? 0,
          isActive: banner.isActive,
        });
      } else {
        setForm({ linkUrl: "", sortOrder: 0, isActive: true });
      }
    }
  }, [open, mode, banner]);

  const handleClose = () => {
    resetImage();
    setForm({ linkUrl: "", sortOrder: 0, isActive: true });
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "add" && !imageFile) {
      toast.error("Banner image is required");
      return;
    }

    setSaving(true);
    const toastId = toast.loading(
      mode === "add" ? "Creating banner..." : "Updating banner...",
    );

    try {
      // Validate form with zod
      const parsed = bannerFormSchema.safeParse({
        image: imageFile || undefined,
        linkUrl: form.linkUrl || undefined,
        sortOrder: form.sortOrder,
        isActive: String(form.isActive),
      });

      if (!parsed.success) {
        const firstError = parsed.error.issues?.[0];
        const message = firstError?.message || "Invalid form data";
        toast.error(message, { id: toastId });
        return;
      }

      // Build FormData for the backend (multipart upload)
      const fd = buildBannerFormData({
        image: imageFile || undefined,
        linkUrl: form.linkUrl || undefined,
        sortOrder: form.sortOrder,
        isActive: form.isActive,
      });

      if (mode === "add") {
        const result = await createBannerAction(fd);
        if (!result.success) {
          toast.error(result.message, { id: toastId });
          return;
        }
        toast.success("Banner created successfully", { id: toastId });
      } else {
        if (!banner?.id) return;
        const result = await updateBannerAction(banner.id, fd);
        if (!result.success) {
          toast.error(result.message, { id: toastId });
          return;
        }
        toast.success("Banner updated successfully", { id: toastId });
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operation failed", {
        id: toastId,
      });
    } finally {
      setSaving(false);
    }
  };

  const isEdit = mode === "edit";
  const displayPreview = imagePreview || (isEdit && banner?.imageUrl) || null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Banner" : "Add New Banner"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the banner details. Leave image empty to keep the current one."
              : "Upload a new homepage banner image."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label
              htmlFor="image"
              className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
            >
              Image {!isEdit ? "*" : "(leave empty to keep current)"}
            </Label>

            {displayPreview ? (
              <div className="relative h-40 rounded-xl overflow-hidden border">
                <Image
                  src={displayPreview}
                  alt="Banner preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    resetImage();
                    // Clear the input value too
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="h-3 w-3 text-white" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/10">
                <div className="text-center text-muted-foreground">
                  <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No image selected</p>
                </div>
              </div>
            )}

            <input
              ref={inputRef}
              id="image"
              name="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isCompressing}
              onClick={() => inputRef.current?.click()}
              className="w-full mt-1"
            >
              {isCompressing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Compressing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {displayPreview ? "Change Image" : "Select Image"}
                </>
              )}
            </Button>
          </div>

          {/* Link URL */}
          <div className="space-y-1.5">
            <Label
              htmlFor="linkUrl"
              className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
            >
              Link URL (optional)
            </Label>
            <Input
              id="linkUrl"
              name="linkUrl"
              type="url"
              value={form.linkUrl}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, linkUrl: e.target.value }))
              }
              placeholder="https://example.com/promo"
              className="rounded-xl h-10"
            />
          </div>

          {/* Sort Order */}
          <div className="space-y-1.5">
            <Label
              htmlFor="sortOrder"
              className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
            >
              Sort Order
            </Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min={0}
              value={form.sortOrder}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  sortOrder: parseInt(e.target.value) || 0,
                }))
              }
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
              checked={form.isActive}
              onCheckedChange={(checked) =>
                setForm((prev) => ({ ...prev, isActive: checked }))
              }
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving || isCompressing}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Update Banner" : "Create Banner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
