export default function RatingStars({ value = 0 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const arr = Array.from({ length: 5 });
  return (
    <div className="flex items-center gap-1">
      {arr.map((_, i) => (
        <span key={i} aria-hidden>
          {i < full ? "★" : i === full && half ? "☆" : "☆"}
        </span>
      ))}
      <span className="sr-only">{value} out of 5</span>
    </div>
  );
}
