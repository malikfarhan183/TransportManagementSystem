import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import classnames from 'classnames';
import "../styles/Styling.css"
// import {Modal } from 'reactstrap';
import EventBus from 'eventing-bus'
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';
import {
   Form,
   FormGroup,
   Label,
   Card,
   CardBody,
   // Table,
   // Row,
   // Col,
   // TabContent,
   // TabPane,
   // Nav,
   // NavItem,
   // NavLink,
   Button,
   Input
} from "reactstrap";
// let tabStyle1={color:'royalblue'}
// let tabStyle2={color:'black'}
// let tabStyle3={color:'black'}
// let tabStyle4={color:'black'}
// let aRow = ""
// let bRow=""
// let cRow=""
class AllocationBottom extends React.Component {

onChangeAllocationBottom=e=>{
  console.log(e.target.value);
  if(e.target.name==='vehicles'){
      this.vehicles=e.target.value;
  }
  if(e.target.name==='noofbags'){
      this.noofbags=e.target.value;
  }
  if(e.target.name==='writtenorder'){
      this.writtenorder=e.target.value;
  }
  if(e.target.name==='location'){
      this.location=e.target.value;
  }

}


  handleNextBtn=e=>{
    console.log('recieved::',e);
    this.toggle(e);
  }
handleAllocationForm=e=>{
  console.log('handleAllocationForm');
    var allocationBottomObject={
        vehiclesData:this.vehicles,
      noofbagsData:this.noofbags,
        writtenorderData:this.writtenorder,
        locationData:this.location
    }
    EventBus.publish("allocationBottomObjectEventBus", allocationBottomObject);
  }

  componentWillMount()
  {
    console.log("Will Mount");
    this.tableRow=[]
    this.tableCollectionRow=[]
    this.tableDepositeRow=[]
  }





  componentDidMount(){

  var url = require('url');
  // const fetch = require('node-fetch');
  const urlObj = url.parse(document.location.href, true);

  console.log("urlObj.hostname.indexOf(localhost)",urlObj.hostname, urlObj.hostname.indexOf("localhost"), urlObj.hostname.indexOf("-dev"));
  if (urlObj.hostname.indexOf("localhost") === -1 && urlObj.hostname.indexOf("-dev") === -1 )
  {
    // global.baseUrl = "http://www.atms.pk"
    global.baseUrl = urlObj.protocol + '//' + urlObj.hostname
  }
  else
  {
    global.baseUrl = "http://atms-dev.herokuapp.com"
  }
    this.vehicles=''
      this.noofbags=''
          this.writtenorder=''
            this.location=''
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (

      <Card>

        <CardBody>
        <Form>
        <div style={{display:'flex'}}>
     <FormGroup>
     <Label for="exampleSelect">Vehicles</Label>
     <Input style={{width:'190px'}} onChange={this.onChangeAllocationBottom}  type="select" name="vehicles" id="exampleSelect">
         <option disabled selected hidden>Select Vehicle</option>
         <option>MK704</option>
         <option>RM509</option>
        <option>RI604</option>
     </Input>
    </FormGroup>

   <FormGroup>
   <Label for="exampleEmail">No.of Bags</Label>
   <Input onChange={this.onChangeAllocationBottom}type="email" name="noofbags" id="exampleEmail" placeholder="No.of Bags" />
   </FormGroup>
    </div>
    <div style={{display:'flex'}}>
   <FormGroup>
     <Label for="exampleEmail">Written Order</Label>
     <Input  onChange={this.onChangeAllocationBottom}  type="email" name="writtenorder" id="exampleEmail" placeholder="Written Order" />
   </FormGroup>
   <FormGroup>
   <Label for="exampleEmail">Location</Label>
   <Input  onChange={this.onChangeAllocationBottom}  type="email" name="location" id="exampleEmail" placeholder="Location" />
   </FormGroup>
   </div>

   </Form>
   <Button
  onClick={this.handleAllocationForm}
   style={{ borderRadius: '10px', paddingBottom: '2px',paddingTop:'2px',marginLeft: '40%'}}
   color="info">Save
   </Button>
        </CardBody>
      </Card>



    );
  }
}

export default AllocationBottom;
