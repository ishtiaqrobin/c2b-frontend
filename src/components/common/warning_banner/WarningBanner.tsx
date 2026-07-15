"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ChevronDown, Loader2 } from "lucide-react";
interface CheckItemMinimal {
  id: string;
  content: string;
}

interface WarningBannerProps {
  items?: CheckItemMinimal[];
  loading?: boolean;
}

export default function WarningBanner({
  items = [],
  loading = false,
}: WarningBannerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (items.length === 0 && !loading) return null;

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm transition-all duration-300">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex justify-between items-center cursor-pointer  "
      >
        <div className="flex items-center gap-2 text-red-600 font-bold">
          <AlertTriangle size={20} />
          <span className="text-gray-900 dark:text-gray-100">
            Things to check before selling
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 hidden sm:block">
            *Please read carefully.
          </span>
          <span
            className="text-gray-500 shrink-0"
            style={{
              display: "inline-block",
              transition: "transform 350ms cubic-bezier(0.25, 1, 0.5, 1)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
            aria-hidden="true"
          >
            <ChevronDown size={20} />
          </span>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={
          isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        style={{ overflow: "hidden" }}
      >
        <div className="p-4 pt-2 text-sm text-gray-700 dark:text-gray-300 space-y-4 border-t border-zinc-100 dark:border-zinc-800/50 mt-1">
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            items.map((item, index) => (
              <div key={item.id || index} className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5 shrink-0">▶</span>
                <p className="whitespace-pre-line leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

export type { WarningBannerProps };
