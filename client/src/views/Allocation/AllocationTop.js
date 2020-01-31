import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import classnames from 'classnames';
import "../styles/Styling.css"
// import {Modal} from 'reactstrap';
// import EventBus from 'eventing-bus'
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


import {
   // Form,
   Card,
   CardBody,
   Table,
   Row,
   Col,
   // Nav,
   // Button,
   // Input
} from "reactstrap";
class AllocationTop extends React.Component {

  render() {
    return (

      <div className="content">
      <Row>
        <Col md="12">
          <Card>

            <CardBody>
              <Table className="tablesorter table">
                <thead className="text-primary">
                  <tr>
                    <th className="header headerSortUp">Allocation Details</th>

                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td >Customer Name</td>
                    <td> farhan</td>
                    <td>Customer Order</td>
                    <td>3590 bags </td>
                    <td>Order Date</td>
                    <td>12/07/2018</td>
                  </tr>
               </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
        </Row>
        </div>


    );
  }
}

export default AllocationTop ;
