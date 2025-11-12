import { Schema, model, Document } from 'mongoose';
import { Movie } from '@/types/index.js';

export interface IMovieDocument extends Movie, Document {
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

const movieSchema = new Schema<IMovieDocument>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  year: {
    type: Number,
    required: true,
    index: true,
  },
  genre: [{
    type: String,
    required: true,
    trim: true,
  }],
  director: {
    type: String,
    required: true,
    trim: true,
  },
  actors: [{
    type: String,
    required: true,
    trim: true,
  }],
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    index: true,
  },
  runtime: {
    type: Number,
    required: true,
    min: 0,
  },
  plot: {
    type: String,
    required: true,
    trim: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    index: { expireAfterSeconds: 0 }, // MongoDB TTL index
  },
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      delete ret.expiresAt;
      return ret;
    },
  },
  toObject: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      delete ret.expiresAt;
      return ret;
    },
  },
});

// Compound indexes for better query performance
movieSchema.index({ title: 'text', plot: 'text' }); // Full-text search
movieSchema.index({ genre: 1, rating: -1 }); // Genre filtering with rating sort
movieSchema.index({ year: -1, rating: -1 }); // Year and rating sorting

export const MovieModel = model<IMovieDocument>('Movie', movieSchema);