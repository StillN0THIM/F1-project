import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages — we'll create these files next
import Home from "./pages/Home";
import Standings from "./pages/Standings";
import Calendar from "./pages/Calendar";
import News from "./pages/News";
import Race from "./pages/Race";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/standings" element={<Standings />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/news" element={<News />} />
        <Route path="/races/:id" element={<Race />} />
        {/* :id means this route accepts a dynamic value e.g. /races/1 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;