"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";

import {
  buybackFeatureFormSchema,
  type BuybackFeatureFormValues,
} from "@/validations/buybackFeature.validation";
import type { IBuybackFeature } from "@/types/buybackFeature.type";
import { useImageUpload } from "@/hooks/useImageUpload";
import { buildBuybackFeatureFormData } from "@/services/buybackFeature.service";
import {
  createBuybackFeatureAction,
  updateBuybackFeatureAction,
} from "@/actions/buybackFeature.action";

interface BuybackFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: IBuybackFeature | null;
  mode: "add" | "edit";
  onSuccess?: () => void;
}

export default function BuybackFeaturesDialog({
  open,
  onOpenChange,
  feature,
  mode,
  onSuccess,
}: BuybackFeaturesDialogProps) {
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BuybackFeatureFormValues>({
    resolver: zodResolver(buybackFeatureFormSchema),
    defaultValues: {
      title: "",
      description: "",
      sortOrder: 0,
    },
  });

  const {
    file: imageFile,
    preview: imagePreview,
    isCompressing,
    handleFileChange,
    reset: resetImage,
    inputRef,
  } = useImageUpload({});

  const sortOrder = watch("sortOrder");

  useEffect(() => {
    if (open) {
      if (mode === "edit" && feature) {
        reset({
          title: feature.title || "",
          description: feature.description || "",
          sortOrder: feature.sortOrder ?? 0,
        });
        resetImage();
      } else if (mode === "add") {
        reset({
          title: "",
          description: "",
          sortOrder: 0,
        });
        resetImage();
      }
    }
  }, [open, mode, feature, reset, resetImage]);

  const handleClose = () => {
    resetImage();
    reset();
    onOpenChange(false);
  };

  const onSubmit = async (values: BuybackFeatureFormValues) => {
    setSaving(true);
    const toastId = toast.loading(
      mode === "add"
        ? "Creating feature..."
        : "Updating feature...",
    );

    try {
      const fd = buildBuybackFeatureFormData({
        image: imageFile || undefined,
        title: values.title.trim(),
        description: values.description.trim(),
        sortOrder: values.sortOrder ?? 0,
      });

      if (mode === "add") {
        const res = await createBuybackFeatureAction(fd);
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Buyback feature created successfully", { id: toastId });
      } else if (mode === "edit" && feature?.id) {
        const res = await updateBuybackFeatureAction(feature.id, fd);
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Buyback feature updated successfully", { id: toastId });
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
  const displayPreview =
    imagePreview || (isEdit && feature?.imageUrl) || null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Buyback Feature" : "Add New Buyback Feature"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the feature details. Leave image empty to keep the current one."
              : "Create a new buyback feature for the homepage."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  alt="Feature preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    resetImage();
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

          {/* Title */}
          <div className="space-y-1.5">
            <Label
              htmlFor="title"
              className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
            >
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              className="rounded-xl h-10 bg-white"
              placeholder="Enter feature title"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
            >
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              className="rounded-xl min-h-24 bg-white"
              placeholder="Enter feature description"
            />
            {errors.description && (
              <p className="text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
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
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) =>
                setValue("sortOrder", parseInt(e.target.value) || 0)
              }
              placeholder="0"
              className="rounded-xl h-10"
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
              {isEdit ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
