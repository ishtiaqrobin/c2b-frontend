"use client";

import { useEffect } from "react";
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
import { toast } from "sonner";
import {
  variantFormSchema,
  type VariantFormValues,
} from "@/validations/product.validation";
import type { IProductVariant } from "@/types/product.type";
import {
  createVariantAction,
  updateVariantAction,
} from "@/actions/product.action";

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
        newPrice: undefined,
        usedPrice: undefined,
        currency: "BDT",
        maxQuantityPerOrder: undefined,
        dailyPurchaseLimit: undefined,
        isActive: true,
      });
    }
  }, [open, mode, variant, reset]);

  const onSubmit = async (values: VariantFormValues) => {
    const toastId = toast.loading(
      mode === "add" ? "Creating variant..." : "Updating variant...",
    );

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

    try {
      if (mode === "add") {
        const res = await createVariantAction(productId, payload);
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Variant created successfully", { id: toastId });
      } else if (mode === "edit" && variant?.id) {
        const res = await updateVariantAction(variant.id, payload);
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
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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
              disabled={isSubmitting}
              className="hover:cursor-pointer"
            >
              {mode === "add" ? "Add Variant" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
