import { useState } from "react";
import { RichTextEditor } from "@mantine/rte";
import { createNote } from "../api/notes";

export default function NoteEditor({ onNoteSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createNote({ title, content });
    onNoteSaved(res.data);
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note Title"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <RichTextEditor value={content} onChange={setContent} />
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Save Note
      </button>
    </form>
  );
}
