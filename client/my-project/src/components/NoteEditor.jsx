import { useState } from "react";
import { createNote } from "../api/notes";

export default function NoteEditor({ onNoteSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [folder, setFolder] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = tags.split(",").map(tag => tag.trim());
    const res = await createNote({ title, content, tags: tagsArray, folder });
    onNoteSaved(res.data);
    setTitle("");
    setContent("");
    setTags("");
    setFolder("");
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
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Note Content"
        className="w-full p-2 border border-gray-300 rounded mb-2"
        rows={5}
      />
      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags (comma separated)"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <input
        type="text"
        value={folder}
        onChange={(e) => setFolder(e.target.value)}
        placeholder="Folder"
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Save Note
      </button>
    </form>
  );
}
