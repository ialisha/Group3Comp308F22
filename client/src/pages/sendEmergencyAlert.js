import { gql, useMutation } from "@apollo/client";
import { useCallback, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";

/** @type {typeof import("../graphql.gen").SendEmergencyAlertDocument} */
const SEND_EMERGENCY_ALERT = gql`
  mutation SendEmergencyAlert($reason: String!) {
    sendAlert(reason: $reason) {
      id
    }
  }
`;

export default function SendEmergencyAlert() {
  const [sendAlert, { loading }] = useMutation(SEND_EMERGENCY_ALERT);
  const history = useHistory();
  const [reason, setReason] = useState("");

  /** @type {import("react").FormEventHandler<HTMLFormElement>} */
  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      try {
        const result = await sendAlert({ variables: { reason } });
        if (result.errors && result.errors.length > 0) {
          alert("Failed to send the alert: " + result.errors[0].message);
          return;
        }
        if (result.data?.sendAlert?.id) {
          alert("The alert was sent!");
          history.push("/");
        } else {
          alert("You need to be logged in.");
          history.push("/sign-in");
        }
      } catch {
        alert("There was an error while sending the alert.");
      }
    },
    [history, reason, sendAlert]
  );

  return (
    <div>
      <div className="card-container">
        <div className="row justify-content-center">
          <h2>
            <span className="text-danger">Send Emergency Alert</span>
          </h2>
        </div>
        <div className="row justify-content-center">
          <h4>
            This Emergency Alert will be sent to your doctor and hospital.
          </h4>
        </div>
        <Form method="post" onSubmit={onSubmit}>
          <fieldset disabled={loading}>
            <Form.Group controlId="alertReason">
              <Form.Label style={{ fontWeight: "bold" }}>
                Alert Reason
              </Form.Label>
              <br />
              <Form.Control
                as="textarea"
                rows={8}
                placeholder="Enter alert reason"
                name="reason"
                required
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </Form.Group>
            <div className="row justify-content-center">
              <Button variant="danger" type="submit">
                SEND ALERT
              </Button>
            </div>
          </fieldset>
        </Form>
      </div>
    </div>
  );
}
