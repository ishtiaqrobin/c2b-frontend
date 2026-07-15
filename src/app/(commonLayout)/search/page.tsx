"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Loader2, PackageSearch, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productService } from "@/services/product.service";
import SearchBar from "@/components/modules/shared/searchbar/SearchBar";
import ProductVariantListItem from "@/components/modules/home/product/ProductVariantListItem";
import ProductVariantCard from "@/components/modules/home/product/ProductVariantCard";
import type { IProductVariant } from "@/types/product.type";
import BannerCarousel from "@/components/modules/home/banner/BannerCarousel";

const PAGE_LIMIT = 20;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [variants, setVariants] = useState<IProductVariant[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const fetchResults = useCallback(
    async (targetPage: number, append: boolean) => {
      if (!query.trim()) {
        setVariants([]);
        return;
      }

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const { data, meta } = await productService.getVariants({
        search: query.trim(),
        page: String(targetPage),
        limit: String(PAGE_LIMIT),
        isActive: "true",
      });

      if (data) {
        setVariants((prev) => (append ? [...prev, ...data] : data));
        if (meta) {
          setTotalPages(Math.ceil(meta.total / PAGE_LIMIT) || 1);
        }
      } else {
        if (!append) setVariants([]);
      }

      setPage(targetPage);
      setIsLoading(false);
      setIsLoadingMore(false);
    },
    [query],
  );

  useEffect(() => {
    setPage(1);
    setVariants([]);
    setTotalPages(1);
    fetchResults(1, false);
  }, [fetchResults]);

  const handleLoadMore = () => {
    fetchResults(page + 1, true);
  };

  const hasMore = page < totalPages;

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      <BannerCarousel />
      <SearchBar initialQuery={query} />

      <div className="container-custom mx-auto px-4 md:px-8 pb-16">
        {query && (
          <div className="mb-6">
            <p className="text-sm text-text-secondary">
              Search results for &quot;
              <span className="font-semibold text-text-primary">{query}</span>
              &quot;
            </p>
          </div>
        )}

        {/* View toggle */}
        {!isLoading && variants.length > 0 && (
          <div className="flex items-center justify-end mb-4">
            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-border">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-[#F4F7F6] shadow-sm text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <List size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-[#F4F7F6] shadow-sm text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-card p-4 rounded-2xl border border-border flex items-center gap-6 animate-pulse"
              >
                <div className="w-20 h-20 bg-muted rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 bg-muted rounded" />
                  <div className="h-3 w-32 bg-muted rounded" />
                </div>
                <div className="space-y-1">
                  <div className="h-3 w-16 bg-muted rounded" />
                  <div className="h-4 w-20 bg-muted rounded" />
                </div>
                <div className="h-10 w-28 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        ) : query && variants.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <PackageSearch className="h-16 w-16 text-text-secondary/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              No results found
            </h2>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              We couldn&apos;t find any products matching &quot;{query}&quot;.
              Try searching with different keywords or browse our categories.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => router.push("/categories")}
            >
              Browse Categories
            </Button>
          </div>
        ) : query === "" ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <Search className="h-16 w-16 text-text-secondary/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Search products
            </h2>
            <p className="text-text-secondary text-sm">
              Enter a product name, brand, or keyword to find buyback prices.
            </p>
          </div>
        ) : viewMode === "list" ? (
          <div className="flex flex-col gap-4">
            {variants.map((variant) => (
              <ProductVariantListItem key={variant.id} variant={variant} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {variants.map((variant, index) => (
              <div key={variant.id} className="w-full">
                <ProductVariantCard variant={variant} index={index} />
              </div>
            ))}
          </div>
        )}

        {/* Load More */}
        {hasMore && !isLoading && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="rounded-xl border-border text-text-primary hover:bg-accent"
            >
              {isLoadingMore && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
