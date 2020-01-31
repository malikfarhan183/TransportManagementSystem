import React from "react";
import {
  FormGroup, Label,
   Form,
   // Card,
   // Table,
   // Row,
   Col,
   // Nav,
   // Button,
   Input
} from "reactstrap";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class Cash extends React.Component {

  render() {
    return (

        <div className="content">
        <Form>
        <FormGroup row>
        <Label style={{marginLeft:'10px'}} for="cash" sm={2}>Price</Label>
        <Col sm={2}>
          <Input type="number" name="cash" id="cash" placeholder=" Enter Price Here" />
        </Col>
        </FormGroup>
        </Form>

        </div>

    );
  }
}

export default Cash;
