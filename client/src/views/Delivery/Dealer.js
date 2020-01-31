import React from "react";
import EventBus from 'eventing-bus'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import ReactTable from 'react-table';
import ReactTooltip from 'react-tooltip'
import NotificationAlert from "react-notification-alert";
// import ExportToExcel from "./ExportToExcel"
import Cheque from './Cheque.js';
// import Cash from './Cash.js';
import Online from './Online.js';
import 'react-table/react-table.css'
// import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import "./dealer.css"
// import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import {
  FormGroup, Label,
   Form,
   // Card,
   // Table,
   // Row,
   Col,
   // Nav,
   Button,
   Input
} from "reactstrap";
// import { Link } from "react-router-dom";
var request = require("request");
// const url = global.baseUrl
// const url = "http://localhost:1338"

// var totalPrice=''
var listOfOption=[]
var valueOfAllCustomer=''
var selectedCustomer =[]
let urlPrams='';
var listOfOptionOfTrucks=[]
var valueOfAllTrucks=''
var selectedTrucks=[]
var fromLocationArray=[]



// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class Dealer extends React.Component {
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
      time=3
    }
    else {
      type="danger"
      time=2
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
  getAllTrucksApiCall=e=>{
    var options = { method: 'POST',
        url: global.baseUrl + '/api/getAllTrucksInfo',
        headers: {'Authorization': localStorage.getItem("token") },
       // body:data,
        json: true
      };
  console.log("options of Get ALL Trucks ", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error", error);
  this.message="Something Went Wrong .."
  this.notify("tc",false);
  this.setState({
      disableAlert:false
  })
        }
        else
        {
          console.log("Respone in Get ALL Trucks", response);   
  this.setState({
      disableSelectField:false
  })
            listOfOptionOfTrucks = response.body.result;
              selectedTrucks=[]
            listOfOptionOfTrucks.forEach((item, index)=>{
               valueOfAllTrucks=JSON.stringify(item);
              selectedTrucks.push(<option key ={index} value = {valueOfAllTrucks}>{item.registrationNumber}</option>)
            })
              this.setState({
                trucksOption:selectedTrucks
              })

           console.log("array " , listOfOptionOfTrucks);


         // if(body.success){
         //   console.log("success :: ", body)
         //
         // }
         // else {
         //   console.log("success false :: ", body);
         // }
        }
      })

  }
  getAllLocationApiCall=e=>{
    var options = { method: 'POST',
        url: global.baseUrl + '/api/getAllTrucksInfo',
        headers: {'Authorization': localStorage.getItem("token") },
       // body:data,
        json: true
      };
  console.log("options of Get ALL Location ", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error", error);
  // this.message="Oops (404) - Please Check Your Internet Connection"
  // this.notify("tc",false);
  // this.setState({
  //     disableAlert:false
  // })
        }
        else
        {
          console.log("Respone in Get ALL Location", response);   
  this.setState({
      disableSelectField:false
  })
  fromLocationArray=[]
  response.body.enum.areaFrom.forEach((item, index)=>{
     // valueOfAllTrucks=JSON.stringify(item);
    fromLocationArray.push(<option key ={index} value = {item}>{item}</option>)
  })
  this.setState({
    fromTrucksOptionLocation:fromLocationArray
  })


            listOfOptionOfTrucks = response.body.enum.area;
              selectedTrucks=[]
            listOfOptionOfTrucks.forEach((item, index)=>{
               // valueOfAllTrucks=JSON.stringify(item);
              selectedTrucks.push(<option key ={index} value = {item}>{item}</option>)
            })
              this.setState({
                trucksOptionLocation:selectedTrucks
              })

           console.log("array " , listOfOptionOfTrucks);


         // if(body.success){
         //   console.log("success :: ", body)
         //
         // }
         // else {
         //   console.log("success false :: ", body);
         // }
        }
      })

  }
  getAllDealerApiCall=e=>{
    var data={
      isDeleted:false
    }
    var options = { method: 'POST',
        url: global.baseUrl + '/api/getAllDealers',
        headers: {'Authorization': localStorage.getItem("token") },
       body:data,
        json: true
      };
  console.log("options of Get ALL Dealer ", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error", error);
  // this.message="Oops (404) - Please Check Your Internet Connection"
  // this.notify("tc",false);
  // this.setState({
  //     disableAlert:false
  // })
        }
        else
        {
          console.log("Respone in Get ALL Dealer", response);   
  this.setState({
      disableSelectField:false
  })

           listOfOption = response.body.result;
           if(listOfOption.length<=0){
             this.message=`No Dealer Found`
                  this.notify("tc",false);
           }
           else{
             selectedCustomer=[]
             listOfOption.forEach((item, index)=>{
            // if(item.isDeleted === false){
              console.log("isDeleted" , item.isDeleted);

              if (item.buisnessName === '') {
                item.buisnessName = '-'
              }
               valueOfAllCustomer=JSON.stringify(item);
              selectedCustomer.push(<option key ={index} value = {valueOfAllCustomer}>{item.name} ({item.buisnessName})</option>)
            // }
            // else{
            //   console.log("isDeleted  else");
            // }
             })
               this.setState({
                 DealerOption:selectedCustomer
               })


             console.log("array " , listOfOption);


           // if(body.success){
           //   console.log("success :: ", body)
           //
           // }
           // else {
           //   console.log("success false :: ", body);
           // }
           }

        }
      })

  }

  onClickSave=e=>{
    this.setState({
        disableAlert:true
    })
    e.preventDefault();
    console.log("SAved CLICKED");
  if(this.state.deliveryType==="Permit"){
    var data={
          date:this.state.date,
          deliveryDate:this.state.date,
         user_id:this.state.dealerId,
         deliveryType:this.state.deliveryType,
         deliveryItemType:this.state.bagsOrBulk,
         quantity:parseInt(this.state.amountOfBags),
         // biltyNumber:'12345678',
         // truckNumber:this.state.truckId,
        rate:this.state.rate,
         totalAmount:this.state.orderPrice,
         address:this.state.toLocation,
         fromAddress:this.state.fromLocation
            }
    console.log("address" ,data.address );
    if(data.user_id===''){
      this.message='Please Select Dealer'
           this.notify("tc",false);
           this.setState({
             disableAlert:''
           })
                         }

    else if (data.quantity===0 || Number.isNaN(data.quantity)) {
      this.message='Please Enter Quantity'
           this.notify("tc",false);
           this.setState({
             disableAlert:''
           })
    }
    else if (data.quantity<0) {
      this.message='You are Entering Negative Quantity'
           this.notify("tc",false);
           this.setState({
             disableAlert:''
           })
    }



      // else if (data.biltyNumber == '' ) {
      //     console.log("if .....................................");
      //   this.message='Please Enter Bilty No'
      //        this.notify("tc",false);
      //        this.setState({
      //          disableAlert:''
      //        })
      // }
      // else if (data.truckNumber == '' ) {
      //     console.log("else .....................................");
      //   this.message='Please Select Truck'
      //        this.notify("tc",false);
      //        this.setState({
      //          disableAlert:''
      //        })
      // }
      else if (data.address===undefined) {
        console.log("next ............");
        this.message='Please Select Location (To)'
             this.notify("tc",false);
             this.setState({
               disableAlert:''
             })
      }
      else if (data.fromAddress===undefined) {
        this.message='Please Select Location (From)'
             this.notify("tc",false);
             this.setState({
               disableAlert:''
             })
      }

    else{
      var options = { method: 'POST',
          url: global.baseUrl + '/api/createDealerDeliveryOrder',
          headers: {'Authorization': localStorage.getItem("token") },
         body:data,
          json: true
        };
    console.log("options of Dealer devlivery order", options);
        request(options, (error, response, body) =>

        {
          if (error)
          {
            console.log("Error", error);
    // this.message="Oops (404) - Please Check Your Internet Connection"
    // this.notify("tc",false);
    // this.setState({
    //     disableAlert:false
    // })
          }
          else
          {
            console.log("Respone in Dealer devlivery order", response); 
    this.setState({
        disableAlert:false
    })
    if(response.body.success){
    this.message='Order Created Successfully'
        this.notify("tc",true);

        setTimeout(()=>{
          this.message= 'Please Go To Delivery History Section To View Your Order(s)'
          this.notify("br",true);

        },3000)
         EventBus.publish("OrderCreatedEventBuss",true)
         this.setState({
           disableAlert:false,
       pageToLoadEnable2:true,
       pageToLoad2:'',
       modalCollection: false,
       dropdownOpen: false,
       dues:'PKR -20,000',
       orderPrice:0,
       pageToLoad1:'',
       amountOfBags:0,
         dealerCode:'Dealer Code',
       tons:0,
       rate:590,
       deliveryType:'Delivered',
       pageToLoad3:'',
       bagsOrBulk:'Bags',
       biltyNo:'',
       truckNo:'',
  DealerOption:'',
  trucksOption:'',
  trucksOptionLocation:'',
  fromTrucksOptionLocation:''
         })
         this.getAllDealerApiCall();
         this.getAllTrucksApiCall();
         this.getAllLocationApiCall();
      }
        else{
          this.message=response.body.error._message
            this.notify("tc",false)
        }
           // if(body.success){
           //   console.log("success :: ", body)
           // }
           // else {
           //   console.log("success false :: ", body);
           // }
          }
        })
    }
  }
  else{
     data={
          date:this.state.date,
          deliveryDate:this.state.date,
         user_id:this.state.dealerId,
         deliveryType:this.state.deliveryType,
         deliveryItemType:this.state.bagsOrBulk,
         quantity:parseInt(this.state.amountOfBags),
         biltyNumber:this.state.biltyNo,
         truckNumber:this.state.truckId,
        rate:this.state.rate,
         totalAmount:this.state.orderPrice,
         address:this.state.toLocation,
         fromAddress:this.state.fromLocation
            }
    console.log("address" ,data.address );
    if(data.user_id===''){
      this.message='Please Select Dealer'
           this.notify("tc",false);
           this.setState({
             disableAlert:''
           })
                         }

    else if (data.quantity===0 || Number.isNaN(data.quantity)) {
      this.message='Please Enter Quantity'
           this.notify("tc",false);
           this.setState({
             disableAlert:''
           })
    }
    else if (data.quantity<0) {
      this.message='You are Entering Negative Quantity'
           this.notify("tc",false);
           this.setState({
             disableAlert:''
           })
    }



      else if (data.biltyNumber === '' ) {
          console.log("if .....................................");
        this.message='Please Enter Bilty No'
             this.notify("tc",false);
             this.setState({
               disableAlert:''
             })
      }
      else if (data.truckNumber === '' ) {
          console.log("else .....................................");
        this.message='Please Select Truck'
             this.notify("tc",false);
             this.setState({
               disableAlert:''
             })
      }
      else if (data.address===undefined) {
        console.log("next ............");
        this.message='Please Select Location (To)'
             this.notify("tc",false);
             this.setState({
               disableAlert:''
             })
      }
      else if (data.fromAddress===undefined) {
        this.message='Please Select Location (From)'
             this.notify("tc",false);
             this.setState({
               disableAlert:''
             })
      }

    else{
       options = { method: 'POST',
          url: global.baseUrl + '/api/createDealerDeliveryOrder',
          headers: {'Authorization': localStorage.getItem("token") },
         body:data,
          json: true
        };
    console.log("options of Dealer devlivery order", options);
        request(options, (error, response, body) =>

        {
          if (error)
          {
            console.log("Error", error);
    // this.message="Oops (404) - Please Check Your Internet Connection"
    // this.notify("tc",false);
    // this.setState({
    //     disableAlert:false
    // })
          }
          else
          {
            console.log("Respone in Dealer devlivery order", response); 
    this.setState({
        disableAlert:false
    })
    if(response.body.success){
    this.message='Order Created Successfully'
        this.notify("tc",true);

        setTimeout(()=>{
          this.message= 'Please Go To Delivery History Section To View Your Order(s)'
          this.notify("br",true);

        },3000)
         EventBus.publish("OrderCreatedEventBuss",true)
         this.setState({
           disableAlert:false,
       pageToLoadEnable2:true,
       pageToLoad2:'',
       modalCollection: false,
       dropdownOpen: false,
       dues:'PKR -20,000',
       orderPrice:0,
       pageToLoad1:'',
       amountOfBags:0,
         dealerCode:'Dealer Code',
       tons:0,
       rate:590,
       deliveryType:'Delivered',
       pageToLoad3:'',
       bagsOrBulk:'Bags',
       biltyNo:'',
       truckNo:'',
  DealerOption:'',
  trucksOption:'',
  trucksOptionLocation:'',
  fromTrucksOptionLocation:''
         })
         this.getAllDealerApiCall();
         this.getAllTrucksApiCall();
         this.getAllLocationApiCall();
      }
        else{
          this.message=response.body.error._message
            this.notify("tc",false)
        }
           // if(body.success){
           //   console.log("success :: ", body)
           // }
           // else {
           //   console.log("success false :: ", body);
           // }
          }
        })
    }
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
    }}
    // componentWillMount(){
    //     this.getAllDealerApiCall();
    // }

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
      this.setState({
          disableSelectField:true
      })
      this.getAllLocationApiCall();
      this.message=''
      console.log("DID Mount");
       this.getAllDealerApiCall();
           this.getAllTrucksApiCall();
      EventBus.on("saveCashEventBus",this.saveCashEventBusFunc );
        EventBus.on("saveBankEventBus",this.saveBankEventBusFunc );
        // this.setState((state, props) => {
        // return {counter: 0 + props.step};
        //        });
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
      date:new Date(),
          disableAlert:false,
          fromTrucksOptionLocation:'',
          truckNo:'',
      pageToLoadEnable2:true,
          disableSelectField:false,
      DealerOption:[],
      dealerId:'',
      pageToLoad2:'',
      modalCollection: false,
      dropdownOpen: false,
      dues:'PKR -20,000',
      orderPrice:0,
      pageToLoad1:'',
      amountOfBags:0,
        dealerCode:'Dealer Code',
      tons:0,
      rate:590,
      deliveryType:'Delivered',
      pageToLoad3:'',
      bagsOrBulk:'Bags',
      biltyNo:'',
      address:'',
      truckId:'',
      trucksOption:''

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
       pageToLoad1:'',

     })
   }
   if(e==='2'){
   this.setState({
     pageToLoad2:'',

   })
 }
 if(e==='3'){
 this.setState({
   pageToLoad3:'',

 })
}



   }
   onClickCheque=e=>{
     console.log("cheque here");
     if(e==="1"){
       this.setState({
         pageToLoad1: <Cheque/>,
         // pageToLoad2:'',
         //   pageToLoad3:''
       })
     }
     else if(e==="2")
     {
       this.setState({
       pageToLoad2: <Cheque/>,
       // pageToLoad1:'',
       //   pageToLoad3:''
      })

     //  this.setState({
     //  pageToLoadEnable2:false
     // })

    }
    else if(e==="3")
    {
      this.setState({
      // pageToLoad2: '',
      // pageToLoad1:'',
      pageToLoad3:<Cheque/>,

     })

   }
   }
   onClickOnline=e=>{
     console.log("online here");
     if(e==="1"){
       this.setState({
         pageToLoad1: <Online/>,
            // pageToLoad2:'',
            //  pageToLoad3:''
       })
     }
     if(e==="2")
     {
       this.setState({
         pageToLoad2: <Online/>,
          // pageToLoad1:'',
          //  pageToLoad3:''
       })
     }
     if(e==="3")
     {
       this.setState({
         // pageToLoad2:'',
         //  pageToLoad1:'',
          pageToLoad3:<Online/>

       })
     }

   }
   onChangeAmountOfBags=e=>{
         console.log("Changing Amont" ,e.target.value );
         console.log("value of ratee is ",this.state.rate);
     this.setState({
       amountOfBags:e.target.value,


      orderPrice:(e.target.value)*this.state.rate
     })
   }
   onChangeBiltyNo=e=>{
     this.setState({
        biltyNo:e.target.value
     })
   }
   // onChangeTruckNo=e=>{
   //   this.setState({
   //      truckNo:e.target.value
   //   })
   // }
   onChangeTruck=e=>{
     console.log("name changing" , e.target.value );
     this.setState({
        truckId:JSON.parse(e.target.value)._id
     })

   }
   onChangeTruckLocation=e=>{
     console.log("location in onChange Function" , e.target.value );
     this.setState({
          [e.target.name]:e.target.value
     })
   }
   onChangeRateFunc=e=>{
    this.setState({
        rate:e.target.value
    })

       this.handleOrdePrice(e.target.value)

   }

   handleOrdePrice=(e)=>{
     console.log("order amountt here 2nd",parseInt(e),this.state.rate);
     this.setState({

            orderPrice:this.state.amountOfBags*e

     })
     console.log("orderPrice :: ", this.state.orderPrice);
   }
   oChangeDeliveredOrPermit=e=>{
     console.log("Onchange func called" , e.target.value);
     this.setState({
       deliveryType:e.target.value
     })
   }
   onChangeBagsOrBulk=e=>{
     console.log("Onchange func called");
     this.setState({
       bagsOrBulk:e.target.value,
          orderPrice:0,
          tons:0,
          amountOfBags:0

     })

   }
   onClickCustomer=e=>{
 console.log("Getting Value of full OPTION " ,e.target.value);

   this.setState({
     dealerCode:JSON.parse(e.target.value).code,
     address:e.target.value.address,
     dealerId:JSON.parse(e.target.value)._id,
     rate:JSON.parse(e.target.value).rate
   })
     console.log("Dealer CLICKED");
   }
   onChangeTon=e=>{
     console.log(e.target.value);
     this.setState({


       tons:e.target.value,

       orderPrice:(e.target.value)*this.state.rate

     })
   }
   onChangeName=e=>{
     console.log("name changing");

     this.setState({
        name:e.target.value,
        dealerCode:JSON.parse(e.target.value).code,
        address:e.target.value.address,
        dealerId:JSON.parse(e.target.value)._id
     })
     this.setState((state, props) => {
      return {counter: 0 + props.step};
             });
   }
   func=e=>{
    console.log("GGG");

   }
   onClickNewDealer=e=>{

     console.log("onClickNewDealer" , this.props);
      urlPrams= '/home/customermanagement/' + 'dealer';
       this.props.props.history.push(urlPrams);
       // window.location.href=('/home/user-management');

   }
   onClickTruck=e=>{
console.log("Value of Adresss ..................." ,e.target.value);
   console.log("value of selected option" , JSON.parse(e.target.value));
   this.setState({
truckNo:JSON.parse(e.target.value).registrationNumber

   })
     console.log("truck CLICKED");
   }
   onClickTruckLocation=e=>{
console.log("Value of Adresss ..................." ,e.target.value);
   console.log("value of selected option" , JSON.parse(e.target.value));
   this.setState({
truckLocation:JSON.parse(e.target.value).registrationNumber

   })
     console.log("truck CLICKED");
   }
   onChangeDate=e=>{
     this.setState({
       date:e
     })
   }

  render(){
    console.log("Render");
    console.log(" customer Pushed here" , selectedCustomer);
  console.log("VALUE OF RESPONSE" , listOfOption);
  console.log("NEW VALUE of Dealer Option" , this.state.DealerOption);
    return (
        <div  className="content">
          <ReactTooltip type='info' effect='solid'/>
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        <Form >
        <FormGroup row>
          <Label sm={2}>Dealer Code</Label>
          <Col sm={3}>
               <Input readOnly onChange={this.onChangeDealerCode}value={this.state.dealerCode} placeholder="Code"  />
          </Col>
          <Col sm={2}>
               <Button color='info'  style={{marginLeft:'63px' , padding:'10px' , width:'131px'}} onClick={this.onClickNewDealer}>Add New Dealer</Button>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label sm={2}>Delivery Date</Label>
          <Col className='date' sm={3}>
          <DatePicker className='datePickerCashManagement'
                     selected={this.state.date}
                     onChange={this.onChangeDate}
                   />          </Col>
        </FormGroup>
        <FormGroup row>
        <Label data-tip="Mandatory Row" for="search" sm={2}>Dealer <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
        <Col sm={4}>
          <select style={{width:'71%'}} className='input' onClick={this.onClickCustomer} onChange={this.onChangeName} >
                {
                  (this.state.disableSelectField) &&
                  <option disabled selected hidden>
              Loading, Please Wait..
                  </option>
          }
            <option selected hidden>Select Dealer</option>
                        {this.state.DealerOption}
          </select>
        </Col>
        </FormGroup>
<hr/>
<FormGroup row>
<Label for="search" sm={2}>Type</Label>
<Col  sm={2}>
<Input type="select" name="select" id="typeOfDelivery" className="typeOfDelivery"onChange={this.oChangeDeliveredOrPermit} value={this.state.deliveryType}>
  <option value='Delivered'>Delivered</option>
  <option value="Permit">Permit</option>
</Input>
</Col>

<Col  sm={2}>
<Input type="select" name="select" id="exampleSelect" onChange={this.onChangeBagsOrBulk}value={this.state.bagsOrBulk}>
  <option >Bulk</option>
  <option value='Bags'>Bags</option>
</Input>
</Col>
</FormGroup>
<div style={{clear:'both'}}></div>
{(this.state.bagsOrBulk ==='Bags') ?
<FormGroup row>
<Label data-tip="Mandatory Row" for="bagsDelivered" sm={2}>Bags Delivered <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
 <Col sm={2}>
  <Label data-tip="Mandatory Field">No of Bags <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
    <Input min="0" type="number" value={this.state.amountOfBags} onChange={this.onChangeAmountOfBags} placeholder="e.g 500 Bags" />
  </Col>
  {(this.state.deliveryType==="Permit")
    ?
    ''
    :
    <div style={{display:'flex'}} >
    <Col>
     <Label data-tip="Mandatory Field">Bilty No <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
       <Input type="text" value={this.state.biltyNo} onChange={this.onChangeBiltyNo} placeholder="Bilty No." />
     </Col>
     <div style={{display:'flex', flexDirection:'column' , marginLeft:'20px'}}>
        <Label data-tip="Mandatory Field">Truck No <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
     <select style={{width:"176px",height:'38px' ,maxWidth:'147px'}} className='input' onClick={this.onClickTruck} onChange={this.onChangeTruck}>
          {
            (this.state.disableSelectField) &&
            <option disabled selected hidden>
        Loading, Please Wait..
            </option>
    }
                           <option selected hidden>
                   Select Truck
                        </option>
                                    {this.state.trucksOption}
     </select>
      </div>
      </div>
  }

    <div style={{display:'flex', flexDirection:'column', marginLeft:'20px'}}>
       <Label data-tip="Mandatory Field">Destination <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
    <select style={{width:"176px",height:'38px',maxWidth:'147px'}}  name='toLocation' className='input' onClick={this.onClickTruckLocation} onChange={this.onChangeTruckLocation}>
         {
           (this.state.disableSelectField) &&
           <option disabled selected hidden>
       Loading, Please Wait..
           </option>
   }
                          <option selected hidden>
                        To
                       </option>
                                   {this.state.trucksOptionLocation}
    </select>
     </div>
     <div style={{display:'flex', flexDirection:'column', marginLeft:'20px'}}>
        <Label data-tip="Mandatory Field">Brand <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
     <select style={{width:"176px",height:'38px',maxWidth:'147px'}} name='fromLocation' className='input' onClick={this.onClickTruckLocation} onChange={this.onChangeTruckLocation}>
          {
            (this.state.disableSelectField) &&
            <option disabled selected hidden>
        Loading, Please Wait..
            </option>
    }
                           <option selected hidden>
                  From
                        </option>
                                    {this.state.fromTrucksOptionLocation}
     </select>
      </div>
  </FormGroup>
    :
  <FormGroup row>
    <Label for="bagsDelivered" sm={2}>Bulk Delivered </Label>
  <Col sm={2}>

  <Label>Tons</Label>
    <Input min="0" type="number"  value={this.state.amountOfBags} onChange={this.onChangeAmountOfBags}  onClick={this.onClickTons}placeholder="e.g 5 Tons" />

  </Col>
  {(this.state.deliveryType==="Permit")
    ?
    ''
    :
    <div style={{display:'flex'}}>
    <Col>
     <Label data-tip="Mandatory Row">Bilty No <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
       <Input type="text" value={this.state.biltyNo} onChange={this.onChangeBiltyNo} placeholder="Bilty No." />

     </Col>
     <div style={{display:'flex', flexDirection:'column', marginLeft:'20px'}}>
        <Label data-tip="Mandatory Row">Truck No <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
     <select style={{width:"176px",height:'38px',maxWidth:'147px'}}className='input' onClick={this.onClickTruck} onChange={this.onChangeTruck}>
          {
            (this.state.disableSelectField) &&
            <option disabled selected hidden>
        Loading, Please Wait..
            </option>
    }
                           <option selected hidden>
                   Select Truck
                        </option>
                                    {this.state.trucksOption}
     </select>
      </div></div>
  }

    <div style={{display:'flex', flexDirection:'column', marginLeft:'20px'}}>
       <Label data-tip="Mandatory Row">Destination <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
    <select style={{width:"176px",height:'38px',maxWidth:'147px'}} className='input' name='toLocation' onClick={this.onClickTruckLocation} onChange={this.onChangeTruckLocation}>
         {
           (this.state.disableSelectField) &&
           <option disabled selected hidden>
       Loading, Please Wait..
           </option>
   }
                          <option selected hidden>
                    To
                       </option>
                                   {this.state.trucksOptionLocation}
    </select>
     </div>
     <div style={{display:'flex', flexDirection:'column', marginLeft:'20px'}}>
        <Label data-tip="Mandatory Row">Brand <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
     <select style={{width:"176px",height:'38px',maxWidth:'147px'}} className='input' name='fromLocation' onClick={this.onClickTruckLocation} onChange={this.onChangeTruckLocation}>
          {
            (this.state.disableSelectField) &&
            <option disabled selected hidden>
        Loading, Please Wait..
            </option>
    }
                           <option selected hidden>
                      From
                        </option>
                                    {this.state.fromTrucksOptionLocation}
     </select>
      </div>
  </FormGroup>
}
<FormGroup row>
<Label for="rate" sm={2}>Rate (PKR)</Label>
<Col sm={2}>
  <Input min="0" className="bold" type="number" name="rate" id="rate" value= {this.state.rate} onChange={(value)=>this.onChangeRateFunc(value)}  placeholder=""/>
</Col>
</FormGroup>
<FormGroup row>
<Label for="orderPrice" sm={2}>Order Price (PKR)</Label>
<Col sm={2}>
  <Input style={{border:'transparent',
    borderRadius: '0px',
    borderBottom: 'solid 1px'}}type="text" name="orderPrice" id="orderPrice" value={(this.state.orderPrice).toLocaleString('en-IN')} placeholder="" />
</Col>
</FormGroup>
<FormGroup check row>
<Col sm={{ size: 10, offset: 2 }}>
  <Button color='info' onClick = {this.onClickSave} disabled={this.state.disableAlert}>
  {
  (this.state.disableAlert) ?
  <i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>
  :  <span style={{display:'flex' , justifyContent:'center'}}> <span>Save</span></span>
  }

  </Button>
</Col>
</FormGroup>
 </Form>


        </div>

    );
  }
}

export default Dealer;
