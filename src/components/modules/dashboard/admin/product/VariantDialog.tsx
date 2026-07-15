"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  variantFormSchema,
  type VariantFormValues,
} from "@/validations/product.validation";
import type { IProductVariant } from "@/types/product.type";
import {
  createVariantAction,
  createVariantWithImageAction,
  updateVariantWithImageAction,
} from "@/actions/product.action";
import { useImageUpload } from "@/hooks/useImageUpload";
import { productService } from "@/services/product.service";

interface VariantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  variant?: IProductVariant | null;
  mode: "add" | "edit";
  onSuccess?: () => void;
}

export default function VariantDialog({
  open,
  onOpenChange,
  productId,
  variant,
  mode,
  onSuccess,
}: VariantDialogProps) {
  const {
    file: imageFile,
    preview: imagePreview,
    isCompressing,
    handleFileChange,
    reset: resetImage,
    inputRef,
  } = useImageUpload({});

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VariantFormValues>({
    resolver: zodResolver(variantFormSchema) as Resolver<VariantFormValues>,
    defaultValues: {
      sku: "",
      storage: "",
      color: "",
      image: undefined,
      newPrice: undefined,
      usedPrice: undefined,
      currency: "BDT",
      maxQuantityPerOrder: undefined,
      dailyPurchaseLimit: undefined,
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (open && mode === "edit" && variant) {
      reset({
        sku: variant.sku ?? "",
        storage: variant.storage ?? "",
        color: variant.color ?? "",
        image: undefined,
        newPrice: variant.newPrice ?? undefined,
        usedPrice: variant.usedPrice ?? undefined,
        currency: variant.currency ?? "BDT",
        maxQuantityPerOrder: variant.maxQuantityPerOrder ?? undefined,
        dailyPurchaseLimit: variant.dailyPurchaseLimit ?? undefined,
        isActive: Boolean(variant.isActive),
      });
    } else if (open && mode === "add") {
      reset({
        sku: "",
        storage: "",
        color: "",
        image: undefined,
        newPrice: undefined,
        usedPrice: undefined,
        currency: "BDT",
        maxQuantityPerOrder: undefined,
        dailyPurchaseLimit: undefined,
        isActive: true,
      });
      resetImage();
    }
  }, [open, mode, variant, reset, resetImage]);

  const onSubmit = async (values: VariantFormValues) => {
    const toastId = toast.loading(
      mode === "add" ? "Creating variant..." : "Updating variant...",
    );

    try {
      if (mode === "add") {
        if (imageFile) {
          const fd = productService.buildVariantFormData({
            ...values,
            image: imageFile,
          });
          const res = await createVariantWithImageAction(productId, fd);
          if (!res.success) {
            toast.error(res.message, { id: toastId });
            return;
          }
        } else {
          const payload = {
            sku: values.sku || undefined,
            storage: values.storage || undefined,
            color: values.color || undefined,
            newPrice: values.newPrice,
            usedPrice: values.usedPrice,
            currency: values.currency || "BDT",
            maxQuantityPerOrder: values.maxQuantityPerOrder,
            dailyPurchaseLimit: values.dailyPurchaseLimit,
            isActive: values.isActive,
          };
          const res = await createVariantAction(productId, payload);
          if (!res.success) {
            toast.error(res.message, { id: toastId });
            return;
          }
        }
        toast.success("Variant created successfully", { id: toastId });
      } else if (mode === "edit" && variant?.id) {
        const fd = productService.buildVariantFormData({
          ...values,
          image: imageFile || undefined,
        });
        const res = await updateVariantWithImageAction(variant.id, fd);
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Variant updated successfully", { id: toastId });
      }

      onSuccess?.();
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Operation failed", {
        id: toastId,
      });
    }
  };

  const handleClose = () => {
    resetImage();
    reset();
    onOpenChange(false);
  };

  const isEdit = mode === "edit";
  const displayPreview =
    imagePreview || (isEdit && variant?.imageUrl) || null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Variant" : "Edit Variant"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new variant to this product."
              : "Update variant information."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label
              htmlFor="variantImage"
              className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
            >
              Image{" "}
              {isEdit
                ? "(leave empty to keep current)"
                : "(optional)"}
            </Label>

            {displayPreview ? (
              <div className="relative h-40 rounded-xl overflow-hidden border">
                <Image
                  src={displayPreview}
                  alt="Variant preview"
                  fill
                  className="object-contain"
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
              id="variantImage"
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

          {/* SKU + Storage */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="sku"
                className="text-sm font-medium text-gray-800"
              >
                SKU
              </label>
              <Input
                id="sku"
                {...register("sku")}
                className="bg-white font-mono text-sm"
                placeholder="SKU-001"
              />
              {errors.sku && (
                <p className="text-xs text-destructive">{errors.sku.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="storage"
                className="text-sm font-medium text-gray-800"
              >
                Storage
              </label>
              <Input
                id="storage"
                {...register("storage")}
                className="bg-white"
                placeholder="128GB"
              />
              {errors.storage && (
                <p className="text-xs text-destructive">
                  {errors.storage.message}
                </p>
              )}
            </div>
          </div>

          {/* Color + Currency */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="color"
                className="text-sm font-medium text-gray-800"
              >
                Color
              </label>
              <Input
                id="color"
                {...register("color")}
                className="bg-white"
                placeholder="Black"
              />
              {errors.color && (
                <p className="text-xs text-destructive">
                  {errors.color.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="currency"
                className="text-sm font-medium text-gray-800"
              >
                Currency
              </label>
              <Input
                id="currency"
                {...register("currency")}
                className="bg-white"
                placeholder="BDT"
              />
              {errors.currency && (
                <p className="text-xs text-destructive">
                  {errors.currency.message}
                </p>
              )}
            </div>
          </div>

          {/* New Price + Used Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="newPrice"
                className="text-sm font-medium text-gray-800"
              >
                New Price
              </label>
              <Input
                id="newPrice"
                type="number"
                step="0.01"
                min={0}
                {...register("newPrice", { valueAsNumber: true })}
                className="bg-white"
                placeholder="0.00"
              />
              {errors.newPrice && (
                <p className="text-xs text-destructive">
                  {errors.newPrice.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="usedPrice"
                className="text-sm font-medium text-gray-800"
              >
                Used Price
              </label>
              <Input
                id="usedPrice"
                type="number"
                step="0.01"
                min={0}
                {...register("usedPrice", { valueAsNumber: true })}
                className="bg-white"
                placeholder="0.00"
              />
              {errors.usedPrice && (
                <p className="text-xs text-destructive">
                  {errors.usedPrice.message}
                </p>
              )}
            </div>
          </div>

          {/* Max Qty + Daily Limit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                htmlFor="maxQuantityPerOrder"
                className="text-sm font-medium text-gray-800"
              >
                Max Qty / Order
              </label>
              <Input
                id="maxQuantityPerOrder"
                type="number"
                min={1}
                {...register("maxQuantityPerOrder", { valueAsNumber: true })}
                className="bg-white"
                placeholder="10"
              />
              {errors.maxQuantityPerOrder && (
                <p className="text-xs text-destructive">
                  {errors.maxQuantityPerOrder.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <label
                htmlFor="dailyPurchaseLimit"
                className="text-sm font-medium text-gray-800"
              >
                Daily Purchase Limit
              </label>
              <Input
                id="dailyPurchaseLimit"
                type="number"
                min={1}
                {...register("dailyPurchaseLimit", { valueAsNumber: true })}
                className="bg-white"
                placeholder="50"
              />
              {errors.dailyPurchaseLimit && (
                <p className="text-xs text-destructive">
                  {errors.dailyPurchaseLimit.message}
                </p>
              )}
            </div>
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2 pt-1">
            <Switch
              id="variantIsActive"
              checked={isActive ?? true}
              onCheckedChange={(checked) => setValue("isActive", checked)}
              className="hover:cursor-pointer"
            />
            <label
              htmlFor="variantIsActive"
              className="text-sm font-medium text-gray-800"
            >
              Active
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="hover:cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className="hover:cursor-pointer"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {mode === "add" ? "Add Variant" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
