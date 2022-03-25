import { Link } from "./Link";
import bcrypt from "bcrypt";

import cookie from "cookie";
import {
  objectType,
  enumType,
  extendType,
  stringArg,
  inputObjectType,
  intArg,
} from "nexus";
import { AuthenticationError } from "apollo-server-micro";
const salt = bcrypt.genSaltSync();

export const User = objectType({
  name: "User",
  definition(t) {
    t.id("id");
    t.string("name");
    t.string("email");
    t.string("password");
    t.string("image");
    t.field("role", { type: Role });
    t.list.field("bookmarks", {
      type: Link,
    });
  },
});

export const Role = enumType({
  name: "Role",
  members: ["User", "Admin"],
});

export const AuthUser = objectType({
  name: "AuthUser",
  definition(t) {
    t.string("token"), t.field("user", { type: User });
  },
});
export const singinMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nullable.field("signin", {
      type: AuthUser,
      args: {
        email: stringArg(),
        password: stringArg(),
      },
      async resolve(_, { email, password }, { prisma, createToken, res }) {
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (user && password === user.password) {
          const token = createToken(user);
          res.setHeader(
            "Set-cookie",
            cookie.serialize("T_ACCESS_TOKEN", token, {
              httpOnly: true,
              maxAge: 8 * 60 * 60,
              sameSite: "lax",
              path: "/",
              secure: process.env.NODE_ENV === "production",
            })
          );
          return { token, user };
        } else {
          throw new Error("incorrect user or password");
        }
      },
    });
  },
});
export const signoutMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nullable.field("signout", {
      type: "String",
      async resolve(_, __, { user, res }) {
        if (user) {
          res.setHeader(
            "Set-cookie",
            cookie.serialize("T_ACCESS_TOKEN", "deleted", {
              path: "/",
              secure: process.env.NODE_ENV === "production",
              expires: new Date("Thu, 01 Jan 1970 00:00:00 GMT"),
            })
          );
          return "ok";
        } else {
          throw new AuthenticationError("no user");
        }

        //
      },
    });
  },
});
export const singupMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", {
      type: "AuthUser",
      args: {
        email: stringArg(),
        password: stringArg(),
        image: stringArg(),
      },
      async resolve(
        _,
        { email, password, image },
        { prisma, createToken, res }
      ) {
        const newUser = await prisma.user.create({
          data: {
            email,
            image,
            password: bcrypt.hashSync(password, salt),
          },
        });
        const token = createToken(newUser);
        return { token, newUser };
      },
    });
  },
});
export const getMe = extendType({
  type: "Query",
  definition(t) {
    t.nullable.field("getMe", {
      type: User,
      async resolve(_, __, { prisma, user }) {
        const U = await prisma.user.findUnique({
          where: { id: user.id },
          include: {
            bookmarks: {
              select: { id: true },
            },
          },
        });
        return U;
      },
    });
  },
});

export const BookmarkLink = extendType({
  type: "Mutation",
  definition(t) {
    t.field("bookmarkLink", {
      type: "Link",
      args: {
        id: stringArg(),
      },
      async resolve(_, args, ctx) {
        const link = await ctx.prisma.link.findUnique({
          where: { id: args.id },
        });

        await ctx.prisma.user.update({
          where: {
            email: ctx.user.email,
          },
          data: {
            bookmarks: {
              connect: {
                id: link.id,
              },
            },
          },
        });
        return link;
      },
    });
  },
});
// export const UserFavorites = extendType({
//   type: "Query",
//   definition(t) {
//     t.list.field("favorites", {
//       type: "Response",
//       args: {
//         first: intArg(),
//         after: stringArg(),
//       },
//       async resolve(_, _args, ctx) {
//         const user = await ctx.prisma.user.findUnique({
//           where: {
//             email: ctx.user.email,
//           },
//           include: {
//             bookmarks: {
//               take: _args.first,
//               skip: 1,
//               cursor: {
//                 id: _args.after,
//               },
//             },
//           },
//         });
//         if (!user) throw new Error("Invalid user");
//         return user.bookmarks;
//       },
//     });
//   },
// });
export const userFav = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("favLinks", {
      type: "Response",
      args: {
        first: intArg(),
        after: stringArg(),
      },
      async resolve(_, __, { prisma, user }) {
        let queryResults = null;
        if (__.after) {
          //check if ther is a cursor as the argument
          queryResults = await prisma.user.findUnique({
            where: { email: user.email },
            select: {
              bookmarks: {
                take: __.first,
                skip: 1,
                cursor: {
                  id: __.after,
                },
              },
            },
          });
        } else {
          // if no cursor that means that this is the first request
          // we will return the first itmes in the database.
          queryResults = await prisma.user.findUnique({
            where: { email: user.email },
            select: { bookmarks: { take: __.first } },
          });
        }
        if (queryResults.bookmarks.length > 0) {
          const lastLink =
            queryResults.bookmarks[queryResults.bookmarks.length - 1];
          const myCursor = lastLink.id;
          const secodQueryResults = await prisma.user.findUnique({
            where: { email: user.email },
            select: {
              bookmarks: {
                take: __.first,
                cursor: {
                  id: myCursor,
                },
              },
            },
          });
          const results = {
            pageInfo: {
              endCursor: myCursor,
              hasNextPage: secodQueryResults.bookmarks.length >= __.first,
            },
            edges: queryResults.bookmarks.map((link) => ({
              cursor: link.id,
              node: link,
            })),
          };
          return results;
        }
        return {
          pageInfo: {
            endCursor: null,
            hasNextPage: false,
          },
          edges: [],
        };
      },
    });
  },
});
