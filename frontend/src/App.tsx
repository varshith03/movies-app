import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AllMovies } from "./pages/AllMovies";
import MovieDetails from "./pages/MovieDetails";
import { StatsDashboard } from "./pages/StatsDashboard";
import { Navbar } from "./components/ui/Navbar";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<AllMovies />} />
          <Route path="/movies" element={<AllMovies />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/stats" element={<StatsDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
