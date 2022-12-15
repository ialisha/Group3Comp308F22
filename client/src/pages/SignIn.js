import { gql, useMutation } from "@apollo/client";
import { useCallback, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { setAuthToken } from "../auth";

/** @type {typeof import("../graphql.gen").SignInDocument} */
const SIGN_IN_MUTATION = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
      user {
        role
      }
    }
  }
`;

export default function SignIn() {
  const [signIn, { loading, client }] = useMutation(SIGN_IN_MUTATION);
  const [error, setError] = useState("");
  const history = useHistory();

  /** @type {import("react").FormEventHandler<HTMLFormElement>} */
  const onSubmit = useCallback(
    async (ev) => {
      ev.preventDefault();
      setError("");

      const form = new FormData(/** @type {HTMLFormElement} */ (ev.target));
      const email = form.get("email");
      const password = form.get("password");

      if (!email || !password) {
        setError("Both fields are required.");
        return;
      }

      if (typeof email !== "string" || typeof password !== "string") {
        setError("Malformed data in the form.");
        return;
      }

      try {
        const result = await signIn({ variables: { email, password } });
        if (result.errors && result.errors.length > 0) {
          setError(
            "There was trouble processing the request. Please try again later."
          );
          return;
        }
        if (result.data?.signIn) {
          setAuthToken(result.data.signIn.token);
          history.replace(
            result.data.signIn.user.role === "NURSE" ? "/" : "/"
          );
          await client.refetchQueries({ include: ["WhoAmI"] });
        } else {
          setError("Invalid credentials.");
        }
      } catch {
        setError("Oops, something went wrong.");
      }
    },
    [client, history, signIn]
  );

  return (
    <>
      <h1 className="mb-5" style={{ color:"#3A66A7", textAlign:"center" }}>Log In to your Account</h1>
      <Form
        method="post"
        className="border rounded mx-3 p-3 text-start"
        onSubmit={onSubmit}
      >
        <fieldset disabled={loading}>
          <Form.Group controlId="sign-in-email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" required />
          </Form.Group>
          <Form.Group controlId="current-password" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </Form.Group>
          {!loading && error && <Alert variant="danger">{error}</Alert>}
          <div className="text-center mb-3">
            <Button type="submit" variant="primary">
              Sign In
            </Button>
          </div>
          <p className="text-center">
            Do not have an account yet?{" "}
            <Link to="/register">Register here.</Link>
          </p>
        </fieldset>
      </Form>
    </>
  );
}
