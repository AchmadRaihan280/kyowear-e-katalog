"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getAllCategoryItems } from "@/lib/firestore";

interface CategoryItem {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
}

export default function AllCategory() {
  const [items, setItems] = useState<CategoryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCategoryItems();
        const formatted = data
          .filter((item) => item.name && item.price && item.imageUrls?.length)
          .map((item) => ({
            id: item.id!,
            name: item.name!,
            price: Number(item.price) || 0,
            imageUrls: item.imageUrls!,
          }));
        setItems(formatted);
      } catch (err) {
        console.error("Failed to fetch all category items", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="px-4 py-8 space-y-8">
      {/* 🔙 Tombol back simbol "<" dengan efek klik */}
      <div>
        <button
          onClick={() => window.history.back()}
          className="text-lg font-bold text-white hover:text-pink-500 transition duration-200 transform active:scale-90"
        >
          &lt;
        </button>
      </div>

      {/* 🛍 Grid Produk */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/allcategories/${item.id}`}
            className="group block bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-md hover:ring-2 hover:ring-pink-500 transition duration-300"
          >
            <div className="relative w-full h-64 bg-slate-700">
              <Image
                src={item.imageUrls[0]}
                alt={item.name}
                fill
                className="object-contain"
                sizes="300px"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white truncate">
                {item.name}
              </h3>
              <p className="text-blue-400 font-bold">
                Rp{item.price.toLocaleString("id-ID")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
