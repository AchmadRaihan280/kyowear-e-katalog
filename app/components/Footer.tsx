import { Instagram, Twitter, Facebook } from "lucide-react";

// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-12 py-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Logo / Brand */}
        <div>
          <h2 className="text-xl font-bold text-white">KyoWear</h2>
          <p className="text-sm mt-2 text-slate-400">
            Exclusive products, unique designs. Bring out your best style with Acme.
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Menu</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Products
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                About Us
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media / Info */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Follow Us</h3>
          <ul className="flex gap-4">
            <li>
              <a href="#" aria-label="Instagram">
                <Instagram className="w-5 h-5 text-slate-300 hover:text-white transition" />
              </a>
            </li>
            <li>
              <a href="#" aria-label="Twitter">
                <Twitter className="w-5 h-5 text-slate-300 hover:text-white transition" />
              </a>
            </li>
            <li>
              <a href="#" aria-label="Facebook">
                <Facebook className="w-5 h-5 text-slate-300 hover:text-white transition" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} KyoWear. All rights reserved.
      </div>
    </footer>
  );
}
