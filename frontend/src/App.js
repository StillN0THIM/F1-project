import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Home";
import Standings from "./pages/Standings";
import Calendar from "./pages/Calendar";
import News from "./pages/News";
import Race from "./pages/Race";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      {/* Navbar sits outside Routes so it appears on every page */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/news" element={<News />} />
          <Route path="/races/:id" element={<Race />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;