import "../styles/tailwind.css";
import Layout from "../components/Layout";
import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "../apollo-client/apollo";
function MyApp({ Component, pageProps }) {
  return Component.authPage ? (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  ) : (
    <ApolloProvider client={apolloClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
