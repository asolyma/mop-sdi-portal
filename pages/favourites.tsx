import Head from "next/head";
import { useQuery, gql } from "@apollo/client";
import { GetServerSideProps } from "next";
import { apolloClient } from "../apollo-client/apollo";
import jwt from "jsonwebtoken";
import Hero from "../components/Hero";
import { FavLinksQuery } from "../graphql/queries";
import Link from "next/link";
import LinkCard from "../components/LinksCard";
import { MdOutlineError } from "react-icons/md";
import { XIcon } from "@heroicons/react/solid";
import { useState } from "react";
export default function Favourites() {
  const [errorMessage, setErrorMessage] = useState(true);

  const {
    data,
    loading,
    error,
    fetchMore: getmo,
  } = useQuery(FavLinksQuery, {
    variables: {
      first: 2,
    },
  });

  if (loading) {
    return (
      <div className="hhh flex justify-center items-center">
        <p>loading</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {errorMessage ? (
          <div className="hhh flex justify-center items-center text-white text-sm">
            <div className="p-5 bg-red-500 m-5 rounded-md max-w-md">
              <div className="flex justify-between">
                <div className="flex space-x-2 mb-2">
                  <MdOutlineError className="h-5 w-5" />
                  <p className="font-bold">Error!</p>
                </div>
                <XIcon
                  className="h-5 cursor-pointer"
                  onClick={() => {
                    setErrorMessage(false);
                  }}
                />
              </div>
              <p>Opps {error.message}</p>
            </div>
          </div>
        ) : (
          <div className="hhh flex justify-center items-center ">
            {" "}
            Please Contact Your Admin 🙄
          </div>
        )}
      </div>
    );
  }
  const { endCursor, hasNextPage } = data.favLinks.pageInfo;
  return (
    <div className="flex flex-col items-center hhh">
      <Head>
        <title>Awesome Links</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto max-w-5xl my-20">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 h-full">
          {data?.favLinks.edges.map((link) => {
            return (
              <LinkCard link={link} key={link.node.id} isFavourite={true} />
            );
          })}
        </ul>
        <div className="flex justify-center">
          {hasNextPage ? (
            <button
              className="mt-10  text-white bg-black  px-6 py-2 rounded-md"
              onClick={() => {
                getmo({
                  variables: {
                    after: endCursor,
                  },
                }).catch((e) => console.log(e));
              }}
            >
              More
            </button>
          ) : (
            <p>You have reached the end!!!😁</p>
          )}
        </div>
      </div>
    </div>
  );
}
