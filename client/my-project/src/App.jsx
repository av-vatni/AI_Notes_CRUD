import { useState, useEffect } from "react";
import NoteEditor from "./components/NoteEditor";
import NotesList from "./components/NotesList";
import Auth from "./components/Auth";
import { User, LogOut, Brain, Plus } from "lucide-react";

function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
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
    setShowNoteEditor(false);
    setRefreshKey((k) => k + 1);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <Brain className="w-24 h-24 text-blue-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">🧠 NeuraNotes</h1>
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
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Brain className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">NeuraNotes</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNoteEditor(!showNoteEditor)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Note</span>
              </button>
              
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
                <span>Welcome, {user.username}!</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {showNoteEditor && (
          <div className="mb-8">
            <NoteEditor onNoteSaved={handleNoteSaved} />
          </div>
        )}
        
        <NotesList refreshKey={refreshKey} />
      </main>
    </div>
  );
}

export default App;
