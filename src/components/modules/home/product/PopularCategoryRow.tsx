"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { productService } from "@/services/product.service";
import ProductVariantCard from "@/components/modules/home/product/ProductVariantCard";
import type { ICategory } from "@/types/category.type";
import type { IProductVariant } from "@/types/product.type";

interface PopularCategoryRowProps {
  category: ICategory;
  index: number;
}

export default function PopularCategoryRow({
  category,
  index,
}: PopularCategoryRowProps) {
  const [variants, setVariants] = useState<IProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await productService.getVariants({
        categoryId: category.id,
        limit: "8",
        isActive: "true",
      });
      if (data) setVariants(data);
      setIsLoading(false);
    };
    fetch();
  }, [category.id]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[220px] shrink-0 space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variants.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">{category.name}</h3>
        <Link
          href={`/categories/${category.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline decoration-2 underline-offset-4"
        >
          See all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {variants.map((variant, i) => (
          <div key={variant.id} className="w-[220px] shrink-0">
            <ProductVariantCard variant={variant} index={i} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
