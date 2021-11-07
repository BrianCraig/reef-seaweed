import { HttpLink, split, ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities"

interface Network {
  gqlHttps: string;
  gqlWss: string;
}

const httpLink = ({ gqlHttps }: Network) => new HttpLink({
  uri: gqlHttps
});

const wsLink = ({ gqlWss }: Network) => new WebSocketLink({
  options: {
    reconnect: true
  },
  uri: gqlWss
});

const splitLink = (network: Network) => split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink(network),
  httpLink(network)
);

export const apolloClientInstance = (network: Network) => new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([splitLink(network)])
});