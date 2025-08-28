import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createNote } from "../api/notes";
import { Tag, FolderOpen, Pin, X } from "lucide-react";

export default function NoteEditor({ onNoteSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [folder, setFolder] = useState("General");
  const [isPinned, setIsPinned] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        content,
        tags,
        folder,
        isPinned,
      };
      const res = await createNote(payload);
      if (onNoteSaved) onNoteSaved(res.data);
      setTitle("");
      setContent("");
      setTags([]);
      setTagInput("");
      setFolder("General");
      setIsPinned(false);
    } catch (error) {
      console.error("Error creating note:", error);
      alert(error?.response?.data?.error || "Failed to create note");
    }
  };

  const addTag = (e) => {
    e.preventDefault();
    const next = tagInput.trim();
    if (!next) return;
    if (!tags.includes(next)) {
      setTags([...tags, next]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "color",
    "background",
    "link",
    "image",
  ];

  const folderOptions = [
    "General",
    "Work",
    "Personal",
    "Ideas",
    "Tasks",
    "Projects",
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a title..."
            className="flex-1 mr-4 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setIsPinned((v) => !v)}
            className={`p-3 rounded-lg transition-colors ${
              isPinned
                ? "text-yellow-600 bg-yellow-50 border border-yellow-200"
                : "text-gray-500 hover:bg-gray-100 border border-transparent"
            }`}
            title={isPinned ? "Unpin" : "Pin"}
          >
            <Pin className="w-5 h-5" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <ReactQuill
            value={content}
            onChange={setContent}
            modules={quillModules}
            formats={quillFormats}
            style={{ height: 240 }}
            className="text-gray-800"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTag(e);
                }}
                placeholder="Add a tag"
                className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((t, i) => (
                  <span
                    key={`${t}-${i}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="ml-2 text-blue-700 hover:text-blue-900"
                      aria-label={`Remove ${t}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Folder</label>
            <div className="relative">
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="w-full p-2 pl-9 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {folderOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <FolderOpen className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save Note
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
