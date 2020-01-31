import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import EventBus from 'eventing-bus'
import {
  FormGroup, Label,
   // Card,

   Table,
   // Row,
   Form,
   Col,
   Nav,
   Button,
   Input
} from "reactstrap";
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class BankForm extends React.Component {
  saveBank=e=>{
    console.log("bank selected");
      EventBus.publish("saveBankEventBus", true);
  }

  render() {
    return (

        <div className="content">
        <Form>
        <FormGroup row>
        <Label for="accountNo" sm={6}>Account No.</Label>
        <Col sm={10}>
          <Input type="text" name="accountNo" id="accountNo" placeholder="Enter Bank Account No." />
        </Col>
        </FormGroup>
        <Col sm={{ size: 10, offset: 2 }}>
          <Button onClick={this.saveBank}color='info'>Save</Button>
        </Col>

        </Form>
        </div>

    );
  }
}

export default BankForm;
