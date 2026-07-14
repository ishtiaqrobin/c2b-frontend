"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Folder } from "lucide-react";
import type { ICategory } from "@/types/category.type";

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

interface CategoryCardProps {
  category: ICategory;
  index: number;
  variant?: "grid" | "list";
}

export default function CategoryCard({
  category,
  index,
  variant = "grid",
}: CategoryCardProps) {
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const childCount = category.children?.length || 0;

  if (variant === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.03 }}
      >
        <Link href={`/categories/${category.slug}`}>
          <div className="group flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4 hover:border-primary/30 hover:shadow-md transition-all duration-300">
            {/* Image / Fallback */}
            <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden">
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
                >
                  <Folder className="h-6 w-6 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              {childCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  {childCount} subcategories
                </p>
              )}
            </div>

            {/* Arrow */}
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0" />
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid variant (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link href={`/categories/${category.slug}`}>
        <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer">
          {/* Image or Gradient */}
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
            />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <h3 className="text-white font-bold text-lg leading-tight mb-1">
              {category.name}
            </h3>
            {childCount > 0 && (
              <span className="text-white/70 text-xs">
                {childCount} subcategories
              </span>
            )}
          </div>

          {/* Hover Arrow */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ArrowRight className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
