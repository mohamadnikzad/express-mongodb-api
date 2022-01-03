import { Schema, model, Document } from "mongoose";

interface IMovieList extends Document {
  title: string;
  genre: string;
  type: string;
  movies: any;
}

const MovieListSchema = new Schema<IMovieList>(
  {
    title: { type: String, required: true, unique: true },
    genre: { type: String, required: true },
    type: { type: String, default: "movie" },
    movies: { type: Array, required: true },
  },
  { timestamps: true }
);

export default model<IMovieList>("MovieList", MovieListSchema);
