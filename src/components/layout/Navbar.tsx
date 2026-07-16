"use client";

import { useState, useRef, useEffect, useCallback, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, ChevronDown, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { productService } from "@/services/product.service";
import { useDebounce } from "@/hooks/useDebounce";
import type { IProductVariant } from "@/types/product.type";
import Image from "next/image";

// --- Dummy Data (Replace these with API calls later) ---
const categories = [
  { id: 1, title: "smartphone", href: "/category/smartphone" },
  { id: 2, title: "home appliances", href: "/category/home-appliances" },
  { id: 3, title: "toys", href: "/category/toys" },
  { id: 4, title: "alcohol", href: "/category/alcohol" },
];

const buybackProcesses = [
  { id: 1, title: "In-store purchase process", href: "/process/in-store" },
  { id: 2, title: "Mail-in buyback process", href: "/process/mail-in" },
  { id: 3, title: "Corporate Purchase Process", href: "/process/corporate" },
  { id: 4, title: "eKYC process", href: "/process/ekyc" },
];

const storeLists = [
  { id: 1, title: "Akabane Store", href: "/stores/akabane" },
  { id: 2, title: "Shin-Okubo store", href: "/stores/shin-okubo" },
  { id: 3, title: "Akihabara Store", href: "/stores/akihabara" },
  { id: 4, title: "Ikebukuro store", href: "/stores/ikebukuro" },
];
// --------------------------------------------------------

export default function Navbar() {
  const router = useRouter();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<IProductVariant[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      return;
    }
    let cancelled = false;
    productService
      .getVariants({
        search: debouncedQuery.trim(),
        limit: "8",
        isActive: "true",
      })
      .then(({ data }) => {
        if (cancelled) return;
        setResults(data ?? []);
        setShowDropdown(true);
        setSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = searchQuery.trim();
      if (!trimmed) return;
      setSearchOpen(false);
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    },
    [searchQuery, router],
  );

  const handleResultClick = useCallback(() => {
    setSearchOpen(false);
    setShowDropdown(false);
    setSearchQuery("");
  }, []);

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex flex-col text-[#f25c27] hover:opacity-90 transition-opacity"
        >
          <span className="text-2xl font-bold font-clash">KroyDot</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-4 py-2 text-[15px] font-medium text-gray-800 hover:bg-gray-100/90 rounded-md transition-colors">
              Category
              <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-hover:rotate-180" />
            </button>
            {/* Dropdown Content */}
            <div className="absolute top-full left-0 pt-2 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 w-48">
              <ul className="bg-white border border-gray-100 shadow-lg rounded-md p-2">
                {categories.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-100/90 hover:text-gray-900 rounded-sm transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Buyback Process Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-4 py-2 text-[15px] font-medium text-gray-800 hover:bg-gray-100/90 rounded-md transition-colors">
              Buyback process
              <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-hover:rotate-180" />
            </button>
            {/* Dropdown Content */}
            <div className="absolute top-full left-0 pt-2 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 w-60">
              <ul className="bg-white border border-gray-100 shadow-lg rounded-md p-2">
                {buybackProcesses.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-100/90 hover:text-gray-900 rounded-sm transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ Link */}
          <Link
            href="/faq"
            className="px-4 py-2 text-[15px] font-medium text-gray-800 hover:bg-gray-100/90 rounded-md transition-colors"
          >
            FAQ
          </Link>

          {/* Store List Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-4 py-2 text-[15px] font-medium text-gray-800 hover:bg-gray-100/90 rounded-md transition-colors">
              Store List
              <ChevronDown className="w-4 h-4 text-gray-500 transition-transform group-hover:rotate-180" />
            </button>
            {/* Dropdown Content */}
            <div className="absolute top-full left-0 pt-2 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 w-48">
              <ul className="bg-white border border-gray-100 shadow-lg rounded-md p-2">
                {storeLists.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className="block px-4 py-2 text-[15px] text-gray-700 hover:bg-gray-100/90 hover:text-gray-900 rounded-sm transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Inquiry Link */}
          <Link
            href="/inquiry"
            className="px-4 py-2 text-[15px] font-medium text-gray-800 hover:bg-gray-100/90 rounded-md transition-colors"
          >
            Inquiry
          </Link>
        </nav>

        {/* Action Icons Section */}
        <div className="flex items-center space-x-6 text-gray-600">
          <div ref={searchRef} className="relative">
            <motion.form
              key="search-input"
              // initial={{ width: 0, opacity: 0 }}
              // animate={{ width: 280, opacity: 1 }}
              // exit={{ width: 0, opacity: 0 }}
              // transition={{ duration: 0.25, ease: "easeInOut" }}
              onSubmit={handleSearchSubmit}
              className="flex items-center overflow-hidden"
            >
              <div className="relative w-full">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearching(true);
                  }}
                  placeholder="Search products..."
                  className="w-full h-9 pl-4 pr-10 text-sm text-gray-700 bg-gray-100/80 border border-gray-200 rounded-md outline-none focus:border-primary/80 focus:ring-0.5 focus:ring-[#008B8B] duration-300 transition-colors"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-0 top-0 h-full flex items-center pr-3 transition-colors text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="absolute right-0 top-0 h-full flex items-center pr-3 text-gray-500 hover:text-primary transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.form>

            {/* Dropdown */}
            <AnimatePresence>
              {debouncedQuery.trim() && showDropdown && (
                <motion.div
                  // initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-100 rounded-md shadow-lg overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-400 tracking-wider">
                      {searching
                        ? "Searching..."
                        : `${results.length} Result${results.length === 1 ? "" : "s"}`}
                    </p>
                  </div>
                  <ul className="max-h-80 overflow-y-auto">
                    {results.length === 0 && !searching ? (
                      <li className="px-4 py-6 text-center text-sm text-gray-400">
                        No products found
                      </li>
                    ) : (
                      results.map((variant) => (
                        <li key={variant.id}>
                          <Link
                            href={`/search?q=${encodeURIComponent(searchQuery)}&pid=${variant.productId}`}
                            onClick={handleResultClick}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                              {variant.imageUrl ? (
                                <Image
                                  src={variant.imageUrl}
                                  alt=""
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Search className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {variant.product?.name ?? "Product"}
                              </p>
                              <p className="text-xs text-gray-400 truncate">
                                {[variant.storage, variant.color]
                                  .filter(Boolean)
                                  .join(" / ")}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              {variant.newPrice != null && (
                                <p className="text-sm font-medium text-primary">
                                  {variant.currency}{" "}
                                  {variant.newPrice.toLocaleString()}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 truncate">
                                New Price
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))
                    )}
                  </ul>
                  {results.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <Link
                        href={`/search?q=${encodeURIComponent(searchQuery)}`}
                        onClick={handleResultClick}
                        className="block w-full text-center text-sm font-medium text-gray-800 hover:text-primary py-2 rounded-md hover:bg-primary/5 duration-300 transition-colors"
                      >
                        View all results
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative hover:text-gray-900 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-[#f25c27] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              0
            </span>
          </Link>

          {/* Phone Icon */}
          {/* <Link
            href="/contact"
            className="hover:text-gray-900 transition-colors"
          >
            <Phone className="w-6 h-6" />
          </Link> */}

          {/* User Icon */}
          <Link href="/login" className="hover:text-gray-900 transition-colors">
            <User className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}
