"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, ChevronRight, Folder, Package } from "lucide-react";
import { categoryService } from "@/services/category.service";
import type { ICategory } from "@/types/category.type";
import CategoryCard from "@/components/modules/home/category/CategoryCard";
import ProductVariantGrid from "@/components/modules/home/product/ProductVariantGrid";
import BannerCarousel from "@/components/modules/home/banner/BannerCarousel";
import PopularCategoriesSection from "@/components/modules/home/product/PopularCategoriesSection";

const GRADIENTS = [
  "from-blue-500/80 to-blue-600/80",
  "from-emerald-500/80 to-emerald-600/80",
  "from-violet-500/80 to-violet-600/80",
  "from-amber-500/80 to-amber-600/80",
  "from-rose-500/80 to-rose-600/80",
  "from-cyan-500/80 to-cyan-600/80",
  "from-fuchsia-500/80 to-fuchsia-600/80",
  "from-teal-500/80 to-teal-600/80",
];

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<ICategory | null>(null);
  const [children, setChildren] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      setIsLoading(true);
      setError(null);

      // Fetch category by slug
      const { data: cat, error: catError } =
        await categoryService.getBySlug(slug);

      if (catError || !cat) {
        setError(catError?.message || "Category not found");
        setIsLoading(false);
        return;
      }

      setCategory(cat);

      // If this category has children, fetch them from the tree
      if (cat._count && cat._count.children > 0) {
        const { data: tree } = await categoryService.getTree();
        if (tree) {
          // Find this category in the tree to get its children
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
      }

      setIsLoading(false);
    };

    fetchCategory();
  }, [slug]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20">
        <div className="container-custom mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-64 rounded-2xl bg-muted" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !category) {
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

  const hasChildren = children.length > 0;
  const childCount = category._count?.children || 0;
  const productCount = category._count?.products || 0;
  const gradientIndex =
    category.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    GRADIENTS.length;

  return (
    <div className="min-h-screen bg-muted/20">
      {/* <BannerCarousel /> */}
      <BannerCarousel categoryId={category.id} />

      <div className="container-custom mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        {/* <motion.nav
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            href="/categories"
            className="hover:text-primary transition-colors"
          >
            Categories
          </Link>
          {category.parent && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link
                href={`/categories/${category.parent.slug}`}
                className="hover:text-primary transition-colors"
              >
                {category.parent.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{category.name}</span>
        </motion.nav> */}

        {/* Notice */}
        {category.notice && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8 rounded-xl border border-primary/20 bg-primary/5 p-5"
          >
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {category.notice.body}
            </p>
          </motion.div>
        )}

        {/* Children Grid */}
        {hasChildren ? (
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-foreground mb-6"
            >
              Subcategories
            </motion.h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {children.map((child, index) => (
                <CategoryCard key={child.id} category={child} index={index} />
              ))}
            </div>
          </>
        ) : productCount > 0 ? (
          /* Leaf category with products — show the buyback item grid */
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl font-bold text-foreground mb-6"
            >
              Items we buy
            </motion.h2>
            <ProductVariantGrid categoryId={category.id} />
          </>
        ) : (
          /* Leaf category — no children AND no products yet */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">
              No Items Yet
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              This category doesn&apos;t have any buyback items listed yet.
              Please check back soon.
            </p>
          </motion.div>
        )}
      </div>

      <PopularCategoriesSection parentId={category.id} />
    </div>
  );
}
