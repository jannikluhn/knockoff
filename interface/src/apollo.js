import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { chains } from "./chains.js";

let apolloClients = {};

for (const chainID in chains) {
  const cache = new InMemoryCache();
  const client = new ApolloClient({
    uri: chains[chainID].graphUrl,
    cache,
  });
  apolloClients[chainID] = client;
}

export { apolloClients };
