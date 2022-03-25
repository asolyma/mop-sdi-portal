import { gql } from "@apollo/client";

export const AllLinksQuery = gql`
  query Links($first: Int, $after: String) {
    Links(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          description
          url
          imageUrl
          category
          bookmarked
        }
      }
    }
  }
`;
export const FavLinksQuery = gql`
  query FavLinks($first: Int, $after: String) {
    favLinks(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          title
          category
          description
          imageUrl
          title
          url
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
