import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "./firebase";

// Tipe data Banner
export type BannerData = {
  id?: string;
  subtitle?: string;
  imageUrls?: string[];
  productId?: string;
  shopeePrice?: string;
  tokopediaPrice?: string;
  name?: string;
  description?: string;
  color?: string;
  size?: string;
  createdAt?: string;
  price?: number | string; // ✅ tambahkan ini
};

// Ambil semua data banner dari Firestore
export const getBannerData = async (): Promise<BannerData[]> => {
  const snapshot = await getDocs(collection(db, "banners"));
  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id, // id dari doc.id dipakai terakhir agar tidak tertimpa
  })) as BannerData[];
};

// Ambil semua data dari koleksi 'newarrivals'
export const getNewArrivals = async (): Promise<BannerData[]> => {
  const snapshot = await getDocs(collection(db, "newarrivals"));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      name: data.name || data.title || "", // fallback jika name belum ada
    };
  }) as BannerData[];
};

// Ambil semua data dari koleksi 'products'
export const getAllCategoryItems = async (): Promise<BannerData[]> => {
  const snapshot = await getDocs(collection(db, "allcategories"));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      name: data.name || data.title || "",
    };
  }) as BannerData[];
};

// Tambahkan banner baru ke Firestore dan update field id agar sama dengan document ID
export const addBanner = async (data: Omit<BannerData, "id">) => {
  const bannersRef = collection(db, "banners");
  const docRef = await addDoc(bannersRef, data);
  await updateDoc(docRef, { id: docRef.id });
};
