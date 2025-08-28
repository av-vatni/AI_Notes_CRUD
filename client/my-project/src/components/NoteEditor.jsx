// filepath: e:\Backend\AI_Notes_CRUD\client\my-project\src\components\NoteEditor.jsx
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createNote } from "../api/notes";
import { Tag, FolderOpen, Pin, X } from "lucide-react";

export default function NoteEditor({ onNoteSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [folder, setFolder] = useState("General");
  const [isPinned, setIsPinned] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const noteData = {
        title: title.trim(),
        content,
        tags: tags.filter(tag => tag.trim()),
        folder,
        isPinned
      };

      const res = await createNote(noteData);
      onNoteSaved(res.data);
      
      setTitle("");
      setContent("");
      setTags([]);
      setFolder("General");
      setIsPinned(false);
      setShowAdvanced(false);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const addTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Voice recording functionality removed

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link', 'image'
  ];

  const folderOptions = ["General", "Work", "Personal", "Ideas", "Tasks", "Projects"];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Create New Note</h2>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            {showAdvanced ? 'Hide' : 'Show'} Options
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="w-full p-4 text-lg border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              required
            />
          </div>

          {/* Rich Text Editor */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Start writing your note..."
              style={{ height: 280 }}
              className="text-gray-800"
            />
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-100">
              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Tag className="inline w-4 h-4 mr-2 text-blue-600" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag..."
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onKeyPress={(e) => e.key === 'Enter' && addTag(e)}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Folder Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <FolderOpen className="inline w-4 h-4 mr-2 text-blue-600" />
                  Folder
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {folderOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFolder(option)}
                      className={`p-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
                        folder === option
                          ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pin Note */}
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                    isPinned
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                  }`}
                >
                  <Pin className={`w-5 h-5 ${isPinned ? 'text-yellow-600' : 'text-gray-500'}`} />
                  <span className="font-medium">
                    {isPinned ? 'Pinned' : 'Pin this note'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setContent("");
                  setTags([]);
                  setFolder("General");
                  setIsPinned(false);
                }}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
