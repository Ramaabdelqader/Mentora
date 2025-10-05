import { useEffect, useState } from "react";

export default function Toast({ text = "", duration = 1800 }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(t);
  }, [duration]);
  if (!show) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="rounded-xl bg-gray-900 text-white px-4 py-2 shadow-lg">
        {text}
      </div>
    </div>
  );
}
