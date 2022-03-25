import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma";
const signedinPages = ["/"];
export default function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  if (signedinPages.find((p) => p === url.pathname)) {
    const token = req.cookies.T_ACCESS_TOKEN;
    if (!token) {
      return NextResponse.redirect("http://localhost:3000/login");
    } else {
      const valid = jwt.verify(token, `${process.env.TOKEN_SECRET}`);
      return;
    }
  }
}
