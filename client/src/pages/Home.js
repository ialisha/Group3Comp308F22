import { SIGNED_IN_QUERY } from "../graphql/queries";
import { ListGroup,Button, Container, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { gql, useApolloClient, useQuery } from "@apollo/client";

/** @type {typeof import("../graphql.gen").WhoAmIDocument} */
const WHO_AM_I_QUERY = gql`
  query WhoAmI {
    whoAmI {
      id
      firstName
      lastName
      role
    }
  }
`;

export default function Home() {
  const whoAmI = useQuery(WHO_AM_I_QUERY, { fetchPolicy: "network-only" });
  const apolloClient = useApolloClient();
  const signedIn = useQuery(SIGNED_IN_QUERY, { fetchPolicy: "cache-only" });
  const history = useHistory();
  const onRecordClick = () => {
    history.push("/record-vitals");
  };
  const onSearchRecordsClick = () => {
    history.push("/past-records");
  };
  return (
    <>
 <h1 className="p-2 bd-highlight" >Welcome to our Application <span>{whoAmI.data?.whoAmI?.firstName}</span></h1> 
  <div className="alert alert-warning" role="alert">  <h2>This application is made by Group 3 for COMP308, Emerging Technologies under the direction of Ilia Nika, Professor and Program Coordinator at Centennial College </h2>
    
     </div>   {signedIn.loading ? (
        // Loading the auth state
        <p>Loading...</p>
      ) : signedIn.data?.whoAmI?.id ? (
        // The user is signed in
        <>
          {/* Contents that differ for each role */}
          {signedIn.data.whoAmI.role === "NURSE" ? (
            // Signed in as a nurse
            <div className="container px-4 py-5">
            <div className="alert alert-success" role="alert">You are logged in as Nurse!!!</div>  
             
            </div>
          ) : (
            // Signed in as a patient
            <div className="alert alert-success" role="alert">You are logged in as a patient!!!.</div>
          )}
        </>
      ) : (
        // The user is not signed in
        <h1>Please sign in to use our service.</h1>
      )}<h2>Group 3 Members:
      </h2>
      <br></br>
      <h2>
      <ListGroup as="ol" numbered>
      <ListGroup.Item as="li" variant="info">Jai Patel - 301170222 - jpate661@my.centennialcollege.ca</ListGroup.Item>
      <ListGroup.Item as="li" variant="info">Anmol Singh - 301145362 - asin1639@my.centennialcollege.ca</ListGroup.Item>
      <ListGroup.Item as="li" variant="info">Kokila Sangilimuthu - 301151291 - ksangili@my.centennialcollege.ca</ListGroup.Item>
      <ListGroup.Item as="li" variant="info">Alisha Irshad - 301147340 - airshad2@my.centennialcollege.cac</ListGroup.Item>
      <ListGroup.Item as="li" variant="info">Mohit Verma - 301170872 - mverma35@my.centennialcollege.ca</ListGroup.Item>
    </ListGroup>
       
       
</h2>
<br></br>
    
    </>
  );
  
}


