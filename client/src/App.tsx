import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewSession from "./pages/NewSession";
import SessionDetail from "./pages/SessionDetail";
import NewHanchan from "./pages/NewHanchan";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-gray-50 max-w-lg mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sessions/new" element={<NewSession />} />
          <Route path="/sessions/:id" element={<SessionDetail />} />
          <Route path="/sessions/:id/hanchan/new" element={<NewHanchan />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
