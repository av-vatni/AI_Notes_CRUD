<<<<<<< HEAD
// filepath: e:\Backend\AI_Notes_CRUD\client\my-project\src\components\NoteEditor.jsx
import { useState, useRef } from "react";
=======
import { useState } from "react";
>>>>>>> 482b7aec41c7a74d942c5107ba61ac056352695e
import { createNote } from "../api/notes";
import { Mic, MicOff, FolderOpen, Pin } from "lucide-react";

export default function NoteEditor({ onNoteSaved }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
<<<<<<< HEAD
  const [tags, setTags] = useState([]);
  const [folder, setFolder] = useState("General");
  const [isPinned, setIsPinned] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

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
      
      // Reset form
      setTitle("");
      setContent("");
      setTags([]);
      setFolder("General");
      setIsPinned(false);
      setShowAdvanced(false);
    } catch (error) {
      console.error("Error creating note:", error);
    }
=======
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
>>>>>>> 482b7aec41c7a74d942c5107ba61ac056352695e
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

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        // Convert audio to text (placeholder - in real app, use speech-to-text API)
        setContent(prev => prev + "\n[Voice Note: Audio recorded]");
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

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

  return (
<<<<<<< HEAD
    <div className="p-6 bg-white rounded-lg shadow-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Create New Note</h2>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Content */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your note..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[140px] resize-y"
              rows={8}
            />
          </div>

          {/* Advanced Options */}
          {showAdvanced && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="inline w-4 h-4 mr-1" />
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Folder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FolderOpen className="inline w-4 h-4 mr-1" />
                  Folder
                </label>
                <select
                  value={folder}
                  onChange={(e) => setFolder(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Ideas">Ideas</option>
                  <option value="Tasks">Tasks</option>
                </select>
              </div>

              {/* Pin Note */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pinNote"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="pinNote" className="flex items-center text-sm font-medium text-gray-700">
                  <Pin className="w-4 h-4 mr-1" />
                  Pin this note
                </label>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-3">
            <button
              type="button"
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              className={`${isRecording ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} px-3 py-2 rounded-lg flex items-center gap-2`}
              title={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span className="text-sm">{isRecording ? 'Stop Recording' : 'Record Voice'}</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Note
            </button>
          </div>
        </div>
      </form>
    </div>
=======
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
>>>>>>> 482b7aec41c7a74d942c5107ba61ac056352695e
  );
}
