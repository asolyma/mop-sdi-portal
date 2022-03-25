import Head from "next/head";
import { useQuery, gql } from "@apollo/client";
import { GetServerSideProps } from "next";
import { apolloClient } from "../apollo-client/apollo";
import jwt from "jsonwebtoken";
import Hero from "../components/Hero";
import { AllLinksQuery } from "../graphql/queries";
import Link from "next/link";
import LinkCard from "../components/LinksCard";
import { MdOutlineError } from "react-icons/md";
import { XIcon } from "@heroicons/react/solid";
import { useState } from "react";
export default function Home({ user }) {
  const [errorMessage, setErrorMessage] = useState(true);
  const { data, loading, error, fetchMore } = useQuery(AllLinksQuery, {
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
  const { endCursor, hasNextPage } = data.Links.pageInfo;
  return (
    <div className="flex flex-col items-center hhh">
      <Head>
        <title>Awesome Links</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto max-w-5xl my-20">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 h-full">
          {data?.Links.edges.map((link) => {
            return (
              <LinkCard link={link} key={link.node.id} isFavourite={false} />
            );
          })}
        </ul>
        <div className="flex justify-center">
          {hasNextPage ? (
            <button
              className="mt-10  text-white bg-black  px-6 py-2 rounded-md"
              onClick={() => {
                fetchMore({
                  variables: {
                    after: endCursor,
                  },
                });
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userToken = req.headers.cookie?.split("=")[1];
  if (!userToken) {
    return {
      props: {
        user: null,
      },
    };
  }
  try {
    const us = jwt.verify(userToken, process.env.TOKEN_SECRET);
    if (us) {
      return {
        props: { user: us },
      };
    } else {
      throw new Error("not a user");
    }
  } catch (error) {
    console.log(error);
    return {
      props: { user: null },
    };
  }
};

/**
 * {data?.Links.edges.map((link) => (
            <li key={link.node.id} className="shadow  max-w-md  rounded">
              <img className="shadow-sm h-[200px]" src={link.node.imageUrl} />
              <div className="p-5 flex flex-col space-y-2">
                <p className="text-sm text-blue-500">{link.node.category}</p>
                <p className="text-lg font-medium">{link.node.title}</p>
                <p className="text-gray-600">{link.node.description}</p>
                <a href={link.node.url} className="flex hover:text-blue-500">
                  {link.node.url.replace(/(^\w+:|^)\/\//, "")}
                  <svg
                    className="w-4 h-4 my-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                  </svg>
                </a>
              </div>
            </li>
          ))}
 */
