import Header from "./components/Header";
import Banner from "./components/Banner";
import NewArrival from "./components/NewArrival";
import TentangKami from "./components/TentangKami";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-slate-900 min-h-screen text-white px-4 py-6">
      <Header />
      <Banner />
      <NewArrival />
      <TentangKami /> 
      <Footer />
    </main>
  );
}
