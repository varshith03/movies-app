import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AllMovies } from "./pages/all-movies";
import MovieDetails from "./pages/movie-details";
import { StatsDashboard } from "./pages/stats-dashboard";
// @ts-ignore

import Login from "./pages/login";
import { Toaster } from "@/components/ui/sonner";
import { authApi } from "./lib/api/api-calls";
// @ts-ignore
import Navbar from "./components/ui/navbar";

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return authApi.isLoggedIn() ? children : <Navigate to="/login" replace />;
};

// Layout for authenticated routes (with navbar)
const AuthenticatedLayout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Toaster position="top-right" />
    </div>
  );
};

// Layout for public routes (without navbar)
const PublicLayout = () => {
  return (
    <div>
      <Outlet />
      <Toaster position="top-right" />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes (no navbar) */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected routes (with navbar) */}
        <Route element={<AuthenticatedLayout />}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AllMovies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <AllMovies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <MovieDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <StatsDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
