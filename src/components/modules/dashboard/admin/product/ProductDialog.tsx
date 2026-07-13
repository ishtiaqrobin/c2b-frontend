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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  productFormSchema,
  type ProductFormValues,
  generateSlug,
} from "@/validations/product.validation";
import type { IProduct } from "@/types/product.type";
import type { ICategory } from "@/types/category.type";
import {
  createProductAction,
  updateProductAction,
} from "@/actions/product.action";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: IProduct | null;
  mode: "add" | "edit";
  categories: ICategory[];
  onSuccess?: () => void;
}

export default function ProductDialog({
  open,
  onOpenChange,
  product,
  mode,
  categories,
  onSuccess,
}: ProductDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      categoryId: "",
      imageUrl: "",
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
    if (open && mode === "edit" && product) {
      reset({
        name: product.name || "",
        slug: product.slug,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl ?? "",
        isActive: Boolean(product.isActive),
      });
    } else if (open && mode === "add") {
      reset({
        name: "",
        slug: "",
        categoryId: "",
        imageUrl: "",
        isActive: true,
      });
    }
  }, [open, mode, product, reset]);

  const onSubmit = async (values: ProductFormValues) => {
    const toastId = toast.loading(
      mode === "add" ? "Creating product..." : "Updating product...",
    );

    try {
      if (mode === "add") {
        const res = await createProductAction({
          name: values.name.trim(),
          slug: values.slug,
          categoryId: values.categoryId,
          imageUrl: values.imageUrl || undefined,
          isActive: values.isActive,
        });
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Product created successfully", { id: toastId });
      } else if (mode === "edit" && product?.id) {
        const res = await updateProductAction(product.id, {
          name: values.name.trim(),
          slug: values.slug,
          categoryId: values.categoryId,
          imageUrl: values.imageUrl || undefined,
          isActive: values.isActive,
        });
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Product updated successfully", { id: toastId });
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
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Fill in the product details below."
              : "Update product information."}
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
              placeholder="Product name"
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
              placeholder="product-slug"
            />
            {errors.slug && (
              <p className="text-xs text-destructive">{errors.slug.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-800">
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              value={watch("categoryId")}
              onValueChange={(v) =>
                setValue("categoryId", v, { shouldValidate: true })
              }
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent position="popper">
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name ?? c.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-destructive">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label
              htmlFor="imageUrl"
              className="text-sm font-medium text-gray-800"
            >
              Image URL{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </label>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              className="bg-white"
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && (
              <p className="text-xs text-destructive">
                {errors.imageUrl.message}
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
              {mode === "add" ? "Create Product" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
