import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { StrictMode } from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { apolloAuthMiddleware, apolloUnauthorizedMiddleware } from "./auth";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "bootstrap/dist/css/bootstrap.min.css";

const httpLink = new HttpLink({
  uri: `${document.location.origin}/graphql`,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([apolloAuthMiddleware, apolloUnauthorizedMiddleware, httpLink]),
});

render(
  <StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
