import React from "react";
import EventBus from 'eventing-bus'
import DatePicker from "react-datepicker";
import ReactTooltip from 'react-tooltip'
import "react-datepicker/dist/react-datepicker.css";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import ReactTable from 'react-table';
// import ExportToExcel from "./ExportToExcel"
import NotificationAlert from "react-notification-alert";
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
var listOfOption=[]
var listOfOptionOfTrucks=[]
var valueOfAllCustomer=''
var valueOfAllTrucks=''
var selectedCustomer =[]
var selectedTrucks=[]
var arrayOfPaymentForApiCall=[]
let urlPrams=''
var fromLocationArray=[]
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class Enduser extends React.Component {
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
      time=4
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
              {
                this.message
              }
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
  paymentApiCall=e=>{
    console.log("IN paymentApiCall" ,this.state.remarksArray);
    for(var i=1;i<this.state.amountArray.length;i++)
    {
      // console.log(this.state.newChequeValue[i]);

      arrayOfPaymentForApiCall.push(
         {
           user_id:this.state.idOfUser,
           remarks:this.state.remarksArray[i],
           amount:this.state.amountArray[i],
           paymentType:'cash',
           collectedBy:this.state.truckDriverName
           // chequeNumber:this.state.newChequeValue[i],
           //   chequeDate:this.state.date,
             // draftNumber:this.state.newOnlineValue[i],
             // draftDate:this.state.draftDate
         }
       )
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>", arrayOfPaymentForApiCall);


      var data={
           arrayOfPayments:arrayOfPaymentForApiCall
      }
        var options = { method: 'POST',
            url: global.baseUrl + '/api/createPayment',
            headers: {'Authorization': localStorage.getItem("token") },
             body:data,
            json: true
          };
      console.log("options of PaymentS in End User", options);
          request(options, (error, response, body) =>
          {
            if (error)
            {
        // this.message="Oops (404) - Please Check Your Internet Connection"
        // this.notify("tc",false);
        // this.setState({
        //     disableAlert:false
        // })
              console.log("Error", error);
            }
            else
            {
              console.log("Respone of PaymentS in End User", response);
              if(response.body.failed===0)  {
                this.message=`${response.body.completed}Payment(s) Created Successfully`
                     this.notify("tc",true);
              }
            else{
                this.message=`${response.body.failed} Payment(s) Failed`
              }
             //               listOfOption = response.body.result;
             //            selectedCustomer=[]
             //            listOfOption.forEach((item, index)=>{
             //               valueOfAllCustomer=JSON.stringify(item);
             //
             //              selectedCustomer.push
             //               (<option key ={index} value={item._id}>{item.name}</option>)
             //            })
             //            this.setState({
             //              bankOption:selectedCustomer
             //            })
             //              response.body.result.map((i,data)=>{
             //                console.log("EAch Value" , i);
             //                valueOfAllCustomer=JSON.stringify(i);
             //                listOfOption.push
             //                (<option key ={i._id} value = {valueOfAllCustomer}>{i.name}</option>)
             //              })
             //              console.log("Array of Pushed Banks " , listOfOption);
             //
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
  onClickSave=e=>{
    console.log("value of tons.............................."  , this.state.tons);
    this.setState({
        disableAlert:true
    })
    if(this.state.cashOnDelivery === 'Yes'){
        this.paymentApiCall();
    }
    e.preventDefault();
    console.log("SAved CLICKED");
      if(this.state.deliveryType==="Permit"){
    var data={
      date:this.state.date,
      deliveryDate:this.state.date,
          user_id:this.state.userId,
         deliveryType:this.state.deliveryType,
         deliveryItemType:this.state.bagsOrBulk,
         quantity:parseInt(this.state.amountOfBags),
         // biltyNumber:'12345678',
         // truckNumber:this.state.truckId,
        rate:this.state.rate,
         totalAmount:this.state.orderPrice,
         address:this.state.toLocation,
         fromAddress:this.state.fromLocation,
         // address:this.state.address,
         // mobile:parseInt(this.state.phone),
         // careOf:this.state.co
    }
    if(data.user_id===''){
      this.message='Please Select End User'
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
      this.message='You Are Entering Negative Quantity'
           this.notify("tc",false);
           this.setState({
             disableAlert:''
           })
    }
    else if (data.address===undefined) {
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

    else if (data.biltyNumber==='') {
        this.message='Please Enter Bilty No'
             this.notify("tc",false);
             this.setState({
               disableAlert:''
             })
      }
      else if (data.truckNumber==='') {
        this.message='Please Select Truck'
             this.notify("tc",false);
             this.setState({
               disableAlert:''
             })
      }
      else if (data.address==='') {
        this.message='Please Select Location (To)'
             this.notify("tc",false);
             this.setState({
               disableAlert:''
             })
      }
      else if (data.fromAddress==='') {
        this.message='Please Select Location (From)'
             this.notify("tc",false);
             this.setState({
               disableAlert:''
             })
      }
      else{
          var options = { method: 'POST',
              url: global.baseUrl + '/api/createEnduserDeliveryOrder',
              headers: {'Authorization': localStorage.getItem("token") },
             body:data,
              json: true
            };
        console.log("options of end user devlivery order", options);
            request(options, (error, response, body) =>

            {
              if (error)
              {
          this.message="Something Went Wrong .."
          this.notify("tc",false);
          this.setState({
              disableAlert:false
          })
                console.log("Error", error);

              }
              else
              {
                console.log("Respone in end user devlivery order", response);  
        this.setState({
          remarksArray:[],
          amountArray:[],
          remarks1:'',
              remarks2:'',
                  remarks3:'',
                      remarks4:'',
          amount1:'' ,
              amount2:'' ,
                  amount3:'' ,
                      amount4:'' ,
            disableAlert:false,
          name:'',
            newAddedPayments:[],
          co:'',
          phone:'',
           address:'',
          dealerCode:'End User Code',
          pageToLoadEnable2:true,
          pageToLoad2:'',
          modalCollection: false,
          dropdownOpen: false,
          dues:'PKR -20,000',
          orderPrice:0,
          pageToLoad1:'',
          amountOfBags:0,
          tons:0,
          rate:590,
          deliveryType:'Delivered',
          pageToLoad3:'',
          bagsOrBulk:'Bags',
          cashOnDelivery:'No',
          paymentArray:[],
          biltyNo:'',
          truckNo:'',
          fromLocation:'',
          toLocation:''

        })
        if(response.body.success)  
      {  this.message='Order Created Successfully'
            this.notify("tc",true);
               EventBus.publish("OrderCreatedEventBuss",true)
               setTimeout(()=>{
                 this.message= 'Please Go To Delivery History Section To View Your Order(s)'
                 this.notify("br",true);

               },3000)
          this.setState({

            name:'',

              newAddedPayments:[],
            co:'',
            phone:'',
             address:'',
            dealerCode:'End User Code',
            pageToLoadEnable2:true,
            pageToLoad2:'',
            modalCollection: false,
            dropdownOpen: false,
            dues:'PKR -20,000',
            orderPrice:0,
            pageToLoad1:'',
            amountOfBags:0,
            tons:0,
            rate:590,
            deliveryType:'Delivered',
            pageToLoad3:'',
            bagsOrBulk:'Bags',
            cashOnDelivery:'No',
            paymentArray:[],
            biltyNo:'',
            truckNo:'',
            customerOption:'',
            trucksOption:'',
            trucksOptionLocation:''
          })
          this.getAllCustomerApiCall();
          this.getAllTrucksApiCall();
          this.getAllLocationApiCall();
          }
            else{
              this.message=response.body.message
                this.notify("tc",false)
            }
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

  }
  else{
    var data={
      date:this.state.date,
      deliveryDate:this.state.date,
          user_id:this.state.userId,
         deliveryType:this.state.deliveryType,
         deliveryItemType:this.state.bagsOrBulk,
         quantity:parseInt(this.state.amountOfBags),
         biltyNumber:this.state.biltyNo,
         truckNumber:this.state.truckId,
        rate:this.state.rate,
         totalAmount:this.state.orderPrice,
         address:this.state.toLocation,
         fromAddress:this.state.fromLocation,
         // address:this.state.address,
         // mobile:parseInt(this.state.phone),
         // careOf:this.state.co
    }
    if(data.user_id===''){
      this.message='Please Select End User'
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
      this.message='You Are Entering Negative Quantity'
           this.notify("tc",false);
           this.setState({
             disableAlert:''
           })
    }
    else if (data.address===undefined) {
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

      else if (data.biltyNumber==='') {
        this.message='Please Enter Bilty No'
             this.notify("tc",false);
             this.setState({
               disableAlert:''
             })
      }
      else if (data.truckNumber==='') {
        this.message='Please Select Truck'
             this.notify("tc",false);
             this.setState({
               disableAlert:''
             })
      } else if (data.address==='') {
            this.message='Please Select Location (To)'
                 this.notify("tc",false);
                 this.setState({
                   disableAlert:''
                 })
          }
          else if (data.fromAddress==='') {
            this.message='Please Select Location (From)'
                 this.notify("tc",false);
                 this.setState({
                   disableAlert:''
                 })
          }
      else{
          var options = { method: 'POST',
              url: global.baseUrl + '/api/createEnduserDeliveryOrder',
              headers: {'Authorization': localStorage.getItem("token") },
             body:data,
              json: true
            };
        console.log("options of end user devlivery order", options);
            request(options, (error, response, body) =>

            {
              if (error)
              {
          this.message="Something Went Wrong .."
          this.notify("tc",false);
          this.setState({
              disableAlert:false
          })
                console.log("Error", error);

              }
              else
              {
                console.log("Respone in end user devlivery order", response);  
        this.setState({
          remarksArray:[],
          amountArray:[],
          remarks1:'',
              remarks2:'',
                  remarks3:'',
                      remarks4:'',
          amount1:'' ,
              amount2:'' ,
                  amount3:'' ,
                      amount4:'' ,
            disableAlert:false,
          name:'',
            newAddedPayments:[],
          co:'',
          phone:'',
           address:'',
          dealerCode:'End User Code',
          pageToLoadEnable2:true,
          pageToLoad2:'',
          modalCollection: false,
          dropdownOpen: false,
          dues:'PKR -20,000',
          orderPrice:0,
          pageToLoad1:'',
          amountOfBags:0,
          tons:0,
          rate:590,
          deliveryType:'Delivered',
          pageToLoad3:'',
          bagsOrBulk:'Bags',
          cashOnDelivery:'No',
          paymentArray:[],
          biltyNo:'',
          truckNo:'',
          fromLocation:'',
          toLocation:''

        })
        if(response.body.success)  
      {  this.message='Order Created Successfully'
            this.notify("tc",true);
               EventBus.publish("OrderCreatedEventBuss",true)
               setTimeout(()=>{
                 this.message= 'Please Go To Delivery History Section To View Your Order(s)'
                 this.notify("br",true);

               },3000)
          this.setState({

            name:'',

              newAddedPayments:[],
            co:'',
            phone:'',
             address:'',
            dealerCode:'End User Code',
            pageToLoadEnable2:true,
            pageToLoad2:'',
            modalCollection: false,
            dropdownOpen: false,
            dues:'PKR -20,000',
            orderPrice:0,
            pageToLoad1:'',
            amountOfBags:0,
            tons:0,
            rate:590,
            deliveryType:'Delivered',
            pageToLoad3:'',
            bagsOrBulk:'Bags',
            cashOnDelivery:'No',
            paymentArray:[],
            biltyNo:'',
            truckNo:'',
            customerOption:'',
            trucksOption:'',
            trucksOptionLocation:''
          })
          this.getAllCustomerApiCall();
          this.getAllTrucksApiCall();
          this.getAllLocationApiCall();
          }
            else{
              this.message=response.body.message
                this.notify("tc",false)
            }
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
  }
  }
  onChangeCO=e=>{
    console.log("Care off  Changing");
    this.setState({
       co:e.target.value
    })
  }
  onChangeName=e=>{
    console.log("name changing" , e.target.value );
    this.setState({
       userId:JSON.parse(e.target.value)._id,
          name:JSON.parse(e.target.value).name,
          dealerCode:JSON.parse(e.target.value).code,
          address:JSON.parse(e.target.value).address,
          co:JSON.parse(e.target.value).careOf,
          phone:JSON.parse(e.target.value).mobile,
          idOfUser:JSON.parse(e.target.value)._id
    })
    this.setState((state, props) => {
     return {counter: 0 + props.step};
            });

  }
  onChangeTruck=e=>{
    console.log("Truck Changing" ,JSON.parse(e.target.value).user_id);
    this.setState({
       truckId:JSON.parse(e.target.value)._id,
       truckDriverName:JSON.parse(e.target.value).user_id
    })
  }
  onChangeAddress=e=>{
    console.log("Address changing");
    this.setState({
      address:e.target.value
    })
  }
  onChangePhone=e=>{
    console.log("PHone number changing");
    this.setState({
      phone:e.target.value
    })
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
    componentWillMount(){
      console.log("will ******************************************************************");

    }
    getAllLocationApiCall=e=>{
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
      // this.message="Oops (404) - Please Check Your Internet Connection"
      // this.notify("tc",false);
      // this.setState({
      //     disableAlert:false
      // })
            console.log("Error", error);
          }
          else
          {
            console.log("Respone in Get ALL Trucks", response);   
    this.setState({
        disableSelectField:false
    })
    fromLocationArray=[]
    response.body.enum.areaFrom.forEach((item, index)=>{
       // valueOfAllTrucks=JSON.stringify(item);
      fromLocationArray.push(<option key ={index} value = {item}>{item}</option>)})
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
      this.message=''
      console.log("DID &");
      this.getAllLocationApiCall();

        this.getAllCustomerApiCall();
        this.getAllTrucksApiCall();
      this.paymentArray=[]
      this.setState((state, props) => {
      return {counter: 0 + props.step};
             });


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
    onChangeBiltyNo=e=>{
      this.setState({
         biltyNo:e.target.value
      })
    }

  constructor(props) {
    super(props);
      this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      date:new Date(),
      truckDriverName:'',
      fromTrucksOptionLocation:'',

              disableSelectField:false,
      remarksArray:[],
      idOfUser:'',
      userId:'',
      customerOption:'',
      amountArray:[],
      remarks1:'',
          remarks2:'',
              remarks3:'',
                  remarks4:'',
      amount1:'' ,
          amount2:'' ,
              amount3:'' ,
                  amount4:'' ,
        disableAlert:false,
      name:'',
        trucksOption:'',
        newAddedPayments:[],
      co:'',
      phone:'',
       address:'',
      dealerCode:'End User Code',
      pageToLoadEnable2:true,
      pageToLoad2:'',
      modalCollection: false,
      dropdownOpen: false,
      dues:'PKR -20,000',
      orderPrice:0,
      pageToLoad1:'',
      amountOfBags:0,
      tons:0,
      rate:590,
      deliveryType:'Delivered',
      pageToLoad3:'',
      bagsOrBulk:'Bags',
      cashOnDelivery:'No',
      paymentArray:[],
      biltyNo:'',
      truckNo:'',
      truckId:''


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

console.log('target value',e.target.value);
     this.setState({
       amountOfBags:e.target.value,

      orderPrice:(e.target.value)*this.state.rate
     })

   }


   onChangeRateFunc=e=>{
    this.setState({
        rate:e.target.value
    })
this.handleOrdePrice(e.target.value)

   }
   onChangeTruckNo=e=>{
     this.setState({
        truckNo:e.target.value
     })
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
console.log("Value of Adresss ..................." ,e.target.value);
   console.log("value of selected option" , JSON.parse(e.target.value));
   this.setState({
     dealerCode:JSON.parse(e.target.value).code,
     address:JSON.parse(e.target.value).address,
     co:JSON.parse(e.target.value).careOf,
     phone:JSON.parse(e.target.value).mobile,
     idOfUser:JSON.parse(e.target.value)._id,
     rate:JSON.parse(e.target.value).rate
   })
   setTimeout(()=>{
     console.log("Value of Phone " , this.state.phone);
     console.log("Value of address " , this.state.address);

     console.log("Value of care of " , this.state.co);

   },1000)
     console.log("CUSTOMER CLICKED");
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
   onChangeTruckLocation=e=>{
     console.log("location in onChange Function" , e.target.value );
     this.setState({
        [e.target.name]:e.target.value
     })

   }
   onChangeTon=e=>{
     console.log(e.target.value);
     this.setState({

       tons:e.target.value,

       orderPrice:(e.target.value)*this.state.rate

     })
   }
   onClickAddPaymentFunc=e=>{
     console.log("payment added",this.paymentArray.length);
     this.setState({
       newAddedPayments:[...this.state.newAddedPayments,'']
     })
   }


   getAllCustomerApiCall=e=>{
     var data={
       isDeleted:false
     }
     var options = { method: 'POST',
         url: global.baseUrl + '/api/getAllCustomers',
         headers: {'Authorization': localStorage.getItem("token") },
        body:data,
         json: true
       };
   console.log("options of Get ALL CUSTOMER ", options);
       request(options, (error, response, body) =>

       {
         if (error)
         {
     // this.message="Oops (404) - Please Check Your Internet Connection"
     // this.notify("tc",false);
     // this.setState({
     //     disableAlert:false
     // })
           console.log("Error", error);
         }
         else
         {
           console.log("Respone in Get ALL CUSTOMER", response);   
   this.setState({
       disableSelectField:false
   })
             listOfOption = response.body.result;
             if(listOfOption===undefined){
               this.message=`No End User Found`
                    this.notify("tc",false);
             }
             else{
               selectedCustomer=[]
             listOfOption.forEach((item, index)=>{
                valueOfAllCustomer=JSON.stringify(item);
               selectedCustomer.push(<option key ={index} value = {valueOfAllCustomer}>{item.name}</option>)})
               this.setState({
                 customerOption:selectedCustomer
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
     this.message="Something Went Wrong .."
     this.notify("tc",false);
     this.setState({
         disableAlert:false
     })
           console.log("Error", error);
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
                 trucksOption:selectedTrucks })

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


   onChangeCOD=e=>{
     this.setState({
       cashOnDelivery:e.target.value
     })
   }

   onChangeAmount=e=>{
     console.log("amount here"  , e.target.id  , e.target.value);
     if(e.target.id==='1'){
     // this.setState({
     //     amount1:e.target.value
     // })
     this.state.amountArray[e.target.id]=e.target.value
     this.setState({
       amountArray:this.state.amountArray
     })
   }
   if(e.target.id==='2'){
   this.setState({
   amount2:e.target.value

   })
   this.state.amountArray[e.target.id]=e.target.value
   this.setState({
     amountArray:this.state.amountArray
   })
 }
 if(e.target.id==='3'){
   this.setState({
amount3:e.target.value

   })
   this.state.amountArray[e.target.id]=e.target.value
   this.setState({
     amountArray:this.state.amountArray
   })


}
if(e.target.id==='4'){
  this.setState({
amount4:e.target.value

  })
  this.state.amountArray[e.target.id]=e.target.value
  this.setState({
    amountArray:this.state.amountArray
  })

}

   }

   onChangeRemarks=e=>{
     console.log("remarks here"  , e.target.id  , e.target.value);
     if(e.target.id==='1'){
       this.state.remarksArray[e.target.id]=e.target.value
       this.setState({
         remarksArray:this.state.remarksArray
       })
     // this.setState({
     //     remarks1:e.target.value
     // })
   }
   if(e.target.id==='2'){
     this.state.remarksArray[e.target.id]=e.target.value
     this.setState({
       remarksArray:this.state.remarksArray
     })
   this.setState({
   remarks2:e.target.value

   })
 }
 if(e.target.id==='3'){
   this.state.remarksArray[e.target.id]=e.target.value
   this.setState({
     remarksArray:this.state.remarksArray
   })
   this.setState({
remarks3:e.target.value

   })


}
if(e.target.id==='4'){
  this.state.remarksArray[e.target.id]=e.target.value
  this.setState({
    remarksArray:this.state.remarksArray
  })
  this.setState({
remarks4:e.target.value

  })

}

   }
   onChangenewAmount=e=>{
   console.log("amount index" ,e.target.id );
     this.state.amountArray[e.target.id]=e.target.value
     this.setState({
       amountArray:this.state.amountArray
     })
     // console.log("IN State" , this.state.amountArray);
   }
   onChangenewRemarks=e=>{
     console.log("remarks index" ,e.target.id );
     this.state.remarksArray[parseInt(e.target.id)+5]=e.target.value
     this.setState({
       remarksArray:this.state.remarksArray
     })
   }
   onClickNewEndUser=e=>{
     console.log("onClickNewEndUser" , this.props);
      urlPrams= '/home/customermanagement/' + 'endUser';
       this.props.props.history.push(urlPrams);
       // window.location.href=('/home/user-management');

   }
   onChangeDate=e=>{
     this.setState({
       date:e
     })
   }
  render() {
    console.log(
      "Render of Customer____________________________________________________________________________________________" ,this.state.trucksOption);
    return (

        <div className="content">
          <ReactTooltip type='info' effect='solid'/>
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        <FormGroup row>
          <Label sm={2}>End User Code</Label>
          <Col sm={3}>
               <Input readOnly onChange={this.onChangeDealerCode} value={this.state.dealerCode} placeholder="ATMS-C-001"  />

          </Col>
          <Col sm={2}>
               <Button color='info'  style={{marginLeft:'46px' , padding:'10px' , width:'152px'}} onClick={this.onClickNewEndUser}>Add New End User</Button>
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
        <Label data-tip="Mandatory Row" for="search" sm={2}>End User <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
        <Col sm={2}>
          <select style={{width:'235px'}}className='input' onClick={this.onClickCustomer} onChange={this.onChangeName}>
               {
                 (this.state.disableSelectField) &&
                 <option disabled selected hidden>
                 Loading, Please Wait..
                 </option>
         }
                                <option selected hidden>
                        Select End User
                             </option>
                                         {this.state.customerOption}
          </select>
        </Col>
        </FormGroup>
<FormGroup row>
<Label for="search" sm={2}>Address</Label>
<Col sm={3}>
  <Input type="text" name="search" id="search" placeholder="Enter Address" onChange={this.onChangeAddress} value= {this.state.address} readOnly />
</Col>
</FormGroup>
<FormGroup row>
<Label for="search" sm={2}>Phone No.</Label>
<Col sm={3}>
  <Input type="text" name="search" id="search" placeholder="03********" onChange={this.onChangePhone} value= {this.state.phone} readOnly/>
</Col>
</FormGroup>
<FormGroup row>
<Label for="search" sm={2}>Care Of</Label>
<Col sm={3}>
  <Input type="text" name="search" id="search" placeholder="C/O" onChange={this.onChangeCO} value= {this.state.co} readOnly/>
</Col>
</FormGroup>

<hr/>
<FormGroup row>
<Label for="search" sm={2}>Type</Label>
<Col  sm={2}>
<Input type="select" name="select" id="exampleSelect" onChange={this.oChangeDeliveredOrPermit} value={this.state.deliveryType}>
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
    <Input min="0" type="number"  value={this.state.amountOfBags} onChange={this.onChangeAmountOfBags} placeholder="e.g 500 Bags" />

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
  {/*  <Col sm={2}>
     <Label>Bilty No</Label>
       <Input min="0" type="text" value={this.state.biltyNo} onChange={this.onChangeBiltyNo} placeholder="Bilty No." />

     </Col>
     <div style={{display:'flex', flexDirection:'column', marginLeft:'20px'}}>
        <Label>Truck No</Label>
     <select style={{width:"176px",height:'38px' ,maxWidth:'147px'}}className='input' onClick={this.onClickTruck} onChange={this.onChangeTruck}>
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
      </div>*/}

    <div style={{display:'flex', flexDirection:'column', marginLeft:'20px'}}>
       <Label data-tip="Mandatory Field">Destination <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
    <select style={{width:"176px",height:'38px',maxWidth:'147px'}} className='input' name='toLocation'onClick={this.onClickTruckLocation} onChange={this.onChangeTruckLocation}>
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
     <select style={{width:"176px",height:'38px',maxWidth:'147px'}} className='input' name='fromLocation'onClick={this.onClickTruckLocation} onChange={this.onChangeTruckLocation}>
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
    <Label for="bagsDelivered" sm={2}>Bulk Delivered</Label>
  <Col sm={2}>

  <Label>Tons</Label>
    <Input min="0" type="number"  value={this.state.amountOfBags} onChange={this.onChangeAmountOfBags} onClick={this.onClickTons}placeholder="e.g 5 Tons" />

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
  {
    /*  <Col sm={2}>
       <Label>Bilty No</Label>
         <Input min="0" type="text" value={this.state.biltyNo} onChange={this.onChangeBiltyNo} placeholder="Bilty No." />

       </Col>
       <div style={{display:'flex', flexDirection:'column', marginLeft:'20px'}}>
          <Label>Truck No</Label>
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
        </div>*/
  }

    <div style={{display:'flex', flexDirection:'column', marginLeft:'20px'}}>
       <Label data-tip="Mandatory Field">Destination <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
    <select style={{width:"176px",height:'38px',maxWidth:'147px'}} className='input' name='toLocation' Click={this.onClickTruckLocation} onChange={this.onChangeTruckLocation}>
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
     <select style={{width:"176px",height:'38px',maxWidth:'147px'}} className='input'  name='fromLocation'onClick={this.onClickTruckLocation} onChange={this.onChangeTruckLocation}>
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
<FormGroup row>
<Label for="cashOnDelivery" sm={2}>Cash On Delivery</Label>
<Col sm={2}>
<Input type="select" name="cashOnDelivery" id="cashOnDelivery" onChange={this.onChangeCOD} value={this.state.cashOnDelivery}>
  <option value='Yes'>Yes</option>
  <option value="No">No</option>
</Input>
</Col>
</FormGroup>
{(this.state.cashOnDelivery ==='Yes')

?
<Form>
<hr/>
<h4 style={{float:'left'}}>PAYMENTS</h4>
<Button onClick={this.onClickAddPaymentFunc}style={{float:'right' , marginRight:'5%',padding: '4px 6px'}} color='info'>+</Button>
<div style={{clear:'both'}}></div>


<FormGroup row>

<Label className='Payment' for="orderPrice" sm={2}>PAYMENTS</Label>
<Col sm={2}>
<Label data-tip="Mandatory Column"  style={{marginTop: '35px',fontWeight:'bold',marginLeft:"23%"}}>Amount (PKR) <span style={{color:'red' , fontSize:'15px'}}>*</span> </Label>
</Col>
<Col sm={2}>
<Label  style={{marginTop: '35px',fontWeight:'bold',marginLeft:"23%"}}>Remarks</Label>
</Col>
</FormGroup>
<FormGroup row>
<Label className='Payment' for="orderPrice" sm={2}>Payment 1</Label>
<Col sm={2}>
  <Input min='0' style={{marginTop: '24px'}} type="number" name="orderPrice" id="1"  onChange={this.onChangeAmount} placeholder="Amount (PKR)" />
</Col>

<Col sm={2}>

  <Input style={{marginTop: '24px'}} type="text" name="orderPrice" id="1" onChange={this.onChangeRemarks} placeholder="Remarks" />

</Col>

</FormGroup>



<FormGroup row>
<Label className='Payment' for="orderPrice" sm={2}>Payment 2</Label>
<Col sm={2}>

  <Input min='0' style={{marginTop: '24px'}}type="number" name="orderPrice" id="2"  onChange={this.onChangeAmount}  placeholder="Amount (PKR)" />

</Col>
<Col sm={2}>

  <Input style={{marginTop: '24px'}} type="text" name="orderPrice" id="2"  onChange={this.onChangeRemarks} placeholder="Remarks" />

</Col>
</FormGroup>


<FormGroup row>
<Label className='Payment' for="orderPrice" sm={2}>Payment 3</Label>
<Col sm={2}>

  <Input min='0' style={{marginTop: '24px'}} type="number" name="orderPrice" id="3"  onChange={this.onChangeAmount} placeholder="Amount (PKR)" />

</Col>
<Col sm={2}>

  <Input style={{marginTop: '24px'}} type="text" name="orderPrice" id="3" onChange={this.onChangeRemarks}  placeholder="Remarks" />

</Col>


</FormGroup>
<FormGroup row>
<Label className='Payment' for="orderPrice" sm={2}>Payment 4</Label>
<Col sm={2}>

  <Input min='0' style={{marginTop: '24px'}} type="number" name="orderPrice" id="4"  onChange={this.onChangeAmount}  placeholder="Amount (PKR)" />

</Col>
<Col sm={2}>
  <Input style={{marginTop: '24px'}}  type="text" name="orderPrice" id="4" onChange={this.onChangeRemarks}  placeholder="Remarks" />

</Col>
</FormGroup>
{/*this.state.paymentArray*/}
{
  this.state.newAddedPayments.map((e,index)=>{
    return(
      <FormGroup key={index} row>
      <Label className='Payment' for="orderPrice" sm={2}>Payment {index+5}</Label>
      <Col sm={2}>

        <Input min='0' style={{marginTop: '24px'}}  type="number" name="orderPrice" id={index+5} onChange={(e)=>this.onChangenewAmount(e)} placeholder="Amount (PKR)" />

      </Col>
      <Col sm={2}>

        <Input  style={{marginTop: '24px'}}  type="text" name="orderPrice" id={index}   onChange={(e)=>this.onChangenewRemarks(e)} placeholder="Remarks" />

      </Col>
      </FormGroup>

    )
  })
}

</Form>


  :

   null
}

<Form>
<FormGroup check row >
<Col sm={{ size: 10, offset: 2 }}>
  <Button color='info' onClick= {this.onClickSave} disabled={this.state.disableAlert}>
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

export default Enduser;
