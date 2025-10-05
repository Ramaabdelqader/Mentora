export default function CategoryPills({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {["All", ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-3 py-1.5 rounded-full border text-sm ${
            active === cat
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
