import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import classnames from 'classnames';
import "../styles/Styling.css"
// import {Modal} from 'reactstrap';
import EventBus from 'eventing-bus'
// import VerificationTab from "./VerificationTab.js"
// import DistributionTab from "./DistributionTab.js"
// import CollectionTab from "./CollectionTab.js"
// import DepositeTab from "./DepositeTab.js"
import OrderDetailTop from "./OrderDetailTop.js"
import OrderDetailBottom from "./OrderDetailBottom.js"
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


// import {
   // Form,
   // Card,
   // Table,
   // Row,
   // Col,
   // Nav,
   // Button,
   // Input
 // } from "reactstrap";
 let tabStyle1={color:'black'}
 let tabStyle2={color:'black'}
 let tabStyle3={color:'black'}
 let tabStyle4={color:'black'}
let aRow = ""
let bRow=""
let cRow=""
class OrderDetailHome extends React.Component {


  handleDepositeForm=e=>{
    console.log(e);
    this.formDepositeData=e;
   console.log("Recieved data :: ",this.formDepositeData);

   cRow =    <tr>
     <td>{this.formDepositeData.typeData}</td>
     <td>{this.formDepositeData.amountData}</td>
     <td >{this.formDepositeData.dateData}</td>
     <td>{this.formDepositeData.submittedByData}</td>
      <td>{this.formDepositeData.referenceData}</td>
     </tr>
 this.tableDepositeRow.push(cRow);
 console.log('after adding values in table::',this.tableDepositeRow);

  }
  handleCollectionForm=e=>{
    console.log(e);
    this.formCollectionData=e;
   console.log("Recieved data :: ",this.formCollectionData);

   bRow =    <tr>
     <td>{this.formCollectionData.typeData}</td>
     <td>{this.formCollectionData.amountData}</td>
     <td >{this.formCollectionData.dateData}</td>
     <td>{this.formCollectionData.collectedByData}</td>
      <td>{this.formCollectionData.referenceData}</td>
     </tr>
 this.tableCollectionRow.push(bRow);
 console.log('after adding values in table::',this.tableCollectionRow);

  }

  handleDistributionForm=e=>{
        this.formData=e;

       aRow =    <tr>
         <td>{this.formData.vehicalsData}</td>
         <td>{this.formData.noOfbagsData}</td>
         <td >{this.formData.depositData}</td>
         <td>{this.formData.referenceData}</td>


       </tr>
     this.tableRow.push(aRow);
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
    this.vehicalsData='';
      this.noOfbagsData='';
          this.depositData='';
          this.typeData='';
          this.amountData='';
          this.dateData='';
            this.collectedByData='';
            this.referenceData='';
            this.submittedByData='';



EventBus.on("formDataDistributionEventBus", this.handleDistributionForm)
EventBus.on("formDataCollectionEventBus", this.handleCollectionForm)
EventBus.on("formDataDepositeEventBus", this.handleDepositeForm)

  }
  toggleModal=(e)=> {
    console.log('entered',e);
     if(e==='1'){
      console.log('value recieved1');
    this.setState(prevState => ({
      modalDistribution: !prevState.modalDistribution,
    }));
  }
  if(e==='2'){
    console.log('value recieved2');
  this.setState(prevState => ({
    modalCollection: !prevState.modalCollection,
  }));
}
if(e==='3'){
  console.log('value recieved3');
this.setState(prevState => ({
  modalDeposit: !prevState.modalDeposit,
}));
}
  }

  toggle(tab) {
    console.log(tab);
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
      this.setState((state, props) => {
      return {counter: 0 + props.step};
             });
    }
    if(tab==='1')
    {
      console.log("Changed 1");
      tabStyle1={color:'royalblue'}
      tabStyle2={color:'black'}
      tabStyle3={color:'black'}
      tabStyle4={color:'black'}

      this.setState((state, props) => {
      return {counter: 0 + props.step};
             });
    }
    if(tab==='2')
    {
      console.log("Changed 2");
      tabStyle1={color:'black'}
      tabStyle2={color:'royalblue'}
      tabStyle3={color:'black'}
      tabStyle4={color:'black'}

      this.setState((state, props) => {
      return {counter: 0 + props.step};
             });
    }
    if(tab==='3')
    {
      console.log("Changed 3");
      tabStyle1={color:'black'}
      tabStyle2={color:'black'}
      tabStyle3={color:'royalblue'}
      tabStyle4={color:'black'}


      this.setState((state, props) => {
      return {counter: 0 + props.step};
             });
    }
    if(tab==='4')
    {
      console.log("Changed 4");
      tabStyle1={color:'black'}
      tabStyle2={color:'black'}
      tabStyle3={color:'black'}
      tabStyle4={color:'royalblue'}

      this.setState((state, props) => {
      return {counter: 0 + props.step};
             });
    }


  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
      this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      activeTab: '1',

        modalDistribution: false,
          modalCollection: false,
            modalDeposit: false
    };
  }

  render() {
    return (

      <div className="content">
        <OrderDetailTop/>
              <div className="content">

                <OrderDetailBottom/>

            </div>
            </div>

    );
  }
}

export default OrderDetailHome ;
