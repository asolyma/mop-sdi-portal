import { PrismaClient, User } from "@prisma/client";
import { IncomingMessage, OutgoingMessage } from "http";
import { getUserFromToken, createToken } from "../lib/auth";

import prisma from "../prisma/prisma";
// import { Claims, getSession } from '@auth0/nextjs-auth0';

export type Context = {
  prisma: PrismaClient;
  req: IncomingMessage;
  res: OutgoingMessage;
  user: User | null;
  createToken: (user: User) => string;
};
export async function createContext({ req, res }): Promise<Context> {
  const token = req.cookies.T_ACCESS_TOKEN || req.headers.authorization;
  let user: User;
  if (token) {
    user = getUserFromToken(token);
  }
  return {
    prisma,
    req,
    res,
    user,
    createToken,
  };
}
