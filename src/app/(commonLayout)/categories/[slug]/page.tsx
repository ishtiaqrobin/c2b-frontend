"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Folder } from "lucide-react";
import { categoryService } from "@/services/category.service";
import { productService } from "@/services/product.service";
import type { ICategory } from "@/types/category.type";
import type { IProductVariant } from "@/types/product.type";
import BannerCarousel from "@/components/modules/home/banner/BannerCarousel";
import BuybackDashboard from "@/components/common/buyback/BuybackDashboard";

const PAGE_LIMIT = 20;

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const searchParams = useSearchParams();
  const router = useRouter();
  const subParam = searchParams.get("sub");
  const pidParam = searchParams.get("pid");

  const [category, setCategory] = useState<ICategory | null>(null);
  const [categoryTree, setCategoryTree] = useState<ICategory[]>([]);
  const [children, setChildren] = useState<ICategory[]>([]);
  const [variants, setVariants] = useState<IProductVariant[]>([]);
  const [sidebarVariants, setSidebarVariants] = useState<IProductVariant[]>([]);
  const sidebarCapturedRef = useRef(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeSubcategoryId = (() => {
    if (!subParam || children.length === 0) return null;
    const match = children.find((c) => c.slug === subParam);
    return match?.id ?? null;
  })();

  // Fetch category info + children
  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      setIsCategoryLoading(true);
      setError(null);

      const { data: cat, error: catError } =
        await categoryService.getBySlug(slug);

      if (catError || !cat) {
        setError(catError?.message || "Category not found");
        setIsCategoryLoading(false);
        setHasInitiallyLoaded(true);
        return;
      }

      setCategory(cat);

      const hasChildren = cat._count && cat._count.children > 0;
      if (hasChildren) {
        const { data: tree } = await categoryService.getTree();
        if (tree) {
          setCategoryTree(tree);
          const findInTree = (nodes: ICategory[]): ICategory | null => {
            for (const node of nodes) {
              if (node.slug === slug) return node;
              if (node.children) {
                const found = findInTree(node.children);
                if (found) return found;
              }
            }
            return null;
          };
          const found = findInTree(tree);
          if (found?.children) {
            setChildren(found.children);
          }
        }
      } else {
        setChildren([]);
      }

      setIsCategoryLoading(false);
    };

    fetchCategory();
  }, [slug]);

  // Pure data fetcher — no synchronous setState
  const fetchVariants = useCallback(
    async (targetPage: number, replace: boolean) => {
      if (!category) return;

      const queryParams: {
        page: string;
        limit: string;
        isActive: string;
        categoryId?: string;
        categoryIds?: string;
      } = {
        page: String(targetPage),
        limit: String(PAGE_LIMIT),
        isActive: "true",
      };

      if (activeSubcategoryId) {
        queryParams.categoryId = activeSubcategoryId;
      } else if (children.length > 0) {
        queryParams.categoryIds = children.map((c) => c.id).join(",");
      } else {
        queryParams.categoryId = category.id;
      }

      const {
        data,
        meta,
        error: fetchError,
      } = await productService.getVariants(queryParams);

      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        setVariants((prev) => (replace ? data : [...prev, ...data]));
        if (meta) {
          setTotalPages(meta.total ? Math.ceil(meta.total / PAGE_LIMIT) : 1);
        }
      }

      if (replace) {
        setPage(targetPage);
        setHasInitiallyLoaded(true);
      }
    },
    [category, children, activeSubcategoryId],
  );

  // Re-fetch when category or filter changes
  useEffect(() => {
    if (!category || isCategoryLoading) return;

    const loadVariants = async () => {
      const queryParams: {
        page: string;
        limit: string;
        isActive: string;
        categoryId?: string;
        categoryIds?: string;
      } = {
        page: "1",
        limit: String(PAGE_LIMIT),
        isActive: "true",
      };

      if (activeSubcategoryId) {
        queryParams.categoryId = activeSubcategoryId;
      } else if (children.length > 0) {
        queryParams.categoryIds = children.map((c) => c.id).join(",");
      } else {
        queryParams.categoryId = category.id;
      }

      const {
        data,
        meta,
        error: fetchError,
      } = await productService.getVariants(queryParams);

      if (fetchError) {
        setError(fetchError.message);
      } else if (data) {
        setVariants(data);
        if (!sidebarCapturedRef.current) {
          setSidebarVariants(data);
          sidebarCapturedRef.current = true;
        }
        if (meta) {
          setTotalPages(meta.total ? Math.ceil(meta.total / PAGE_LIMIT) : 1);
        }
      }

      setPage(1);
      setHasInitiallyLoaded(true);
    };

    loadVariants();
  }, [category, isCategoryLoading, activeSubcategoryId, children]);

  const buildUrl = (sub?: string | null, pid?: string | null) => {
    const parts: string[] = [];
    if (sub) parts.push(`sub=${sub}`);
    if (pid) parts.push(`pid=${pid}`);
    return parts.length > 0
      ? `/categories/${slug}?${parts.join("&")}`
      : `/categories/${slug}`;
  };

  const handleSubcategoryChange = (subcategoryId: string | null) => {
    if (!subcategoryId) {
      router.replace(buildUrl(null, null), { scroll: false });
    } else {
      const sub = children.find((c) => c.id === subcategoryId);
      if (sub) {
        router.replace(buildUrl(sub.slug, null), { scroll: false });
      }
    }
  };

  const handleProductChange = (productId: string | null) => {
    if (!productId) {
      router.replace(buildUrl(subParam, null), { scroll: false });
    } else {
      router.replace(buildUrl(subParam, productId), { scroll: false });
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setIsLoadingMore(true);
    setPage(nextPage);
    fetchVariants(nextPage, false).finally(() => setIsLoadingMore(false));
  };

  const hasMore = page < totalPages;

  const activeSubcategory = activeSubcategoryId
    ? children.find((c) => c.id === activeSubcategoryId) || null
    : null;

  // Apply client-side product filter
  const displayedVariants = !pidParam
    ? variants
    : variants.filter((v) => v.productId === pidParam);

  const isLoading = !hasInitiallyLoaded;

  // Error state
  if (error && !category) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <Folder className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Category Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || "The category you're looking for doesn't exist."}
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse All Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {category && (
        <div className="relative">
          {/* <BannerCarousel categoryId={category.id} /> */}
          <BannerCarousel />
          {category.notice && (
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/20 bg-primary/5 p-5"
              >
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                  {category.notice.body}
                </p>
              </motion.div>
            </div>
          )}
        </div>
      )}

      <BuybackDashboard
        category={category}
        categoryTree={categoryTree}
        subcategories={children}
        sidebarVariants={sidebarVariants}
        variants={displayedVariants}
        activeSubcategoryId={activeSubcategoryId}
        activeSubcategoryName={activeSubcategory?.name || null}
        activeProductId={pidParam ?? null}
        onSubcategoryChange={handleSubcategoryChange}
        onProductChange={handleProductChange}
        isLoading={isLoading || isCategoryLoading}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
