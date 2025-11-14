import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api/api-calls";
import { useQueryClient } from "@tanstack/react-query";
import type { MovieApiResponse } from "@/types";
import ReturnHome from "@/components/ui/return-home";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export function StatsDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cachedFlattened, setCachedFlattened] = useState<MovieApiResponse[]>(
    []
  );

  useEffect(() => {
    // Redirect if not admin
    if (!authApi.isAdmin()) {
      navigate("/");
    }
  }, [navigate]);

  // Read cached movies queries from TanStack Query without fetching
  useEffect(() => {
    const allMoviesQueries = queryClient.getQueriesData({
      queryKey: ["movies"],
    });
    const firstData = allMoviesQueries[0]?.[1] as any;
    const flattened =
      firstData?.pages?.flatMap((p: any) => p?.data ?? []) ?? [];
    setCachedFlattened(flattened);

    console.log("[StatsDashboard] Movies queries in cache:", allMoviesQueries);
    console.log(
      "[StatsDashboard] Flattened cached movies count:",
      flattened.length
    );
    console.log("[StatsDashboard] Flattened cached movies sample:", flattened);
  }, [queryClient]);

  const movies = cachedFlattened;

  const yearsList = movies
    .map((m) => m.year)
    .filter((y): y is number => typeof y === "number");
  const minYear = yearsList.length ? Math.min(...yearsList) : null;
  const maxYear = yearsList.length ? Math.max(...yearsList) : null;

  const runtimeByYear: Record<number, { total: number; count: number }> = {};
  movies.forEach((movie) => {
    const year = movie.year;
    if (!runtimeByYear[year]) runtimeByYear[year] = { total: 0, count: 0 };
    runtimeByYear[year].total += movie.runtime ?? 0;
    runtimeByYear[year].count += 1;
  });

  const avgRuntimeData = Object.entries(runtimeByYear)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, data]) => ({
      year,
      avgRuntime: data.total / data.count,
    }));

  const css = getComputedStyle(document.documentElement);
  const foreground = css.getPropertyValue("--foreground").trim();
  const mutedForeground = css.getPropertyValue("--muted-foreground").trim();
  const borderColor = css.getPropertyValue("--border").trim();

  const isDark = document.documentElement.classList.contains("dark");
  const axisTickColor = isDark ? "#FFFFFF" : mutedForeground;

  const lineData = {
    labels: avgRuntimeData.map((item) => item.year),
    datasets: [
      {
        label: "Average Runtime (minutes)",
        data: avgRuntimeData.map((item) => item.avgRuntime),
        borderColor: "#3B82F6",
        backgroundColor: "#3B82F6",
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#3B82F6",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const genreCount: Record<string, number> = {};
  const genreRatings: Record<string, number[]> = {};

  movies.forEach((movie) => {
    (movie.genre ?? []).forEach((g) => {
      genreCount[g] = (genreCount[g] || 0) + 1;
      if (!genreRatings[g]) genreRatings[g] = [];
      genreRatings[g].push(movie.rating ?? 0);
    });
  });

  const avgRatingByGenre = Object.keys(genreRatings).map((g) => ({
    genre: g,
    avgRating:
      genreRatings[g].reduce((a, b) => a + b, 0) / genreRatings[g].length,
  }));

  const genreData = {
    labels: Object.keys(genreCount),
    datasets: [
      {
        data: Object.values(genreCount),
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#8B5CF6",
          "#EC4899",
          "#F59E0B",
          "#F87171",
        ],
      },
    ],
  };

  const ratingsData = {
    labels: avgRatingByGenre.map((item) => item.genre),
    datasets: [
      {
        label: "Average Rating",
        data: avgRatingByGenre.map((item) => item.avgRating),
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#8B5CF6",
          "#EC4899",
          "#F59E0B",
          "#F87171",
        ],
      },
    ],
  };

  if (!authApi.isAdmin()) {
    return null;
  }

  if (cachedFlattened.length === 0) {
    return (
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background/95">
        <ReturnHome />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
          Movie Analytics Dashboard
        </h1>
        <p className="mb-6 text-muted-foreground">
          No data available. Load movies first to view analytics.
        </p>
      </div>
    );
  }
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background/95">
      <ReturnHome />

      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
        Movie Analytics Dashboard
      </h1>
      <p className="mb-6 text-muted-foreground">
        Visualize movie trends and metrics
        {minYear !== null && maxYear !== null
          ? ` from ${minYear} to ${maxYear}`
          : ""}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg border border-border shadow">
          <h3 className="text-xl font-semibold text-card-foreground">
            Genre Distribution
          </h3>
          <p className="mb-4 text-muted-foreground">
            Percentage breakdown of movies by genre
          </p>
          <div className="h-80">
            <Pie
              data={genreData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "right" } },
              }}
            />
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border shadow">
          <h3 className="text-xl font-semibold text-card-foreground">
            Average Ratings of Genre
          </h3>
          <p className="mb-4 text-muted-foreground">
            Compares the average user rating for each genre.
          </p>
          <div className="h-80">
            <Bar
              data={ratingsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 10,
                    grid: { color: borderColor },
                    ticks: { color: axisTickColor },
                  },
                  x: {
                    grid: { color: borderColor },
                    ticks: { color: mutedForeground },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border border-border shadow">
        <h3 className="text-xl font-semibold text-card-foreground">
          Average Runtime by Year
        </h3>
        <p className="mb-4 text-muted-foreground">
          Shows the trend of average movie length over the selected years
        </p>

        <div className="h-80 w-full overflow-x-auto">
          <div className="min-w-[600px] h-full">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      color: foreground,
                      font: {
                        size: 12,
                      },
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        ` ${context.parsed.y.toFixed(1)} minutes`,
                    },
                    titleColor: foreground,
                    bodyColor: foreground,
                    backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
                    borderColor: borderColor,
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 6,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Runtime (minutes)",
                      color: foreground,
                      font: {
                        size: 12,
                      },
                    },
                    grid: {
                      color: borderColor,
                      drawBorder: true,
                    },
                    ticks: {
                      color: axisTickColor,
                      font: {
                        size: 11,
                      },
                    },
                  },
                  x: {
                    title: {
                      display: true,
                      text: "Year",
                      color: foreground,
                      font: {
                        size: 12,
                      },
                    },
                    grid: {
                      color: borderColor,
                      drawBorder: true,
                    },
                    ticks: {
                      color: axisTickColor,
                      font: {
                        size: 11,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
