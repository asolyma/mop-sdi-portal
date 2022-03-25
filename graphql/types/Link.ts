import { extendType, idArg, intArg, objectType, stringArg } from "nexus";
import { User } from "./User";

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.string("id");
    t.string("title");
    t.string("description");
    t.string("url");
    t.nullable.string("imageUrl");
    t.string("category");
    t.list.field("users", {
      type: User,
      async resolve(_, __, { prisma }) {
        return await prisma.user
          .findUnique({
            where: {
              id: _.id,
            },
          })
          .bookmarks();
      },
    });
    t.boolean("bookmarked");
  },
});
export const createLink = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createLink", {
      type: Link,
      args: {
        category: stringArg(),
        description: stringArg(),
        imageUrl: stringArg(),
        title: stringArg(),
        url: stringArg(),
      },
      async resolve(
        _,
        { category, description, imageUrl, title, url },
        { prisma }
      ) {
        const newLink = await prisma.link.create({
          data: {
            category,
            description,
            imageUrl,
            title,
            url,
          },
        });
        return newLink;
      },
    });
  },
});

//we need to add a couple of object types:

export const Edge = objectType({
  name: "Edge",
  definition(t) {
    t.string("cursor");
    t.field("node", { type: Link });
  },
});
export const PageInfo = objectType({
  name: "PageInfo",
  definition(t) {
    t.string("endCursor");
    t.boolean("hasNextPage");
  },
});
export const Response = objectType({
  name: "Response",
  definition(t) {
    t.field("pageInfo", { type: PageInfo });
    t.list.field("edges", { type: Edge });
  },
});

export const Linksquery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("Links", {
      type: "Response",
      args: {
        first: intArg(),
        after: stringArg(),
      },
      async resolve(_, __, { prisma, user }) {
        const bookmarks = await prisma.user.findUnique({
          where: { id: user.id },
          select: { bookmarks: { select: { id: true } } },
        });
        //

        function z(LinksArray, BookmarksArray) {
          if (!BookmarksArray) {
            return LinksArray;
          }
          for (let i = 0; i < BookmarksArray.length; i++) {
            for (let j = 0; j < LinksArray.length; j++) {
              if (LinksArray[j].id === BookmarksArray[i].id) {
                LinksArray[j].bookmarked = true;
              }
            }
          }
          return LinksArray;
        }

        //

        let queryResults = null;
        if (__.after) {
          //check if ther is a cursor as the argument
          const temp = await prisma.link.findMany({
            take: __.first,
            skip: 1,
            cursor: {
              id: __.after,
            },
          });
          queryResults = z(temp, bookmarks?.bookmarks);
        } else {
          // if no cursor that means that this is the first request
          // we will return the first itmes in the database.
          const temp = await prisma.link.findMany({
            take: __.first,
          });
          queryResults = z(temp, bookmarks?.bookmarks);
        }

        if (queryResults.length > 0) {
          const lastLink = queryResults[queryResults.length - 1];
          const myCursor = lastLink.id;
          let secodQueryResults;
          const temp = await prisma.link.findMany({
            take: __.first,
            cursor: {
              id: myCursor,
            },
          });
          secodQueryResults = z(temp, bookmarks?.bookmarks);
          const results = {
            pageInfo: {
              endCursor: myCursor,
              hasNextPage: secodQueryResults.length >= __.first,
            },
            edges: queryResults.map((link) => ({
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
