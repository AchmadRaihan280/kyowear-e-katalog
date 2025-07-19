import Header from "../components/Header";
import Footer from "../components/Footer";
import AllCategory from "../components/AllCategory";

export default function AllCategoryPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white px-4 py-6">
      <Header />
      <AllCategory />
      <Footer />
    </main>
  );
}
