import { Link } from "react-router-dom";
import { ThemeToggle } from "./theme-toggle";
import { SearchBar } from "./search-bar";
import { BarChart } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background">
      <div className="flex h-16 items-center justify-between px-32">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="https://png.pngtree.com/element_our/20190529/ourmid/pngtree-blue-square-diamond-gems-image_1216895.jpg" // Replace with your logo path
            alt="MovieBox"
            className="h-8 w-auto"
          />
          <span className="text-xl font-bold">MovieBox</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:block w-1/2 mx-8">
          <SearchBar />
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          <Link
            to="/stats"
            className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-input  hover:bg-accent hover:text-accent-foreground transition-colors"
            title="Dashboard"
          >
            <BarChart className="h-4 w-4" />
            <span className="sr-only">Dashboard</span>
          </Link>
          <ThemeToggle />
          <button className="h-9 w-9 rounded-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=32&h=32&q=80"
              alt="User"
              className="h-full w-full object-cover"
            />
          </button>
        </div>
      </div>

      {/* Mobile Search - shown only on small screens */}
      <div className="md:hidden p-4 border-t">
        <SearchBar />
      </div>
    </header>
  );
}
