import Vue from "vue";
import VueApollo from "vue-apollo";
import { ApolloClient } from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { chains } from "./chains.js";

let apolloProvider;

function setupApollo() {
  Vue.use(VueApollo);

  let clients = {};
  for (const chain in chains) {
    const link = createHttpLink({
      uri: chains[chain].graphUrl,
    });
    const cache = new InMemoryCache();
    const client = new ApolloClient({
      link,
      cache,
    });
    clients[chain] = client;
  }

  apolloProvider = new VueApollo({
    clients,
  });
}

export { setupApollo, apolloProvider };
