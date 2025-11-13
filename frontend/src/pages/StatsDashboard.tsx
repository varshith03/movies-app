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
import axios from "axios";
import { useEffect, useState } from "react";

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

import { responseData } from "./sampleResponse";

export function StatsDashboard() {
  const [movieResponse, setMovieResponse] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // 🔹 Replace with your actual API endpoint
        const result = await axios.get("https://your-api-endpoint.com/movies");

        console.log("API Response:", result.data);

        setMovieResponse(result.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  //make changes here
  const response = movieResponse || responseData;

  const runtimeByYear: Record<number, { total: number; count: number }> = {};
  response.data.forEach((movie) => {
    const year = movie.year;
    if (!runtimeByYear[year]) runtimeByYear[year] = { total: 0, count: 0 };
    runtimeByYear[year].total += movie.runtime;
    runtimeByYear[year].count += 1;
  });

  const avgRuntimeData = Object.entries(runtimeByYear)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, data]) => ({
      year,
      avgRuntime: data.total / data.count,
    }));

  const lineData = {
    labels: avgRuntimeData.map((item) => item.year),
    datasets: [
      {
        label: "Average Runtime (minutes)",
        data: avgRuntimeData.map((item) => item.avgRuntime),
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        pointBackgroundColor: "#3B82F6",
        pointBorderColor: "#fff",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const genreCount: Record<string, number> = {};
  const genreRatings: Record<string, number[]> = {};

  response.data.forEach((movie) => {
    movie.genre.forEach((g) => {
      genreCount[g] = (genreCount[g] || 0) + 1;
      if (!genreRatings[g]) genreRatings[g] = [];
      genreRatings[g].push(movie.rating);
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
        backgroundColor: "#3B82F6",
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Movie Analytics Dashboard
      </h1>
      <p className="mb-6 text-gray-500">
        Visualize movie trends and metrics from 1980 to 2023
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800">
            Genre Distribution
          </h3>
          <p className="mb-4 text-gray-500">
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

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-800">
            Average Ratings of Genre
          </h3>
          <p className="mb-4 text-gray-500">
            Compares the average user rating for each genre.
          </p>
          <div className="h-80">
            <Bar
              data={ratingsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, max: 10 } },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-800">
          Average Runtime by Year
        </h3>
        <p className="mb-4 text-gray-500">
          Shows the trend of average movie length over the selected years
        </p>

        <div className="h-80 w-[800px] mx-auto">
          <Line
            data={lineData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      ` ${context.parsed.y.toFixed(1)} minutes`,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: "Runtime (minutes)" },
                },
                x: {
                  title: { display: true, text: "Year" },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
