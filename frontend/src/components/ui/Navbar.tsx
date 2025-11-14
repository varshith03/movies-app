import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { BarChart } from "lucide-react";
import { useEffect, useState } from "react";
import { authApi } from "@/lib/api/api-calls";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin when component mounts
    setIsAdmin(authApi.isAdmin());
  }, []);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="https://png.pngtree.com/element_our/20190529/ourmid/pngtree-blue-square-diamond-gems-image_1216895.jpg" // Replace with your logo path
            alt="MovieBox"
            className="h-8 w-auto"
          />
          <span className="text-xl font-bold">MovieBox</span>
        </Link>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {isAdmin && (
            <Link
              to="/stats"
              className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-input hover:bg-accent hover:text-accent-foreground transition-colors"
              title="Dashboard"
            >
              <BarChart className="h-4 w-4" />
              <span className="sr-only">Dashboard</span>
            </Link>
          )}
          <ThemeToggle />
          <button className="h-9 w-9 rounded-full overflow-hidden">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSWFfyF1Jqo8eVpUIolixhgsB_A_qoTToa3Q&s"
              alt="User"
              className="h-full w-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
