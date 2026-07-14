import React from "react";
import Link from "next/link";

// ১. টাইপ ডেফিনিশন
interface StoreLocation {
  id: number;
  name: string;
  address: string;
  tel: string;
}

interface FooterLink {
  id: number;
  label: string;
  href: string;
}

// ২. বাংলাদেশী ফেইক ডেটা অ্যারে
const storeLocations: StoreLocation[] = [
  {
    id: 1,
    name: "Gulshan Main Store",
    address: "House 12, Road 45, Gulshan-2, Dhaka 1212, Bangladesh",
    tel: "+880 2-9876543",
  },
  {
    id: 2,
    name: "Agrabad Branch",
    address: "CDA Avenue, Agrabad Commercial Area, Chattogram 4000, Bangladesh",
    tel: "+880 31-765432",
  },
  {
    id: 3,
    name: "Zindabazar Store",
    address: "Al-Hamra Shopping City, Zindabazar, Sylhet 3100, Bangladesh",
    tel: "+880 821-712345",
  },
  {
    id: 4,
    name: "Shaheb Bazar Branch",
    address: "Zero Point, Shaheb Bazar, Rajshahi 6000, Bangladesh",
    tel: "+880 721-776543",
  },
];

const footerLinks: FooterLink[] = [
  { id: 1, label: "Important Notes Regarding Buyback", href: "#" },
  { id: 2, label: "Buyback Terms of Service", href: "#" },
  { id: 3, label: "Privacy Policy", href: "#" },
  { id: 4, label: "Company Profile", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-[#26313C] text-gray-300 w-full pt-16 pb-12 px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* লোগো / টাইটেল */}
        <div className="mb-12">
          <h2 className="text-4xl font-semibold text-gray-400 tracking-wider">
            Buyback BD
          </h2>
        </div>

        {/* স্টোর লোকেশন গ্রিড - Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {storeLocations.map((store) => (
            <div key={store.id} className="text-sm leading-relaxed">
              <p className="font-semibold text-gray-200">{store.name}</p>
              <p className="mt-1">{store.address}</p>
              <p className="mt-1 text-gray-400">TEL : {store.tel}</p>
            </div>
          ))}
        </div>

        {/* ফুটার লিঙ্কস */}
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium mb-8">
          {footerLinks.map((link, index) => (
            <React.Fragment key={link.id}>
              <Link
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
              {index < footerLinks.length - 1 && (
                <span className="text-gray-500 font-light">|</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* লিগ্যাল এবং কপিরাইট টেক্সট */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 text-xs text-gray-400">
          <div className="max-w-2xl leading-relaxed">
            <p>
              Dhaka North City Corporation Trade License No.
              TRAD/DNCC/123456/2026.
            </p>
            <p>
              Unauthorized reproduction or quotation of any text or content
              provided on this site is strictly prohibited.
            </p>
          </div>
          <div className="lg:text-right max-w-xl leading-relaxed">
            <p>
              Copyright © Buyback BD - Your source for smartphones, mobile
              phones, home appliances, electronics, and daily necessities. All
              rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
