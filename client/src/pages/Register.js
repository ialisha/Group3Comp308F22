import { gql, useMutation } from "@apollo/client";
import { useCallback, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { setAuthToken } from "../auth";

/** @type {typeof import("../graphql.gen").RegisterDocument} */
const REGISTER_MUTATION = gql`
  mutation Register(
    $email: String!
    $password: String!
    $role: UserRole!
    $firstName: String!
    $lastName: String!
  ) {
    register(
      accountData: {
        email: $email
        password: $password
        role: $role
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      token
    }
  }
`;

export default function Register() {
  const [register, { loading, client }] = useMutation(REGISTER_MUTATION);
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
      const role = form.get("role");
      const firstName = form.get("first-name");
      const lastName = form.get("last-name");

      if (!email || !password || !role || !firstName || !lastName) {
        setError("All fields are required.");
        return;
      }

      if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        (role !== "PATIENT" && role !== "NURSE") ||
        typeof firstName !== "string" ||
        typeof lastName !== "string"
      ) {
        setError("Malformed data in the form.");
        return;
      }

      try {
        const result = await register({
          variables: { email, password, role, firstName, lastName },
        });
        if (result.errors && result.errors.length > 0) {
          setError(
            "There was trouble processing the request. Please try again later."
          );
          return;
        }
        if (result.data?.register?.token) {
          setAuthToken(result.data.register.token);
          history.replace("/");
          await client.refetchQueries({ include: ["WhoAmI"] });
        } else {
          setError("Invalid values.");
        }
      } catch {
        setError("Oops, something went wrong.");
      }
    },
    [client, history, register]
  );

  return (
    <>
 <h1 className="mb-5" style={{ color:"#3A66A7", textAlign:"center" }}>Register</h1>
      <Form
        method="post"
        className="border rounded mx-3 p-3 text-start"
        onSubmit={onSubmit}
      >
        <fieldset disabled={loading}>
          <Form.Group
            className="mb-3"
            controlId="register-email"
            onSubmit={onSubmit}
          >
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              required
              aria-describedby="email-description"
            />
            <Form.Text id="email-description">
              Please enter a valid email address so that you can receive any
              emails we send you.
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="new-password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              autoComplete="new-password"
              required
              aria-describedby="password-description"
            />
            <Form.Text id="password-description">
              For better security, make your password at least 6 characters
              long, and mix letters and numbers.
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="register-role" className="mb-3">
            <Form.Label>User Role</Form.Label>
            <Form.Select
              name="role"
              defaultValue={"PATIENT"}
              aria-describedby="register-description"
            >
              <option value={"PATIENT"}>Patient</option>
              <option value={"NURSE"}>Nurse</option>
            </Form.Select>
            <Form.Text id="register-description">
              Are you a patient or a nurse?
            </Form.Text>
          </Form.Group>
          <Row xs={1} md={2} className="mb-3">
            <Col
              as={Form.Group}
              className="mb-3 mb-md-0"
              controlId="register-first-name"
            >
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="first-name" required />
            </Col>
            <Col as={Form.Group} controlId="register-last-name">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="last-name" required />
            </Col>
          </Row>
          {!loading && error && <Alert>{error}</Alert>}
          <div className="text-center mb-3">
            <Button type="submit" variant="primary">
              Register
            </Button>
          </div>
          <p className="text-center">
            Already have an account? <Link to="/sign-in">Sign in here.</Link>
          </p>
        </fieldset>
      </Form>
    </>
  );
}
