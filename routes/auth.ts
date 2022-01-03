import { Router } from "express";
import { User } from "../models";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";

const router = Router();
//Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET!
    ).toString(),
  });
  try {
    const user = await newUser.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      res.status(401).json({
        status: 401,
        message: "Wrong password or username!",
      });
    else {
      const bytes = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SECRET!
      );
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
      if (originalPassword !== req.body.password)
        res.status(401).json({
          status: 401,
          message: "Wrong password or pass word!",
        });
      else {
        const accessToken = jwt.sign(
          { id: user._id, isAdmin: user.isAdmin },
          process.env.JWT_SECRET!,
          { expiresIn: "5d" }
        );
        //@ts-ignore
        const { password, ...info } = user._doc;
        res.status(200).json({ ...info, accessToken });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
