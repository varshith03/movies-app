import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface StatsData {
  totalMovies: number;
  averageRating: number;
  totalWatchTime: number;
  moviesByGenre: { genre: string; count: number }[];
  ratingsDistribution: { rating: number; count: number }[];
  recentActivity: { action: string; movie: string; time: string }[];
}

export function StatsDashboard() {
  // Mock data - replace with actual API calls
  const statsData: StatsData = {
    totalMovies: 1245,
    averageRating: 4.2,
    totalWatchTime: 2456,
    moviesByGenre: [
      { genre: "Action", count: 350 },
      { genre: "Comedy", count: 280 },
      { genre: "Drama", count: 320 },
      { genre: "Sci-Fi", count: 195 },
      { genre: "Horror", count: 100 },
    ],
    ratingsDistribution: [
      { rating: 1, count: 25 },
      { rating: 2, count: 75 },
      { rating: 3, count: 200 },
      { rating: 4, count: 400 },
      { rating: 5, count: 545 },
    ],
    recentActivity: [
      { action: "added", movie: "Inception", time: "2 hours ago" },
      { action: "rated", movie: "The Dark Knight", time: "5 hours ago" },
      { action: "watched", movie: "Interstellar", time: "1 day ago" },
    ],
  };

  const genreData = {
    labels: statsData.moviesByGenre.map((item) => item.genre),
    datasets: [
      {
        data: statsData.moviesByGenre.map((item) => item.count),
        backgroundColor: [
          "#3B82F6",
          "#10B981",
          "#8B5CF6",
          "#EC4899",
          "#F59E0B",
        ],
        borderWidth: 1,
      },
    ],
  };

  const ratingsData = {
    labels: statsData.ratingsDistribution.map((item) => `${item.rating}★`),
    datasets: [
      {
        label: "Number of Movies",
        data: statsData.ratingsDistribution.map((item) => item.count),
        backgroundColor: "#3B82F6",
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Statistics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500">Total Movies</p>
              <h3 className="text-2xl font-bold">
                {statsData.totalMovies.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500">Average Rating</p>
              <h3 className="text-2xl font-bold">
                {statsData.averageRating.toFixed(1)}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-gray-500">Total Watch Time</p>
              <h3 className="text-2xl font-bold">
                {statsData.totalWatchTime.toLocaleString()}h
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Charts */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Movies by Genre</h3>
          <div className="h-80">
            <Pie
              data={genreData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Ratings Distribution</h3>
          <div className="h-80">
            <Bar
              data={ratingsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      stepSize: 100,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {statsData.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="p-2 rounded-full bg-blue-100 text-blue-600 mr-3">
                {activity.action === "added" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                )}
                {activity.action === "rated" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                )}
                {activity.action === "watched" && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium">
                  {activity.action === "added" &&
                    `Added ${activity.movie} to your collection`}
                  {activity.action === "rated" &&
                    `Rated ${activity.movie} 5 stars`}
                  {activity.action === "watched" && `Watched ${activity.movie}`}
                </p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
