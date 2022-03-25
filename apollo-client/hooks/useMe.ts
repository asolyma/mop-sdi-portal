import { gql } from "apollo-server-micro";
import apolloClient from "../apollo";
export const useMe = () => {
  const user = apolloClient.cache.readQuery({
    query: gql``,
  });

  return {
    user: null,
    error: null,
  };
};
