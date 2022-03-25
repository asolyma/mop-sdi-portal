import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
  RequestHandler,
} from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        Links: relayStylePagination(),
        favLinks: relayStylePagination(),
      },
    },
  },
});

export const apolloClient = new ApolloClient({
  cache,
  uri: "http://localhost:3000/api/graphql",
  credentials: "include",
});

apolloClient;

const secondCashe = new InMemoryCache();

const ulink = createUploadLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});
const http = new HttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});
export const uploadclient = new ApolloClient({
  cache: secondCashe,
  link: ApolloLink.from([ulink as unknown as ApolloLink]),
});
