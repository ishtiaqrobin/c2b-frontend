"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ChevronDown } from "lucide-react";

// এই ডেটাগুলো পরে API থেকে আসবে
const WARNING_DATA = [
  'The new price listed below is for an unlocked (Apple Store version), unopened, and warranty not yet activated device.\n・For unlocked, opened, or ununlocked devices, click on "Notes" (optional) to see the reduced price.',
  "If the remaining warranty period for the iPhone is less than 9 months, the price will be reduced.\nSome devices may have been activated by the seller even if unopened, so the buyback price will vary depending on the purchase date.",
  "If the device has been charged 5 times or more, the price will be reduced.",
  'The used price listed below is the highest price for an unlocked device. (The appraisal amount will vary depending on the condition, such as scratches.)\n・For ununlocked devices, click on "Notes" (optional) to see the reduced price.\n・For used items, the maximum battery capacity must be 81% or higher. If it is below 81%, the price will be reduced.',
  "If you have set up an Apple ID or Apple iCloud, please be sure to delete and reset it.",
  'For inspection purposes, please sell your device with a battery condition of "30% or higher" (excluding unopened items).',
  'We cannot purchase devices with network usage restrictions marked "×" or "- (other than Apple version)".\nIf the network usage restriction becomes "×" after the sale is completed, we will return the product and charge you the full purchase price.',
  "Exchanged items will be purchased as used.",
];

export default function WarningBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm transition-all duration-300">
      {/* ── Header / Toggle Button ── */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex justify-between items-center cursor-pointer select-none"
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

      {/* ── Expandable Body (Accordion) ── */}
      <motion.div
        initial={false}
        animate={
          isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        style={{ overflow: "hidden" }}
      >
        <div className="p-4 pt-2 text-sm text-gray-700 dark:text-gray-300 space-y-4 border-t border-zinc-100 dark:border-zinc-800/50 mt-1">
          {WARNING_DATA.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5 shrink-0">▶</span>
              <p className="whitespace-pre-line leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
