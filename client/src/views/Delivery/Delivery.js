import React from "react";
import EventBus from 'eventing-bus'
import Enduser from  "views/Delivery/Enduser.js"
import NotificationAlert from "react-notification-alert";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import ReactTable from 'react-table';
// import ExportToExcel from "./ExportToExcel"
import Cheque from './Cheque.js';
// import Cash from './Cash.js';
import Online from './Online.js';
import 'react-table/react-table.css'
import Dealer from "views/Delivery/Dealer.js"
// import OrderHistory from "./OrderHistory.js"
import "./dealer.css"
import {
  FormGroup, Label,
   Form,
   Card,
   Col,
   Button,
   Input
} from "reactstrap";
import { Link } from "react-router-dom";
var totalPrice=''
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';
// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';
class Delivery extends React.Component {
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
    notify = (place, auth) => {
      console.log("Place :: ", place, auth);
      var type;
      var time;
      // if(auth === "block"){
      //   type="info";
      //   time=2
      // }
      if(auth)
      {
        type="success";
        time=2
      }
      else {
        type="danger"
        time=7
      }

      var options = {};
      options = {
        place: place,
        message: (
          <div>
          {
            (auth)?
              <div>
             {this.message}
              </div>
              :
              <div>
                   {this.message}
              </div>
          }
          </div>
        ),
        type: type,
        icon: "tim-icons icon-bell-55",
        autoDismiss: time
      };
      this.refs.notificationAlert.notificationAlert(options);
    };

    componentDidMount(){

  var url = require('url');
  const fetch = require('node-fetch');
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
  this.message=''
      EventBus.on("saveCashEventBus",this.saveCashEventBusFunc );
        EventBus.on("saveBankEventBus",this.saveBankEventBusFunc );
    }
    saveBankEventBusFunc=e=>{
      this.setState({
        pageToLoad1:'',
        pageToLoad2:''

      })
    }
    saveCashEventBusFunc=e=>{
        this.setState({
          pageToLoad1:'',
          pageToLoad2:''
        })
    }

  constructor(props) {
    super(props);
      this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      pageToLoad2:'',
      modalCollection: false,
      dropdownOpen: false,
      dues:'PKR -20,000',
      orderPrice:0,
      pageToLoad1:'',
      amountOfBags:'',
      tons:'',
      rate:750,
      deliveryPageToLoad: <Dealer props={props}/>
    };
  }
   toggleModal=e=>{
     console.log("togle modal");
     this.setState(prevState => ({
       modalCollection: !prevState.modalCollection,
     }));
   }
   toggleDropdown=e=>{
     this.setState(prevState => ({
   dropdownOpen: !prevState.dropdownOpen
 }));
   }
   onClickCash=e=>{
     console.log("cash here");
     if(e==='1'){
     this.setState({
       pageToLoad1:''
     })
   }
   if(e==='2'){
   this.setState({
     pageToLoad2:''
   })
 }



   }
   onClickCheque=e=>{
     console.log("cheque here");
     if(e==="1"){
       this.setState({
         pageToLoad1: <Cheque/>
       })
     }
     if(e==="2")
     this.setState({
       pageToLoad2: <Cheque/>
     })

   }
   onClickOnline=e=>{
     console.log("online here");
     if(e==="1"){
       this.setState({
         pageToLoad1: <Online/>
       })
     }
     if(e==="2")
     {
       this.setState({
         pageToLoad2: <Online/>
       })
     }

   }
   amountOfBags=e=>{

console.log('target value',e.target.value);
     this.setState({
       tons: (e.target.value)/1000,
      orderPrice:(e.target.value)*this.state.rate
     })

   }
   onClickDealer=e=>{
     console.log("clicked dealer option");
     this.setState({
       deliveryPageToLoad: <Dealer props={this.props} />
     })

   }
   onClickEndUser=e=>{
     console.log("clicked End User option");
     this.setState({
       deliveryPageToLoad: <Enduser props={this.props}/>
     })
   }

  render() {
console.log("Render of Delivery" , this.props);
    return (

        <div className="content">
        <div className="scrollerclass">
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>

        <Card style={{padding:'15px' , marginLeft:"0px"}}>
        <h3 style={{margin:'10px'}}>ORDER DELIVERY</h3>
        <h4 style={{margin:'10px', color:'green'}}><u>Place Orders</u></h4>
        <Form style={{marginLeft:'10px'}}>
        <FormGroup row>

        </FormGroup>
         <FormGroup row>
         <Label sm={2}>Customer Type</Label>
         <Col sm={2}>
         <Label style={{marginTop:'7px',cursor:'pointer'}}>
             <Input onClick={this.onClickDealer}type="radio" name="radio1" defaultChecked/>{' '}
             Dealer
             </Label>
           </Col>
            <Col sm={2}>
            <Label style={{marginTop:'7px',cursor:'pointer'}}>
             <Input  onClick={this.onClickEndUser}type="radio" name="radio1" />{' '}
             End User
             </Label>
              </Col>
         </FormGroup>
         <hr/>
         {this.state.deliveryPageToLoad}
      </Form>
        </Card>
        { /* <OrderHistory name='Order'/> */}
         </div>
        </div>

    );
  }
}

export default Delivery;
