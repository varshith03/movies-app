/**
 * Test script to verify sortOrder functionality
 * Run with: node test-sort-order.js
 *
 * Make sure the server is running on http://localhost:8080
 */

const http = require("http");

// Test cases for sort order functionality
const testCases = [
  {
    name: "Default sort order (desc) - Rating",
    url: "/api/movies?sort=rating&limit=5",
    description:
      "Should return movies sorted by rating in descending order (highest first)",
  },
  {
    name: "Ascending sort order - Rating",
    url: "/api/movies?sort=rating&sortOrder=asc&limit=5",
    description:
      "Should return movies sorted by rating in ascending order (lowest first)",
  },
  {
    name: "Descending sort order - Year",
    url: "/api/movies?sort=year&sortOrder=desc&limit=5",
    description:
      "Should return movies sorted by year in descending order (newest first)",
  },
  {
    name: "Ascending sort order - Year",
    url: "/api/movies?sort=year&sortOrder=asc&limit=5",
    description:
      "Should return movies sorted by year in ascending order (oldest first)",
  },
  {
    name: "Invalid sort order",
    url: "/api/movies?sort=rating&sortOrder=invalid",
    description: "Should return 400 error for invalid sort order",
  },
  {
    name: "Combined with search and filter",
    url: "/api/movies?search=the&filter=genre:Drama&sort=rating&sortOrder=asc&limit=3",
    description: "Should work with search, filter, and ascending rating sort",
  },
];

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 8080,
      path: path,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsedData });
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    req.end();
  });
}

function compareSortOrder(movies, field, expectedOrder) {
  if (movies.length < 2) return true; // Can't verify sort with less than 2 items

  for (let i = 0; i < movies.length - 1; i++) {
    const current = movies[i][field];
    const next = movies[i + 1][field];

    if (expectedOrder === "asc" && current > next) return false;
    if (expectedOrder === "desc" && current < next) return false;
  }
  return true;
}

async function runTests() {
  console.log("🧪 Testing Sort Order Functionality\n");
  console.log("Make sure the server is running on http://localhost:8080\n");

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`📝 Test ${i + 1}: ${testCase.name}`);
    console.log(`   Description: ${testCase.description}`);
    console.log(`   URL: ${testCase.url}`);

    try {
      const result = await makeRequest(testCase.url);

      if (testCase.name === "Invalid sort order") {
        // This should return a 400 error
        if (result.status === 400) {
          console.log(
            `   ✅ SUCCESS - Correctly returned 400 error for invalid sort order`
          );
          console.log(`   📄 Message: ${result.data.message}`);
        } else {
          console.log(
            `   ❌ FAILED - Expected 400 error but got status: ${result.status}`
          );
        }
      } else if (result.status === 200 && result.data.success) {
        console.log(`   ✅ SUCCESS - Found ${result.data.data.length} movies`);

        if (result.data.data.length > 0) {
          // Verify sort order
          const movies = result.data.data;
          const urlParams = new URLSearchParams(testCase.url.split("?")[1]);
          const sortField = urlParams.get("sort");
          const sortOrder = urlParams.get("sortOrder") || "desc"; // default is desc

          if (sortField) {
            const isCorrectOrder = compareSortOrder(
              movies,
              sortField,
              sortOrder
            );
            console.log(
              `   📊 Sort verification: ${
                isCorrectOrder ? "✅ Correct" : "❌ Incorrect"
              } ${sortOrder} order for ${sortField}`
            );

            // Show first few movies as examples
            console.log(`   📽️  Examples (${sortField} values):`);
            movies.slice(0, 3).forEach((movie, idx) => {
              console.log(
                `      ${idx + 1}. "${movie.title}" - ${sortField}: ${
                  movie[sortField]
                }`
              );
            });
          }
        }

        console.log(
          `   📊 Total: ${result.data.pagination.total} movies found`
        );
      } else {
        console.log(
          `   ❌ FAILED - Status: ${result.status}, Response:`,
          result.data
        );
      }
    } catch (error) {
      console.log(`   ❌ ERROR - ${error.message}`);
    }

    console.log(""); // Empty line for readability
  }

  console.log("🏁 Sort order testing completed!");
  console.log("\n💡 Manual Testing URLs:");
  testCases.forEach((test, idx) => {
    if (test.name !== "Invalid sort order") {
      console.log(`   ${idx + 1}. http://localhost:8080${test.url}`);
    }
  });

  console.log("\n📋 Sort Order Options:");
  console.log("   • sortOrder=desc (default) - Highest/Newest first");
  console.log("   • sortOrder=asc - Lowest/Oldest first");
  console.log("   • Works with: sort=rating, sort=year");
}

runTests().catch(console.error);
