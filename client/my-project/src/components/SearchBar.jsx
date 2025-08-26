import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    onSearch(q.toLowerCase());
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder="Search by title or tag..."
      className="w-full p-2 border border-gray-300 rounded mb-4"
    />
  );
}
