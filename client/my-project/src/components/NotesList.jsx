import { useEffect, useState } from "react";
import { getNotes, deleteNote } from "../api/notes";

export default function NotesList({ searchQuery }) {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    const res = await getNotes();
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    await deleteNote(id);
    fetchNotes();
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {filteredNotes.map((note) => (
        <div key={note._id} className="border p-4 rounded shadow bg-white">
          <h2 className="font-bold text-lg">{note.title}</h2>
          <p className="text-sm text-gray-600">Folder: {note.folder || 'None'}</p>
          <p>{note.content}</p>
          <div className="mt-2 text-sm text-gray-500">
            {note.tags && note.tags.length > 0 && (
              <div>Tags: {note.tags.join(", ")}</div>
            )}
          </div>
          <button
            onClick={() => handleDelete(note._id)}
            className="mt-2 text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

