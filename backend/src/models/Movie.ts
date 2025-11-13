import mongoose, { Schema } from "mongoose";
import { IMovie } from "../types";

const movieSchema = new Schema<IMovie>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 10,
      index: true,
    },
    day: {
      type: Number,
      min: 1,
      max: 31,
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
    },
    genre: [
      {
        type: String,
        required: true,
        trim: true,
        index: true,
      },
    ],
    director: {
      type: String,
      required: true,
      trim: true,
    },
    actors: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    runtime: {
      type: Number,
      required: true,
      min: 1,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
      index: true,
    },
    plot: {
      type: String,
      required: true,
      trim: true,
    },
    box_office: {
      type: String,
      trim: true,
    },
    screenwriter: {
      type: String,
      trim: true,
    },
    studio: {
      type: String,
      trim: true,
    },
    poster: {
      type: String,
      trim: true,
    },
    poster_url: {
      type: String,
      trim: true,
    },
    releaseDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

movieSchema.index({
  title: "text",
  plot: "text",
  director: "text",
  actors: "text",
});

movieSchema.virtual("id").get(function () {
  return this._id.toString();
});

movieSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc: any, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

movieSchema.index({ genre: 1, rating: -1 });
movieSchema.index({ year: -1, rating: -1 });

export const Movie = mongoose.model<IMovie>("Movie", movieSchema);
