"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
  storeFormSchema,
  type StoreFormValues,
  generateSlug,
} from "@/validations/store.validation";
import type { IStore } from "@/types/store.type";
import {
  createStoreAction,
  updateStoreAction,
} from "@/actions/store.action";

interface StoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store?: IStore | null;
  mode: "add" | "edit";
  onSuccess?: () => void;
}

export default function StoreDialog({
  open,
  onOpenChange,
  store,
  mode,
  onSuccess,
}: StoreDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      address: "",
      isActive: true,
    },
  });

  const nameVal = watch("name");
  const isActive = watch("isActive");

  // Auto-generate slug from name in add mode
  useEffect(() => {
    if (mode === "add" && !dirtyFields.slug) {
      setValue("slug", generateSlug(nameVal || ""), { shouldValidate: false });
    }
  }, [nameVal, mode, dirtyFields.slug, setValue]);

  // Populate form in edit mode
  useEffect(() => {
    if (open) {
      if (mode === "edit" && store) {
        reset({
          name: store.name || "",
          slug: store.slug,
          address: store.address ?? "",
          isActive: Boolean(store.isActive),
        });
      } else if (mode === "add") {
        reset({
          name: "",
          slug: "",
          address: "",
          isActive: true,
        });
      }
    }
  }, [open, mode, store, reset]);

  const onSubmit = async (values: StoreFormValues) => {
    const toastId = toast.loading(
      mode === "add" ? "Creating store..." : "Updating store...",
    );

    try {
      if (mode === "add") {
        const res = await createStoreAction({
          name: values.name.trim(),
          slug: values.slug,
          address: values.address || undefined,
          isActive: values.isActive,
        });
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Store created successfully", { id: toastId });
      } else if (mode === "edit" && store?.id) {
        const res = await updateStoreAction(store.id, {
          name: values.name.trim(),
          slug: values.slug,
          address: values.address || undefined,
          isActive: values.isActive,
        });
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Store updated successfully", { id: toastId });
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Store" : "Edit Store"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Fill in the store details below."
              : "Update store information."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-800"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="name"
              {...register("name")}
              className="bg-white"
              placeholder="Store name"
            />
            {errors.name && (
              <p className="text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <label htmlFor="slug" className="text-sm font-medium text-gray-800">
              Slug <span className="text-red-500">*</span>
            </label>
            <Input
              id="slug"
              {...register("slug")}
              className="bg-white font-mono text-sm"
              placeholder="store-slug"
            />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label htmlFor="address" className="text-sm font-medium text-gray-800">
              Address{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <Input
              id="address"
              {...register("address")}
              className="bg-white"
              placeholder="Store address"
            />
            {errors.address && (
              <p className="text-xs text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <Switch
              id="isActive"
              checked={isActive ?? true}
              onCheckedChange={(checked) => setValue("isActive", checked)}
              className="hover:cursor-pointer"
            />
            <label
              htmlFor="isActive"
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
              {mode === "add" ? "Create Store" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
