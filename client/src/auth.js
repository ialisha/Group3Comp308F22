import { ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const STORAGE_TOKEN_KEY = "token";

/**
 * Retrieve saved token from local storage
 */
const getAuthHeader = () => {
  const token = localStorage.getItem(STORAGE_TOKEN_KEY);
  return token ? `Bearer ${token}` : "";
};

/**
 * Save the token to local storage
 *
 * @param {string} token
 */
export const setAuthToken = (token) => {
  localStorage.setItem(STORAGE_TOKEN_KEY, token);
};

/**
 * Remove the saved token in local storage
 */
export const clearAuthToken = () => {
  localStorage.removeItem(STORAGE_TOKEN_KEY);
};

/**
 * Apollo client middleware that takes the jwt token from local storage and adds
 * it to the request header
 *
 * https://www.apollographql.com/docs/react/networking/advanced-http-networking#customizing-request-logic
 * https://www.apollographql.com/docs/react/networking/authentication#header
 */
export const apolloAuthMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: getAuthHeader(),
    },
  }));
  return forward(operation);
});

export const apolloUnauthorizedMiddleware = onError(
  ({ networkError, operation }) => {
    // @ts-ignore
    if (networkError?.statusCode === 401) {
      clearAuthToken();
      // TODO purge cache
    }
  }
);
