import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import ReactTable from 'react-table';
// import Cheque from './Cheque.js';
// import Cash from './Cash.js';
// import Online from './Online.js';
import 'react-table/react-table.css'
// import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {
  FormGroup, Label,
   Form,
   Card,
   // Table,
   // Row,
   Col,
   // Nav,
   Button,
   Input
} from "reactstrap";
// import EventBus from 'eventing-bus'
// import { Link } from "react-router-dom";
import FleetManagementModal from "./FleetManagementModal.js"
import "./FleetManagement.css"



class FleetManagement extends React.Component {
  toggle(tab) {
    console.log(tab);

      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        });
      this.setState((state, props) => {
      return {counter: 0 + props.step};
             });
    }}

  constructor(props) {
    super(props);

    this.state = {
      pageToLoad:'',
      dropdownOpen: false
    };
  }

   toggleDropdown=e=>{
     this.setState(prevState => ({
   dropdownOpen: !prevState.dropdownOpen
 }));


   }

  render() {

    return (

        <div className="content">

        <Card style={{padding:'12px'}}>
        <h3 style={{margin:'10px'}}>Fleet Management</h3>
        <Form style={{marginLeft:'10px',marginTop:'10px'}}>
<FormGroup row>
<Label for="truckNo" sm={2}>Truck No.</Label>
<Col sm={4}>
  <Input type="text" name="truckNo" id="truckNo" placeholder="Enter Truck No." />
</Col>
</FormGroup>
<FormGroup row>
<Label for="origin" sm={2}>Origin</Label>
<Col sm={4}>
  <Input type="text" name="origin" id="origin" placeholder="Enter Origin Place" />
</Col>
</FormGroup>
<FormGroup row>
<Label for="destination" sm={2}>Destination</Label>
<Col sm={4}>
  <Input type="text" name="destination" id="destination" placeholder="Enter destination Place"/>
</Col>
</FormGroup>
<FormGroup row>
<Label for="destination" sm={2}>Type</Label>
<Col sm={4}>
  <select className='input'type="text" name="type" id="type">
  <option value='bulk'>Bulk</option>
    <option value='bag'>Bag</option>
  </select>
</Col>
</FormGroup>

<FormGroup row>
<Label for="freight" sm={2}>Freight</Label>
<Col sm={4}>
  <Input type="text" name="freight" id="freight" placeholder="Enter Rate Here"/>
</Col>
</FormGroup>
<hr/>
<div className='heading'>
<h3> Expanses</h3>    {<FleetManagementModal/>}
</div>
<FormGroup row>
<Label for="freight" sm={2}>Diesel</Label>
<Col sm={4}>
  <Input type="number" name="freight" id="freight" placeholder="Enter Diesel Here"/>
</Col>
</FormGroup>
<FormGroup row>
<Label for="freight" sm={2}>Toll Tax</Label>
<Col sm={4}>
  <Input type="number" name="freight" id="freight" placeholder="Enter Tax Here"/>
</Col>
</FormGroup>
<FormGroup row>
<Label for="challan" sm={2}>Challan</Label>
<Col sm={4}>
  <Input type="number" name="challan" id="challan" placeholder="Enter Challan Here"/>
</Col>
</FormGroup>
<FormGroup row>
<Label for="freight" sm={2}>Maintenance</Label>
<Col sm={3}>
  <Input type="number" name="freight" id="freight" placeholder="Enter Maintenance"/>
</Col>
<Col sm={3}>
  <Input type="number" name="freight" id="freight" placeholder="Enter Maintenance"/>
</Col>
<Col sm={3}>
  <Input type="number" name="freight" id="freight" placeholder="Enter Maintenance"/>
</Col>
</FormGroup>
<FormGroup row>
<Label for="pettyCash" sm={2}>Petty Cash</Label>
<Col sm={4}>
  <Input type="number" name="pettyCash" id="pettyCash" placeholder="Enter petty Cash"/>
</Col>
</FormGroup>
<FormGroup style={{marginTop:'20px',marginBottom:'5px'}}check row>
<Col sm={{ size: 10, offset: 2 }}>
  <Button color='info'>Save</Button>
</Col>
</FormGroup>
</Form>
        </Card>

        </div>

    );
  }
}

export default FleetManagement;
