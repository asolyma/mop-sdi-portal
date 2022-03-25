import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { HeartIcon, StarIcon } from "@heroicons/react/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/react/solid";

import {
  BookmarkIcon,
  StarIcon as SolidStartIcon,
} from "@heroicons/react/solid";
import { useState } from "react";
import { BsBookmarkStar } from "react-icons/bs";
import {} from "../apollo-client/apollo";
//query user's favourites
// if the id of the user link is in the favourites show the solid one

const LinkCard = ({ link, isFavourite }) => {
  const linkId = link.node.id;
  const {
    data: me,
    loading: loadingME,
    error: errorMe,
  } = useQuery(
    gql`
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
    `,
    {}
  );
  const [bookmark, { data, loading, error }] = useMutation(
    gql`
      mutation Mutation($bookmarkLinkId: String) {
        bookmarkLink(id: $bookmarkLinkId) {
          id
        }
      }
    `,
    { variables: { bookmarkLinkId: link.node.id } }
  );

  const [bookmarked, setBookmarked] = useState(false);

  return (
    <li
      key={link.node.id}
      className="shadow-lg  max-w-md  rounded flex flex-col"
    >
      <img
        className="shadow-sm h-[200px] px-4 mt-2 object-cover"
        src={link.node.imageUrl}
      />
      <div className="p-5 flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-sm text-blue-500">{link.node.category}</p>
          {!isFavourite && (
            <div>
              {bookmarked || link.node?.bookmarked ? (
                <SolidHeartIcon className="h-6 text-purple-500" />
              ) : (
                <HeartIcon
                  className="h-6 text-purple-500"
                  onClick={() => {
                    setBookmarked(!bookmarked);
                    bookmark({
                      onCompleted(d) {
                        console.log();
                      },
                    });
                  }}
                />
              )}
            </div>
          )}
          {isFavourite && (
            <div>
              <p>UnBookmark</p>
            </div>
          )}{" "}
        </div>
        <p className="text-lg font-medium text-white">{link.node.title}</p>
        <p className="text-gray-400">{link.node.description}</p>
        <a
          href={link.node.url}
          className="flex text-gray-500 hover:text-blue-500"
        >
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
  );
};

export default LinkCard;
