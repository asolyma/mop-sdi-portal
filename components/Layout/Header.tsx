import React, { useState } from "react";
import Link from "next/link";
import router from "next/router";
import { apolloClient, uploadclient } from "../../apollo-client/apollo";
import {
  DotsVerticalIcon,
  HomeIcon,
  LogoutIcon,
  PlusIcon,
  StarIcon,
} from "@heroicons/react/solid";
import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import Image from "next/image";
import Spinner from "../Spinner";
const signoutMutation = gql`
  mutation Mutation {
    signout
  }
`;
const getMe = gql`
  query Query {
    getMe {
      id
      name
      email
      image
      role
      bookmarks {
        id
      }
    }
  }
`;
const Header = () => {
  const [showMenu, setshowmenu] = useState(false);
  const [
    signout,
    { data: signoutData, loading: signoutLoading, error: signoutError },
  ] = useMutation(signoutMutation);
  const { data, loading, error } = useQuery(getMe);
  if (error) {
    console.log(error);
  }

  const menuBar = {
    User: [],
    Admin: [],
  };
  return (
    <div className="fixed z-[2] border-b-2 border-opacity-25 border-white">
      <header className="text-gray-600 body-font w-screen border-b-2 bg-black border-gray-500 border-opacity-10">
        <div className="flex w-full justify-between space-x-2 items-center px-5 h-[72px]  ">
          <div className="flex justify-center items-center">
            <DotsVerticalIcon
              className="h-8 cursor-pointer text-white"
              onClick={() => {
                setshowmenu(!showMenu);
                console.log("show drop down menu");
              }}
            />
            <div className="flex flex-col space-y-2 md:flex space-x-2 items-center">
              <div className="relative w-[60px] h-[60px] rounded-full border-2 border-white border-opacity-20 hover:border-opacity-70 transition duration-300 cursor-pointer">
                {data?.getMe?.image ? (
                  <Image
                    className="absolute "
                    src={data?.getMe?.image}
                    layout="fill"
                    objectFit="cover"
                    alt=""
                  />
                ) : (
                  <div className="h-full w-full bg-purple-900 rounded-full flex justify-center items-center">
                    <p className="text-white  text-lg">
                      {data?.getMe?.email[0].toUpperCase()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          {!showMenu && (
            <div className="relative w-[300px] h-[70px]">
              <Image
                className="absolute"
                src="/f00414d1-c2dc-4d85-9f17-97e3d85d9e23_MPED-Egypt-logo.png"
                layout="fill"
                objectFit="contain"
              />
            </div>
          )}
          {showMenu && (
            <div className="md:w-full">
              <ul className="flex justify-center md:justify-start items-center space-x-2 md:space-x-4">
                <li>
                  <button
                    onClick={() => {
                      router.push("/");
                    }}
                    className="px-2 md:px-4 py-1 md:py-2  text-gray-400 hover:text-white text-xs md:text-sm font-bold transform hover:scale-110 hover: duration-300 "
                  >
                    Home
                  </button>
                </li>
                <button
                  onClick={() => {
                    router.push("/favourites");
                  }}
                  className="px-2 md:px-4 py-1 md:py-2  text-gray-400 hover:text-white text-xs md:text-sm font-bold transform hover:scale-110 hover: duration-300 "
                >
                  Favourites
                </button>
                <li>
                  <button
                    onClick={() => {
                      signout({
                        onCompleted() {
                          router.push("/login");
                        },
                        onError() {
                          console.log(error);
                        },
                      });
                    }}
                    className="px-2 md:px-4 py-1 md:py-2  text-gray-400 hover:text-white text-xs md:text-sm font-bold transform hover:scale-110 hover: duration-300 "
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
