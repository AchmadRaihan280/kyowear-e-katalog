"use client";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  writeBatch,
  deleteField,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import DescriptionBanner from "../../components/DescriptionBanner";
import Image from "next/image";

interface Banner {
  docId?: string;
  title: string;
  description: string;
  colors: string[];
  sizes: string[];
  price: string;
  imageUrl?: string; // Legacy field
  imageUrls?: string[]; // New field
  purchaseLink?: string;
  createdAt?: Timestamp;
}

export default function AdminBannerPage() {
  const [user, setUser] = useState<User | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [price, setPrice] = useState("");
  const [purchaseLink, setPurchaseLink] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        router.push("/login");
      } else {
        setUser(u);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push("/");
  };

  const uploadImageToCloudinary = async (image: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "kyowear");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlh4vrbpe/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      console.error("Failed to upload to Cloudinary:", await res.text());
      throw new Error("Image upload failed");
    }

    const data = await res.json();
    return data.secure_url;
  };

  const fetchBanners = async () => {
    if (!user) return;

    try {
      const snapshot = await getDocs(collection(db, "banners"));
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        // Handle both image formats and ensure we always have an array
        const images = docData.imageUrl
          ? [docData.imageUrl]
          : Array.isArray(docData.imageUrls)
          ? docData.imageUrls
          : [];

        return {
          docId: doc.id,
          imageUrls: images.filter(
            (url) => typeof url === "string" && url.length > 0
          ), // Filter out invalid URLs
          ...docData,
        } as Banner;
      });
      setBanners(data.reverse());
    } catch (err) {
      console.error("Failed to fetch banners:", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map((file) => uploadImageToCloudinary(file))
      );
      setImageUrls((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      alert("Failed to upload images.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleEditBanner = (index: number) => {
    const banner = banners[index];
    setTitle(banner.title);
    setDescription(banner.description);
    setColors(banner.colors.join(", "));
    setSizes(banner.sizes.join(", "));
    setPrice(banner.price);
    setImageUrls(banner.imageUrls || []);
    setPurchaseLink(banner.purchaseLink || "");
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteBanner = async (index: number) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await deleteDoc(doc(db, "banners", banners[index].docId!));
        fetchBanners();
      } catch (err) {
        console.error("Failed to delete banner:", err);
        alert("Error occurred while deleting banner.");
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setColors("");
    setSizes("");
    setPrice("");
    setImageUrls([]);
    setPurchaseLink("");
    setEditIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to perform this action.");
      router.push("/login");
      return;
    }

    if (!title || imageUrls.length === 0) {
      alert("Title and at least one image are required.");
      return;
    }

    const bannerData = {
      title,
      description,
      colors: colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      sizes: sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      price,
      imageUrls, // Always save as array
      purchaseLink,
      createdAt: Timestamp.now(),
       isBestSeller: true,
    };

    try {
      if (editIndex !== null && banners[editIndex]?.docId) {
        // For update, remove legacy imageUrl field if exists
        await updateDoc(doc(db, "banners", banners[editIndex].docId!), {
          ...bannerData,
          imageUrl: deleteField(),
        });
        alert("Banner updated successfully!");
      } else {
        await addDoc(collection(db, "banners"), bannerData);
        alert("Banner added successfully!");
      }

      resetForm();
      fetchBanners();
    } catch (error) {
      console.error("Error saving banner:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white p-6 space-y-8 fixed h-full">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
            K
          </div>
          <h1 className="text-xl font-bold">
            <span className="text-purple-400">Kyo</span>
            <span className="text-white">Wear</span>
          </h1>
        </div>

        <nav className="space-y-2">
          <a
            href="/admindashboard/banner"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-slate-700 text-white"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>
            </svg>
            <span>Banner</span>
          </a>
          <a
            href="/admindashboard/newarrival"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-700 hover:text-white transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              ></path>
            </svg>
            <span>New Arrival</span>
          </a>

          {/* ✅ Tambahan menu AllProducts */}
          <a
            href="/admindashboard/allcategory"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-slate-700 hover:text-white transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a2 2 0 012-2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4z"
              />
            </svg>
            <span>All Products</span>
          </a>
        </nav>

        <button
  onClick={() => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
      handleLogout();
    }
  }}
  className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 px-4 py-3 rounded-lg text-white transition mt-auto"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    ></path>
  </svg>
  <span>Logout</span>
</button>

      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {editIndex !== null ? "Edit Banner" : "Add New Banner"}
            </h2>
          </div>

          {/* Form Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-md p-6 space-y-6"
              >
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] text-black"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Colors and Sizes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Colors (comma separated)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      value={colors}
                      onChange={(e) => setColors(e.target.value)}
                      placeholder="Example: Black, White, Red"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sizes (comma separated)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      value={sizes}
                      onChange={(e) => setSizes(e.target.value)}
                      placeholder="Example: S, M, L, XL"
                    />
                  </div>
                </div>

                {/* Price and Purchase Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Purchase Link
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      value={purchaseLink}
                      onChange={(e) => setPurchaseLink(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {editIndex !== null ? "Update Banner" : "Add Banner"}
                  </button>
                </div>
              </form>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Upload Images
                </h3>

                <div className="space-y-4">
                  <label className="block">
                    <span className="sr-only">Choose images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploading}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </label>

                  {uploading && (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span>Uploading images...</span>
                    </div>
                  )}

                  {/* Image Preview Grid */}
                  {imageUrls.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Image Previews
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                              <Image
                                src={url}
                                alt={`Preview ${index + 1}`}
                                width={100}
                                height={100}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md hover:bg-red-600"
                              title="Delete image"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Banner Preview */}
              {title && imageUrls.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Banner Preview
                  </h3>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <DescriptionBanner
                      title={title}
                      price={price}
                      colors={colors
                        .split(",")
                        .map((c) => c.trim())
                        .filter(Boolean)}
                      sizes={sizes
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)}
                      description={description}
                      imageUrls={[imageUrls[0]]} // ✅ perbaikan: ubah jadi array
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Banner List */}
          <section className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Banner List</h3>
              <p className="text-sm text-gray-500">
                {banners.length} {banners.length === 1 ? "banner" : "banners"}{" "}
                available
              </p>
            </div>

            {banners.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <h4 className="mt-3 text-lg font-medium text-gray-700">
                  No banners yet
                </h4>
                <p className="mt-1 text-gray-500">
                  Start by adding a new banner
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {banners.map((banner, idx) => (
                  <div
                    key={banner.docId}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <div className="relative h-48 bg-gray-100">
                      {banner.imageUrls && banner.imageUrls.length > 0 && (
                        <Image
                          src={banner.imageUrls[0]}
                          alt={banner.title}
                          fill
                          className="object-cover"
                          priority
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                        <h3 className="text-white font-semibold">
                          {banner.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-blue-600 font-bold">
                            {banner.price}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {banner.colors.length}{" "}
                            {banner.colors.length === 1 ? "color" : "colors"} •{" "}
                            {banner.sizes.length}{" "}
                            {banner.sizes.length === 1 ? "size" : "sizes"}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditBanner(idx)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition"
                            title="Edit"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              ></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteBanner(idx)}
                            className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
                            title="Delete"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
