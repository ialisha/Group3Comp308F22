import { gql, useQuery } from "@apollo/client";
import { Alert } from "react-bootstrap";

/** @type {typeof import("../graphql.gen").GetEmergencyAlertsDocument} */
const GET_EMERGENCY_ALERTS_QUERY = gql`
  query GetEmergencyAlerts {
    getAlerts {
      id
      sender {
        id
        email
        firstName
        lastName
      }
      createdAt
      reason
    }
  }
`;

export default function PatientEmergencyAlerts() {
  const { loading, error, data } = useQuery(GET_EMERGENCY_ALERTS_QUERY);

  return (
    <div className="card-child" style={{ width: "100%" }}>
      <div className="row justify-content-center">
        <h2>
          Patients <span className="text-danger">Emergency Alerts</span>
        </h2>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error || !data ? (
        <Alert>{error ?? "Failed to get data"}</Alert>
      ) : data.getAlerts.length !== 0 ? (
        <div className="row justify-content-center row-padding">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Reason</th>
                <th>Date Created</th>
                <th>Patient Email</th>
              </tr>
            </thead>
            <tbody>
              {data.getAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.reason}</td>
                  <td>{new Date(alert.createdAt).toDateString()}</td>
                  <td>{alert.sender.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="row justify-content-center">
          <h4>No Alerts Present</h4>
        </div>
      )}
    </div>
  );
}
