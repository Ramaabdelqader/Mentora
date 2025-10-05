export default function SearchBar({ value, onChange, onSubmit, placeholder="Search courses..." }) {
  return (
    <form
      onSubmit={(e)=>{ e.preventDefault(); onSubmit?.(); }}
      className="flex w-full gap-2"
    >
      <input
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="input"
        placeholder={placeholder}
      />
      <button className="btn btn-outline" type="submit">Search</button>
    </form>
  );
}
