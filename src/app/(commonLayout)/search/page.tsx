"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import SearchBar from "@/components/modules/shared/searchbar/SearchBar";
import BannerCarousel from "@/components/modules/home/banner/BannerCarousel";
import BuybackDashboard from "@/components/common/buyback/BuybackDashboard";
import type { IProductVariant } from "@/types/product.type";
import type { ICategory } from "@/types/category.type";

const PAGE_LIMIT = 20;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [variants, setVariants] = useState<IProductVariant[]>([]);
  const [categoryTree, setCategoryTree] = useState<ICategory[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
    categoryService.getTree().then(({ data }) => {
      if (data) setCategoryTree(data);
    });
  }, []);

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

  if (!query) {
    return (
      <div className="min-h-screen bg-[#F4F7F6]">
        <BannerCarousel />
        <SearchBar />
        <div className="container-custom mx-auto pb-16">
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <Search className="h-16 w-16 text-text-secondary/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-text-primary mb-2">
              Search products
            </h2>
            <p className="text-text-secondary text-sm">
              Enter a product name, brand, or keyword to find buyback prices.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      <BannerCarousel />
      <SearchBar initialQuery={query} />

      <div className="container-custom mx-auto">
        <BuybackDashboard
          category={null}
          categoryTree={categoryTree}
          subcategories={[]}
          sidebarVariants={variants}
          variants={variants}
          activeSubcategoryId={null}
          activeSubcategoryName={null}
          activeProductId={null}
          onSubcategoryChange={() => {}}
          onProductChange={() => {}}
          isLoading={isLoading}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
}
