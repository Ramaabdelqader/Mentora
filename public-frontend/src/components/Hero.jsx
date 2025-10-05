import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-gradient">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Learn new skills with{" "}
            <span className="text-blue-600">Mentora</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            High-quality courses by expert instructors. Study anywhere, anytime, at your pace.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/courses" className="btn btn-primary">Browse courses</Link>
            <a href="#featured" className="btn btn-outline">See featured</a>
          </div>
          <p className="mt-6 text-sm text-gray-500">Trusted by 20k+ learners globally.</p>
        </div>
        <div className="hidden md:block">
          <img
            className="w-full max-w-xl mx-auto rounded-3xl shadow-2xl ring-1 ring-black/5"
            src="/stdnts.jpg"
            alt="Students learning online"
          />
        </div>
      </div>
    </section>
  );
}
