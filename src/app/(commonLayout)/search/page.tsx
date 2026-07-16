"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import SearchBar from "@/components/modules/shared/searchbar/SearchBar";
import BannerCarousel from "@/components/modules/home/banner/BannerCarousel";
import BuybackDashboard from "@/components/common/buyback/BuybackDashboard";
import type { IProductVariant } from "@/types/product.type";
import type { ICategory } from "@/types/category.type";

const PAGE_LIMIT = 20;

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const activeSubParam = searchParams.get("sub") || null;
  const activePidParam = searchParams.get("pid") || null;

  const [allVariants, setAllVariants] = useState<IProductVariant[]>([]);
  const [categoryTree, setCategoryTree] = useState<ICategory[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    categoryService.getTree().then(({ data }) => {
      if (data) setCategoryTree(data);
    });
  }, []);

  useEffect(() => {
    if (!query.trim()) return;

    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled) setIsLoading(true);
    });

    productService
      .getVariants({
        search: query.trim(),
        page: "1",
        limit: String(PAGE_LIMIT),
        isActive: "true",
      })
      .then(({ data, meta }) => {
        if (cancelled) return;
        setAllVariants(data ?? []);
        if (meta) setTotalPages(Math.ceil(meta.total / PAGE_LIMIT) || 1);
        setPage(1);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);

    const nextPage = page + 1;
    const { data, meta } = await productService.getVariants({
      search: query.trim(),
      page: String(nextPage),
      limit: String(PAGE_LIMIT),
      isActive: "true",
    });

    if (data) {
      setAllVariants((prev) => [...prev, ...data]);
      if (meta) setTotalPages(Math.ceil(meta.total / PAGE_LIMIT) || 1);
    }
    setPage(nextPage);
    setIsLoadingMore(false);
  };

  const hasMore = page < totalPages;

  const buildUrl = (sub: string | null, pid: string | null) => {
    const parts: string[] = [];
    if (query) parts.push(`q=${encodeURIComponent(query)}`);
    if (sub) parts.push(`sub=${encodeURIComponent(sub)}`);
    if (pid) parts.push(`pid=${encodeURIComponent(pid)}`);
    return `/search?${parts.join("&")}`;
  };

  const handleSubcategoryChange = (subcategoryId: string | null) => {
    router.replace(buildUrl(subcategoryId, null), { scroll: false });
  };

  const handleProductChange = (productId: string | null) => {
    router.replace(buildUrl(activeSubParam, productId), { scroll: false });
  };

  const displayedVariants = useMemo(() => {
    let filtered = allVariants;
    if (activePidParam) {
      filtered = filtered.filter((v) => v.productId === activePidParam);
    }
    if (activeSubParam) {
      filtered = filtered.filter(
        (v) => v.product?.category?.id === activeSubParam,
      );
    }
    return filtered;
  }, [allVariants, activeSubParam, activePidParam]);

  const activeSubcategoryName =
    activeSubParam && categoryTree.length > 0
      ? (() => {
          for (const main of categoryTree) {
            const children = main.children as ICategory[] | undefined;
            if (children) {
              const match = children.find((c) => c.id === activeSubParam);
              if (match) return match.name;
            }
          }
          return null;
        })()
      : null;

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
          sidebarVariants={allVariants}
          variants={displayedVariants}
          activeSubcategoryId={activeSubParam}
          activeSubcategoryName={activeSubcategoryName}
          activeProductId={activePidParam}
          onSubcategoryChange={handleSubcategoryChange}
          onProductChange={handleProductChange}
          isLoading={isLoading}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
        />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}
