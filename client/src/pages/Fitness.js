import React from 'react'
import { ListGroup,Button, Container, Row, Col ,Card} from "react-bootstrap";
function Fitness() {
  return (
      <div>
    <div className="alert alert-primary" role="alert">
   Welcome to your Fitness Page . Lets explore some Fitness Stuffs!!!
  </div>
  <div className="d-flex justify-content-start">
  <div className="Card p-2 bd-highlight" >
  <img src="/yoga.png" width="350" height="200" alt="" />
  <div className="alert alert-success" role="alert">
    <a href="https://youtu.be/hJbRpHZr_d0" >Cure Anxiety & Depression</a>
  </div>
  
</div>
<div className="d-flex justify-content-center">
<div className="Card p-2 bd-highlight" >
  <img src="/fitness.png" width="350" height="200" alt="" />
  <div className="alert alert-success" role="alert">
    <a href="https://youtu.be/ml6cT4AZdqI" >Some Fitness Stuff</a>
  </div>
  </div>
</div>
<div className="d-flex justify-content-around">
<div className="Card p-2 bd-highlight" >
  <img src="/exercise.png" width="350" height="200" alt="" />
  <div className="alert alert-success" role="alert">
    <a href="https://youtu.be/5Ju3XvZ6S1Q" >Some Yoga Stuff</a>
  </div>
  </div>
</div>
</div>

</div>

  )
}

export default Fitness