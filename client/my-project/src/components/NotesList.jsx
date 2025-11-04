import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getNotes, deleteNote, updateNote } from "../api/notes";
import { summarizeNote, expandNote, generateTags } from "../api/ai";
import { uploadImageBase64 } from "../api/upload";
import { Search, Filter, Tag, FolderOpen, Pin, Archive, Edit, Trash2, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import config from "../config";

export default function NotesList({ refreshKey }) {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [expandedNoteIds, setExpandedNoteIds] = useState(new Set());
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
  const quillRefs = useRef({});
  const currentEditingNoteRef = useRef(null);

  const fetchNotes = async () => {
    try {
      console.log('📝 Fetching notes...');
      const res = await getNotes();
      setNotes(res.data);
      console.log(`✅ Fetched ${res.data.length} notes successfully`);
    } catch (error) {
      console.error("❌ Error fetching notes:", error);
      // Show user-friendly error message
      if (error.response?.status === 500) {
        alert('Server error. Please try again later.');
      } else if (error.message.includes('Network error')) {
        alert('Connection error. Please check your internet connection.');
      } else {
        alert(`Error loading notes: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [refreshKey]);

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

  const formatContentToHtml = (raw) => {
    if (!raw) return "";
    // Remove code fences if any slipped in
    let text = raw.replace(/```[a-zA-Z]*\n([\s\S]*?)\n```/g, '$1');
    // Strip full document wrappers if present
    text = text.replace(/<!DOCTYPE[^>]*>/gi, '')
               .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')
               .replace(/<\/?html[^>]*>/gi, '')
               .replace(/<\/?body[^>]*>/gi, '');
    const hasHtmlTags = /<[^>]+>/.test(text);
    if (hasHtmlTags) return text;
    const lines = raw.split(/\r?\n/);
    let html = "";
    let inUl = false;
    let inOl = false;
    const flushLists = () => { if (inUl) { html += "</ul>"; inUl = false; } if (inOl) { html += "</ol>"; inOl = false; } };
    for (const line of lines) {
      const bulletMatch = line.match(/^\s*([*-])\s+(.+)$/);
      const orderedMatch = line.match(/^\s*\d+\.\s+(.+)$/);
      if (bulletMatch) {
        if (!inUl) { flushLists(); html += "<ul>"; inUl = true; }
        html += `<li>${bulletMatch[2]}</li>`;
      } else if (orderedMatch) {
        if (!inOl) { flushLists(); html += "<ol>"; inOl = true; }
        html += `<li>${orderedMatch[1]}</li>`;
      } else if (/^\s*$/.test(line)) {
        flushLists();
        html += "<br/>";
      } else {
        flushLists();
        const strong = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1<\/strong>');
        const em = strong.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1<\/em>');
        html += `<p>${em}</p>`;
      }
    }
    flushLists();
    return html;
  };

  const isExpanded = (id) => expandedNoteIds.has(id);
  const toggleExpanded = (id) => {
    setExpandedNoteIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        console.log(`🗑️  Deleting note ${id}...`);
        await deleteNote(id);
        console.log('✅ Note deleted successfully');
        fetchNotes();
      } catch (error) {
        console.error("❌ Error deleting note:", error);
        const errorMessage = error?.response?.data?.error || error.message || 'Unknown error occurred';
        alert(`Failed to delete note: ${errorMessage}`);
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
    currentEditingNoteRef.current = note._id;
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const saveEdit = async () => {
    try {
      await updateNote(editingNote, { title: editTitle, content: editContent });
      setEditingNote(null);
      currentEditingNoteRef.current = null;
      setEditTitle("");
      setEditContent("");
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
      const errorMessage = error?.response?.data?.error || error?.response?.data?.details || error.message || 'Unknown error occurred';
      alert(`Failed to update note: ${errorMessage}`);
    }
  };

  // Custom image handler for ReactQuill
  const imageHandler = useCallback(async (quillInstance) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image is too large. Maximum size is 5MB. Please compress the image and try again.');
        return;
      }

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result;
        if (!base64Image || !quillInstance) return;

        try {
          // Upload to server
          const result = await uploadImageBase64(base64Image);
          
          // Get the full URL
          const imageUrl = result.url.startsWith('http') 
            ? result.url 
            : `${config.apiUrl}${result.url}`;
          
          // Get current selection range
          const range = quillInstance.getSelection(true);
          
          // Insert image at cursor position
          quillInstance.insertEmbed(range.index, 'image', imageUrl);
          
          // Move cursor after image
          quillInstance.setSelection(range.index + 1);
        } catch (error) {
          console.error('Error uploading image:', error);
          const errorMessage = error?.response?.data?.error || error.message || 'Failed to upload image';
          alert(`Image upload failed: ${errorMessage}`);
        }
      };
      
      reader.readAsDataURL(file);
    };
  }, []);

  // Create a stable modules configuration
  // Only depends on imageHandler which is stable (useCallback with empty deps)
  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: () => {
          // Get the currently editing note's quill instance from ref
          const noteId = currentEditingNoteRef.current;
          if (noteId && quillRefs.current[noteId]) {
            imageHandler(quillRefs.current[noteId]);
          }
        }
      }
    }
  }), [imageHandler]); // imageHandler is stable (useCallback with empty deps)

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link', 'image'
  ];
  const runSummary = async (id) => {
    try {
      setBusyId(id);
      console.log(`🤖 Running AI summary for note ${id}...`);
      await summarizeNote(id);
      console.log('✅ AI summary completed, refreshing notes...');
      fetchNotes();
    } catch (error) {
      console.error('❌ AI summary failed:', error);
      const errorMessage = error?.response?.data?.error || error.message || 'Unknown error occurred';
      alert(`AI Summary failed: ${errorMessage}`);
    } finally {
      setBusyId(null);
    }
  };

  const runExpand = async (id) => {
    try {
      setBusyId(id);
      console.log(`🤖 Running AI expansion for note ${id}...`);
      await expandNote(id, 'detailed');
      console.log('✅ AI expansion completed, refreshing notes...');
      fetchNotes();
    } catch (error) {
      console.error('❌ AI expansion failed:', error);
      const errorMessage = error?.response?.data?.error || error.message || 'Unknown error occurred';
      alert(`AI Expansion failed: ${errorMessage}`);
    } finally {
      setBusyId(null);
    }
  };

  const runTagGen = async (id) => {
    try {
      setBusyId(id);
      console.log(`🤖 Running AI tag generation for note ${id}...`);
      const res = await generateTags(id);
      const tags = res.data?.suggestedTags || [];
      if (tags.length) {
        console.log(`🏷️  Generated tags: ${tags.join(', ')}`);
        await updateNote(id, { tags });
        console.log('✅ Tags updated, refreshing notes...');
        fetchNotes();
      } else {
        console.log('⚠️  No tags generated by AI');
        alert('AI could not generate tags for this note. Please try again or add tags manually.');
      }
    } catch (error) {
      console.error('❌ AI tag generation failed:', error);
      const errorMessage = error?.response?.data?.error || error.message || 'Unknown error occurred';
      alert(`AI Tag Generation failed: ${errorMessage}`);
    } finally {
      setBusyId(null);
    }
  };


  const cancelEdit = () => {
    setEditingNote(null);
    currentEditingNoteRef.current = null;
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

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Tags Filter */}
          <div>
            <select
              value={selectedTags.join(',')}
              onChange={(e) => setSelectedTags(e.target.value ? e.target.value.split(',') : [])}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">All Folders</option>
              {getUniqueFolders().map(folder => (
                <option key={folder} value={folder}>{folder}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Filters and Sort */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                showArchived 
                  ? 'bg-gray-800 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {showArchived ? 'Hide' : 'Show'} Archived
            </button>
            
            <div className="flex items-center space-x-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="updatedAt">Updated</option>
                <option value="createdAt">Created</option>
                <option value="title">Title</option>
              </select>
              <button
                onClick={() => setSortOrder(order => order === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-500 font-medium">
            {filteredNotes.length} of {notes.length} notes
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.slice(0, visibleCount).map((note) => (
          <div
            key={note._id}
            className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-xl ${
              note.isPinned ? 'ring-2 ring-yellow-400 shadow-yellow-100' : ''
            } ${note.isArchived ? 'opacity-75' : ''}`}
          >
            {/* Note Header */}
            <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {editingNote === note._id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <h3 className="font-semibold text-gray-800 text-base leading-tight">{note.title}</h3>
                  )}
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-gray-500 font-medium">
                      {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                    </span>
                    {note.isPinned && <Pin className="w-4 h-4 text-yellow-500" />}
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleTogglePin(note._id)}
                    className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                      note.isPinned ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400'
                    }`}
                    title={note.isPinned ? 'Unpin' : 'Pin'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleToggleArchive(note._id)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                    title={note.isArchived ? 'Unarchive' : 'Archive'}
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => startEdit(note)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Note Content */}
            <div className="p-5">
              {editingNote === note._id ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <ReactQuill
                    ref={(el) => {
                      if (el) {
                        quillRefs.current[note._id] = el.getEditor();
                      } else {
                        delete quillRefs.current[note._id];
                      }
                    }}
                    value={editContent}
                    onChange={setEditContent}
                    modules={quillModules}
                    formats={quillFormats}
                    style={{ height: 240 }}
                    className="text-gray-800"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <div
                      className={`prose prose-sm max-w-none text-gray-700 leading-relaxed transition-all ${isExpanded(note._id) ? '' : 'line-clamp-4 overflow-hidden'}`}
                      dangerouslySetInnerHTML={{ __html: formatContentToHtml(note.content) }}
                    />
                    {!isExpanded(note._id) && (
                      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    )}
                  </div>
                  <button
                    onClick={() => toggleExpanded(note._id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {isExpanded(note._id) ? 'Show Less' : 'Read More'}
                  </button>

                  {note.aiSummary && (
                    <div className="p-4 rounded-lg border border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-purple-800 text-sm">AI Summary</span>
                      </div>
                      <p className="text-purple-800 text-sm leading-relaxed whitespace-pre-wrap">
                        {note.aiSummary}
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Folder */}
                  {note.folder && (
                    <div className="flex items-center text-sm text-gray-500">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      {note.folder}
                    </div>
                  )}
                </div>
              )}

              {/* Edit Actions */}
              {editingNote === note._id && (
                <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* AI Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100 flex-wrap">
                <button
                  onClick={() => runSummary(note._id)}
                  disabled={busyId === note._id}
                  className="px-3 py-2 text-sm rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 disabled:opacity-50 transition-colors font-medium border border-purple-200"
                  title="Summarize with AI"
                >
                  <Sparkles className="inline w-4 h-4 mr-1" /> Summarize
                </button>
                <button
                  onClick={() => runExpand(note._id)}
                  disabled={busyId === note._id}
                  className="px-3 py-2 text-sm rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50 transition-colors font-medium border border-indigo-200"
                  title="Expand with AI"
                >
                  <Sparkles className="inline w-4 h-4 mr-1" /> Expand
                </button>
                <button
                  onClick={() => runTagGen(note._id)}
                  disabled={busyId === note._id}
                  className="px-3 py-2 text-sm rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 transition-colors font-medium border border-blue-200"
                  title="Generate tags with AI"
                >
                  <Tag className="inline w-4 h-4 mr-1" /> AI Tags
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length > visibleCount && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setVisibleCount(c => c + 4)}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors"
          >
            Show More
          </button>
        </div>
      )}

      {filteredNotes.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 max-w-md mx-auto">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {searchTerm || selectedTags.length > 0 || selectedFolder ? 'No notes found' : 'No notes yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedTags.length > 0 || selectedFolder 
                ? 'Try adjusting your search or filters to find what you\'re looking for.' 
                : 'Create your first note to get started with your note-taking journey!'
              }
            </p>
            {!searchTerm && selectedTags.length === 0 && !selectedFolder && (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Create Note
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

