import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DescriptionBanner from "../../components/DescriptionBanner";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

interface Product {
  title: string;
  price: string;
  colors: string[];
  sizes: string[];
  description: string;
  imageUrl: string;
  imageUrls?: string[];
  purchaseLink?: string;
}

interface PageProps {
  params: { id: string };
}

export default async function BannerDetailPage({ params }: PageProps) {
  const { id } = params;
  const docRef = doc(db, "banners", id);
  const docSnap = await getDoc(docRef);

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
          <DescriptionBanner
            title={product.title}
            price={`Rp${parseInt(product.price).toLocaleString("id-ID")}`}
            colors={product.colors}
            sizes={product.sizes}
            description={product.description}
            imageUrls={product.imageUrls || [product.imageUrl]}
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
