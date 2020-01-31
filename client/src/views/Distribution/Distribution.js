import React from "react";
import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


import {
                               Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col
} from "reactstrap";

class Distribution extends React.Component {
  render() {
    return (

        <div className="content">
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h2"><h2>Distribution</h2></CardTitle>
                </CardHeader>
                <CardBody>
                  <Table className="tablesorter table" responsive>
                    <thead className="text-primary">
                      <tr>
                        <th className="header headerSortUp">Order ID</th>
                        <th>Status</th>
                        <th>Vehical NO.</th>
                        <th>ETA</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>10247</td>
                        <td>In Progress</td>
                        <td>MK-237</td>
                        <td>7/12/2018</td>
                      </tr>
                      <tr>
                        <td>38909</td>
                        <td>Completed</td>
                        <td>MR-502</td>
                        <td>25/02/2018</td>
                      </tr>
                       <tr>
                        <td>42442</td>
                        <td>In Progress</td>
                        <td>RL-980</td>
                        <td>12/06/2018</td>
                      </tr>
                      <tr>
                        <td>23893</td>
                        <td>Completed</td>
                        <td>RP-876</td>
                        <td>16/08/2018</td>
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

export default Distribution;
