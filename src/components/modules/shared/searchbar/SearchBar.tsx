"use client";

import React, { FormEvent } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    // এখানে আপনার সার্চ লজিক বসান
    console.log("Search triggered");
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-10">
      <form
        onSubmit={handleSearch}
        className="flex items-center w-full bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-gray-100 p-2 pl-6 lg:pl-8 transition-shadow hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]"
      >
        <input
          type="text"
          placeholder="Search for buyback price (enter product name and JAN code)"
          className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder:text-gray-400/90 text-sm md:text-base font-medium w-full pr-4"
        />
        <button
          type="submit"
          className="flex items-center justify-center bg-[#008B8B] hover:bg-[#007070] text-white rounded-full h-10 w-10 transition-colors flex-shrink-0"
          aria-label="Search"
        >
          <Search className="w-5 h-5" strokeWidth={2.5} />
        </button>
      </form>
    </div>
  );
}
