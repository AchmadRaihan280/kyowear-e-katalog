"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
    setShowSearch(false);
  };

  // Tutup search bar kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  return (
    <header className="relative bg-slate-900 border-b border-gray-800">
      {/* Header Utama */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Kiri */}
        <div className="text-white font-bold text-xl">KyoWear</div>

        {/* Tengah */}
        <nav className="absolute left-1/2 -translate-x-1/2 text-gray-400">
          <Link
            href="/allcategory"
            className="hover:text-pink-500 transition-colors duration-300 font-medium"
          >
            AllProducts
          </Link>
        </nav>

        {/* Kanan */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSearch(true)}
            className="text-white hover:text-pink-500 transition duration-300"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push("/login")}
            className="text-white hover:text-pink-500 transition duration-300"
            aria-label="Admin Login"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      {showSearch && (
        <div
          ref={searchRef}
          className="absolute top-full left-0 w-full bg-slate-900 shadow-md p-3 z-50"
        >
          <form onSubmit={handleSearch} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search Products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 text-sm text-white bg-slate-800 border border-slate-700 rounded-lg outline-none placeholder-gray-400"
              autoFocus
            />
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-lg transition-colors text-sm font-medium"
            >
              Search
            </button>

            <button
              type="button"
              onClick={() => setShowSearch(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
