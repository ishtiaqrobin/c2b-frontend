"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, ChevronRight, Folder, Grid3X3 } from "lucide-react";
import { categoryService } from "@/services/category.service";
import type { ICategory } from "@/types/category.type";
import Image from "next/image";

function SubCategoryItem({
  sub,
  parentSlug,
  index,
}: {
  sub: ICategory;
  parentSlug: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
    >
      <Link
        href={`/categories/${parentSlug}?sub=${sub.slug}`}
        className="group flex items-center gap-2 rounded-md px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 duration-300 transition-all"
      >
        <span className="text-muted-foreground/30 select-none">├──</span>
        <ChevronRight className="h-3 w-3 shrink-0 opacity-0 group-hover:opacity-100 transition-all -ml-1" />
        <span className="truncate group-hover:translate-x-0.5 transition-transform">
          {sub.name}
        </span>
      </Link>
    </motion.div>
  );
}

function CategoryTreeNode({
  category,
  index,
}: {
  category: ICategory;
  index: number;
}) {
  const childCount = category.children?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <div className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/20 hover:shadow-sm transition-all duration-300">
        {/* Parent category header */}
        <Link
          href={`/categories/${category.slug}`}
          className="group flex items-center gap-4 p-5"
        >
          <div className="flex shrink-0 items-center justify-center rounded-full group-hover:from-primary/15 group-hover:to-primary/10 transition-colors">
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={category.name}
                width={48}
                height={48}
                className="object-cover"
              />
            ) : (
              <Folder className="h-5 w-5 text-primary/60" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {category.name}
            </h3>
            {childCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {childCount} subcategor{childCount === 1 ? "y" : "ies"}
              </p>
            )}
          </div>

          <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary/60 group-hover:translate-x-0.5 transition-all" />
        </Link>

        {/* Sub-categories tree */}
        {childCount > 0 && (
          <div className="border-t border-border/50 px-3 pb-3 pt-1">
            {category.children!.map((sub, i) => (
              <SubCategoryItem
                key={sub.id}
                sub={sub}
                parentSlug={category.slug}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await categoryService.getTree();
      if (data) setCategories(data);
      setIsLoading(false);
    };
    fetch();
  }, []);

  const filtered = categories.filter((cat) => {
    const match = cat.name.toLowerCase().includes(search.toLowerCase());
    if (match) return true;
    if (cat.children) {
      return cat.children.some((child) =>
        child.name.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return false;
  });

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container-custom mx-auto px-4 py-8">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Browse All Categories
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            Find exactly what you need by exploring our full range of
            categories.
          </p>
        </motion.div>

        {/* Loading */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Grid3X3 className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              {search
                ? "No categories match your search."
                : "No categories yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {filtered.map((category, index) => (
              <CategoryTreeNode
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
