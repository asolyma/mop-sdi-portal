import {
  ApolloCache,
  ApolloError,
  DefaultContext,
  gql,
  MutationFunctionOptions,
  OperationVariables,
  useMutation,
} from "@apollo/client";
import { User } from "@prisma/client";
import { GetServerSideProps } from "next";
import Hero2 from "../components/Hero2";

const signinMutation = gql`
  mutation Signin($email: String, $password: String) {
    signin(email: $email, password: $password) {
      user {
        email
        id
        image
        name
      }
    }
  }
`;

const login = () => {
  const [signin, { data, loading, error }] = useMutation(signinMutation);
  return <Hero2 login={signin} isLoading={loading} data={data} err={error} />;
};
login.authPage = true;
export default login;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const token = req.cookies.T_ACCESS_TOKEN;
  if (token) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
      props: {},
    };
  } else {
    return {
      props: {},
    };
  }
};
