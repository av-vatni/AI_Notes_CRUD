import { useEffect, useState } from "react";
import { getNotes, deleteNote } from "../api/notes";

export default function NotesList() {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {notes.map((note) => (
        <div key={note._id} className="border p-4 rounded shadow bg-white">
          <h2 className="font-bold text-lg">{note.title}</h2>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
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
