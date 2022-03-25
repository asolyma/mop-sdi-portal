import { ApolloServer } from "apollo-server-micro";
// import { typeDefs } from "../../graphql/schema";
import { s } from "../../graphql/schema";
import { NextApiRequest, NextApiResponse } from "next";
import Cors from "micro-cors";
import prisma from "../../prisma/prisma";
const cors = Cors();
import { createContext } from "../../graphql/context";
const server = new ApolloServer({
  schema: s,
  //plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  context: createContext,
});

const startserver = server.start();

export default cors(async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  await startserver;
  await server.createHandler({
    path: "/api/graphql",
  })(req, res);
});

export const config = {
  api: {
    bodyParser: false,
  },
};
