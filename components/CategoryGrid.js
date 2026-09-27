import CategoryItem from './CategoryItem';

// Notice the "export default" here
export default function CategoryGrid({ categories }) {
  return (
    <div className="mb-14">
      <div className="text-center mb-6">
        <h3 className="font-serif text-xl font-bold text-[#2d2420]">Shop by Category</h3>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 md:gap-6">
        {categories.map((cat, idx) => (
          <CategoryItem key={idx} cat={cat} />
        ))}
      </div>
    </div>
  );
}