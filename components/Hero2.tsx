import {
  ApolloCache,
  ApolloError,
  DefaultContext,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";
import { BsFacebook, BsGithub, BsGlobe } from "react-icons/bs";
import { XIcon } from "@heroicons/react/solid";
import { User } from "@prisma/client";
import { UserInputError } from "apollo-server-micro";
import Image from "next/image";
import { useRef, useState } from "react";
import router from "next/router";
import Spinner from "./Spinner";
interface HeroProps {
  login: (
    options?: MutationFunctionOptions<
      any,
      OperationVariables,
      DefaultContext,
      ApolloCache<any>
    >
  ) => Promise<any>;
  isLoading: boolean;
  err: ApolloError;
  data: any;
}
const Hero2: React.FC<HeroProps> = ({ login, isLoading, err }) => {
  const [showModal, setShowModal] = useState(false);
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  return (
    <div className="h-screen flex justify-center items-center relative bg-[#05050c] bg-cover ">
      <div className="absolute top-5 right-5 w-[200px] h-[72px] md:w-[300px]">
        <Image
          src="/f00414d1-c2dc-4d85-9f17-97e3d85d9e23_MPED-Egypt-logo.png"
          alt=""
          layout="fill"
          objectFit="contain"
        />
      </div>
      <button
        className="text-gray-300 hover:text-white top-10 left-10 rounded-md absolute border-2 border-white  border-opacity-20 hover:border-white transition duration-300 transform hover:scale-110 shadow-cyan-500/50
px-4 py-1 tracking-wider"
        onClick={() => {
          setShowModal(true);
        }}
      >
        LOGIN
      </button>
      <h2 className="font-Poppins text-[50px] md:text-[128px] font-extrabold opacity-30  absolute ">
        <p className="egdePro1">EdgePro</p>
      </h2>
      <h2 className="font-Poppins text-[50px] font-extrabold md:text-[128px] absolute ">
        <p className="egdePro2">EdgePro</p>
      </h2>
      {showModal && (
        <div className="bg-black bg-opacity-80  w-screen h-full absolute flex justify-center items-center z-1">
          <div className="flex flex-col p-6 mx-4 md:mx-0  relative rounded-md shadow-md shadow-gray-500/50 border-gray-500/50 border">
            <XIcon
              className="text-cyan-500 absolute right-2 top-2 h-6 border border-cyan-500/30 p-1 rounded-md hover:border-cyan-300 trasi duration-300  cursor-pointer"
              onClick={() => {
                setShowModal(false);
              }}
            />
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide md:text-sm text-gray-400 text-xs font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="appearance-none block w-full text-white  border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none  focus:border-gray-500 bg-white bg-opacity-10"
                  id="email"
                  type="text"
                  placeholder="asd@asd.com"
                  ref={email}
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-400 text-xs md:text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  className="appearance-none block w-full  text-white  border-gray-500 rounded py-3 px-4 mb-3 leading-tight  bg-white bg-opacity-10 focus:border-gray-500"
                  id="password"
                  type="password"
                  placeholder="************"
                  ref={password}
                />
              </div>
              <button
                className="text-blue-600 border border-cyan-500/30 w-full mx-3 mt-2 uppercase rounded-md  px-6 py-2 flex justify-center"
                onClick={() => {
                  if (email && password) {
                    const userInput = {
                      email: email.current.value,
                      password: password.current.value,
                    };
                    login({
                      variables: {
                        email: userInput.email,
                        password: userInput.password,
                      },
                      onCompleted() {
                        console.log("completed");
                        router.push("/");
                      },
                      onError(e) {
                        console.log(e);
                        console.log("error");
                      },
                    });
                  } else {
                    throw new UserInputError("invalid input");
                  }
                }}
              >
                {isLoading ? <Spinner /> : "GO"}
              </button>
              {err ? (
                <p className="text-xs text-red-500 felx mt-5 mx-3">
                  {err.message}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}
      <div className="flex space-x-4 bottom-14 absolute">
        <a href="https://github.com/asolyma">
          <BsGithub className="text-white h-5 w-5 hover:animate-bounce transition duration-300 cursor-pointer" />
        </a>
        <a href="https://www.facebook.com/EDGE.Pro.for.Information.Systems/">
          <BsFacebook className="text-white  h-5 w-5 hover:animate-bounce transition duration-300 cursor-pointer" />
        </a>
        <a href="https://edge-pro.com/">
          <BsGlobe className="text-white  h-5 w-5 hover:animate-bounce transition duration-300 cursor-pointer" />
        </a>
      </div>
    </div>
  );
};

export default Hero2;
