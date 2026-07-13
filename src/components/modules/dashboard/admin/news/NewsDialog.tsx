"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { newsFormSchema, type NewsFormValues } from "@/validations/news.validation";
import type { INews } from "@/types/news.type";
import { createNewsAction, updateNewsAction } from "@/actions/news.action";

interface NewsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news?: INews | null;
  mode: "add" | "edit";
  onSuccess?: () => void;
}

export default function NewsDialog({
  open,
  onOpenChange,
  news,
  mode,
  onSuccess,
}: NewsDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: "",
      body: "",
      publishedAt: "",
      isActive: true,
    },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (open && mode === "edit" && news) {
      reset({
        title: news.title || "",
        body: news.body || "",
        publishedAt: news.publishedAt ? news.publishedAt.substring(0, 16) : "",
        isActive: Boolean(news.isActive),
      });
    } else if (open && mode === "add") {
      const now = new Date();
      const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .substring(0, 16);
      reset({
        title: "",
        body: "",
        publishedAt: localIso,
        isActive: true,
      });
    }
  }, [open, mode, news, reset]);

  const onSubmit = async (values: NewsFormValues) => {
    const toastId = toast.loading(
      mode === "add" ? "Creating news..." : "Updating news...",
    );

    const publishedAt = values.publishedAt
      ? new Date(values.publishedAt).toISOString()
      : undefined;

    try {
      if (mode === "add") {
        const res = await createNewsAction({
          publishedAt,
          isActive: values.isActive,
          title: values.title.trim(),
          body: values.body?.trim() || undefined,
        });
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("News created successfully", { id: toastId });
      } else if (mode === "edit" && news?.id) {
        const res = await updateNewsAction(news.id, {
          publishedAt,
          isActive: values.isActive,
          title: values.title.trim(),
          body: values.body?.trim() || undefined,
        });
        if (!res.success) {
          toast.error(res.message, { id: toastId });
          return;
        }
        toast.success("News updated successfully", { id: toastId });
      }

      onSuccess?.();
      handleClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Operation failed",
        { id: toastId },
      );
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add News" : "Edit News"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Create a new news article."
              : "Update news article information."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-800"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              {...register("title")}
              className="bg-white"
              placeholder="Enter news title"
            />
            {errors.title && (
              <p className="text-xs text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Body */}
          <div className="space-y-1.5">
            <label
              htmlFor="body"
              className="text-sm font-medium text-gray-800"
            >
              Body
            </label>
            <Textarea
              id="body"
              {...register("body")}
              className="bg-white min-h-[100px]"
              placeholder="Enter news body"
            />
            {errors.body && (
              <p className="text-xs text-destructive">
                {errors.body.message}
              </p>
            )}
          </div>

          {/* Published At */}
          <div className="space-y-1.5">
            <label
              htmlFor="publishedAt"
              className="text-sm font-medium text-gray-800"
            >
              Published At
            </label>
            <Input
              id="publishedAt"
              type="datetime-local"
              {...register("publishedAt")}
              className="bg-white"
            />
            {errors.publishedAt && (
              <p className="text-xs text-destructive">
                {errors.publishedAt.message}
              </p>
            )}
          </div>

          {/* isActive — edit mode only */}
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
