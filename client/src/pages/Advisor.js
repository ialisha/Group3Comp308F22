import { gql, useLazyQuery } from "@apollo/client";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";

/** @type {typeof import("../graphql.gen").HealthAdviceDocument} */
const HEALTH_ADVICE_QUERY = gql`
  query HealthAdvice($data: PredictionData!) {
    healthAdvice(data: $data) {
      heartDiseaseProbability
    }
  }
`;

export default function Advisor() {
  const [getAdvice, { called, loading, data }] =
    useLazyQuery(HEALTH_ADVICE_QUERY);
  const [error, setError] = useState("");

  /** @type {import("react").FormEventHandler<HTMLFormElement>} */
  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setError("");

      const form = new FormData(/** @type {HTMLFormElement} */ (event.target));
      // @ts-ignore
      const age = parseInt(form.get("age"), 10);
      const sex = form.get("sex") === "Male" ? "M" : "F";
      const exerciseAngina = !!form.get("angina");
      // @ts-ignore
      const cholesterol = parseFloat(form.get("cholesterol"));
      const fastingBloodSugar = !!form.get("sugar");
      // @ts-ignore
      const restingBloodPressure = parseFloat(form.get("pressure"));
      // @ts-ignore
      const maxHeartRate = parseFloat(form.get("heart-rate"));
      const chestPainInput = form.get("chest-pain");
      const chestPain =
        chestPainInput === "NEVER" ||
        chestPainInput === "LITTLE" ||
        chestPainInput === "SOME" ||
        chestPainInput === "SEVERE"
          ? chestPainInput
          : "NEVER";

      try {
        const result = await getAdvice({
          variables: {
            data: {
              age,
              sex,
              chestPain,
              exerciseAngina,
              cholesterol,
              fastingBloodSugar,
              restingBloodPressure,
              maxHeartRate,
            },
          },
        });
        if (result.error) {
          setError(
            "There was trouble processing the request. Please try again later."
          );
          return;
        }
      } catch {
        setError("Oops, something went wrong.");
      }
    },
    [getAdvice]
  );

  return (
    <>
      <h1 className="mb-3">AI Advisor</h1>
      <p className="mb-5">
        With the below information provided from you, our AI advisor can guess
        what health concerns you are likely to have.
      </p>

      <Form
        method="post"
        className="border rounded mx-3 p-3"
        onSubmit={onSubmit}
      >
        <h2 className="visually-hidden">Form to Fill In Your Data</h2>
        <Row as="fieldset" disabled={loading}>
          {/* Age */}
          <Col
            as={Form.Group}
            xs={12}
            md={6}
            controlId="advice-age"
            className="mb-4"
          >
            <Form.Label>Age</Form.Label>
            <Form.Control type="text" name="age" required defaultValue={50} />
          </Col>

          {/* Sex */}
          <Col as="fieldset" xs={12} md={6} className="mb-4">
            <Form.Label
              as="legend"
              style={{ fontSize: "var(--bs-body-font-size)" }}
            >
              Sex
            </Form.Label>
            <div className="form-control border-0">
              <Form.Check
                inline
                type="radio"
                name="sex"
                id="advice-sex-m"
                label="Male"
                required
                defaultChecked
              />
              <Form.Check
                inline
                type="radio"
                name="sex"
                id="advice-sex-f"
                required
                label="Female"
              />
            </div>
          </Col>

          {/* Chest pain */}
          <Col
            as={Form.Group}
            xs={12}
            md={6}
            controlId="advice-chest-pain"
            className="mb-4"
          >
            <Form.Label>Chest Pain</Form.Label>
            <Form.Select name="chest-pain" required defaultValue="NEVER">
              <option value="NEVER">Never</option>
              <option value="LITTLE">A little</option>
              <option value="SOME">Some</option>
              <option value="SEVERE">Severe</option>
            </Form.Select>
          </Col>

          {/* Exercise angina */}
          <Col as={Form.Group} xs={12} md={6} className="mb-4">
            <Form.Label as="div">Exercise Angina</Form.Label>
            <div className="form-control border-0">
              <Form.Check
                inline
                type="checkbox"
                name="angina"
                id="advice-angina"
                label="Chest pain after exercise?"
                value="true"
              />
            </div>
          </Col>

          {/* Cholesterol */}
          <Col
            as={Form.Group}
            xs={12}
            md={6}
            controlId="advice-cholesterol"
            className="mb-4"
          >
            <Form.Label>Cholesterol (mg/dl)</Form.Label>
            <Form.Control
              type="text"
              name="cholesterol"
              required
              defaultValue={175}
            />
          </Col>

          {/* Fasting blood sugar */}
          <Col as={Form.Group} xs={12} md={6} className="mb-4">
            <Form.Label as="div">Fasting Blood Sugar</Form.Label>
            <div className="form-control border-0">
              <Form.Check
                inline
                type="checkbox"
                name="sugar"
                id="advice-sugar"
                label="FBS over 120 mg/dl?"
                value="true"
              />
            </div>
          </Col>

          {/* Resting blood pressure */}
          <Col
            as={Form.Group}
            xs={12}
            md={6}
            controlId="advice-blood-pressure"
            className="mb-4"
          >
            <Form.Label>Resting Blood Pressure (mmHg)</Form.Label>
            <Form.Control
              type="text"
              name="pressure"
              required
              defaultValue={130}
            />
          </Col>

          {/* Maximum heart rate */}
          <Col
            as={Form.Group}
            xs={12}
            md={6}
            controlId="advice-heart-rate"
            className="mb-4"
          >
            <Form.Label>Maximum Heart Rate (beat/min)</Form.Label>
            <Form.Control
              type="text"
              name="heart-rate"
              required
              defaultValue={175}
            />
          </Col>

          {/* Submit button */}
          <Col xs={12} className="text-center mt-3">
            <Button type="submit" variant="primary">
              Get Prediction
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Results */}
      {called &&
        (error ? (
          // In case of error
          <Alert variant="danger" className="mt-5">
            {error}
          </Alert>
        ) : !data ? (
          <p className="mt-5 text-center">Loading...</p>
        ) : (
          <div className="d-flex justify-content-center mt-5">
            <Card className="mx-3 p-3">
              <Card.Body>
                <Card.Title as="h2">Advice, Just for You</Card.Title>
                <Card.Text>
                  Below is what we found out about your data.
                </Card.Text>
              </Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item className="pt-4">
                  <h3>Heart Disease Probability</h3>
                  <p>You are likely to have a heart disease by:</p>
                  <p className="text-center">
                    {(data.healthAdvice.heartDiseaseProbability * 100).toFixed(
                      2
                    )}
                    %
                  </p>
                  <p>
                    {data.healthAdvice.heartDiseaseProbability > 0.8
                      ? "Please consult a doctor."
                      : data.healthAdvice.heartDiseaseProbability > 0.5
                      ? "No immediate attention is needed, but please keep on watch."
                      : data.healthAdvice.heartDiseaseProbability > 0.3
                      ? "You are doing ok."
                      : "Perfect!"}
                  </p>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </div>
        ))}
    </>
  );
}
