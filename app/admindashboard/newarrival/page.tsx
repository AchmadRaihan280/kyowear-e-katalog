// app/admindashboard/newarrival/page.tsx
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
  deleteField,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Arrival {
  docId?: string;
  title: string;
  description: string;
  colors: string[];
  sizes: string[];
  price: number | string;
  imageUrls?: string[];
  purchaseLink?: string;
  createdAt?: Timestamp;
}

export default function AdminNewArrivalPage() {
  const [user, setUser] = useState<User | null>(null);
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [price, setPrice] = useState<string | number>("");
  const [purchaseLink, setPurchaseLink] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) router.push("/login");
      else setUser(u);
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

    if (!res.ok) throw new Error("Image upload failed");

    const data = await res.json();
    return data.secure_url;
  };

  const fetchArrivals = async () => {
    if (!user) return;

    try {
      const snapshot = await getDocs(collection(db, "newarrivals"));
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        const images = Array.isArray(docData.imageUrls)
          ? docData.imageUrls
          : [];
        return {
          docId: doc.id,
          imageUrls: images.filter((url) => typeof url === "string"),
          ...docData,
        } as Arrival;
      });
      setArrivals(data.reverse());
    } catch (err) {
      console.error("Failed to fetch new arrivals:", err);
    }
  };

  useEffect(() => {
    fetchArrivals();
  }, [user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map(uploadImageToCloudinary)
      );
      setImageUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      alert("Upload gagal.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (i: number) => {
    setImageUrls(imageUrls.filter((_, index) => index !== i));
  };

  const handleEditArrival = (index: number) => {
    const item = arrivals[index];
    setTitle(item.title);
    setDescription(item.description);
    setColors(item.colors.join(", "));
    setSizes(item.sizes.join(", "));
    setPrice(item.price);
    setImageUrls(item.imageUrls || []);
    setPurchaseLink(item.purchaseLink || "");
    setEditIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteArrival = async (index: number) => {
    if (!confirm("Delete this item?")) return;
    try {
      await deleteDoc(doc(db, "newarrivals", arrivals[index].docId!));
      fetchArrivals();
    } catch (err) {
      alert("Delete failed.");
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

    if (!title || imageUrls.length === 0) {
      alert("Title and image are required.");
      return;
    }

    const data = {
      name: title, // <== ini tambahan
      title,
      description,
      colors: colors.split(",").map((c) => c.trim()),
      sizes: sizes.split(",").map((s) => s.trim()),
      price: typeof price === "string" ? parseInt(price) || 0 : price || 0,
      imageUrls: Array.isArray(imageUrls)
        ? imageUrls.filter((url) => typeof url === "string")
        : [],
      purchaseLink,
      createdAt: Timestamp.now(),
    };

    try {
      if (editIndex !== null && arrivals[editIndex]?.docId) {
        await updateDoc(doc(db, "newarrivals", arrivals[editIndex].docId!), {
          ...data,
          imageUrl: deleteField(),
        });
        alert("Updated successfully!");
      } else {
        await addDoc(collection(db, "newarrivals"), data);
        alert("Added successfully!");
      }
      resetForm();
      fetchArrivals();
    } catch (error) {
      console.error("Submit error:", error);
      alert(
        `An error occurred: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-slate-800 text-white p-6 space-y-8 fixed h-full">
  {/* Logo */}
  <div className="flex items-center space-x-2">
    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
      K
    </div>
    <h1 className="text-xl font-bold">
      <span className="text-purple-400">Kyo</span>
      <span className="text-white">Wear</span>
    </h1>
  </div>

  {/* Menu */}
  <nav className="space-y-2">
    <a
      href="/admindashboard/banner"
      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <span>Banner</span>
    </a>

    <a
      href="/admindashboard/newarrival"
      className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-slate-700 text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
      <span>New Arrival</span>
    </a>

    <a
      href="/admindashboard/allcategory"
      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-700 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a2 2 0 012-2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4z" />
      </svg>
      <span>All Products</span>
    </a>
  </nav>

  {/* Logout */}
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


      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">
              {editIndex !== null ? "Edit New Arrival" : "Add New Arrival"}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-md p-6 space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg min-h-[120px] text-black"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Colors (comma separated)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                      value={colors}
                      onChange={(e) => setColors(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sizes (comma separated)
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                      value={sizes}
                      onChange={(e) => setSizes(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
                      value={purchaseLink}
                      onChange={(e) => setPurchaseLink(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg"
                >
                  {editIndex !== null ? "Update Arrival" : "Add Arrival"}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Upload Images
                </h3>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                />
                {uploading && (
                  <p className="text-blue-600 mt-2">Uploading...</p>
                )}
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={url}
                          alt={`Image ${index + 1}`}
                          width={100}
                          height={100}
                          className="object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {title && imageUrls.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">
                    Preview
                  </h3>
                  <div className="flex items-center gap-4">
                    <Image
                      src={imageUrls[0]}
                      alt={title}
                      width={100}
                      height={100}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{title}</p>
                      <p className="text-sm text-gray-600">{description}</p>
                      <p className="text-blue-600 font-bold">
                        Rp
                        {(typeof price === "string"
                          ? parseInt(price)
                          : price
                        ).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <section className="mt-12">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              New Arrivals List
            </h3>
            {arrivals.length === 0 ? (
              <p className="text-gray-500">No arrivals yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {arrivals.map((item, idx) => (
                  <div
                    key={item.docId}
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                  >
                    {item.imageUrls && item.imageUrls[0] && (
                      <Image
                        src={item.imageUrls[0]}
                        alt={item.title}
                        width={400}
                        height={250}
                        className="w-full object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {item.title}
                      </h4>
                      <p className="text-blue-600 font-bold">{item.price}</p>
                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() => handleEditArrival(idx)}
                          className="text-sm text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteArrival(idx)}
                          className="text-sm text-red-600"
                        >
                          Delete
                        </button>
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
