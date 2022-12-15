import { gql, useQuery, useLazyQuery } from "@apollo/client";
import { useCallback, useState, useEffect } from "react";
import { Alert, Button, Form, ListGroup, Table } from "react-bootstrap";
import { SIGNED_IN_QUERY } from "../graphql/queries";
import SignIn from "./SignIn";

const GET_PAST_VITALS_QUERY = gql`
  query GetPastVitals($firstName: String!, $lastName: String!) {
    getPastVitals(firstName: $firstName, lastName: $lastName) {
      id
      bodyTemperature
      heartRate
      bloodPressure
      respiratoryRate
      recorded
    }
  }
`;

export default function RecordVitals() {
  //
  const signedIn = useQuery(SIGNED_IN_QUERY, { fetchPolicy: "cache-only" });
  const [fullRecord, setFullRecord] = useState({
    id: null,
    bodyTemperature: null,
    heartRate: null,
    bloodPressure: null,
    respiratoryRate: null,
    recorded: null,
  });
  const [pastRecords, setRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [pastVitalsQuery, { loading, error, data }] = useLazyQuery(
    GET_PAST_VITALS_QUERY,
    {
      fetchPolicy: "network-only",
      onCompleted: (data) => {
        if (error) {
          setErrorMessage("Could not process your request at this time.");
          return;
        }
        if (data?.getPastVitals) {
          setRecords(data.getPastVitals);
          setFullRecord({
            id: null,
            bodyTemperature: null,
            heartRate: null,
            bloodPressure: null,
            respiratoryRate: null,
            recorded: null,
          });
          setErrorMessage("");
          return;
        } else {
          setErrorMessage("Invalid input");
        }
      },
    }
  );
  //
  const OnSearchSubmit = useCallback(
    (ev) => {
      ev.preventDefault();
      //
      const form = new FormData(ev.target);
      const firstName = form.get("firstName");
      const lastName = form.get("lastName");
      //
      if (!firstName || !lastName) {
        setErrorMessage("First and last name are required.");
        return;
      }
      //
      try {
        pastVitalsQuery({ variables: { firstName, lastName } });
      } catch (e) {
        console.log(e);
        setErrorMessage("Something went wrong");
      }
    },
    [data, error, pastVitalsQuery, setRecords, setFullRecord]
  );
  //
  const onViewRecord = useCallback(
    async (record) => {
      setFullRecord({
        id: record.id,
        bodyTemperature: record.bodyTemperature,
        heartRate: record.heartRate,
        bloodPressure: record.bloodPressure,
        respiratoryRate: record.respiratoryRate,
        recorded: record.recorded,
      });
    },
    [setFullRecord]
  );
  //
  return (
    <>
      {signedIn.loading ? (
        <p>Loading...</p>
      ) : signedIn.data?.whoAmI?.id ? (
        <>
          <h1 className="mb-5">View Past Records</h1>
          <Form
            method="post"
            className="border rounded mx-3 p-3 text-start"
            onSubmit={OnSearchSubmit}
          >
            <Form.Group controlId="patient-first-name" className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstName" />
            </Form.Group>
            <Form.Group controlId="patient-last-name" className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastName" />
            </Form.Group>
            {!loading && errorMessage && <Alert>{errorMessage}</Alert>}
            <div className="text-center mb-3">
              <Button type="submit" variant="primary">
                Search
              </Button>
            </div>
          </Form>
          <br />
        </>
      ) : (
        <SignIn />
      )}
      {fullRecord.id ? (
        <>
          <Table striped bordered>
            <tbody>
              <tr>
                <td>Date: </td>
                <td>{new Date(fullRecord.recorded).toUTCString()}</td>
              </tr>
              <tr>
                <td>Body Temperature (°C): </td>
                <td>{fullRecord.bodyTemperature}</td>
              </tr>
              <tr>
                <td>Heart Rate (Bpm): </td>
                <td>{fullRecord.heartRate}</td>
              </tr>
              <tr>
                <td>Blood Pressure: </td>
                <td>{fullRecord.bloodPressure}</td>
              </tr>
              <tr>
                <td>Respiratory Rate (breaths/min): </td>
                <td>{fullRecord.respiratoryRate}</td>
              </tr>
            </tbody>
          </Table>
        </>
      ) : (
        <></>
      )}
      {pastRecords && pastRecords.length > 0 ? (
        <>
          <ListGroup>
            {pastRecords.map((item, idx) => (
              <ListGroup.Item
                key={idx}
                action
                onClick={() => onViewRecord(item)}
              >
                {new Date(item.recorded).toUTCString()}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
