"use client";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import DescriptionAllcategory from "../../components/DescriptionAllcategory";

interface Product {
  title: string;
  price: string | number;
  colors: string[];
  sizes: string[];
  description: string;
  imageUrl?: string;
  imageUrls?: string[];
  purchaseLink?: string;
}

interface PageProps {
  params: { id: string };
}

export default async function AllCategoryDetailPage({ params }: PageProps) {
  const { id } = params;

  const docRef = doc(db, "allcategories", id);
  const docSnap = await getDoc(docRef);

  console.log("🔥 docSnap.exists:", docSnap.exists());
  console.log("🔥 docSnap data:", docSnap.data());

  if (!docSnap.exists()) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p>Produk tidak ditemukan.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const product = docSnap.data() as Product;

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Header />
      <main className="flex-grow py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <DescriptionAllcategory
            title={product.title}
            price={
              typeof product.price === "number"
                ? `Rp${product.price.toLocaleString("id-ID")}`
                : product.price
            }
            colors={product.colors}
            sizes={product.sizes}
            description={product.description}
            imageUrls={product.imageUrls || [product.imageUrl || ""]}
            purchaseLink={product.purchaseLink}
          />

          {product.purchaseLink && (
            <div className="text-center">
              <a
                href={product.purchaseLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-blue-600 hover:bg-pink-500 transition text-white font-semibold rounded-lg"
              >
                Buy Now
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
