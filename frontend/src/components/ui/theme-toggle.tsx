"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-md bg-transparent border border-input  hover:bg-accent/20 transition-colors duration-200 cursor-pointer group"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 text-yellow-500 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 text-blue-400 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-popover/95 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg p-1.5 space-y-1 min-w-[120px] z-50"
          sideOffset={8}
        >
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            className={`flex items-center px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
              theme === "light" ? "bg-accent/50" : "hover:bg-accent/30"
            }`}
          >
            <Sun className="mr-2 h-4 w-4 text-yellow-500" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            className={`flex items-center px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
              theme === "dark" ? "bg-accent/50" : "hover:bg-accent/30"
            }`}
          >
            <Moon className="mr-2 h-4 w-4 text-blue-400" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            className={`flex items-center px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
              theme === "system" ? "bg-accent/50" : "hover:bg-accent/30"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
