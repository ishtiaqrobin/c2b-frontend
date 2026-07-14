"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { toast } from "sonner";
import { PackageSearch, Share2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { IProductVariant } from "@/types/product.type";

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
  // Default to whichever condition actually has a price set — some
  // variants may only buy back USED items, or only NEW, not both.
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

  // Variant photo first (color-specific), falling back to the parent
  // product's image when the variant itself has none set.
  const imageSrc = variant.imageUrl || variant.product?.imageUrl || null;

  const productName = variant.product?.name || "Product";
  const variantLabel = [variant.storage, variant.color]
    .filter(Boolean)
    .join(" ");
  const title = variantLabel ? `${productName} ${variantLabel}` : productName;

  const activePrice =
    condition === "NEW" ? variant.newPrice : variant.usedPrice;
  const formattedActivePrice = formatPrice(activePrice, variant.currency);

  const maxQty = variant.maxQuantityPerOrder ?? undefined;

  const handlePurchaseApplication = () => {
    // Cart module isn't wired up yet — this keeps the interaction
    // honest instead of pretending to add to a cart that doesn't
    // persist anywhere. Replace with a real addToCart call once the
    // cart module exists.
    toast.info(
      `${title} (${condition === "NEW" ? "New" : "Second-hand"}) x${quantity} — purchase flow coming soon`,
    );
  };

  return (
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

      {/* Condition selector — only shown if both NEW & USED prices exist */}
      {availableConditions.length > 0 && (
        <RadioGroup
          value={condition}
          onValueChange={(v) => setCondition(v as "NEW" | "USED")}
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
          onClick={handlePurchaseApplication}
          className="flex-1 h-8 text-xs bg-red-600 hover:bg-red-700"
        >
          Purchase application
        </Button>
      </div>

      {formattedActivePrice && maxQty && (
        <p className="mt-1.5 text-[10px] text-muted-foreground">
          Max {maxQty} per order
        </p>
      )}
    </motion.div>
  );
}
