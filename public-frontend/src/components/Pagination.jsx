export default function Pagination({ page, total, pageSize, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="flex items-center justify-center gap-2">
      <button className="btn btn-outline" disabled={page <= 1} onClick={()=>onChange(page-1)}>Prev</button>
      <span className="text-sm text-gray-600">
        Page <b>{page}</b> of <b>{totalPages}</b>
      </span>
      <button className="btn btn-outline" disabled={page >= totalPages} onClick={()=>onChange(page+1)}>Next</button>
    </div>
  );
}
