"use client";

import { ChevronDown } from "lucide-react";
import type { ICategory } from "@/types/category.type";

interface SidebarFilterProps {
  mainCategory: ICategory | null;
  subcategories: ICategory[];
  activeSubcategoryId: string | null;
  onSubcategoryChange: (categoryId: string | null) => void;
}

const COLORS = [
  "bg-[#E85D22]",
  "bg-[#0066CC]",
  "bg-[#993399]",
  "bg-[#008080]",
  "bg-[#CC6600]",
  "bg-[#336633]",
];

export default function SidebarFilter({
  mainCategory,
  subcategories,
  activeSubcategoryId,
  onSubcategoryChange,
}: SidebarFilterProps) {
  if (!mainCategory) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-lg overflow-hidden border border-orange-200">
        <div className="bg-[#E85D22] text-white font-bold px-4 py-3">
          {mainCategory.name}
        </div>
        <div className="bg-white flex flex-col">
          {subcategories.length > 0 ? (
            subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() =>
                  onSubcategoryChange(
                    activeSubcategoryId === sub.id ? null : sub.id,
                  )
                }
                className={`px-4 py-3 border-b flex justify-between items-center text-sm cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeSubcategoryId === sub.id
                    ? "bg-orange-50 text-[#E85D22] font-semibold"
                    : "text-gray-700"
                }`}
              >
                {sub.name}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    activeSubcategoryId === sub.id ? "rotate-180" : ""
                  }`}
                />
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500">
              No subcategories
            </div>
          )}
        </div>
      </div>

      {subcategories.slice(0, 3).map((sub, idx) => (
        <button
          key={sub.id}
          onClick={() =>
            onSubcategoryChange(
              activeSubcategoryId === sub.id ? null : sub.id,
            )
          }
          className={`${COLORS[idx % COLORS.length]} text-white font-bold px-4 py-3 rounded-lg cursor-pointer hover:brightness-110 transition-all ${
            activeSubcategoryId === sub.id ? "ring-2 ring-white ring-offset-2" : ""
          }`}
        >
          {sub.name}
        </button>
      ))}
    </div>
  );
}
