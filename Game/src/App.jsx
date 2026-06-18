import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";
import WordCollection from "./pages/WordCollection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />{" "}
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/words" element={<WordCollection />} />
      <Route path="/wheel" element={<div>Discussion Page Coming Soon</div>} />
    </Routes>
  );
}

export default App;
