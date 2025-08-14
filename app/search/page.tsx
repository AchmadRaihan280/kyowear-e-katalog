// app/search/page.tsx
import { Suspense } from "react";
import SearchPageContent from "./SearchPageContent";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-10 text-gray-400">Loading search...</div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
