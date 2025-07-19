"use client";

import Image from "next/image";

export default function TentangKami() {
  return (
    <section className="bg-white dark:bg-gray-900 py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Text */}
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            About KyoWear
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
            KyoWear is a local fashion brand committed to delivering
            high-quality, trend-forward apparel at accessible prices. We
            believe that everyone deserves to feel confident, stylish, and
            expressive—without breaking the bank.
          </p>
          <p className="text-gray-700 dark:text-gray-400 text-base">
            Our collections are crafted with care, blending timeless essentials
            with fresh, modern vibes. Whether you're dressing up or keeping it
            casual, KyoWear is here to elevate your everyday look.
          </p>
        </div>

        {/* Right: Animated Image */}
        <div className="flex justify-center md:justify-end">
          <Image
            src="/bajuu.png"
            alt="About KyoWear"
            width={400}
            height={400}
            className="object-contain animate-bounce-slow"
          />
        </div>
      </div>

      {/* Garis pembatas bawah */}
      <div className="border-t mt-12 border-gray-300 dark:border-gray-700" />
    </section>
  );
}
