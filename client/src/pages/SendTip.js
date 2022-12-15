import { gql, useMutation } from "@apollo/client";
import { useCallback, useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";

/** @type {typeof import("../graphql.gen").SendTipDocument} */
const SENDMESSAGE_MUTATION = gql`
  mutation sendTip($body: String!) {
    sendMessage(body: $body) {
      id
    }
  }
`;

function SendTip() {
  const [sendTip, { loading }] = useMutation(SENDMESSAGE_MUTATION);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory();

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const result = await sendTip({ variables: { body: message } });
      if (result.errors && result.errors.length > 0) {
        setError(
          "There was trouble processing the request. Please try again later."
        );
        return;
      }
      if (result.data?.sendMessage) {
        alert("Message sent succesfully");
      } else {
        alert("Unable to send message");
        setError("Unable to send message");
      }
    } catch {
      setError("Oops, something went wrong.");
    }
  };

  return (
    <div>
      <h1 className="mb-5">Send Tips To Patients</h1>
      <Form
        method="post"
        className="border rounded mx-3 p-3 text-start"
        onSubmit={onSubmit}
      >
        <fieldset disabled={loading}>
          <Form.Group controlId="Message" className="mb-3">
            <Form.Label>Message Or Tip</Form.Label>
            <Form.Control
              type="text"
              name="message"
              required
              value={message}
              onChange={(ev) => setMessage(ev.target.value)}
            />
          </Form.Group>
          <div className="text-center mb-3">
            <Button type="submit" variant="primary">
              Send
            </Button>
          </div>
        </fieldset>
      </Form>
    </div>
  );
}

export default SendTip;
