import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

export const createToken = (user: User) =>
  jwt.sign({ ...user }, `${process.env.TOKEN_SECRET}`);

export const getUserFromToken = (token: string) => {
  try {
    const user = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
    // const check = await prisma.user.findUnique({ where: { id: user.id } });
    // if (!check) {
    //   throw new Error("Not a real user");
    // }
    return user;
    // return models.User.findOne({ id: user.id });
  } catch (e) {
    console.log(e);
    return e;
  }
};
