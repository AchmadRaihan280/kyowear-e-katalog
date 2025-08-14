// app/search/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  collection: "banner" | "newarrival" | "allcategory";
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q")?.toLowerCase() || "";
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!keyword) return;
      setLoading(true);

      const collectionsToSearch = [
        { name: "banners", type: "banner" as const },
        { name: "newarrivals", type: "newarrival" as const },
        { name: "allcategories", type: "allcategory" as const },
      ];

      let allResults: Product[] = [];

      for (const col of collectionsToSearch) {
        const snap = await getDocs(collection(db, col.name));
        const filtered = snap.docs
          .map((doc) => {
            const data = doc.data();
            const imageUrls = data.imageUrls || [];
            return {
              id: doc.id,
              title: data.title ?? "Tanpa Judul",
              price: parseInt(data.price ?? "0"),
              imageUrl: imageUrls[0] || data.imageUrl || "",
              collection: col.type,
            };
          })
          .filter((p) => p.title.toLowerCase().includes(keyword));
        allResults = [...allResults, ...filtered];
      }

      setResults(allResults);
      setLoading(false);
    };

    fetchData();
  }, [keyword]);

  if (!keyword) {
    return (
      <div className="text-center py-10 text-gray-400">
        Ketik kata kunci untuk mencari produk.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-slate-900 min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6 text-center">
        Hasil Pencarian: "{keyword}"
      </h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-pink-500 border-t-transparent rounded-full" />
        </div>
      ) : results.length === 0 ? (
        <p className="text-gray-400">Produk tidak ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((item) => (
            <Link
              key={item.id}
              href={`/${item.collection}/${item.id}`}
              className="group block bg-gray-900 rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105"
            >
              <div className="relative w-full h-64 bg-gray-800">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-white truncate">
                  {item.title}
                </h3>
                <p className="text-pink-500 font-bold text-sm">
                  Rp{item.price.toLocaleString("id-ID")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
