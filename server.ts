import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { authRoute, movieListRoute, movieRoute, userRoute } from "./routes";

dotenv.config();
const PORT = 8000;

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => console.log("Connected to db"))
  .catch((err) => console.error(err.message));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);
app.use("/api/movie_lists", movieListRoute);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
