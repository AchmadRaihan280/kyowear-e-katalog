"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
  };

  return (
    <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center px-6 py-4 bg-slate-900 border-b border-gray-800 gap-3 sm:gap-0">
      <div className="text-white font-bold text-xl">KyoWear</div>
      <form
        onSubmit={handleSearch}
        className="flex w-full sm:w-auto max-w-md bg-white rounded-full overflow-hidden shadow-md"
      >
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 text-sm text-gray-800 outline-none"
        />
        <button
          type="submit"
          className="bg-pink-600 hover:bg-pink-700 text-white px-4 sm:px-6 transition-colors"
        >
          Cari
        </button>
      </form>

      <nav className="flex gap-4 text-gray-400">
        <Link
          href="/allcategory"
          className="hover:text-pink-500 transition-colors duration-300"
        >
          AllProducts
        </Link>
      </nav>

      <button
        onClick={() => router.push("/login")}
        className="text-white hover:text-pink-500 transition duration-300"
        aria-label="Admin Login"
      >
        <User className="w-5 h-5" />
      </button>
    </header>
  );
}
