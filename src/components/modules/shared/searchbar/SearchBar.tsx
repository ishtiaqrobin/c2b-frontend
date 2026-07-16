"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchBarProps {
  initialQuery?: string;
}

export default function SearchBar({ initialQuery = "" }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-10">
      <form
        onSubmit={handleSearch}
        className="flex items-center w-full bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-100 p-2 pl-6 lg:pl-8 transition-shadow hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for buyback price (enter product name and code)"
          className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400/90 text-sm md:text-base font-medium w-full pr-4"
        />
        <button
          type="submit"
          className="flex items-center justify-center bg-primary/90 hover:bg-primary text-white rounded-full h-10 w-10 transition-colors shrink-0 cursor-pointer"
          aria-label="Search"
        >
          <Search className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}
