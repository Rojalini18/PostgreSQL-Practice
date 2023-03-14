import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  url: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
});
