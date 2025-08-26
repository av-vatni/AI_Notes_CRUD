import { useState, useEffect } from "react";
import NoteEditor from "./components/NoteEditor";
import NotesList from "./components/NotesList";
import Auth from "./components/Auth";
import { User, LogOut, Brain, Mic, Search, FolderOpen, Tag } from "lucide-react";

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleAuthSuccess = (data) => {
    setUser(data.user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  const handleNoteSaved = () => {
    // Refresh notes list
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <Brain className="w-24 h-24 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🧠 AI Notes</h1>
            <p className="text-gray-600 text-lg">Your intelligent note-taking companion</p>
          </div>
          
          <button
            onClick={() => setShowAuth(true)}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg"
          >
            Get Started
          </button>
        </div>

        {showAuth && (
          <Auth onAuthSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-3">
                <Brain className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">AI Notes</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
                <span>Welcome, {user.username}!</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Settings removed as API key is managed on server */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg lg:shadow-none transform transition-transform duration-300 ease-in-out lg:transition-none`}>
          <div className="h-full flex flex-col">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`${
                    activeTab === "notes"
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <Search className="mr-3 h-5 w-5" />
                  All Notes
                </button>
                
                <button
                  onClick={() => setActiveTab("folders")}
                  className={`${
                    activeTab === "folders"
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <FolderOpen className="mr-3 h-5 w-5" />
                  Folders
                </button>
                
                <button
                  onClick={() => setActiveTab("tags")}
                  className={`${
                    activeTab === "tags"
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <Tag className="mr-3 h-5 w-5" />
                  Tags
                </button>
                
                <button
                  onClick={() => setActiveTab("ai")}
                  className={`${
                    activeTab === "ai"
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <Brain className="mr-3 h-5 w-5" />
                  AI Features
                </button>
                
                <button
                  onClick={() => setActiveTab("voice")}
                  className={`${
                    activeTab === "voice"
                      ? "bg-blue-100 text-blue-700 border-r-2 border-blue-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                >
                  <Mic className="mr-3 h-5 w-5" />
                  Voice Notes
                </button>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {activeTab === "notes" && (
              <>
                <NoteEditor onNoteSaved={handleNoteSaved} />
                <NotesList />
              </>
            )}
            
            {activeTab === "folders" && (
              <div className="text-center py-12">
                <FolderOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Folders View</h2>
                <p className="text-gray-600">Organize your notes by folders</p>
              </div>
            )}
            
            {activeTab === "tags" && (
              <div className="text-center py-12">
                <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Tags View</h2>
                <p className="text-gray-600">Browse notes by tags</p>
              </div>
            )}
            
            {activeTab === "ai" && (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">AI Features</h2>
                <p className="text-gray-600">AI-powered note enhancement and summarization</p>
              </div>
            )}
            
            {activeTab === "voice" && (
              <div className="py-8">
                <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Mic className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-800">Voice Notes</h2>
                  </div>
                  <p className="text-gray-600 mb-4">Use the microphone button in "Create New Note" to record audio snippets. The audio is not uploaded; we append a marker to your note. For transcription, integrate a speech-to-text service later.</p>
                  <ul className="list-disc pl-6 text-sm text-gray-600 space-y-1">
                    <li>Click the mic button to start recording, click again to stop.</li>
                    <li>Recording status is shown on the button color.</li>
                    <li>A marker gets added to the note content after stop.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

    </div>
  );
}

export default App;