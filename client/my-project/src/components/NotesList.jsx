import { useEffect, useState } from "react";
import { getNotes, deleteNote, updateNote } from "../api/notes";
import { summarizeNote, expandNote, generateTags } from "../api/ai";
import { Search, Filter, Tag, FolderOpen, Pin, Archive, Edit, Trash2, Sparkles, Highlighter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NotesList({ searchQuery }) {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showArchived, setShowArchived] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchNotes = async () => {
    try {
      const res = await getNotes();
      setNotes(res.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    filterAndSortNotes();
  }, [notes, searchTerm, selectedTags, selectedFolder, sortBy, sortOrder, showArchived]);

  const filterAndSortNotes = () => {
    let filtered = notes.filter(note => {
      // Filter by archived status
      if (note.isArchived !== showArchived) return false;
      
      // Filter by search term
      if (searchTerm && !note.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !note.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter by tags
      if (selectedTags.length > 0 && !selectedTags.some(tag => note.tags.includes(tag))) {
        return false;
      }
      
      // Filter by folder
      if (selectedFolder && note.folder !== selectedFolder) {
        return false;
      }
      
      return true;
    });

    // Sort notes
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Put pinned notes first
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    setFilteredNotes(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await deleteNote(id);
        fetchNotes();
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await updateNote(id, { isPinned: !notes.find(n => n._id === id)?.isPinned });
      fetchNotes();
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const handleToggleArchive = async (id) => {
    try {
      await updateNote(id, { isArchived: !notes.find(n => n._id === id)?.isArchived });
      fetchNotes();
    } catch (error) {
      console.error("Error toggling archive:", error);
    }
  };

  const startEdit = (note) => {
    setEditingNote(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const saveEdit = async () => {
    try {
      await updateNote(editingNote, { title: editTitle, content: editContent });
      setEditingNote(null);
      setEditTitle("");
      setEditContent("");
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };
  const runSummary = async (id) => {
    try {
      setBusyId(id);
      await summarizeNote(id);
      fetchNotes();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    } finally {
      setBusyId(null);
    }
  };

  const runExpand = async (id) => {
    try {
      setBusyId(id);
      await expandNote(id, 'detailed');
      fetchNotes();
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    } finally {
      setBusyId(null);
    }
  };

  const runTagGen = async (id) => {
    try {
      setBusyId(id);
      const res = await generateTags(id);
      const tags = res.data?.suggestedTags || [];
      if (tags.length) {
        await updateNote(id, { tags });
        fetchNotes();
      }
    } catch (e) {
      alert(e?.response?.data?.error || e.message);
    } finally {
      setBusyId(null);
    }
  };


  const cancelEdit = () => {
    setEditingNote(null);
    setEditTitle("");
    setEditContent("");
  };

  const getUniqueTags = () => {
    const allTags = notes.flatMap(note => note.tags || []);
    return [...new Set(allTags)].filter(tag => tag && tag.trim());
  };

  const getUniqueFolders = () => {
    const allFolders = notes.map(note => note.folder || 'General');
    return [...new Set(allFolders)].filter(folder => folder && folder.trim());
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery) ||
    (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
  );

  return (
<<<<<<< HEAD
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Tags Filter */}
          <div>
            <select
              value={selectedTags.join(',')}
              onChange={(e) => setSelectedTags(e.target.value ? e.target.value.split(',') : [])}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Tags</option>
              {getUniqueTags().map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Folder Filter */}
          <div>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Folders</option>
              {getUniqueFolders().map(folder => (
                <option key={folder} value={folder}>{folder}</option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="updatedAt">Updated</option>
              <option value="createdAt">Created</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
=======
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
>>>>>>> 482b7aec41c7a74d942c5107ba61ac056352695e
        </div>

        {/* Quick Filters */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex space-x-2">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-3 py-1 rounded-full text-sm ${
                showArchived 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showArchived ? 'Hide' : 'Show'} Archived
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredNotes.length} of {notes.length} notes
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => (
          <div
            key={note._id}
            className={`border rounded-lg shadow-sm bg-white overflow-hidden ${
              note.isPinned ? 'ring-2 ring-yellow-400' : ''
            } ${note.isArchived ? 'opacity-75' : ''}`}
          >
            {/* Note Header */}
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editingNote === note._id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-1 border border-gray-300 rounded text-sm font-semibold"
                    />
                  ) : (
                    <h3 className="font-semibold text-gray-800 text-sm">{note.title}</h3>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </span>
                    {note.isPinned && <Pin className="w-3 h-3 text-yellow-500" />}
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleTogglePin(note._id)}
                    className={`p-1 rounded hover:bg-gray-200 ${
                      note.isPinned ? 'text-yellow-500' : 'text-gray-400'
                    }`}
                    title={note.isPinned ? 'Unpin' : 'Pin'}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={() => handleToggleArchive(note._id)}
                    className="p-1 rounded hover:bg-gray-200 text-gray-400"
                    title={note.isArchived ? 'Unarchive' : 'Archive'}
                  >
                    <Archive className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={() => startEdit(note)}
                    className="p-1 rounded hover:bg-gray-200 text-gray-400"
                    title="Edit"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="p-1 rounded hover:bg-gray-200 text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Note Content */}
            <div className="p-4">
              {editingNote === note._id ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-sm resize-none"
                  rows={4}
                />
              ) : (
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              )}

              {/* AI Summary */}
              {note.aiSummary && (
                <div className="mt-2 p-2 bg-purple-50 border border-purple-200 rounded text-xs text-purple-800">
                  <div className="flex items-center gap-1 font-semibold mb-1"><Highlighter className="w-3 h-3" /> AI Summary</div>
                  <div className="whitespace-pre-wrap">{note.aiSummary}</div>
                </div>
              )}

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Folder */}
              {note.folder && (
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <FolderOpen className="w-3 h-3 mr-1" />
                  {note.folder}
                </div>
              )}

              {/* Edit Actions */}
              {editingNote === note._id && (
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={saveEdit}
                    className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* AI Actions */}
              <div className="flex gap-2 mt-3 flex-wrap">
                <button
                  onClick={() => runSummary(note._id)}
                  disabled={busyId === note._id}
                  className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-50"
                  title="Summarize with AI"
                >
                  <Sparkles className="inline w-3 h-3 mr-1" /> Summarize
                </button>
                <button
                  onClick={() => runExpand(note._id)}
                  disabled={busyId === note._id}
                  className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50"
                  title="Expand with AI"
                >
                  <Sparkles className="inline w-3 h-3 mr-1" /> Expand
                </button>
                <button
                  onClick={() => runTagGen(note._id)}
                  disabled={busyId === note._id}
                  className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                  title="Generate tags with AI"
                >
                  <Tag className="inline w-3 h-3 mr-1" /> AI Tags
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No notes found. {searchTerm || selectedTags.length > 0 || selectedFolder ? 'Try adjusting your filters.' : 'Create your first note!'}</p>
        </div>
      )}
    </div>
  );
}

