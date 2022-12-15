import { gql, useMutation, useQuery } from "@apollo/client";
import { useCallback, useState, useEffect } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { SIGNED_IN_QUERY } from "../graphql/queries";
import SignIn from "./SignIn";
import { useHistory } from "react-router-dom";

const DAILYINFO_MUTATION = gql`
  mutation DailyINFOrm(
    $pulseRate: String
    $bloodPressure: String
    $weight: String
    $temperature: String
    $respiratoryRate: String
    $patient: ID!
  ) {
    dailyINFOrm(
      generalInfo: {
        pulseRate: $pulseRate
        bloodPressure: $bloodPressure
        weight: $weight
        temperature: $temperature
        respiratoryRate: $respiratoryRate
        patient: $patient
      }
    ) {
      id
    }
  }
`;

export default function DailyINFOrm() {
  const signedIn = useQuery(SIGNED_IN_QUERY, { fetchPolicy: "cache-only" });
  const [record, { loading }] = useMutation(DAILYINFO_MUTATION);
  const [error, setError] = useState("");
  const history = useHistory();

  const onSubmit = useCallback(
    async (ev) => {
      ev.preventDefault();
      setError("");

      const form = new FormData(ev.target);
      const pulseRate = form.get("pulseRate");
      const bloodPressure = form.get("bloodPressure");
      const weight = form.get("weight");
      const temperature = form.get("temperature");
      const respiratoryRate = form.get("respiratoryRate");
      const patient = signedIn.data?.whoAmI?.id;

      if (
        (form.get("pulseRate") !== "" && !pulseRate) ||
        (form.get("bloodPressure") && !bloodPressure) ||
        (form.get("weight") && !weight) ||
        (form.get("temperature") && !temperature) ||
        (form.get("respiratoryRate") && !respiratoryRate)
      ) {
        setError("All fields are required.");
        return;
      }

      if (
        typeof pulseRate !== "string" ||
        typeof bloodPressure !== "string" ||
        typeof weight !== "string" ||
        typeof temperature !== "string" ||
        typeof respiratoryRate !== "string"
      ) {
        setError("Malformed data in the form.");
        return;
      }

      try {
        const result = await record({
          variables: {
            pulseRate,
            bloodPressure,
            weight,
            temperature,
            respiratoryRate,
            patient,
          },
        });
        if (result.errors && result.errors.length > 0) {
          setError(
            "There was trouble processing the request. Please try again later."
          );
          return;
        }
        if (result.data?.dailyINFOrm.id) {
          // TODO handle submit result
          history.replace("/");
        } else {
          setError("Invalid values.");
        }
      } catch {
        setError("Oops, something went wrong.");
      }
    },
    [signedIn.data?.whoAmI?.id, history, record]
  );

  return (
    <>
      {signedIn.loading ? (
        <p>Loading...</p>
      ) : signedIn.data?.whoAmI?.id ? (
        <>
          <h1 className="mb-5">Daily Information</h1>
          <Form
            method="post"
            className="border rounded mx-3 p-3 text-start"
            onSubmit={onSubmit}
          >
            <fieldset disabled={loading}>
              <Form.Group
                className="mb-3"
                controlId="register-form"
                onSubmit={onSubmit}
              >
                <Form.Label>Pulse Rate</Form.Label>
                <Form.Control
                  type="text"
                  name="pulseRate"
                  required
                  aria-describedby="pulseRate-description"
                />
                <Form.Text id="pulseRate-description">
                  Please enter your pulse rate as indicated by the nurse.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="blood-Pressure">
                <Form.Label>Blood Pressure</Form.Label>
                <Form.Control
                  type="text"
                  name="bloodPressure"
                  autoComplete="blood-Pressure"
                  required
                  aria-describedby="bloodPressure-description"
                />
                <Form.Text id="bloodPressure-description">
                  Please enter your blood pressure as indicated by the nurse.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="weight-ind">
                <Form.Label>Weight</Form.Label>
                <Form.Control
                  type="text"
                  name="weight"
                  autoComplete="weight-ind"
                  required
                  aria-describedby="weight-description"
                />
                <Form.Text id="weight-description">
                  Please enter your weight as indicated by the nurse.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="temp-ind">
                <Form.Label>Temperature (C°)</Form.Label>
                <Form.Control
                  type="text"
                  name="temperature"
                  autoComplete="temp-ind"
                  required
                  aria-describedby="temp-description"
                />
                <Form.Text id="temp-description">
                  Please enter your temperature in C° as indicated by the nurse.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="respiratoryRate-ind">
                <Form.Label>Respiratory Rate</Form.Label>
                <Form.Control
                  type="text"
                  name="respiratoryRate"
                  autoComplete="respiratoryRate-ind"
                  required
                  aria-describedby="respiratoryRate-description"
                />
                <Form.Text id="respiratoryRate-description">
                  Please enter your respiratory rate in breaths per minute.
                </Form.Text>
              </Form.Group>

              {!loading && error && <Alert>{error}</Alert>}
              <div className="text-center mb-3">
                <Button type="submit" variant="primary">
                  Submit
                </Button>
              </div>
              <p className="text-center">
                By clicking submit you agree to our terms and conditions
              </p>
            </fieldset>
          </Form>
        </>
      ) : (
        <SignIn />
      )}
    </>
  );
}
