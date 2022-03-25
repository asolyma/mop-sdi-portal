// import { gql } from "apollo-server-micro";
// export const typeDefs = gql`
//   type Link {
//     id: String!
//     title: String
//     description: String
//     url: String
//     imageUrl: String
//     category: String
//     users: [String]
//   }
//   type Query {
//     links: [Link]!
//   }
// `;
import { GraphQLSchema } from "graphql";
import { makeSchema } from "nexus";
import { join } from "path";
import * as types from "./types";

const schema = makeSchema({
  types,
  outputs: {
    typegen: join(
      process.cwd(),
      "node_modules",
      "@types",
      "nexus-typegen",
      "index.d.ts"
    ),
    schema: join(process.cwd(), "graphql", "schema.graphql"),
  },
  contextType: {
    export: "Context",
    module: join(process.cwd(), "graphql", "context.ts"),
  },
});

export const s = schema as unknown as GraphQLSchema;
