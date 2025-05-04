import NoteEditor from "./components/NoteEditor";
import NotesList from "./components/NotesList";

 function App(){
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">📝 AI Notes</h1>
      <NoteEditor onNoteSaved={() => window.location.reload()} />
      <NotesList/>
    </div>
  )
}
export default App;