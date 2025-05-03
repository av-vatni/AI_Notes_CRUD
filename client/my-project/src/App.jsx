import { useEffect } from "react";



function App() {
  useEffect(() => {
    fetch('http://localhost:5000')
      .then(res => res.text())
      .then(data => console.log(data));
  }, []);
  
  return <h1 className="text-3xl font-bold text-center">Hello New Project it is!!!</h1>;
}

export default App
