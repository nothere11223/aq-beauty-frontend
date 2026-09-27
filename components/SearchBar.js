import { Search, SlidersHorizontal } from 'lucide-react';

export default function SearchBar() {
  return (
    <div className="mb-10 max-w-2xl mx-auto">
      <div className="flex items-center bg-white rounded-full px-5 py-3.5 shadow-sm border border-[#f2e6dc] gap-3 hover:border-amber-700 transition duration-300">
        <Search className="h-5 w-5 text-[#b09b88]" />
        <input 
          type="text" 
          placeholder="Search for luxury skincare, makeup, fragrances..." 
          className="bg-transparent text-sm focus:outline-none w-full text-[#2d2420] placeholder-[#b09b88]"
        />
        <SlidersHorizontal className="h-4 w-4 text-[#8c735e] cursor-pointer hover:text-amber-700 transition" />
      </div>
    </div>
  );
}