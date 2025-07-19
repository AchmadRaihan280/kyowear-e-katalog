"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface DescriptionBannerProps {
  title: string;
  price: string;
  colors: string[];
  sizes: string[];
  description: string;
  imageUrls: string[];
}

export default function DescriptionBanner({
  title,
  price,
  colors,
  sizes,
  description,
  imageUrls = [],
}: DescriptionBannerProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const mainImage = imageUrls[selectedImage] || "/placeholder-product.jpg";

  return (
    <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-xl p-6 shadow-sm">
      {/* Image Section */}
      <div className="lg:w-1/2">
        {/* Swiper for mobile: slide image to switch */}
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          onSlideChange={(swiper) => setSelectedImage(swiper.activeIndex)}
          className="rounded-lg overflow-hidden bg-gray-100 aspect-square cursor-pointer"
        >
          {imageUrls.map((url, i) => (
            <SwiperSlide key={i}>
              <div
                className="relative w-full h-full aspect-square"
                onClick={() => setShowLightbox(true)}
              >
                <Image
                  src={url}
                  alt={`Product image ${i + 1}`}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbnails only on desktop */}
        {imageUrls.length > 1 && (
          <div className="hidden lg:grid grid-cols-4 gap-2 mt-4">
            {imageUrls.map((url, index) => (
              <button
                key={index}
                className={`relative aspect-square rounded overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <Image
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="lg:w-1/2 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-xl font-semibold text-pink-600">{price}</p>

        <div className="prose text-gray-600">
          {description.split("\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {colors.length > 0 && (
          <div>
            <h2 className="font-medium text-gray-700">Colors</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {colors.map((color) => (
                <span
                  key={color}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}

        {sizes.length > 0 && (
          <div>
            <h2 className="font-medium text-gray-700">Sizes</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <Image
              src={mainImage}
              alt={title}
              width={1200}
              height={1200}
              className="w-full h-full object-contain"
              unoptimized
            />
            <button
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                setShowLightbox(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
