"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
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
import { useImageUpload } from "@/hooks/useImageUpload";
import { productService } from "@/services/product.service";

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
  const [saving, setSaving] = useState(false);

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
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      categoryId: "",
      image: undefined,
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
      if (mode === "edit" && product) {
        reset({
          name: product.name || "",
          slug: product.slug,
          categoryId: product.categoryId,
          image: undefined,
          isActive: Boolean(product.isActive),
        });
      } else if (mode === "add") {
        reset({
          name: "",
          slug: "",
          categoryId: "",
          image: undefined,
          isActive: true,
        });
        resetImage();
      }
    }
  }, [open, mode, product, reset, resetImage]);

  const onSubmit = async (values: ProductFormValues) => {
    const toastId = toast.loading(
      mode === "add" ? "Creating product..." : "Updating product...",
    );

    setSaving(true);

    try {
      const fd = productService.buildProductFormData({
        image: imageFile || undefined,
        name: values.name.trim(),
        slug: values.slug,
        categoryId: values.categoryId,
        isActive: values.isActive,
      });

      if (mode === "add") {
        const res = await createProductAction(fd);
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("Product created successfully", { id: toastId });
      } else if (mode === "edit" && product?.id) {
        const res = await updateProductAction(product.id, fd);
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
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    resetImage();
    reset();
    onOpenChange(false);
  };

  const isEdit = mode === "edit";
  const displayPreview = imagePreview || (isEdit && product?.imageUrl) || null;

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

          {/* Image Upload */}
          <div className="space-y-1.5">
            <Label
              htmlFor="image"
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
                  alt="Product preview"
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
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || saving || isCompressing}
              className="hover:cursor-pointer"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "add" ? "Create Product" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
