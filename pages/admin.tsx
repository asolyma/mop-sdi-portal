import { NextPage } from "next";
import { uploadclient } from "../apollo-client/apollo";
import { gql, useMutation } from "@apollo/client";
import { useRef, useState } from "react";
import { XIcon } from "@heroicons/react/solid";
import { Link } from "@prisma/client";
const addlinkMutation = gql`
  mutation createLink(
    $category: String
    $description: String
    $imageUrl: String
    $title: String
    $url: String
  ) {
    createLink(
      category: $category
      description: $description
      imageUrl: $imageUrl
      title: $title
      url: $url
    ) {
      id
    }
  }
`;
const uploadMutation = gql`
  mutation uploader($file: Upload) {
    uploadFile(file: $file) {
      url
    }
  }
`;
const admin: NextPage = () => {
  const [
    createLink,
    { data: linkData, loading: loadinLinkcreation, error: errorLinkCreation },
  ] = useMutation(addlinkMutation);
  const [upload, { data, loading, error }] = useMutation(uploadMutation, {
    client: uploadclient,
  });
  const [file, setFile] = useState(null);
  const [errorToast, setErrorToas] = useState(false);
  const title = useRef<HTMLInputElement>(null);
  const category = useRef<HTMLInputElement>(null);
  const description = useRef<HTMLTextAreaElement>(null);
  const url = useRef<HTMLInputElement>(null);

  return (
    <div className=" hhh flex flex-col items-center p-6">
      <div className="fixed w-screen">
        {errorToast && (
          <div
            className="bg-red-600 inset-0 top-2 absolute shadow-lg mx-auto w-80 max-w-full text-sm pointer-events-auto bg-clip-padding rounded-lg block mb-3"
            id="static-example"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            data-mdb-autohide="false"
          >
            <div className="bg-red-600 flex justify-between items-center py-2 px-3 bg-clip-padding border-b border-red-500 rounded-t-lg">
              <p className="font-bold text-white flex items-center">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="times-circle"
                  className="w-4 h-4 mr-2 fill-current"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
                  ></path>
                </svg>
                Error
              </p>
              <div className="flex items-center">
                <button
                  type="button"
                  className=" box-content text-lg w-4 h-4 ml-2 text-white border-none rounded-none  focus:shadow-none focus:outline-none focus:opacity-100 hover:text-white hover:opacity-75 hover:no-underline"
                  data-mdb-dismiss="toast"
                  aria-label="Close"
                  onClick={() => {
                    setErrorToas(false);
                  }}
                >
                  <XIcon h-4 className="border-2 rounded-full border-white" />
                </button>
              </div>
            </div>
            <div className="p-3 bg-red-600 rounded-b-lg break-words text-white">
              {error.message}
            </div>
          </div>
        )}
      </div>
      <div className="max-w-screen-sm w-full md:max-w-[600px] justify-center shadow-2xl items-center rounded-lg mt-[100px] mb-[20px]  ">
        <div className="p-2 md:p-6 ">
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();

              if (file) {
                upload({
                  variables: {
                    file: file,
                  },
                  onCompleted({ uploadFile }) {
                    const image = uploadFile.url;
                    console.log(image);
                    createLink({
                      variables: {
                        category: category?.current.value,
                        description: description?.current.value,
                        imageUrl: image,
                        title: title.current?.value,
                        url: url.current?.value,
                      },
                      onCompleted(d) {
                        console.log("link created successfully", d);
                      },
                      onError(e) {
                        console.log(e);
                      },
                    });
                  },
                  onError(e) {
                    setErrorToas(true);
                    // setTimeout(() => {
                    //   setErrorToas(false);
                    // }, 2000);
                  },
                });
              } else {
                createLink({
                  variables: {
                    category: category?.current.value,
                    description: description?.current.value,
                    title: title.current?.value,
                    url: url.current?.value,
                  },
                  onCompleted(d) {
                    console.log("link created without image");
                  },
                  onError(e) {
                    console.log(e);
                  },
                });
              }
            }}
          >
            <div className="flex flex-col -mx-3 mb-6">
              <div className="w-full  px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Link Title
                </label>
                <input
                  required
                  className="bg-opacity-10 bg-white appearance-none block w-full  text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-first-name"
                  type="text"
                  placeholder="Utilities Dashboard"
                  ref={title}
                />
              </div>
              <div className="w-full  px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-first-name"
                >
                  Link Category
                </label>
                <input
                  required
                  className="bg-opacity-10 bg-white appearance-none block w-full  text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                  id="grid-first-name"
                  type="text"
                  placeholder="Utilities Dashboard"
                  ref={category}
                />
              </div>
              <div className="w-full px-4 flex flex-col">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-last-name"
                >
                  Link Description
                </label>
                <textarea
                  required
                  ref={description}
                  name="Description"
                  id="Description"
                  cols={30}
                  rows={5}
                  className=" rounded-md"
                />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full px-3">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-Url"
                >
                  Url
                </label>
                <input
                  className="bg-opacity-10 bg-whit appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-Url"
                  type="url"
                  placeholder="http://mappent/apps?tenant=utilitiesa"
                  ref={url}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Choose a cover Photo
              </label>
              <input
                required
                id="file_input"
                type="file"
                onChange={(e) => {
                  const fileToupload = e.target.files[0];
                  if (!fileToupload) {
                    return;
                  }
                  setFile(() => fileToupload);
                }}
              />

              {/* <button
                onClick={() => {}}
                className="text-blue-500 w-full md:w-[100px] bg-black rounded-md px-2 py-1"
              >
                Upload
              </button> */}
              <input
                type="submit"
                value={"Create Link"}
                className="bg-slate-700 rounded-md w-full cursor-pointer text-white font-extrabold py-4"
              />
            </div>
            {/* <div className="flex flex-wrap -mx-3 mb-2">
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-city"
                >
                  City
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-city"
                  type="text"
                  placeholder="Albuquerque"
                />
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-state"
                >
                  State
                </label>
                <div className="relative">
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-state"
                  >
                    <option>New Mexico</option>
                    <option>Missouri</option>
                    <option>Texas</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="grid-zip"
                >
                  Zip
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-zip"
                  type="text"
                  placeholder="90210"
                />
              </div>
            </div> */}
          </form>
        </div>
        <form action="" method="POST"></form>
      </div>
    </div>
  );
};

export default admin;
