import { Schema, model, Document } from "mongoose";
export interface IMovie extends Document {
  title: string;
  desc: string;
  imgUrl: string;
  year: string;
  isSeries: boolean;
  genre: string;
  country: string;
  lang: string;
  actor: string;
  director: string;
  isPersian: boolean;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    imgUrl: { type: String, required: true },
    year: { type: String },
    actor: { type: String },
    director: { type: String },
    lang: { type: String },
    country: { type: String },
    genre: { type: String, required: true },
    isSeries: { type: Boolean, default: false },
    isPersian: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IMovie>("Movie", MovieSchema);
