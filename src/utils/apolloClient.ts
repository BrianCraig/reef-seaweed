import { HttpLink, split, ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities"

const httpLink = new HttpLink({
  uri: 'https://dev.reef.polkastats.io/api/v3'
});

const wsLink = new WebSocketLink({
  options: {
    reconnect: true
  },
  uri: 'wss://dev.reef.polkastats.io/api/v3'
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export const apolloClientInstance = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([splitLink])
});