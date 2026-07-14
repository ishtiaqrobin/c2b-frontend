"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Loader2, PackageX } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { productService } from "@/services/product.service";
import type { IProductVariant } from "@/types/product.type";
import ProductVariantCard from "./ProductVariantCard";

interface ProductVariantGridProps {
  categoryId: string;
}

const PAGE_LIMIT = 20;

export default function ProductVariantGrid({
  categoryId,
}: ProductVariantGridProps) {
  const [variants, setVariants] = useState<IProductVariant[]>([]);
  const [storageOptions, setStorageOptions] = useState<string[]>([]);
  const [activeStorage, setActiveStorage] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch a page of variants for the current category + storage filter.
  const fetchPage = useCallback(
    async (targetPage: number, storage: string, replace: boolean) => {
      if (replace) setIsLoading(true);
      else setIsLoadingMore(true);
      setError(null);

      const { data, meta, error: fetchError } = await productService.getVariants({
        categoryId,
        page: String(targetPage),
        limit: String(PAGE_LIMIT),
        isActive: "true",
        ...(storage !== "all" ? { storage } : {}),
      });

      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        setVariants((prev) => (replace ? data : [...prev, ...data]));

        // Seed the storage filter tabs from the first, unfiltered fetch
        // only — once populated, tabs stay stable even as the user
        // filters (so the "all" tab doesn't disappear options).
        if (storage === "all" && targetPage === 1) {
          const unique = Array.from(
            new Set(
              data
                .map((v) => v.storage)
                .filter((s): s is string => Boolean(s)),
            ),
          ).sort();
          setStorageOptions(unique);
        }

        if (meta) {
          setTotalPages(meta.total ? Math.ceil(meta.total / PAGE_LIMIT) : 1);
        }
      }

      setIsLoading(false);
      setIsLoadingMore(false);
    },
    [categoryId],
  );

  // Initial load + reload whenever the category or storage filter changes.
  useEffect(() => {
    setPage(1);
    fetchPage(1, activeStorage, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, activeStorage]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage, activeStorage, false);
  };

  const hasMore = page < totalPages;

  return (
    <div>
      {/* Storage filter tabs — only shown if variants actually vary by storage */}
      {storageOptions.length > 0 && (
        <Tabs
          value={activeStorage}
          onValueChange={setActiveStorage}
          className="mb-6"
        >
          <TabsList className="flex-wrap h-auto gap-1 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="rounded-full border data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              all
            </TabsTrigger>
            {storageOptions.map((s) => (
              <TabsTrigger
                key={s}
                value={s}
                className="rounded-full border data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                {s}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="text-center py-12">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && variants.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <PackageX className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">
            No items available
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            {activeStorage !== "all"
              ? `No ${activeStorage} items found. Try a different storage size.`
              : "There are no buyback items listed under this category yet."}
          </p>
        </motion.div>
      )}

      {/* Grid */}
      {!isLoading && !error && variants.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {variants.map((variant, index) => (
              <ProductVariantCard
                key={variant.id}
                variant={variant}
                index={index % PAGE_LIMIT}
              />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
              >
                {isLoadingMore && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
