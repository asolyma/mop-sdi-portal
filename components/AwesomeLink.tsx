// import { useQuery } from "@apollo/client";
// import Head from "next/head";
// import { AllLinksQuery } from "../graphql/queries";
// export default function AwsomeLinks({ user }) {
//   const { data, loading, error, fetchMore } = useQuery(AllLinksQuery, {
//     variables: {
//       first: 2,
//     },
//   });
//   if (loading) {
//     return <p>...................................Loading</p>;
//   }
//   if (error) {
//     return <p>Opps {error.message}</p>;
//   }
//   const { endCursor, hasNextPage } = data.Links.pageInfo;
//   return (
//     <div className="flex flex-col items-center hh scrollbar-thin scrollbar-hide overflow-y-scroll">
//       <div className="container mx-auto max-w-5xl my-20">
//         <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></ul>
//       </div>
//       {hasNextPage ? (
//         <button
//           className="bg-black text-white px-6 py-2 rounded-md"
//           onClick={() => {
//             fetchMore({
//               variables: {
//                 after: endCursor,
//               },
//             });
//           }}
//         >
//           More
//         </button>
//       ) : (
//         <p>You have reached the end!!!😁</p>
//       )}
//     </div>
//   );
// }
