import jwt from "jsonwebtoken";

export const verify = (req: any, res: any, next: any) => {
  const headerToken = req.headers.token;
  if (!headerToken) return res.status(401).json("Your not authintacated");
  else {
    const token = headerToken.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET!, (err: any, data: any) => {
      if (err) return res.status(401).json("Token is not Valid !");
      req.user = data;
      next();
    });
  }
};
