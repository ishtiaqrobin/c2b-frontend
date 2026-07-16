import React from "react";
import Image from "next/image";
import Link from "next/link";

interface BuybackMethod {
  id: number;
  altText: string;
  imagePath: string;
  linkUrl?: string;
}

const methods: BuybackMethod[] = [
  {
    id: 1,
    altText: "In-store purchase process",
    imagePath:
      "https://res.cloudinary.com/da6yr9lro/image/upload/v1784047441/method1_xomaqy.png",
    linkUrl: "/buyback",
  },
  {
    id: 2,
    altText: "Mail-in buyback process",
    imagePath:
      "https://res.cloudinary.com/da6yr9lro/image/upload/v1784047441/method2_1_toxxjr.png",
    linkUrl: "/buyback",
  },
  {
    id: 3,
    altText: "Corporate Purchase Process",
    imagePath:
      "https://res.cloudinary.com/da6yr9lro/image/upload/v1784047441/method3_bqtngc.png",
    linkUrl: "/buyback",
  },
];

export default function BuybackMethods() {
  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Choose your preferred buyback method
        </h2>

        {/* Grid - Mobile: 1 col, Tablet/Desktop: 3 cols */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {methods.map((method) => (
            <Link
              href={method.linkUrl || "/"}
              key={method.id}
              className="relative w-full overflow-hidden cursor-pointer transition-all duration-500 hover:scale-103"
            >
              <Image
                src={method.imagePath}
                alt={method.altText}
                width={600}
                height={220}
                className="w-full h-auto object-cover"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
