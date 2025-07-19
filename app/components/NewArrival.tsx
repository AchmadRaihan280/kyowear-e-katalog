"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getNewArrivals } from "@/lib/firestore";
import Link from "next/link";

interface ArrivalItem {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
}

export default function NewArrival() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<ArrivalItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNewArrivals();
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
        console.error("Failed to fetch new arrivals", err);
      }
    };

    fetchData();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = direction === "left" ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="mt-6 px-0 md:px-5 relative">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-slate-900 hover:bg-slate-700 text-white rounded-full p-2 shadow"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Scrollable Container with proper padding */}
      <div className="w-full overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar py-2 px-[16px] md:px-[80px] scroll-px-[16px] md:scroll-px-[80px] min-w-0"
        >
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/newarrival/${item.id}`}
              className="relative bg-slate-800 border border-slate-700 rounded-xl flex-shrink-0 w-[300px] h-[220px] p-4 shadow-md hover:ring-2 hover:ring-pink-600 transition duration-300"
            >
              <Image
                src={item.imageUrls[0]}
                alt={item.name}
                fill
                className="object-contain"
                sizes="300px"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-full text-white text-sm">
                <span className="font-semibold">{item.name}</span>
                <span className="bg-gradient-to-r from-blue-600 to-blue-400 px-3 py-1 rounded-full text-xs text-white shadow">
                  Rp{item.price.toLocaleString("id-ID")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-slate-900 hover:bg-slate-700 text-white rounded-full p-2 shadow"
      >
        <ChevronRight size={20} />
      </button>

      <div className="border-t mt-12 border-gray-300 dark:border-gray-700" />
    </section>
  );
}
