import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";

export default function CourseCard({ c }) {
  return (
    <article className="card overflow-hidden flex flex-col">
      <img src={c.thumbnail} alt={c.title} className="h-44 w-full object-cover" />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 line-clamp-2">{c.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{c.short}</p>
        <div className="flex items-center justify-between text-sm text-gray-600 mt-auto">
          <div className="flex items-center gap-2">
            <img src={c.instructor.avatar} alt="" className="h-6 w-6 rounded-full" />
            <span>{c.instructor.name}</span>
          </div>
          <RatingStars value={c.rating} />
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-gray-900">${c.price}</span>
          <Link to={`/courses/${c.id}`} className="btn btn-primary">View</Link>
        </div>
      </div>
    </article>
  );
}
