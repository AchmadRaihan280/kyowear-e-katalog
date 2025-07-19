"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BannerItem {
  docId: string;
  title: string;
  price: number;
  imageUrl: string;
  isBestSeller?: boolean;
}

export default function Banner() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); // ✅ state loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "banners"));
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          const imageUrls = docData.imageUrls || [];
          return {
            docId: doc.id,
            title: docData.title ?? "Tanpa Judul",
            price: parseInt(docData.price ?? "0"),
            imageUrl: imageUrls[0] || docData.imageUrl || "",
            isBestSeller: docData.isBestSeller === true,
          };
        });
        setBanners(data);
      } catch (err) {
        console.error("Error fetching banners:", err);
      } finally {
        setLoading(false); // ✅ selesai loading
      }
    };

    fetchData();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 px-4 min-h-[400px] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full" />
      </div>
    );
  }

  if (banners.length === 0) return null;

  const current = banners[currentIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto py-8 px-4">
      <Link href={`/banner/${current.docId}`} className="block relative group">
        <div className="relative w-full h-[400px] bg-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
          {current.isBestSeller && (
            <div className="absolute top-4 left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
              BestSeller
            </div>
          )}
          <Image
            src={current.imageUrl}
            alt={current.title}
            width={500}
            height={400}
            className="object-contain max-h-full"
            unoptimized
            priority
          />

          {/* Title & Price Badge */}
          <div className="absolute bottom-4 left-4 flex gap-3 items-center bg-black/70 px-4 py-2 rounded-full text-white backdrop-blur-md">
            <span className="font-bold text-sm">{current.title}</span>
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Rp{current.price.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </Link>

      {/* Carousel Control */}
      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          >
            ←
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          >
            →
          </button>
        </>
      )}
    </div>
  );
}
