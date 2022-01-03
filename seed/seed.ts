import axios from "axios";
import cheerio from "cheerio";
import mongoose from "mongoose";
import dotenv from "dotenv";
import map from "lodash/map";
import forEach from "lodash/forEach";
import { Movie } from "../models";
dotenv.config();

const url = "https://hexdownload.co/foreign-series/";
const seedMovies = async () => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const posts = $("div.entry-content");
    forEach(posts, async (post) => {
      let movie: any = {};
      movie.title = $(post).find("p.film-name").text().split(":")[1];
      movie.lang = $(post).find("p.film-lan").text().split(":")[1];
      movie.country = $(post).find("p.film-country").text().split(":")[1];
      movie.director = $(post).find("p.film-director").text().split(":")[1];
      movie.actor = $(post).find("p.film-actor").text().split(":")[1];
      movie.year = $(post).find("p.film-year").find("a").text();
      let genres = map($(post).find("p.film-genre").find("a"), (genre) => {
        return $(genre).text();
      });
      movie.genre = genres.join(",");
      movie.desc = $(post).find("p.film-story").text();
      movie.imgUrl = $(post)
        .find("p.post-image")
        .find("a")
        .find("img")
        .attr("src");
      movie.isSeries = true;
      movie.isPersian = false;
      const newMovie = new Movie(movie);
      let savedMovie = await newMovie.save();
      console.log(savedMovie);
    });
  } catch (error) {
    console.log(error);
  }
};

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => {
    seedMovies();
    console.log("Connected to db");
  })
  .catch((err) => console.error(err));
