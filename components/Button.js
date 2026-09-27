export default function Button({ children, className = "", onClick, variant = "primary" }) {
  const baseStyle = "text-xs font-semibold px-6 py-3 rounded-full flex items-center gap-2 shadow-md transition mx-auto md:mx-0";
  const variants = {
    primary: "bg-[#2d2420] text-[#f7ede2] hover:bg-amber-800",
    secondary: "bg-amber-700 text-white hover:bg-amber-800",
    outline: "bg-transparent border border-[#2d2420] text-[#2d2420] hover:bg-[#2d2420] hover:text-white"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}