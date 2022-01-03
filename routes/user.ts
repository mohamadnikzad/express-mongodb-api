import Router from "express";
import User from "../models/User";
import CryptoJS from "crypto-js";
import { verify } from "../middlewares/verifyToken";

const router = Router();

//UPDATE
router.put("/:id", verify, async (req, res) => {
  //@ts-ignore
  if (req.user.id === req.params.id || req.user.idAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SECRET!
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("not allowed");
  }
});

//DELETE
router.delete("/:id", verify, async (req, res) => {
  //@ts-ignore
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("user has been deleted ...");
    } catch (error) {
      res.status(500).json(error);
    }
  } else return res.status(403).json("not allowed!");
});

//GET ONE
router.get("/:id", verify, async (req, res) => {
  //@ts-ignore
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      const user = await User.findById(req.params.id);
      //@ts-ignore
      const { password, ...info } = user._doc;
      if (user) return res.status(200).json(info);
      else return res.status(404).json("not found");
    } catch (error) {
      res.status(500).json(error);
    }
  } else return res.status(403).json("not allowed!");
});

//GET ALL
router.get("/", verify, async (req, res) => {
  //@ts-ignore
  if (req.user.isAdmin) {
    const query = req.query.new;
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(2)
        : await User.find();
      if (users) return res.status(200).json(users);
      else return res.status(500).json("somthing went wrong!");
    } catch (error) {
      res.status(500).json(error);
    }
  } else return res.status(403).json("not allowed!");
});
//GET STATS

export default router;
