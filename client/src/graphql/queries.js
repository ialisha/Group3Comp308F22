import { gql } from "@apollo/client";

/** @type {typeof import("../graphql.gen").SignedInDocument} */
export const SIGNED_IN_QUERY = gql`
  query SignedIn {
    whoAmI {
      id
      role
    }
  }
`;
