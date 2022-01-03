import Router from "express";
import { verify } from "../middlewares/verifyToken";
import { MovieList } from "../models";

const router = Router();

//create
router.post("/create", verify, async (req, res) => {
  //@ts-ignore
  if (req.user.isAdmin) {
    try {
      const newMovielist = new MovieList(req.body);
      const movieList = await newMovielist.save();
      res.status(201).json(movieList);
    } catch (error) {
      //@ts-ignore
      res.status(422).json(error.message);
    }
  }
});

//delete
router.delete("/delete/:id", verify, async (req, res) => {
  //@ts-ignore
  if (req.user.isAdmin) {
    try {
      await MovieList.findByIdAndDelete(req.params.id);
      res.status(200).json("MovieList has been deleted ...");
    } catch (error) {
      res.status(500).json("something went wrong!");
    }
  } else return res.status(403).json("not allowed!");
});

//get
router.get("/", verify, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list: any[] = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await MovieList.aggregate([
          { $sample: { size: 10 } },
          {
            $match: {
              type: typeQuery,
              genre: genreQuery,
            },
          },
        ]);
      } else {
        list = await MovieList.aggregate([
          { $sample: { size: 10 } },
          {
            $match: {
              type: typeQuery,
            },
          },
        ]);
      }
    } else {
      list = await MovieList.aggregate([{ $sample: { size: 10 } }]);
    }
    return res.status(200).json(list);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
