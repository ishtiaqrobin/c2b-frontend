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
  categoryFormSchema,
  type CategoryFormValues,
} from "@/validations/category.validation";
import type { ICategory } from "@/types/category.type";
import { createCategory, updateCategory } from "@/actions/category.action";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: ICategory | null;
  mode: "add" | "edit";
  onSuccess?: () => void;
}

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export default function CategoryDialog({
  open,
  onOpenChange,
  category,
  mode,
  onSuccess,
}: CategoryDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      isActive: true,
    },
  });

  const nameVal = watch("name");
  const isActive = watch("isActive");

  // Auto-generate slug from name in add mode (only when slug hasn't been manually edited)
  useEffect(() => {
    if (mode === "add" && !dirtyFields.slug) {
      setValue("slug", generateSlug(nameVal || ""), { shouldValidate: false });
    }
  }, [nameVal, mode, dirtyFields.slug, setValue]);

  // Sync form values when dialog opens or category changes
  useEffect(() => {
    if (open && mode === "edit" && category) {
      reset({
        name: category.name || "",
        slug: category.slug || "",
        isActive: Boolean(category.isActive),
      });
    } else if (open && mode === "add") {
      reset({
        name: "",
        slug: "",
        isActive: true,
      });
    }
  }, [open, mode, category, reset]);

  const onSubmit = async (values: CategoryFormValues) => {
    const toastId = toast.loading(
      mode === "add" ? "Creating category..." : "Updating category...",
    );

    try {
      if (mode === "add") {
        const res = await createCategory({
          slug: values.slug,
          isActive: values.isActive,
          name: values.name.trim(),
        });

        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }

        toast.success("Category created successfully", { id: toastId });
      } else if (mode === "edit" && category?.id) {
        const res = await updateCategory(category.id, {
          slug: values.slug,
          isActive: values.isActive,
          name: values.name.trim(),
        });

        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }

        toast.success("Category updated successfully", { id: toastId });
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operation failed", {
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Category" : "Edit Category"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new category."
              : "Update category information."}
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
              placeholder="Enter category name"
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
              placeholder="category-slug"
            />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>

          {/* isActive (edit mode only) */}
          {mode === "edit" && (
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={isActive}
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
          )}

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
              {mode === "add" ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
