import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import {
   Form,
   // FormGroup,
   // Label,
   Card,
   // CardBody,
   // Table,
   // Row,
   // Col,
   // Nav,
   // Button,
   // Input
} from "reactstrap";
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class TruckDatabase extends React.Component {

  render() {
    return (

        <div className="content">


          <div className="content">
           <Card style={{padding:'15px',paddingBottom:'100%'}}>
           <Form style={{marginLeft:'10px',marginTop:'2%'}}>
          <h3> Truck Database </h3>
          <p style={{position:"absolute",marginLeft:'39%',marginTop:'14%',color:'royalblue'}} > Under Process...</p>
          </Form>
           </Card>
          </div>
        </div>
    );
  }
}

export default TruckDatabase;
