import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Lobby from "./pages/Lobby";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />{" "}
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/words" element={<div>Word Collection Coming Soon</div>} />
    </Routes>
  );
}

export default App;
