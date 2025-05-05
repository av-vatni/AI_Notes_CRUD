import { useState } from "react";
import NoteEditor from "./components/NoteEditor";
import NotesList from "./components/NotesList";
import SearchBar from "./components/SearchBar";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">📝 AI Notes</h1>
      <NoteEditor onNoteSaved={() => window.location.reload()} />
      <SearchBar onSearch={setSearchQuery} />
      <NotesList searchQuery={searchQuery} />
    </div>
  );
}
