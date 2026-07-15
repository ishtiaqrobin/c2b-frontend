"use client";

import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Eye } from "lucide-react";

import { createFaqAction, updateFaqAction } from "@/actions/faq.action";
import { faqFormSchema } from "@/validations/faq.validation";
import type { IFaq } from "@/types/faq.type";

interface FaqDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq: IFaq | null;
  mode: "add" | "edit";
  onSuccess?: () => void;
}

interface FormState {
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
}

export default function FaqDialog({
  open,
  onOpenChange,
  faq,
  mode,
  onSuccess,
}: FaqDialogProps) {
  const [form, setForm] = useState<FormState>({
    question: "",
    answer: "",
    sortOrder: 0,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === "edit" && faq) {
        setForm({
          question: faq.question,
          answer: faq.answer,
          sortOrder: faq.sortOrder ?? 0,
          isActive: faq.isActive,
        });
      } else {
        setForm({
          question: "",
          answer: "",
          sortOrder: 0,
          isActive: true,
        });
      }
    }
  }, [open, mode, faq]);

  const handleClose = () => {
    setForm({ question: "", answer: "", sortOrder: 0, isActive: true });
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.question.trim()) {
      toast.error("Question is required");
      return;
    }
    if (!form.answer.trim()) {
      toast.error("Answer is required");
      return;
    }

    setSaving(true);
    const toastId = toast.loading(
      mode === "add" ? "Creating FAQ..." : "Updating FAQ...",
    );

    try {
      const parsed = faqFormSchema.safeParse({
        question: form.question,
        answer: form.answer,
        sortOrder: form.sortOrder,
        isActive: String(form.isActive),
      });

      if (!parsed.success) {
        const firstError = parsed.error.issues?.[0];
        const message = firstError?.message || "Invalid form data";
        toast.error(message, { id: toastId });
        return;
      }

      if (mode === "add") {
        const result = await createFaqAction(parsed.data);
        if (!result.success) {
          toast.error(result.message, { id: toastId });
          return;
        }
        toast.success("FAQ created successfully", { id: toastId });
      } else {
        if (!faq?.id) return;
        const result = await updateFaqAction(faq.id, parsed.data);
        if (!result.success) {
          toast.error(result.message, { id: toastId });
          return;
        }
        toast.success("FAQ updated successfully", { id: toastId });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the FAQ question and answer."
              : "Add a new question and answer pair."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="question"
              className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
            >
              Question
            </Label>
            <Input
              id="question"
              name="question"
              value={form.question}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, question: e.target.value }))
              }
              placeholder="Enter the question"
              className="rounded-md h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="answer"
              className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
            >
              Answer
            </Label>
            <Textarea
              id="answer"
              name="answer"
              value={form.answer}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, answer: e.target.value }))
              }
              placeholder="Enter the answer"
              className="rounded-md min-h-[120px] resize-y"
            />
          </div>

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
              className="rounded-md h-10"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-md-xl bg-muted/30">
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
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Update FAQ" : "Create FAQ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
