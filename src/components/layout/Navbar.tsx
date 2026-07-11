"use client";

import Link from "next/link";
import { ShoppingCart, Phone, User, ChevronDown } from "lucide-react";

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
  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex flex-col text-[#f25c27] hover:opacity-90 transition-opacity"
        >
          <span className="text-3xl font-bold tracking-widest font-sans">
            買取商店
          </span>
          <span className="text-sm font-medium tracking-wide">
            kaitorishouten
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2">
          {/* Category Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-4 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
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
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-sm transition-colors"
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
            <button className="flex items-center gap-1 px-4 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
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
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-sm transition-colors"
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
            className="px-4 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            Frequently Asked Questions
          </Link>

          {/* Store List Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-4 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
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
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-sm transition-colors"
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
            className="px-4 py-2 text-base font-medium text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
          >
            Inquiry
          </Link>
        </nav>

        {/* Action Icons Section */}
        <div className="flex items-center space-x-6 text-gray-600">
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
          <Link
            href="/contact"
            className="hover:text-gray-900 transition-colors"
          >
            <Phone className="w-6 h-6" />
          </Link>

          {/* User Icon */}
          <Link href="/login" className="hover:text-gray-900 transition-colors">
            <User className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </header>
  );
}
