export default function CategoryItem({ cat }) {
  return (
    <div className="flex flex-col items-center gap-2 group cursor-pointer">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-sm border border-[#f2e6dc] overflow-hidden p-1 group-hover:border-amber-700 transition duration-300">
        <img src={cat.img} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-105 transition duration-500" />
      </div>
      <span className="text-xs text-[#735e4d] font-medium tracking-tight group-hover:text-amber-800 transition">{cat.name}</span>
    </div>
  );
}