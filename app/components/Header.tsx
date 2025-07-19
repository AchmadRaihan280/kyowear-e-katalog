"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "lucide-react";

export default function Header() {
  const router = useRouter();

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-slate-900 border-b border-gray-800">
      <div className="text-white font-bold text-xl">KyoWear</div>

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
