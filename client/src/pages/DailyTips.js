import React, { useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  Alert,
  Button,
  Col,
  Form,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";

/** @type {typeof import("../graphql.gen").GetMessagesDocument} */
export const GET_MESSAGES = gql`
  query GetMessages {
    getMessages {
      id
      body
    }
  }
`;

function DailyTips(props) {
  const [showLoading, setShowLoading] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_MESSAGES);

  if (loading) {
    return (
      <div>
        <div>
          {showLoading && (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          )}
        </div>
      </div>
    );
  }
  console.log(data);

  // TODO: make a nicer error page
  if (error || !data) {
    return <p>Error...</p>;
  }

  return (
    <div>
      {data.getMessages && data.getMessages.length !== 0 ? (
        <div>
          {showLoading && (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          )}
          <ListGroup>
            {data.getMessages.map((item, idx) => (
              <ListGroup.Item
                key={idx}
                action
                onClick={() => {
                  alert(item.body);
                }}
              >
                {item.body}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      ) : (
        <p> No messages found! </p>
      )}
    </div>
  );
}

export default DailyTips;
