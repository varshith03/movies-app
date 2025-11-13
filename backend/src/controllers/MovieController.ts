import { Request, Response } from "express";
import { MovieService } from "../services/MovieService";
import { IMovieQuery } from "../types";
import { createObjectCsvWriter } from "csv-writer";
import path from "path";
import fs from "fs";

export class MovieController {
  private movieService: MovieService;

  constructor() {
    this.movieService = new MovieService();
  }

  public getMovies = async (req: Request, res: Response): Promise<void> => {
    try {
      const query: IMovieQuery = {
        search: req.query.search as string,
        sort: req.query.sort as "rating" | "year",
        sortOrder: req.query.sortOrder as "asc" | "desc",
        filter: req.query.filter as string,
        limit: req.query.limit ? Number(req.query.limit) : 10,
        offset: req.query.offset ? Number(req.query.offset) : 0,
      };

      // Validate pagination parameters
      if (query.limit && (query.limit < 1 || query.limit > 100)) {
        res.status(400).json({
          success: false,
          message: "Limit must be between 1 and 100",
        });
        return;
      }

      if (query.offset && query.offset < 0) {
        res.status(400).json({
          success: false,
          message: "Offset must be non-negative",
        });
        return;
      }

      // Validate sortOrder parameter
      if (query.sortOrder && !["asc", "desc"].includes(query.sortOrder)) {
        res.status(400).json({
          success: false,
          message: "Sort order must be 'asc' or 'desc'",
        });
        return;
      }

      const result = await this.movieService.getMovies(query);

      res.status(200).json({
        success: true,
        message: "Movies retrieved successfully",
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Get movies error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  public getMovieById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Movie ID is required",
        });
        return;
      }

      const movie = await this.movieService.getMovieById(id);

      if (!movie) {
        res.status(404).json({
          success: false,
          message: "Movie not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Movie retrieved successfully",
        data: movie,
      });
    } catch (error) {
      console.error("Get movie by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  public exportMovies = async (req: Request, res: Response): Promise<void> => {
    try {
      const movies = await this.movieService.getAllMoviesForExport();

      // Create CSV file
      const csvFilePath = path.join(
        __dirname,
        "../../temp",
        `movies_export_${Date.now()}.csv`
      );

      // Ensure temp directory exists
      const tempDir = path.dirname(csvFilePath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const csvWriter = createObjectCsvWriter({
        path: csvFilePath,
        header: [
          { id: "id", title: "ID" },
          { id: "title", title: "Title" },
          { id: "year", title: "Year" },
          { id: "day", title: "Day" },
          { id: "month", title: "Month" },
          { id: "genre", title: "Genre" },
          { id: "director", title: "Director" },
          { id: "actors", title: "Actors" },
          { id: "runtime", title: "Runtime (minutes)" },
          { id: "rating", title: "Rating" },
          { id: "plot", title: "Plot" },
          { id: "box_office", title: "Box Office" },
          { id: "screenwriter", title: "Screenwriter" },
          { id: "studio", title: "Studio" },
          { id: "poster_url", title: "Poster URL" },
        ],
      });

      // Prepare data for CSV
      const csvData = movies.map((movie) => ({
        id: movie._id.toString(),
        title: movie.title,
        year: movie.year,
        day: movie.day || "",
        month: movie.month || "",
        genre: Array.isArray(movie.genre)
          ? movie.genre.join(", ")
          : movie.genre,
        director: movie.director,
        actors: Array.isArray(movie.actors)
          ? movie.actors.join(", ")
          : movie.actors,
        runtime: movie.runtime,
        rating: movie.rating,
        plot: movie.plot,
        box_office: movie.box_office || "",
        screenwriter: movie.screenwriter || "",
        studio: movie.studio || "",
        poster_url: movie.poster_url || "",
      }));

      await csvWriter.writeRecords(csvData);

      // Set headers for file download
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="movies_export.csv"`
      );
      res.setHeader("Content-Type", "text/csv");

      // Stream the file and clean up
      const fileStream = fs.createReadStream(csvFilePath);

      fileStream.pipe(res);

      fileStream.on("end", () => {
        // Clean up temp file
        fs.unlink(csvFilePath, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });
      });
    } catch (error) {
      console.error("Export movies error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}
