"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { toast } from "sonner";
import { PackageSearch, Share2, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { IProductVariant, IVariantDeduction } from "@/types/product.type";

interface ProductVariantCardProps {
  variant: IProductVariant;
  index?: number;
}

const formatPrice = (value: number | null | undefined, currency: string) => {
  if (value === null || value === undefined) return null;
  return `${new Intl.NumberFormat("en-US").format(value)} ${currency}`;
};

export default function ProductVariantCard({
  variant,
  index = 0,
}: ProductVariantCardProps) {
  const availableConditions = useMemo(() => {
    const list: Array<"NEW" | "USED"> = [];
    if (variant.newPrice !== null && variant.newPrice !== undefined)
      list.push("NEW");
    if (variant.usedPrice !== null && variant.usedPrice !== undefined)
      list.push("USED");
    return list;
  }, [variant.newPrice, variant.usedPrice]);

  const [condition, setCondition] = useState<"NEW" | "USED">(
    availableConditions[0] ?? "NEW",
  );
  const [quantity, setQuantity] = useState(1);

  // Deduction popup state
  const [deductionOpen, setDeductionOpen] = useState(false);
  const [selectedDeductionIds, setSelectedDeductionIds] = useState<Set<string>>(
    new Set(),
  );
  const [confirmed, setConfirmed] = useState(false);

  const imageSrc = variant.imageUrl || variant.product?.imageUrl || null;

  const productName = variant.product?.name || "Product";
  const variantLabel = [variant.storage, variant.color]
    .filter(Boolean)
    .join(" ");
  const title = variantLabel ? `${productName} ${variantLabel}` : productName;

  const basePrice =
    condition === "NEW" ? variant.newPrice : variant.usedPrice;
  const formattedBasePrice = formatPrice(basePrice, variant.currency);

  const maxQty = variant.maxQuantityPerOrder ?? undefined;

  // Filter deductions by selected condition
  const applicableDeductions = useMemo(() => {
    if (!variant.deductions) return [];
    return variant.deductions.filter((d) => d.condition === condition);
  }, [variant.deductions, condition]);

  const totalDeduction = useMemo(() => {
    let sum = 0;
    for (const d of applicableDeductions) {
      if (selectedDeductionIds.has(d.id)) {
        sum += Number(d.amount);
      }
    }
    return sum;
  }, [applicableDeductions, selectedDeductionIds]);

  const finalPrice = basePrice != null ? basePrice - totalDeduction : null;
  const formattedFinalPrice = finalPrice != null ? formatPrice(finalPrice, variant.currency) : null;

  const toggleDeduction = (deductionId: string) => {
    setSelectedDeductionIds((prev) => {
      const next = new Set(prev);
      if (next.has(deductionId)) {
        next.delete(deductionId);
      } else {
        next.add(deductionId);
      }
      return next;
    });
  };

  const handlePurchaseApplication = () => {
    if (applicableDeductions.length > 0) {
      setConfirmed(false);
      setDeductionOpen(true);
      return;
    }
    toast.info(
      `${title} (${condition === "NEW" ? "New" : "Second-hand"}) x${quantity}${finalPrice != null ? ` — ${formattedFinalPrice}` : ""} — purchase flow coming soon`,
    );
  };

  const handleConfirmDeductions = () => {
    setConfirmed(true);
    setDeductionOpen(false);
    const selectedLabels = applicableDeductions
      .filter((d) => selectedDeductionIds.has(d.id))
      .map((d) => d.label);
    const deductionSummary =
      selectedLabels.length > 0
        ? ` (deductions: ${selectedLabels.join(", ")})`
        : "";
    toast.info(
      `${title} (${condition === "NEW" ? "New" : "Second-hand"}) x${quantity}${formattedFinalPrice ? ` — ${formattedFinalPrice}` : ""}${deductionSummary} — purchase flow coming soon`,
    );
  };

  const openDeductionPopup = () => {
    setSelectedDeductionIds(new Set());
    setConfirmed(false);
    setDeductionOpen(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.35 }}
        className="group relative flex flex-col rounded-xl border border-border/50 bg-card p-3 hover:border-primary/30 hover:shadow-md transition-all duration-300"
      >
        {/* Share icon */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            if (navigator.share) {
              navigator.share({ title, url: window.location.href }).catch(() => {});
            } else {
              navigator.clipboard?.writeText(window.location.href);
              toast.success("Link copied");
            }
          }}
          className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Share"
        >
          <Share2 className="h-3.5 w-3.5" />
        </button>

        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted/40 mb-3">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PackageSearch className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}
        </div>

        {/* Title + SKU */}
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1">
          {title}
        </h3>
        {variant.sku && (
          <p className="text-[11px] text-muted-foreground font-mono mb-2">
            SKU: {variant.sku}
          </p>
        )}

        {/* Condition selector */}
        {availableConditions.length > 0 && (
          <RadioGroup
            value={condition}
            onValueChange={(v) => {
              setCondition(v as "NEW" | "USED");
              setSelectedDeductionIds(new Set());
              setConfirmed(false);
            }}
            className="flex flex-col gap-1.5 mb-2"
          >
            {availableConditions.map((c) => {
              const price = c === "NEW" ? variant.newPrice : variant.usedPrice;
              return (
                <div key={c} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <RadioGroupItem value={c} id={`${variant.id}-${c}`} />
                    <Label
                      htmlFor={`${variant.id}-${c}`}
                      className="text-xs font-normal cursor-pointer"
                    >
                      {c === "NEW" ? "New" : "second hand"}
                    </Label>
                  </div>
                  <span className="text-sm font-bold text-red-600">
                    {formatPrice(price, variant.currency)}
                  </span>
                </div>
              );
            })}
          </RadioGroup>
        )}

        {availableConditions.length === 0 && (
          <p className="text-xs text-muted-foreground mb-2">
            Price not available
          </p>
        )}

        {/* Confirmed deduction summary */}
        {confirmed && selectedDeductionIds.size > 0 && (
          <div className="mb-2 px-2 py-1.5 bg-primary/5 rounded-md border border-primary/10">
            <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-0.5">
              Deductions applied
            </p>
            {applicableDeductions
              .filter((d) => selectedDeductionIds.has(d.id))
              .map((d) => (
                <p
                  key={d.id}
                  className="text-[11px] text-muted-foreground flex justify-between"
                >
                  <span>{d.label}</span>
                  <span>-{formatPrice(d.amount, variant.currency)}</span>
                </p>
              ))}
            {finalPrice != null && (
              <p className="text-xs font-bold text-foreground flex justify-between border-t border-primary/10 mt-1 pt-1">
                <span>Final price</span>
                <span>{formattedFinalPrice}</span>
              </p>
            )}
          </div>
        )}

        {/* Quantity + CTA */}
        <div className="mt-auto flex items-center gap-2 pt-1">
          <Input
            type="number"
            min={1}
            max={maxQty}
            value={quantity}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (Number.isNaN(v)) return setQuantity(1);
              setQuantity(maxQty ? Math.min(v, maxQty) : v);
            }}
            className="h-8 w-16 text-xs px-2"
            aria-label="Quantity"
          />
          <Button
            size="sm"
            disabled={availableConditions.length === 0}
            onClick={
              confirmed ? openDeductionPopup : handlePurchaseApplication
            }
            className="flex-1 h-8 text-xs bg-red-600 hover:bg-red-700"
          >
            {confirmed ? "Update" : "Purchase application"}
          </Button>
        </div>

        {formattedBasePrice && maxQty && (
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            Max {maxQty} per order
          </p>
        )}
      </motion.div>

      {/* Deduction selection dialog */}
      <Dialog open={deductionOpen} onOpenChange={setDeductionOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg">{title}</DialogTitle>
            <DialogDescription>
              {condition === "NEW" ? "New" : "Second-hand"} &middot; Qty:{" "}
              {quantity} &middot; Base: {formattedBasePrice}
            </DialogDescription>
          </DialogHeader>

          {applicableDeductions.length > 0 && (
            <div className="space-y-3 py-2">
              <p className="text-sm font-semibold text-foreground">
                Select applicable deductions
              </p>
              {applicableDeductions.map((d) => (
                <label
                  key={d.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2.5 cursor-pointer hover:bg-accent/50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      checked={selectedDeductionIds.has(d.id)}
                      onCheckedChange={() => toggleDeduction(d.id)}
                    />
                    <span className="text-sm text-foreground">{d.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-red-600 shrink-0">
                    -{formatPrice(d.amount, variant.currency)}
                  </span>
                </label>
              ))}
            </div>
          )}

          {finalPrice != null && (
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm font-semibold text-foreground">
                Final price
              </span>
              <span className="text-lg font-bold text-red-600">
                {formattedFinalPrice}
              </span>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeductionOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDeductions}
              className="bg-red-600 hover:bg-red-700"
            >
              <Check className="mr-1.5 h-4 w-4" />
              Confirmed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
