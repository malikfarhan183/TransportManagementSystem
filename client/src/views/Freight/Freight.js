import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';
import classnames from 'classnames';
import "../styles/Styling.css"

// reactstrap components
import {
  Card,
  // CardHeader,
  CardBody,
  // CardTitle,
  Table,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  // Button,
  // CardText
} from "reactstrap";

let tabStyle1={cursor:'pointer', height:'70px',background:'white'}
let tabStyle2={cursor:'pointer',height:'70px',paddingTop:'20px',paddingRight:'40px',background:'lightgray'}


class Frieght extends React.Component  {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }

    this.setState((state, props) => {
    return {counter: 0 + props.step};
           });

    if(tab==='1')
  {
    console.log("Changed 1");
    tabStyle1={background:'white'}
    tabStyle2={background:'lightgray'}
    this.setState((state, props) => {
    return {counter: 0 + props.step};
           });
  }

  if(tab==='2')
  {
    console.log("Changed 2");
    tabStyle2={background:'white'}
    tabStyle1={background:'lightgray'}

    this.setState((state, props) => {
    return {counter: 0 + props.step};
           });
  }


  }
  render() {
    return (
      <div className="content">

        <Nav tabs>

          <NavItem style={{width:'50%'}}>
            <NavLink
              style= {tabStyle1}
              className={classnames({
                tabActive: this.state.activeTab === '1' }, "tabNotActive") }
              onClick={() => { this.toggle('1'); }}
            >
              <h4>VEHICLES</h4>
            </NavLink>
          </NavItem>

          <NavItem style={{width:'50%'}}>
            <NavLink
              style= {tabStyle2}
              className={classnames({ tabActive: this.state.activeTab === '2' }, "tabNotActive") }
              onClick={() => {

                this.toggle('2'); }}
            >
            <h4>  LOCATION PRESETS</h4>
          </NavLink>
          </NavItem>

        </Nav>



        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">

            <Row>
              <Col md="12">

              <Card>
              <CardBody>
                <Table  className="tablesorter table" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th className="header headerSortUp">Order ID</th>
                      <th>Status</th>
                      <th>Vehicle No.</th>
                      <th>ETA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>10247</td>
                      <td>IN Progress</td>
                      <td>MK-237</td>
                      <td>2018-12-02</td>
                    </tr>
                    <tr>
                      <td>38909</td>
                      <td>Completed</td>
                      <td>MR-502</td>
                      <td>2018-02-25</td>
                    </tr>
                     <tr>
                      <td>42442</td>
                      <td>In Progress</td>
                      <td>RL-980</td>
                      <td>2018-06-07</td>
                    </tr>
                    <tr>
                      <td>23893</td>
                      <td>Completed</td>
                      <td>RP-876</td>
                      <td>2018-08-12</td>
                    </tr>
                  </tbody>
                </Table>
                </CardBody>
                </Card>

              </Col>
            </Row>

          </TabPane>
          <TabPane tabId="2">

            <Row>
              <Col md="12">
             <Card>
             <CardBody>
              <Table className="tablesorter table" responsive>
                <thead className="text-primary">
                  <tr>
                    <th className="header headerSortUp">Country</th>
                      <th className="header headerSortUp">City</th>

                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PAKISTAN</td>
                    <td>RAWALPINDI</td>

                  </tr>
                </tbody>
              </Table>
              </CardBody>
              </Card>


              </Col>
            </Row>

          </TabPane>
        </TabContent>


      </div>
    );
  }
}



export default  Frieght;
