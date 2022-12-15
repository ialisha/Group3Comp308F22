import { gql, useMutation, useQuery } from "@apollo/client";
import { useCallback, useState, useEffect } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { SIGNED_IN_QUERY } from "../graphql/queries";
import SignIn from "./SignIn";
import { useHistory } from "react-router-dom";

const RECORD_VITALS_MUTATION = gql`
  mutation RecordVitals(
    $bodyTemperature: Float
    $heartRate: Float
    $bloodPressure: Float
    $respiratoryRate: Float
    $firstName: String!
    $lastName: String!
    $nurse: ID!
  ) {
    recordVitals(
      vitalsData: {
        bodyTemperature: $bodyTemperature
        heartRate: $heartRate
        bloodPressure: $bloodPressure
        respiratoryRate: $respiratoryRate
        firstName: $firstName
        lastName: $lastName
        nurse: $nurse
      }
    ) {
      id
    }
  }
`;

export default function RecordVitals() {
  //
  const signedIn = useQuery(SIGNED_IN_QUERY, { fetchPolicy: "cache-only" });
  const [record, { loading }] = useMutation(RECORD_VITALS_MUTATION);
  const history = useHistory();
  const [error, setError] = useState("");
  //
  const OnSubmit = useCallback(
    async (ev) => {
      ev.preventDefault();
      //
      const form = new FormData(ev.target);
      const firstName = form.get("firstName");
      const lastName = form.get("lastName");
      const bodyTemperature = parseFloat(form.get("bodyTemperature"));
      const heartRate = parseFloat(form.get("heartRate"));
      const bloodPressure = parseFloat(form.get("bloodPressure"));
      const respiratoryRate = parseFloat(form.get("respiratoryRate"));
      //
      if (
        (form.get("bodyTemperature") != "" && !bodyTemperature) ||
        (form.get("heartRate") && !heartRate) ||
        (form.get("bloodPressure") && !bloodPressure) ||
        (form.get("respiratoryRate") && !respiratoryRate)
      ) {
        setError(
          "body temp., heart rate, blood pressure and resp. rate must be valid numbers"
        );
        return;
      }
      const nurse = signedIn.data?.whoAmI?.id;
      //
      if (!firstName || !lastName) {
        setError("First and last name are required.");
        return;
      }
      //
      try {
        const result = await record({
          variables: {
            bodyTemperature,
            heartRate,
            bloodPressure,
            respiratoryRate,
            firstName,
            lastName,
            nurse,
          },
        });
        if (result.errors && result.errors.length > 0) {
          setError("Could not process your request at this time.");
          return;
        }
        if (result.data?.recordVitals?.id) {
          history.replace("/");
        } else {
          setError("Invalid input");
        }
      } catch (e) {
        console.log(e);
        setError("Something went wrong");
      }
    },
    [signedIn.data?.whoAmI?.id, history, record]
  );
  //
  return (
    <>
      {signedIn.loading ? (
        <p>Loading...</p>
      ) : signedIn.data?.whoAmI?.id ? (
        <>
          <h1 className="mb-5">Record Vitals Information</h1>
          <Form
            method="post"
            className="border rounded mx-3 p-3 text-start"
            onSubmit={OnSubmit}
          >
            <Form.Group controlId="patient-first-name" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstName" />
            </Form.Group>
            <Form.Group controlId="patient-last-name" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastName" />
            </Form.Group>
            <Form.Group controlId="body-temperature" className="mb-3">
              <Form.Label>Body Temperature (°C)</Form.Label>
              <Form.Control type="text" name="bodyTemperature" />
            </Form.Group>
            <Form.Group controlId="heart-rate" className="mb-3">
              <Form.Label>Heart Rate (Bpm)</Form.Label>
              <Form.Control type="text" name="heartRate" />
            </Form.Group>
            <Form.Group controlId="blood-pressure" className="mb-3">
              <Form.Label>Blood Pressure</Form.Label>
              <Form.Control type="text" name="bloodPressure" />
            </Form.Group>
            <Form.Group controlId="respiratoryRate" className="mb-3">
              <Form.Label>Respiratory Rate (breaths/min)</Form.Label>
              <Form.Control type="text" name="respiratoryRate" />
            </Form.Group>
            {!loading && error && <Alert>{error}</Alert>}
            <div className="text-center mb-3">
              <Button type="submit" variant="primary">
                Save
              </Button>
            </div>
          </Form>
        </>
      ) : (
        <SignIn />
      )}
    </>
  );
}
