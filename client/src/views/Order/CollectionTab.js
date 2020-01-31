import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import classnames from 'classnames';
import "../styles/Styling.css"
// import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import EventBus from 'eventing-bus'
import ReactTooltip from 'react-tooltip'
import Cheque from '../Delivery/Cheque.js';
// import CollectionHistory from "./CollectionHistory.js"
import BankAccounts from "views/Delivery/BankAccounts.js"
// import Cash from '../Delivery/Cash.js';
// import OrderHistory from "../Delivery/OrderHistory.js"
import Online from '../Delivery/Online.js';
import RecieptNo from '../Delivery/RecieptNo.js';

import NotificationAlert from "react-notification-alert";

// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';
import {
   Form,
   FormGroup,
   Label,
   Card,
   // CardBody,
   // Table,
   // Row,
   Col,
   // Nav,
   Button,
   Input
} from "reactstrap";
// var totalPrice=''
// var bold
var request = require("request");
// const url = global.baseUrl
// var moment = require('moment');
var listOfOption=[]
var listOfOptionUser=[]
var listOfOptioninCustomer=[]
// var malik = []
var valueOfAllCustomer=''
var valueOfAllUser=''
var valueOfAllDealer=''
var selectedCustomer =[]
var selectedUser=[]
var selectedDealer =[]
// var data=''
var creditOfEachCustomer=[]
var creditOfEachUser=[]
var creditOfEachDealer=[]
var tempArray=''
// var flag=false
var loginUserName=''
var paymentType='cash'
var newPaymentArray = [
  {
    id:'5',
    value:'m5',
    remarks:'Remarks1'
  }
]


// var valueVar=''
 // var remarksVar=''
 // var newVar=''
 // var m = ''
 var arrayOfPaymentForApiCall=[]
 // var pageToLoadNew=''
var cc=0
// let tabStyle1={color:'black'}
// let tabStyle2={color:'black'}
// let tabStyle3={color:'black'}
// let tabStyle4={color:'black'}
// let bRow=""
class CollectionTab extends React.Component {
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
      time=5
    }
    else {
      type="danger"
      time=3
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
    getAllUsersApiCall=e=>{
      var data={
        type:JSON.stringify(["super","admin","financeManager","deliveryManager" , "collectionManager"])
      }
      var options = { method: 'POST',
          url: global.baseUrl + '/api/getAllUsersAdmin',
          headers: {'Authorization': localStorage.getItem("token") },
         body:data,
          json: true
        };
    console.log("options of Get ALL User Admin ", options);
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
            console.log("**Respone in Get ALL User Admin", response);   
    this.setState({
        disableSelectField:false
    })
             listOfOptionUser = response.body.result;
             selectedUser=[]
             listOfOptionUser.forEach((item, index)=>{
               if(item.isDeleted ===false)
              {
                if (item.type === '') {
                 item.type = '-'
               }
                valueOfAllUser=JSON.stringify(item);
               selectedUser.push(<option key ={index} value = {valueOfAllUser}>{item.name} ({item.type})</option>)
                creditOfEachUser.push(
                  {
                    id:item._id,
                    credit:item.credit
                  }
                )
             }
           }
           )
             console.log("CREDIT STATUS OBJECT" , creditOfEachUser);
               this.setState({
                 userOption:selectedUser
               })
           if(body.success){
             console.log("success :: ", body)

           }
           else {
             console.log("success false :: ", body);
           }
          }
        })

    }

    getAllDealerApiCall=e=>{
      var options = { method: 'POST',
          url: global.baseUrl + '/api/getAllDealers',
          headers: {'Authorization': localStorage.getItem("token") },
         // body:data,
          json: true
        };
    console.log("options of Get ALL Dealer ", options);
        request(options, (error, response, body) =>

        {
          if (error)
          {
            console.log("Error", error);
          }
          else
          {
            console.log("Respone in Get ALL Dealer", response);   
    this.setState({
        disableSelectField:false
    })
             listOfOption = response.body.result;
             selectedCustomer=[]
             listOfOption.forEach((item, index)=>{
               if (item.buisnessName === '') {
                 item.buisnessName = '-'
               }

                valueOfAllCustomer=JSON.stringify(item);
               selectedCustomer.push(<option key ={index} value = {valueOfAllCustomer}>{item.name} ({item.buisnessName})</option>)
                creditOfEachCustomer.push(
                  {
                    id:item._id,
                    credit:item.credit
                  }
                )
             })
             console.log("CREDIT STATUS OBJECT" , creditOfEachCustomer);
               this.setState({
                 DealerOption:selectedCustomer
               })
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
    getAllCustomerApiCall=e=>{
      var options = { method: 'POST',
          url: global.baseUrl + '/api/getAllCustomers',
          headers: {'Authorization': localStorage.getItem("token") },
         // body:data,
          json: true
        };
    console.log("options of Get ALL Customer ", options);
        request(options, (error, response, body) =>

        {
          if (error)
          {
            console.log("Error", error);
          }
          else
          {
            console.log("Respone in Get ALL CUSTOMER", response);
    listOfOptioninCustomer = response.body.result;

    this.setState({
        disableSelectField:false
    })
      if(listOfOptioninCustomer===undefined){
         console.log("Customer Not found");
      }
      else{
        selectedDealer=[]
        listOfOptioninCustomer.forEach((item, index)=>{
           valueOfAllDealer=JSON.stringify(item);
           if (item.careOf === '') {
             item.careOf = '-'
           }
          selectedDealer.push(<option key ={index} value = {valueOfAllDealer}>{item.name} ({item.careOf})</option>)
           creditOfEachDealer.push(
             {
               id:item._id,
               credit:item.credit
             }
           )
        })
        console.log("CREDIT STATUS OBJECT" , creditOfEachDealer);
          this.setState({
            customerOption:selectedDealer
          })


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
    changingIndexOfRecieptNoEventBusFunc=e=>{
      console.log("changingIndexOfRecieptNoEventBusFunc" , e);

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
      console.log("Did Of Collection");
      this.getAllUsersApiCall();
         this.getAllDealerApiCall();
         this.getAllCustomerApiCall();
           this.message=''
      this.paymentArray=[];
      this.UniqueAccountPAymentNo=[]
      this.SerialNoOfStaticCheque=''
      this.UniqueOnlinePAymentNo='';
        this.UniqueChequePAymentNo=[];
      EventBus.on("saveCashEventBus",this.saveCashEventBusFunc );
        EventBus.on("saveBankEventBus",this.saveBankEventBusFunc );
        EventBus.on("changingIndexOfRecieptNoEventBus",this.changingIndexOfRecieptNoEventBusFunc );


    }
    ChequeNoEventBusFunc=e=>{
      console.log("New PAYMNET Account REF NO ......................................................" ,e);
      console.log("and Serial No" ,this.SerialNoOfStaticCheque );
      this.state.newChequeValue[e.index]=e.referenceNo
          // this.state.newOnlineOfPayment[e.target.id]=''
      this.setState({
        newChequeValue:this.state.newChequeValue
      })
      this.setState({
        chequeNo:e
      })
      setTimeout(()=>{
        console.log(this.state.newChequeValue);
      },1000)
    }

    idOfBackEventBusFunc=e=>{
      console.log("THROUGH EVVENT BUS ID OF BANK" , e.id);
      console.log("THROUGH EVVENT BUS Payment ## OF BANK" , e.index);

     this.state.newOnlineValue[e.index]=e.id
      this.setState({
        newOnlineValue:this.state.newOnlineValue
      })
      this.setState({
        idOfBank:e
      })
    }
    idOfNewBackEventBusFunc=(e)=>{
      console.log("idOfNewBackEventBusFunc.......................................................................", e);
      console.log("NO of Payment" ,this.UniqueOnlinePAymentNo);
      this.state.newOnlineValue[e.index]=e.id
      this.setState({
        newOnlineValue:this.state.newOnlineValue
      })
    }
    accountOfBankEventBusFunc=e=>{
      console.log("THROUGH EVVENT BUS ACCOUNT OF BANK in new PAYMNET....>>>" , e);
      this.state.newOnlineAccountValue[e.index]=e.accountId
      this.setState({
        newOnlineAccountValue:this.state.newOnlineAccountValue
      })
      this.setState({
        idOfBank:e.accountNumber
      })
      console.log("ACCOUNT No ... IN EVENT BUS FUNC" , this.state.newOnlineAccountValue);
    }
    referenceNoEventBusFunc=e=>{
      console.log("referenceNoEventBusFunc......>>>", e);
      // console.log("NO of Payment" ,this.UniqueChequePAymentNo);
      // this.state.newReferenceValue[this.UniqueChequePAymentNo]=e
      // this.setState({
      //   newReferenceValue:this.state.newReferenceValue
      // })
    }
    saveBankEventBusFunc=e=>{
      this.setState({
        pageToLoad1:'',
        pageToLoad1AndBanks:'',
        pageToLoad2:'',
        pageToLoad2AndBanks:'',
             pageToLoad3AndBanks:'',
                  pageToLoad4AndBanks:'',

      })
    }
    saveCashEventBusFunc=e=>{
        this.setState({
          pageToLoad1:'',
          pageToLoad1AndBanks:'',
          pageToLoad2AndBanks:'',
               pageToLoad3AndBanks:'',
                    pageToLoad4AndBanks:'',

          pageToLoad2:''
        })
    }

  constructor(props) {
    console.log("Constructor of Colection");
    super(props);
      this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      date: new Date(),
      userCode:'',
        disableAlert:false,
              disableSelectField:false,
      formToLoad:'',
      newChequeValue:[],
      chequeNo:'',
      newAddedPayments:[],
      newAmountOfPayment:[],
        newRemarksOfPayment:[],
      newChequeOfPayment:[],
        newOnlineOfPayment:[],
        newCashOfPayment:[],
        newOnlineValue:[],
        newOnlineAccountValue:[],
        newCashReciptValue:[],
          newReferenceValue:[],
        pageToLoadNewPaymentCheque:'',
        pageToLoadNewPaymentOnline:'',
        pageToLoadNewPaymentChequeAndBank:"",
        pageToLoadNewPaymentCash:'',
      startingPoint:5,
      noOfPayments:'',
      type:'cash',
      creditOfSelectedCustomer:'',
      DealerOption:[],
        customerOption:[],
      pageToLoadEnable2:true,
      pageToLoad2:<RecieptNo recieptNo={'2'}/>,
      modalCollection: false,
      dropdownOpen: false,
      dues:'PKR -20,000',
      orderPrice:0,
        pageToLoadNew:'',
      pageToLoad1:<RecieptNo recieptNo={'1'}/>,
      pageToLoad2AndBanks:'',
           pageToLoad3AndBanks:'',
                pageToLoad4AndBanks:'',
      amountOfBags:'',
      tons:'',
      rate:750,
      pageToLoad3:<RecieptNo recieptNo={'3'}/>,
      collectedBy:"ali",
      paymentArray:[],
        pageToLoad4:<RecieptNo recieptNo={'4'}/>,
            pageToLoad5:'',
            amount1:'',
            amount2:'',
              amount3:'',
                amount4:'',
                  amount5:'',
                    amount6:'',
            remarks:'',
            remarks2:'',
            remarks3:'',
            remarks4:'',
              remarks5:'',
                remarks6:'',
            idOfBank:'',
            dealerCode:''


    };
       EventBus.on("recieptNoOfCashEventBus",this.recieptNoOfCashEventBusFunc);
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
     paymentType="cash"
     if(e==='1'){
     this.setState({
       pageToLoad1:<RecieptNo recieptNo={e}/>,
       pageToLoad1AndBanks:'',
            // pageToLoad2AndBanks:'',
            //      pageToLoad3AndBanks:'',
            //           pageToLoad4AndBanks:'',
       type:'cash'
     })
     EventBus.on("recieptNoOfCashEventBus",this.recieptNoOfCashEventBusFunc);

   }
   if(e==='2'){
   this.setState({
     pageToLoad2:<RecieptNo recieptNo={e}/>,
     // pageToLoad1AndBanks:'',
     pageToLoad2AndBanks:'',
          // pageToLoad3AndBanks:'',
          //      pageToLoad4AndBanks:'',

      type:'cash'

   })
   EventBus.on("recieptNoOfCashEventBus",this.recieptNoOfCashEventBusFunc);

 }
 if(e==='3'){
 this.setState({
   pageToLoad3:<RecieptNo recieptNo={e}/>,
   // pageToLoad1AndBanks:'',
   // pageToLoad2AndBanks:'',
        pageToLoad3AndBanks:'',
             // pageToLoad4AndBanks:'',

    type:'cash'

 })
 EventBus.on("recieptNoOfCashEventBus",this.recieptNoOfCashEventBusFunc);

}
if(e==='4'){
this.setState({
  pageToLoad4:<RecieptNo recieptNo={e}/>,
  // pageToLoad1AndBanks:'',
  // pageToLoad2AndBanks:'',
  //      pageToLoad3AndBanks:'',
            pageToLoad4AndBanks:'',

   type:'cash'

})
EventBus.on("recieptNoOfCashEventBus",this.recieptNoOfCashEventBusFunc);

}
   }
   onClickCheque=e=>{
       paymentType='cheque'
     console.log("cheque here" , e);
     if(e==="1"){
       console.log("1 selected");
       this.UniqueOnlinePAymentNo=e
       this.SerialNoOfStaticCheque=e
       this.setState({
         pageToLoad1: <Cheque paymentNo={e} />,
         pageToLoad1AndBanks:<Online paymentNo={e}/>,
         type:'cheque'
         // pageToLoad2:'',
         //   pageToLoad3:''
       })
          EventBus.on("ChequeNoEventBus",this.ChequeNoEventBusFunc);
          EventBus.on("idOfBackEventBus",this.idOfBackEventBusFunc);
     }
     else if(e==="2")
     {
        this.SerialNoOfStaticCheque=e
        this.UniqueOnlinePAymentNo=e

       this.setState({
       pageToLoad2: <Cheque paymentNo={e}/>,
       pageToLoad2AndBanks:<Online paymentNo={e}/>,

         type:'cheque'
       // pageToLoad1:'',
       //   pageToLoad3:''
      })
        EventBus.on("ChequeNoEventBus",this.ChequeNoEventBusFunc);
        EventBus.on("idOfBackEventBus",this.idOfBackEventBusFunc);


     //  this.setState({
     //  pageToLoadEnable2:false
     // })

    }
    else if(e==="3")
    {
       this.SerialNoOfStaticCheque=e
       this.UniqueOnlinePAymentNo=e

      this.setState({
      // pageToLoad2: '',
      // pageToLoad1:'',
      pageToLoad3:<Cheque paymentNo={e}/>,
      pageToLoad3AndBanks:<Online paymentNo={e}/>,

        type:'cheque'

     })
       EventBus.on("ChequeNoEventBus",this.ChequeNoEventBusFunc);
       EventBus.on("idOfBackEventBus",this.idOfBackEventBusFunc);


   }
   else if(e==="4")
   {
      this.SerialNoOfStaticCheque=e
      this.UniqueOnlinePAymentNo=e

     this.setState({
     // pageToLoad2: '',
     // pageToLoad1:'',
     pageToLoad4:<Cheque paymentNo={e}/>,
     pageToLoad4AndBanks:<Online paymentNo={e} />,

       type:'cheque'

    })
      EventBus.on("ChequeNoEventBus",this.ChequeNoEventBusFunc);
      EventBus.on("idOfBackEventBus",this.idOfBackEventBusFunc);


  }
   }
   recieptNoOfCashEventBusFunc=e=>{
     console.log("THROUGH EVVENT BUS RECIPT NO OF CASH in new PAYMNET....>>>" , e);
     this.state.newCashReciptValue[e.index]=e.recieptNo
     this.setState({
       newCashReciptValue:this.state.newCashReciptValue
     })
     this.setState({
       idOfBank:e.accountNumber
     })
     console.log("RECIEPT NO ...SAVED IN ARRAY IN EVENTBUS FUNC" , this.state.newCashReciptValue);

   }
   onClickOnline=e=>{
     paymentType='online'
     console.log("online here");
     if(e==="1"){
              this.setState({
         pageToLoad1:<BankAccounts paymentNo={e}/>,
         pageToLoad1AndBanks:'',
         // pageToLoad2AndBanks:'',
               // pageToLoad3AndBanks:'',
                   // pageToLoad4AndBanks:'',

           type:'online'
            // pageToLoad2:'',
            //  pageToLoad3:''
       })

       EventBus.on("accountOfBankEventBus",this.accountOfBankEventBusFunc);

     }
     if(e==="2")
     {
       this.UniqueAccountPAymentNo=e

       this.setState({
         pageToLoad2: <BankAccounts paymentNo={e}/>,
         type:'online',
         // pageToLoad1AndBanks:'',
         pageToLoad2AndBanks:'',
              // pageToLoad3AndBanks:'',
              //      pageToLoad4AndBanks:'',

          // pageToLoad1:'',
          //  pageToLoad3:''
       })
       EventBus.on("accountOfBankEventBus",this.accountOfBankEventBusFunc);
     }
     if(e==="3")
     {
       this.UniqueAccountPAymentNo=e

       this.setState({
         // pageToLoad2:'',
         //  pageToLoad1:'',
         // pageToLoad1AndBanks:'',
         // pageToLoad2AndBanks:'',
              pageToLoad3AndBanks:'',
                   // pageToLoad4AndBanks:'',

          pageToLoad3:<BankAccounts paymentNo={e}/>,
          type:'online'

       })
       EventBus.on("accountOfBankEventBus",this.accountOfBankEventBusFunc);
     }
     if(e==="4")
     {
       this.UniqueAccountPAymentNo=e

       this.setState({
         // pageToLoad2:'',
         //  pageToLoad1:'',
         // pageToLoad1AndBanks:'',
         // pageToLoad2AndBanks:'',
         //      pageToLoad3AndBanks:'',
                   pageToLoad4AndBanks:'',

          pageToLoad4:<BankAccounts paymentNo={e}/>,
          type:'online'

       })
       EventBus.on("accountOfBankEventBus",this.accountOfBankEventBusFunc);
     }


   }
   amountOfBags=e=>{

console.log('target value',e.target.value);
     this.setState({
       amountOfBags:e.target.value,
       tons: (e.target.value)*50/1000,
      orderPrice:(e.target.value)*this.state.rate
     })
   }


   onChangeRateFunc=e=>{
     console.log("rate is changinggg",e.target.value);
    console.log("order amountt here 1st",this.state.rate);

    this.setState({
        rate:e.target.value
    })
 console.log("order amountt here 2nd",this.state.rate);


this.handleOrdePrice(e.target.value)

   }
   handleOrdePrice=(e)=>{
     console.log("order amountt here 2nd",parseInt(e),this.state.rate);
     this.setState({
            orderPrice:this.state.amountOfBags*parseInt(e)
     })
     console.log("orderPrice :: ", this.state.orderPrice);
   }
oChangeDeliveredOrPermit=e=>{
  console.log("Onchange func called");
  this.setState({
    collectedBy:e.target.value
  })
}
onChangeAmont6=e=>{
  console.log("SIXTH");
}
onClickAddPaymentFunc=e=>{
  console.log("Adding ..  >" ,this.state.newAddedPayments);
  //We have  issue when we have more new payment options added.(e.g if we put value in new payment option that is #5 (NO PROBLEM),After this next payment options filled then also No problem .. Means if we are filling one by one top to bottom then good. Problem is when we are done with 3 new payment then edit 6th one , values will mixed at that time)
  //we are limiting this function to add only one new payment option that is #5
  // if you want to add new payment option on every click then remove below if
  if(this.state.newAddedPayments.length===0){
    console.log("Adding first");
    this.setState({
      newAddedPayments:[...this.state.newAddedPayments,'']
    })
  }
  else{
    console.log("Adding Next");
    this.message='New Payment Field Already Added '
          this.notify("tc",false);
  }
  //   EventBus.publish("AddingNewPaymentsEventBus", this.state.noOfPayments);

    // this.onClickNewPaymentCash(e)
}
newDisplayFunc=e=>{
  console.log("value of recieved posts" , e);
  return e.pageToLoadNew;
}
paymentApiCall=e=>{
console.log("IN paymentApiCall" ,paymentType);
for(var i=1;i<this.state.newAmountOfPayment.length;i++)
{
  console.log(this.state.newChequeValue[i]);
  if(this.state.newChequeValue[i]!==undefined||this.state.newOnlineValue[i]!==undefined)
{
      arrayOfPaymentForApiCall.push(
     {
       collectedBy:this.state.userCode,
       user_id:this.state.dealerCode,
       remarks:this.state.newRemarksOfPayment[i],
       amount:this.state.newAmountOfPayment[i],
       paymentType:'cheque',
       chequeNumber:this.state.newChequeValue[i],
         chequeDate:this.state.date,
         bank_id:this.state.newOnlineValue[i]
         // draftNumber:this.state.newOnlineValue[i],
         // draftDate:this.state.draftDate
     }
   )
 }
else if(this.state.newOnlineAccountValue[i]!==undefined){

  arrayOfPaymentForApiCall.push(
       {
         collectedBy:this.state.userCode,

         user_id:this.state.dealerCode,
         remarks:this.state.newRemarksOfPayment[i],
         amount:this.state.newAmountOfPayment[i],
         paymentType:'online',
         // chequeNumber:this.state.newChequeValue[i],
         //   chequeDate:this.state.date,
           account_id:this.state.newOnlineAccountValue[i],
           draftDate:this.state.date,
       }
     )
}
else if(this.state.newCashReciptValue[i]!==undefined){

  arrayOfPaymentForApiCall.push(
       {
         collectedBy:this.state.userCode,

         user_id:this.state.dealerCode,
         remarks:this.state.newRemarksOfPayment[i],
         amount:this.state.newAmountOfPayment[i],
         paymentType:'cash',
         // chequeNumber:this.state.newChequeValue[i],
         //   chequeDate:this.state.date,
           receipt_no:this.state.newCashReciptValue[i],
           cashDate:this.state.date,
       }
     )
}
// else{
//   arrayOfPaymentForApiCall.push(
//        {
//          collectedBy:this.state.userCode,
//
//          user_id:this.state.dealerCode,
//          remarks:this.state.newRemarksOfPayment[i],
//          amount:this.state.newAmountOfPayment[i],
//          paymentType:'cash',
//          // chequeNumber:this.state.newChequeValue[i],
//          //   chequeDate:this.state.date,
//            // draftNumber:this.state.newOnlineValue[i],
//            // draftDate:this.state.draftDate
//        }
//      )
// }
}
console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>" , paymentType);
var totalAmount=0
  for(var i=1;i<this.state.newAmountOfPayment.length;i++){
    console.log("value" ,i , this.state.newAmountOfPayment[i] );
      if(this.state.newAmountOfPayment[i]>0){
        totalAmount=totalAmount+JSON.parse(this.state.newAmountOfPayment[i])
        console.log("IN IF");
      }
      console.log("After addition" , totalAmount);
  }



 console.log("totalAmount :: " , totalAmount);
  var data={
       arrayOfPayments:arrayOfPaymentForApiCall
  }
  if(this.state.dealerCode===''){
    console.log("Dealer Code>>");
    this.message='Please Select Dealer/Customer'
          this.notify("tc",false);
          this.setState({
              disableAlert:false
          })
          arrayOfPaymentForApiCall=[]
  }
  else if (this.state.userCode==='') {
    console.log("user Code>>");
    this.message='Please Select User'
          this.notify("tc",false);
          this.setState({
              disableAlert:false
          })
          arrayOfPaymentForApiCall=[]
  }
  else if (this.state.date==='') {
    console.log("Date>>");
    this.message='Please Select Date'
          this.notify("tc",false);
          this.setState({
              disableAlert:false
          })
          arrayOfPaymentForApiCall=[]
  }

  else if (this.state.userCode==='') {
    console.log("user Code>>");
    this.message='Please Select User'
          this.notify("tc",false);
          this.setState({
              disableAlert:false
          })
          arrayOfPaymentForApiCall=[]
  }
     else if (totalAmount===0) {
       console.log("Amonut>>");
    this.message='Please Select Amount'
          this.notify("tc",false);
          this.setState({
              disableAlert:false
          })
          arrayOfPaymentForApiCall=[]
  }
  // else if (paymentType === 'cash') {
  //   console.log("CAsh >>");
    else if(this.state.newCashReciptValue.length===0 && paymentType === 'cash') {
      console.log("CASH >> newCashReciptValue");
      this.message='Please Enter Reciept Number'
            this.notify("tc",false);
            this.setState({
                disableAlert:false
            })
            arrayOfPaymentForApiCall=[]
    }
  //   paymentType=''
  // }
  // else if (paymentType === 'online') {
  //   console.log("Onine>>");
  else if(this.state.newOnlineAccountValue.length===0 && paymentType === 'online') {
      this.message='Please Select Bank Account Number'
            this.notify("tc",false);
            this.setState({
                disableAlert:false
            })
            arrayOfPaymentForApiCall=[]
    }
    // paymentType=''
  // }
  // else if (paymentType === 'cheque') {
  //   console.log("Cheque >>");
  else if(this.state.newChequeValue.length===0 && paymentType === 'cheque') {
      this.message='Please Enter Reference Number'
            this.notify("tc",false);
            this.setState({
                disableAlert:false
            })
            arrayOfPaymentForApiCall=[]
    }
  else if(this.state.newOnlineValue.length===0 && paymentType === 'cheque'){

      this.message='Please Select Bank'
            this.notify("tc",false);
            this.setState({
                disableAlert:false
            })
            arrayOfPaymentForApiCall=[]
    }
  //   paymentType=''
  // }

  // else if (totalAmount>-(this.state.creditOfSelectedCustomer)) {
  //   this.message='Your Entered Amount Is Greater Than Selected User Total Credit'
  //         this.notify("tc",false);
  //         this.setState({
  //             disableAlert:false
  //         })
  //         arrayOfPaymentForApiCall=[]
  // }
  else{
    console.log("else");
    var options = { method: 'POST',
        url: global.baseUrl + '/api/createPayment',
        headers: {'Authorization': localStorage.getItem("token") },
         body:data,
        json: true
      };
  console.log("options of Payment collectionTab", options);
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
    console.log("Respone in Payment CollectionTAB", response);

  // this.message='Payments Collected Successfully'
  //       this.notify("tc",true);
  if(response.body.failed){
    this.message=response.body.message
         this.notify("tc",false);
         this.setState({
           disableAlert:false
         })
  }
  if(response.body.success)  {
    this.setState({
      disableAlert:false
    })
    this.message=`Payment(s) Created Successfully`
         this.notify("tc",true);
         // this.getAllDealerApiCall();
         // this.getAllCustomerApiCall();
         // this.setState({
         //   DealerOption:'',
         //   customerOption:''
         // })
         // this.setState({date: new Date(),
         //   disableAlert:false,
         //         disableSelectField:false,
         // formToLoad:'',
         // newChequeValue:[],
         // chequeNo:'',
         // newAddedPayments:[],
         // newAmountOfPayment:[],
         //   newRemarksOfPayment:[],
         // newChequeOfPayment:[],
         //   newOnlineOfPayment:[],
         //   newCashOfPayment:[],
         //   newOnlineValue:[],
         //   newOnlineAccountValue:[],
         //     newReferenceValue:[],
         //   pageToLoadNewPaymentCheque:'',
         //   pageToLoadNewPaymentOnline:'',
         //   pageToLoadNewPaymentChequeAndBank:"",
         //   pageToLoadNewPaymentCash:'',
         // startingPoint:5,
         // noOfPayments:'',
         // type:'cash',
         // creditOfSelectedCustomer:'',
         // DealerOption:[],
         //   customerOption:[],
         // pageToLoadEnable2:true,
         // pageToLoad2:'',
         // modalCollection: false,
         // dropdownOpen: false,
         // dues:'PKR -20,000',
         // orderPrice:0,
         //   pageToLoadNew:'',
         // pageToLoad1:'',
         // pageToLoad2AndBanks:'',
         //      pageToLoad3AndBanks:'',
         //           pageToLoad4AndBanks:'',
         // amountOfBags:'',
         // tons:'',
         // rate:750,
         // pageToLoad3:'',
         // collectedBy:"ali",
         // paymentArray:[],
         //   pageToLoad4:'',
         //       pageToLoad5:'',
         //       amount1:'',
         //       amount2:'',
         //         amount3:'',
         //           amount4:'',
         //             amount5:'',
         //               amount6:'',
         //       remarks:'',
         //       remarks2:'',
         //       remarks3:'',
         //       remarks4:'',
         //         remarks5:'',
         //           remarks6:'',
         //       idOfBank:'',
         //       dealerCode:''})
  }
  setTimeout(()=>{
    window.location.reload();
  },2000)
           EventBus.publish("collectionPayments",true)
           setTimeout(()=>{
             this.message= 'Please Go To Collection History Section To View All Colections'
             this.notify("br",true);
           },3000)
             
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

}
onClickSave=e=>{
  this.setState({
      disableAlert:true
  })
  console.log("SAVE Button Clicked now.............");
// console.log("newChequeOfPayment" ,this.state.newChequeOfPayment);
// console.log("newOnlineOfPayment" ,this.state.newOnlineOfPayment);


   //   newPaymentArray.forEach((item, index)=>{
   // })
     // if(this.state.amount1!== ''){
       // console.log("first");
 // console.log("AMOUNT1" , this.state.amount1);
       // if(this.state.type==='cash'){
       //   console.log("CASHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
       //    data={
       //     amount:this.state.amount1,
       //       remarks:this.state.remarks,
       //       user_id:this.state.dealerCode,
       //       paymentType:this.state.type,
       //   }
       // }
       // if(this.state.type==='cheque')
       // {
       //   console.log("chequeEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEeee");
       //    data={
       //     amount:parseInt(this.state.amount1),
       //       remarks:this.state.remarks,
       //       user_id:this.state.dealerCode,
       //       paymentType:this.state.type,
       //       chequeDate:this.state.date,
       //       chequeNumber:this.state.chequeNo
       //   }
       // }
     //   if(this.state.type==='online')
     //   {
     //     console.log("ONLINEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEe");
     //     data={
     //       amount:parseInt(this.state.amount1),
     //         remarks:this.state.remarks,
     //         user_id:this.state.dealerCode,
     //         paymentType:this.state.type,
     //         chequeDate:this.state.date,
     //         chequeNumber:this.state.chequeNo,
     //         bank_id:this.state.dealerCode
     //     }
     //
     // }
     this.paymentApiCall();
   // }
   }
  //  onChangeRemarks=e=>{
  // console.log("Clicked Remarks") ;
  //  console.log(e.target.id);
  // if(e.target.id===5)
  // {
  //   console.log("5th Remarks Clicked");
  //   this.setState({
  //     remarks5:e.target.value
  //   })
  // }
  // if(e.target.id===6)
  // {
  //   console.log("6th Remarks Clicked");
  //   this.setState({
  //     remarks6:e.target.value
  //   })
  // }
  //  }
onChangeAmont1=e=>{
  // console.log("amount 1 " , e.target.value , e.target.id);
  this.state.newAmountOfPayment[e.target.id]=e.target.value
  this.setState({
    newAmountOfPayment:this.state.newAmountOfPayment
  })
  // console.log("IN State" , this.state.newAmountOfPayment);
  // console.log("AMOUNT 1"  , e.target.value);
  // this.setState({
  //   amount1:e.target.value
  // })
}
onChangeAmont2=e=>{
  // console.log("amount2 " , e.target.value , e.target.id);
  this.state.newAmountOfPayment[e.target.id]=e.target.value
  this.setState({
    newAmountOfPayment:this.state.newAmountOfPayment
  })
  // console.log("IN State" , this.state.newAmountOfPayment);

  //   console.log("AMOUNT 2"  , e);
  // this.setState({
  //   amount2:e.target.value
  // })
}
onChangeAmont3=e=>{
  // console.log("amount3 " , e.target.value , e.target.id);
  this.state.newAmountOfPayment[e.target.id]=e.target.value
  this.setState({
    newAmountOfPayment:this.state.newAmountOfPayment
  })
  // console.log("IN State" , this.state.newAmountOfPayment);
  //   console.log("AMOUNT 3"  , e);
  // this.setState({
  //   amount3:e.target.value
  // })
}
onChangeAmont4=e=>{
  // console.log("amount4 " , e.target.value , e.target.id);
  this.state.newAmountOfPayment[e.target.id]=e.target.value
  this.setState({
    newAmountOfPayment:this.state.newAmountOfPayment
  })
  // console.log("IN State" , this.state.newAmountOfPayment);
  //   console.log("AMOUNT 4"  , e);
  // this.setState({
  //   amount4:e.target.value
  // })
}

onChangeRemarks1=e=>{
  this.state.newRemarksOfPayment[e.target.id]=e.target.value
  this.setState({
    newRemarksOfPayment:this.state.newRemarksOfPayment
  })
  // console.log("IN State" , this.state.newRemarksOfPayment);
  // console.log("REMARKS 1::" , e.target.value);
  // this.setState({
  //   remarks:e.target.value
  // })
}
onChangeRemarks3=e=>{
  this.state.newRemarksOfPayment[e.target.id]=e.target.value
  this.setState({
    newRemarksOfPayment:this.state.newRemarksOfPayment
  })
  // console.log("REMARKS 1::" , e.target.value);
  // this.setState({
  //   remarks3:e.target.value
  // })
}
onChangeRemarks4=e=>{
  this.state.newRemarksOfPayment[e.target.id]=e.target.value
  this.setState({
    newRemarksOfPayment:this.state.newRemarksOfPayment
  })
  // console.log("REMARKS 1::" , e.target.value);
  // this.setState({
  //   remarks4:e.target.value
  // })
}

onChangeRemarks2=e=>{
  this.state.newRemarksOfPayment[e.target.id]=e.target.value
  this.setState({
    newRemarksOfPayment:this.state.newRemarksOfPayment
  })
  // this.setState({
  //   remarks2:e.target.value
  // })
}
onClickCustomer=e=>{
console.log("Getting Value of full OPTION " ,e.target.value);

this.setState({
  dealerCode:JSON.parse(e.target.value)._id,
})
  console.log("Dealer CLICKED" , JSON.parse(e.target.value).credit);

creditOfEachCustomer.forEach((item, index)=>{
  console.log("ITEM" ,item.credit);
 if(JSON.parse(e.target.value)._id === item.id)
 {
   var creditOfSelectedUserValueCustomer=''
   if(JSON.parse(e.target.value).credit<0){
     var m=JSON.parse(e.target.value).credit
     console.log("m:::::::::::::" ,Math.abs(m));
     creditOfSelectedUserValueCustomer=`(${Math.abs(m).toLocaleString('en-US')})`
   }else{
     creditOfSelectedUserValueCustomer=JSON.parse(e.target.value).credit
   }
   this.setState({
     creditOfSelectedCustomer:creditOfSelectedUserValueCustomer
   })
 }
 })
 this.setState((state, props) => {
      return {counter: 0 + props.step};
             });

}
onClickUser=e=>{
console.log("Getting Value of full OPTION in user" ,e.target.value);
//
this.setState({
  userCode:JSON.parse(e.target.value)._id,
})
  console.log("User CLICKED" , JSON.parse(e.target.value)._id);

// creditOfEachCustomer.forEach((item, index)=>{
//   console.log("ITEM" ,item.id);
//  if(JSON.parse(e.target.value)._id === item.id)
//  {
//    this.setState({
//      creditOfSelectedCustomer:item.credit
//    })
//  }
//  })

}
onClickDealer=e=>{
console.log("Getting Value of full OPTION " ,e.target.value);
//
this.setState({
  dealerCode:JSON.parse(e.target.value)._id
})
  console.log("Dealer CLICKED" , JSON.parse(e.target.value)._id);

creditOfEachDealer.forEach((item, index)=>{
  console.log("ITEM" ,item.id);
 if(JSON.parse(e.target.value)._id === item.id)
 {
   this.setState({
     creditOfSelectedCustomer:item.credit
   })
 }

 })
 this.setState((state, props) => {
      return {counter: 0 + props.step};
             });

}

onChangeDate=e=>{
  console.log("DATE SELECTED" , e);
  this.setState({
    date:e
  })
}
onChangeNoPay=e=>{
  console.log("NO OF PAYMENTS" ,e.target.value);
  this.setState({
    noOfPayments:Number(e.target.value)
  })
}
displayFunc=(e)=>{
  console.log("Display function is called here" , e.paymentArray);
  return e.paymentArray;
}
onChangeAmount=(e)=>{
  console.log("OnChange in amont of new Payment _________________________________________________",e.target.value , parseInt(e.target.id)+5);
      this.state.newAmountOfPayment[parseInt(e.target.id)+5]=e.target.value
      this.setState({
        newAmountOfPayment:this.state.newAmountOfPayment
      })
      console.log("IN State" , this.state.newAmountOfPayment);
}
onChangeRemarks=(e)=>{
  console.log("OnChange in remarks of new Payment _________________________________________________",e.target.value , parseInt(e.target.id)+5);
      this.state.newRemarksOfPayment[parseInt(e.target.id)+5]=e.target.value
      this.setState({
        newRemarksOfPayment:this.state.newRemarksOfPayment
      })
      console.log("IN State" , this.state.newRemarksOfPayment);
}

onClickNewPaymentCheque=e=>{
  console.log("SR NO" ,parseInt(e.target.id)+5);
    this.UniqueChequePAymentNo=parseInt(e.target.id)+5;
  // EventBus.on("ChequeNoEventBus",this.referenceNoEventBusFunc);
  this.SerialNoOfStaticCheque=parseInt(e.target.id)+5
    this.UniqueOnlinePAymentNo=parseInt(e.target.id)+5;
    EventBus.on("ChequeNoEventBus",this.ChequeNoEventBusFunc);
    EventBus.on("idOfBackEventBus",this.idOfNewBackEventBusFunc);

  console.log("OnChange in Cheque of new Payment _________________________________________________",e.target.id , e.target.value);
      this.state.newChequeOfPayment[e.target.id]=e.target.value
          this.state.newOnlineOfPayment[e.target.id]=''
          this.state.newCashOfPayment[e.target.id]=''

      this.setState({
        newChequeOfPayment:this.state.newChequeOfPayment
      })
      if(this.state.newChequeOfPayment[e.target.id]==='on'){
        console.log("CHEQUE COMPONENT LOADEDDDDDDDDDDDDDDd");
        this.setState({
            pageToLoadNewPaymentCheque:<Cheque paymentNo={parseInt(e.target.id)+5} />,
            pageToLoadNewPaymentChequeAndBank:<Online paymentNo={parseInt(e.target.id)+5}/>
        })
      }
      console.log("IN State cheque" , this.state.newChequeOfPayment);
      console.log("IN State online" , this.state.newOnlineOfPayment);
}
onClickNewPaymentCash=e=>{
  EventBus.on("recieptNoOfCashEventBus",this.recieptNoOfCashEventBusFunc);
  console.log("OnChange in cash of new Payment _________________________________________________",e);
      this.state.newCashOfPayment[e]='cash'
          this.state.newOnlineOfPayment[e]=''
              this.state.newChequeOfPayment[e]=''

      this.setState({
        newCashOfPayment:this.state.newCashOfPayment
      })
      if(this.state.newCashOfPayment[e]==='cash'){
        console.log("CHEQUE COMPONENT LOADEDDDDDDDDDDDDDDd");
        this.setState({
            pageToLoadNewPaymentCash:<RecieptNo recieptNo={parseInt(e)+5}/>
        })
      }
      console.log("IN State cheque" , this.state.newChequeOfPayment);
      console.log("IN State online" , this.state.newOnlineOfPayment);
      // cc=0
}
onClickNewPaymentOnline=e=>{
    this.UniqueAccountPAymentNo=parseInt(e.target.id)+5;
    EventBus.on("accountOfBankEventBus",this.accountOfBankEventBusFunc);
  console.log("OnChange in Online of new Payment _________________________________________________",e.target.id);
      this.state.newOnlineOfPayment[e.target.id]=e.target.value
        this.state.newChequeOfPayment[e.target.id]=''
        this.state.newCashOfPayment[e.target.id]=''

      this.setState({
        newOnlineOfPayment:this.state.newOnlineOfPayment
      })
      if(this.state.newOnlineOfPayment[e.target.id]==='on'){
        console.log("ONLINE COMPONENT LOADEDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDdddd");
        this.setState({
          pageToLoadNewPaymentOnline:<BankAccounts paymentNo={parseInt(e.target.id)+5}/>
        })
      }
      console.log("IN State online" , this.state.newOnlineOfPayment);
          console.log("IN State cheque" , this.state.newChequeOfPayment);
}
onClickDealerCheckBox=e=>{
  this.setState({
    formToLoad:'dealer',
    creditOfSelectedCustomer:'',
    customerOption:[]
  })
  this.getAllDealerApiCall();
}

onClickEndUserCheckBox=e=>{
  this.setState({
    formToLoad:'customer',
    creditOfSelectedCustomer:'',
    DealerOption:[]
  })
  this.getAllCustomerApiCall();

}
onChangeDealer=e=>{
  console.log("Getting Value of full OPTION " ,e.target.value);

  this.setState({
    dealerCode:JSON.parse(e.target.value)._id,
  })
    console.log("Dealer CLICKED" , JSON.parse(e.target.value)._id);

  creditOfEachCustomer.forEach((item, index)=>{
    console.log("ITEM" ,item.id);
   if(JSON.parse(e.target.value)._id === item.id)
   {
     this.setState({
       creditOfSelectedCustomer:item.credit
     })
   }
   })
   this.setState((state, props) => {
        return {counter: 0 + props.step};
               });
}
onChangeEndUser=e=>{
  console.log("Getting Value of full OPTION " ,e.target.value);
  //
  this.setState({
    dealerCode:JSON.parse(e.target.value)._id
  })
    console.log("Dealer CLICKED" , JSON.parse(e.target.value)._id);

  creditOfEachDealer.forEach((item, index)=>{
    console.log("ITEM" ,item.id);
   if(JSON.parse(e.target.value)._id === item.id)
   {
     this.setState({
       creditOfSelectedCustomer:item.credit
     })
   }

   })
   this.setState((state, props) => {
        return {counter: 0 + props.step};
               });
}
onChangeCollectedBy=e=>{
  console.log("Getting Value of full OPTION in user" ,e.target.value);
  //
  this.setState({
    userCode:JSON.parse(e.target.value)._id,
  })
    console.log("User CLICKED" , JSON.parse(e.target.value)._id);

  // creditOfEachCustomer.forEach((item, index)=>{
  //   console.log("ITEM" ,item.id);
  //  if(JSON.parse(e.target.value)._id === item.id)
  //  {
  //    this.setState({
  //      creditOfSelectedCustomer:item.credit
  //    })
  //  }
  //  })
  this.setState((state, props) => {
       return {counter: 0 + props.step};
              });

}


  render() {
  console.log("Render of Collection");
  loginUserName=localStorage.getItem("loginUserName")
  // console.log("Reference No" , this.state.chequeNo);
  console.log("newOnlineValue" , this.state.newOnlineValue);
  // console.log("newReferenceValue" ,this.state.newReferenceValue);
    return (
              <div className="content">
              <ReactTooltip type='info' effect='solid'/>
              <div className="react-notification-alert-container">
                <NotificationAlert ref="notificationAlert" />
              </div>
              <div className="scrollerclass">
              <Card style={{padding:'15px'}}>
            {  /* {this.state.pageToLoadNew}*/}
                       <h3 style={{margin:'10px 0px'}}>Collections</h3>
            <h4 style={{margin:'10px', color:'green'}}><u>All Collections From Dealers/Customers</u></h4>
                <Form style={{marginLeft:'10px'}}>
                 <FormGroup row>
                 <Label sm={2}>End User Type</Label>
                 <Col sm={2}>
                 <Label style={{marginTop:'7px'}}>
                     <Input onClick={this.onClickDealerCheckBox}type="radio" name="radio1" defaultChecked/>{' '}
                     Dealer
                     </Label>
                   </Col>
                    <Col sm={2}>
                    <Label style={{marginTop:'7px'}}>
                     <Input  onClick={this.onClickEndUserCheckBox}type="radio" name="radio1" />{' '}
                     End User
                     </Label>
                      </Col>
                 </FormGroup>
                 <hr/>
              <FormGroup style={{marginLeft:'13%',marginTop:'4%'}} row>
      {
        (this.state.formToLoad ==='customer') ?
        <Col style={{display:'flex',flexDirection:'column' ,marginTop:'3px'}}sm={3}>
        <Label data-tip="Mandatory Field" >End User Name <span style={{color:'red' , fontSize:'15px'}}>*</span> </Label>
        <select style={{borderRadius:'8px',height:'39px'}}
            onClick={this.onClickDealer}
            onChange={this.onChangeEndUser}>
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
         :
         <Col style={{display:'flex',flexDirection:'column' ,marginTop:'3px'}}sm={3}>
         <Label data-tip="Mandatory Field">Dealer Name <span style={{color:'red' , fontSize:'15px'}}>*</span> </Label>
         <select style={{borderRadius:'8px',height:'39px'}}
             onClick={this.onClickCustomer}
             onChange={this.onChangeDealer}>
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
      }

             <div style={{display:'flex',flexDirection:'column' ,marginTop:'7px'}}>
              <Label>Collection Date</Label>

              <DatePicker className='datePicker'
                         selected={this.state.date}
                         onChange={this.onChangeDate}
                       />
                {/* <Input type="date" name="date" id="date" onChange={this.onChangeDate}/>*/}
              </div>
              { /*   <Col sm={3}>
              <Label>Collected  By</Label>
          <Input type="select" name="select" id="exampleSelect"
              onChange={this.oChangeDeliveredOrPermit} value={this.state.collectedBy}>
                <option value='ali'>Ali</option>
                <option value="bashir">Bashir</option>

              </Input>

              <Input type="text" name="select" id="exampleSelect"
                   onChange={this.oChangeDeliveredOrPermit} value={loginUserName} readOnly/>
              </Col>*/}
              <Col style={{display:'flex',flexDirection:'column' ,marginTop:'3px'}}sm={3}>
              <Label data-tip="Mandatory Field">Collected By <span style={{color:'red' , fontSize:'15px'}}>*</span> </Label>
              <select style={{borderRadius:'8px',height:'39px'}}
                  onClick={this.onClickUser}
                  onChange={this.onChangeCollectedBy}>
                  {
                    (this.state.disableSelectField) &&
                    <option disabled selected hidden>
                    Loading, Please Wait..
                    </option>
            }
              <option selected hidden>Select User</option>
                          {this.state.userOption}
              </select>
              </Col>
              </FormGroup>
              <FormGroup row>
              <Label for="search" sm={2}>Credit Status (PKR)</Label>
              <Col sm={2}>
                <Input style={{border:'transparent',
                fontWeight:'bold',
                  borderRadius: '0px',
                  borderBottom: 'solid 1px'}}type="text" name="search" id="search"
                   value={(this.state.creditOfSelectedCustomer)} placeholder="" />
              </Col>

              </FormGroup>

                  <hr/>
              <h4 style={{float:'left'}}>PAYMENTS</h4>
              <div>
{           /*   <Input style={{width:'65px',marginLeft:'81%' , height:'26px' , marginTop:'4px'}} type="number" onChange={this.onChangeNoPay} placeholder="e.g 1"/>
*/}
              <Button onClick={(e)=>{
                  cc=0;
                  setTimeout(()=>{
                    this.onClickAddPaymentFunc(e)
                  },400)

              }}
              style={{float:'right' , marginRight:'5%',padding: '4px 6px'}} color='info'>+</Button>
              </div>
              <div style={{clear:'both'}}></div>
              <FormGroup row>
              <Label style={{minWidth:'100px'}} className='Payment' for="orderPrice" sm={1}>PAYMENTS</Label>
              <Col sm={2}>
              <Label  data-tip="Mandatory Column" style={{marginTop: '35px',fontWeight:'bold',marginLeft:"10%"}}>Amount (PKR) <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
              </Col>
              <Col sm={2}>
              <Label  className='main'style={{marginTop: '35px',fontWeight:'bold',marginLeft:"11%"}}>Mode Of Payment</Label>
              </Col>
              <Col sm={2}>
              <Label  style={{marginTop: '35px',fontWeight:'bold',marginLeft:"260%"}}>Remarks</Label>
              </Col>
              </FormGroup>
              <FormGroup row>
              <Label style={{minWidth:'100px'}} className='Payment' for="orderPrice" sm={1}>Payment 1</Label>
              <Col sm={2}>
                <Input min='0' style={{marginTop: '24px'}} type="number" placeholder="Amount (PKR)" id={'1'} value={this.state.newAmountOfPayment[1]}onChange={this.onChangeAmont1}/>
              </Col>
              <Col>
              <div style={{display:'flex',paddingTop:'10px', width:"60%"}}>
              <div  style={{marginTop: '24px'}} className="optionDiv">
                <div className="checkboxStyle">
                  <Label style={{marginRight:'26px', cursor:'pointer'}} >
                  <Input onClick={()=>this.onClickCash('1')}type="radio" name="radio2" defaultChecked />{' '}
                  Cash
                    </Label>
                </div>
              <div className="checkboxStyle">
                <Label style={{ cursor:'pointer'}}>
                  <Input style={{marginLeft:'-14px'}}onClick={()=>this.onClickCheque('1')} type="radio" name="radio2" />{' '}
                  Cheque
                    </Label>
                </div>
                  <div className="checkboxStyle" style={{marginLeft:"19px" ,minWidth:"104px"}}>
                    <Label style={{ cursor:'pointer'}}>
                    <Input  style={{marginLeft:'-14px'}} onClick={()=>this.onClickOnline('1')} type="radio" name="radio2" />{' '}
                    Online
                      </Label>
                  </div>
                  </div>
                  <div className="checkboxStyle1" >
                        {this.state.pageToLoad1}

                  </div>
                  <div style={{marginLeft:"220px"}}className="checkboxStyle1" >

                        {this.state.pageToLoad1AndBanks}
                  </div>
               </div >
              </Col>
              <Col style={{marginRight:'60px'}}sm={2}>

                <Input  style={{marginTop: '28px'}} type="text"placeholder="Remarks" id={'1'}onChange={this.onChangeRemarks1}/>

              </Col>

              </FormGroup>


              <FormGroup row>
              <Label style={{minWidth:'100px'}} className='Payment' for="orderPrice" sm={1}>Payment 2</Label>
              <Col sm={2}>

                <Input  min='0' style={{marginTop: '24px'}} type="number" placeholder="Amount (PKR)" id={'2'}  value={this.state.newAmountOfPayment[2]} onChange={this.onChangeAmont2}  />

              </Col>
              <Col>

              <div style={{display:'flex',paddingTop:'10px', width:"60%"}}>
              <div   style={{marginTop: '24px'}} className="optionDiv">
                <div className="checkboxStyle">
                <Label style={{marginRight:'26px' ,cursor:"pointer"}}>
                  <Input  onClick={()=>this.onClickCash('2')}type="radio" name="radio3" defaultChecked />{' '}
                  Cash
                    </Label>
                </div>

              <div className="checkboxStyle">
                <Label style={{ cursor:'pointer'}}>
                  <Input  style={{marginLeft:'-14px'}} onClick={()=>this.onClickCheque('2')} type="radio" name="radio3" />{' '}
                  Cheque
                    </Label>
                </div>
                  <div className="checkboxStyle" style={{marginLeft:"19px" ,minWidth:"104px"}}>
                    <Label style={{ cursor:'pointer'}}>
                    <Input  style={{marginLeft:'-14px'}} onClick={()=>this.onClickOnline('2')} type="radio" name="radio3"  />{' '}
                    Online
                      </Label>
                  </div>
                  </div>
                  <div className="checkboxStyle1" >
                        {this.state.pageToLoad2}
                  </div>
                  <div style={{marginLeft:"220px"}}className="checkboxStyle1" >
                        {this.state.pageToLoad2AndBanks}
                  </div>
               </div >
              </Col>
              <Col style={{marginRight:'60px'}}sm={2}>
                <Input
                 style={{marginTop: '28px'}}
                 placeholder="Remarks"   id={'2'} onChange={this.onChangeRemarks2} />
              </Col>

              </FormGroup>
              <FormGroup row>
              <Label style={{minWidth:'100px'}} className='Payment' for="orderPrice" sm={1}>Payment 3</Label>
              <Col sm={2}>

                <Input min='0' style={{marginTop: '24px'}} type="number" placeholder="Amount (PKR)" id={'3'}  value={this.state.newAmountOfPayment[3]} onChange={this.onChangeAmont3} />

              </Col>
              <Col>

              <div style={{display:'flex',paddingTop:'10px', width:"60%"}}>
              <div  style={{marginTop: '24px'}}  className="optionDiv">
                <div className="checkboxStyle">
              <Label style={{marginRight:'26px',cursor:'pointer'}}>
                  <Input  onClick={()=>this.onClickCash('3')}type="radio" name="radio4" defaultChecked/>{' '}
                  Cash
                    </Label>
                </div>

              <div className="checkboxStyle">
                <Label style={{ cursor:'pointer'}}>
                  <Input  style={{marginLeft:'-14px'}} onClick={()=>this.onClickCheque('3')} type="radio" name="radio4" />{' '}
                  Cheque
                    </Label>
                </div>

                  <div className="checkboxStyle" style={{marginLeft:"19px" ,minWidth:"104px" }}>
                    <Label style={{ cursor:'pointer'}}>
                    <Input  style={{marginLeft:'-14px'}} onClick={()=>this.onClickOnline('3')} type="radio" name="radio4" />{' '}
                    Online
                      </Label>
                  </div>
                  </div>
                  <div className="checkboxStyle1" >
                        {this.state.pageToLoad3}
                  </div>
                  <div style={{marginLeft:"220px"}}className="checkboxStyle1" >

                        {this.state.pageToLoad3AndBanks}
                  </div>
               </div >
              </Col>
              <Col style={{marginRight:'60px'}}sm={2}>

                <Input  style={{marginTop: '28px'}} type="text" placeholder="Remarks"  id={'3'} onChange={this.onChangeRemarks3}/>

              </Col>

              </FormGroup>

                            <FormGroup row>
                            <Label style={{minWidth:'100px'}} className='Payment' for="orderPrice" sm={1}>Payment 4</Label>
                            <Col sm={2}>

                              <Input min='0' style={{marginTop: '24px'}}  type="number"  placeholder="Amount (PKR)" id={'4'}  value={this.state.newAmountOfPayment[4]} onChange={this.onChangeAmont4}/>

                            </Col>
                            <Col>

                            <div style={{display:'flex',paddingTop:'10px', width:"60%"}}>
                            <div  style={{marginTop: '24px'}} className="optionDiv">
                              <div className="checkboxStyle">
                              <Label style={{marginRight:'26px',cursor:'pointer'}}>
                                <Input  onClick={()=>this.onClickCash('4')}type="radio" name="radio5"  defaultChecked/>{' '}
                                Cash
                                  </Label>
                              </div>
                            <div className="checkboxStyle">
                              <Label style={{ cursor:'pointer'}}>
                                <Input   style={{marginLeft:'-14px'}}onClick={()=>this.onClickCheque('4')} type="radio" name="radio5" />{' '}
                                Cheque
                                  </Label>
                              </div>

                                <div className="checkboxStyle" style={{marginLeft:"19px" ,minWidth:"104px"}} >
                                  <Label style={{ cursor:'pointer'}} >
                                  <Input style={{marginLeft:'-14px'}} onClick={()=>this.onClickOnline('4')} type="radio" name="radio5" />{' '}
                                  Online
                                </Label>
                                </div>
                                </div>
                                <div className="checkboxStyle1" >
                                      {this.state.pageToLoad4}
                                </div>
                                <div style={{marginLeft:"220px"}}className="checkboxStyle1" >

                                      {this.state.pageToLoad4AndBanks}
                                </div>

                             </div >

                            </Col>
                            <Col style={{marginRight:'60px'}}sm={2}>

                              <Input  style={{marginTop: '28px'}} type="text" placeholder="Remarks"  id={'4'} onChange={this.onChangeRemarks4} />

                            </Col>

                            </FormGroup>
                              {/*  <AddingNewPayments/>
                                this.displayFunc(this.state)*/}
                                  {
                                    this.state.newAddedPayments.map((e,i)=>{
                                      console.log("CCCCCCCCC :: ", cc);
                                    if(cc===0)
                                    {
                                      setTimeout(()=>{
                                        cc=1
                                        this.onClickNewPaymentCash(i)
                                      },100)

                                    }
                                      return(
                                        <FormGroup key={i} row>
                                        <Label style={{minWidth:'100px'}} className='Payment' sm={1}>Payment {i+5}</Label>
                                        <Col sm={2}>
                                          <Input min='0' style={{marginTop: '24px'}} id={i} name='amount'  value={this.state.newAmountOfPayment[i+5]}
                                            onChange={(e)=>this.onChangeAmount(e)} type="number" placeholder="Amount (PKR)" />
                                        </Col>
                                        <Col>
                                        <div style={{display:'flex',paddingTop:'10px', width:"60%"}}>
                                        <div  style={{marginTop: '24px'}} className="optionDiv">
                                          <div className="checkboxStyle">
                                            <Label style={{marginRight:'26px' , cursor:'pointer'}}>
                                            <Input id={i} onClick={()=>this.onClickNewPaymentCash(i)} type="radio" name={i} defaultChecked/> {' '}
                                            Cash
                                              </Label>
                                          </div>
                                        <div className="checkboxStyle">
                                          <Label style={{ cursor:'pointer'}}>
                                            <Input  style={{marginLeft:'-14px'}}  id={i} onClick={(e)=>this.onClickNewPaymentCheque(e)} type="radio" name={i} />{' '}
                                            Cheque
                                              </Label>
                                          </div>
                                            <div className="checkboxStyle" style={{marginLeft:"19px" ,minWidth:"104px"}}>
                                              <Label style={{ cursor:'pointer'}}>
                                              <Input  style={{marginLeft:'-14px'}} id={i}onClick={(e)=>this.onClickNewPaymentOnline(e)} type="radio" name={i} />{' '}
                                              Online
                                                </Label>
                                            </div>
                                            </div>
                                            <div className="checkboxStyle1" >
                                            {

                                              (this.state.newOnlineOfPayment[i]==='on')?
                                              this.state.pageToLoadNewPaymentOnline
                                              :
                                              ''
                                            }
                                            {
                                              (this.state.newChequeOfPayment[i]==='on')?
                                              this.state.pageToLoadNewPaymentCheque
                                              :
                                              ''
                                            }
                                            {
                                              (this.state.newCashOfPayment[i]==='cash')?
                                              this.state.pageToLoadNewPaymentCash
                                              :
                                              ''
                                            }

                                            </div>
                                            <div style={{marginLeft:"220px"}} className="checkboxStyle1" >

                                            {
                                              (this.state.newChequeOfPayment[i]==='on')?
                                              this.state.pageToLoadNewPaymentChequeAndBank
                                              :
                                              ''
                                            }


                                            </div>
                                         </div>
                                        </Col>
                                        <Col style={{marginRight:'60px'}}sm={2}>

                                          <Input
                                           style={{marginTop: '24px'}} id={i}
                                          type="text" placeholder="Remarks" name='remarks'
                                          onChange={(e)=>this.onChangeRemarks(e)} />

                                        </Col>

                                        </FormGroup>
                                      )
                                    })
                                  }
              <FormGroup check row>
              <Col sm={{ size: 10, offset: 2 }}>
                <Button color='info' onClick={this.onClickSave} disabled={this.state.disableAlert}>

                {
                (this.state.disableAlert) ?
                <i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>
                :  <span style={{display:'flex' , justifyContent:'center'}}> <span>Save</span></span>
                }
                </Button>
              </Col>
              </FormGroup>
              </Form>
   </Card>

              {/*
                  <CollectionHistory/>
                  **************************** this commented section is old collection **************************************************
                  <Row>
                    <Col md="12">
                   <Card>

                   <CardBody>
                   <div className="content">
                   <div style={{paddingTop:'10px',paddingBottom:'10px'}}>

                   <div style={{display:"flex"}}>
                    <p  style={{marginRight:'70px',marginLeft:'10px'}} >Dealer Name :</p>
                   <p>Malik Farhan</p>


                   </div>
                   <div style={{display:"flex",paddingTop:"10px"}}>
                    <p  style={{marginRight:'70px',marginLeft:'10px'}} >Credit Status:</p>
                    <p>PKR 550000</p>
                   </div>

                   </div>
                   <div>
                   <h5 style={{color:'blue'}}>Fund Collection</h5>
                   </div>
                   <Table className="tablesorter table" >

                     <thead className="text-primary">
                       <tr>
                         <th className="header headerSortUp">Type</th>
                           <th className="header headerSortUp">Amount</th>
                           <th className="header headerSortUp">Date</th>
                            <th className="header headerSortUp">Collected By</th>
                             <th className="header headerSortUp">Reference No.</th>
                      </tr>
                     </thead>
                     <tbody>
                  {this.tableCollectionRow}
                     </tbody>
                   </Table>

                   <div>
                     <Button color="info" onClick={()=>this.toggleModal('2')}>Add</Button>
                     <Modal size='lg' style={{

                        marginTop: '145px',padding: '0px',height: '262px'

                     }}  isOpen={this.state.modalCollection} toggleModal={this.toggleModal} className={this.props.className}>
                     <ModalHeader toggle={()=>this.toggleModal('2')}><h4>Collection</h4></ModalHeader>
                       <ModalBody   style={{paddingTop: '17px',paddingBottom: '13px'}}>
                       <Form >
                       <div style={{display:'flex'}}>
                    <FormGroup>
                    <Label for="exampleSelect">Type</Label>
                    <Input  style={{width:'190px'}}   onChange={this.onChangeFormDistribution}  type="select" name="type" id="exampleSelect">
                        <option>Cheque</option>
                        <option>Online Payment</option>
                    </Input>
                   </FormGroup>

                  <FormGroup>
                  <Label for="exampleEmail">Amount</Label>
                  <Input onChange={this.onChangeFormDistribution}type="email" name="amount" id="exampleEmail" placeholder="Amount" />
                  </FormGroup>
                  </div>
                  <div style={{display:'flex'}}>
                  <FormGroup>
                    <Label for="exampleEmail">Date</Label>
                    <Input  onChange={this.onChangeFormDistribution}  type="date" name="date" id="exampleEmail" placeholder="Date" />
                 </FormGroup>
                 <FormGroup>
                   <Label for="exampleEmail">Collected By.</Label>
                   <Input  onChange={this.onChangeFormDistribution}  type="email" name="collectedBy" id="exampleEmail" placeholder="Collected By" />
                </FormGroup>
                </div>
                <div style={{display:'flex'}}>
               <FormGroup>
                 <Label for="exampleEmail">Reference No.</Label>
                 <Input  onChange={this.onChangeFormDistribution}  type="email" name="reference" id="exampleEmail" placeholder="Reference No." />
              </FormGroup>
                </div>
             </Form>
                       </ModalBody>
                       <ModalFooter>
                         <Button style={{ borderRadius: '10px', paddingBottom: '2px',paddingTop:'2px',marginLeft: '40%'}}
                         color="info" onClick={()=>this.collectionHandleData('2')}>Save
                         </Button>
                       </ModalFooter>
                     </Modal>
                   </div>


                   </div>

                    </CardBody>

                    <div  style={{textAlign:'center',marginTop:'40px',marginBottom:'40px'}}className="col-md-12">
                       <Button color="info">save</Button>

                     <Button
                       onClick={() => { this.toggle('4'); }}
                       style={{marginRight:'100px'}}color="info">next</Button>
                       *****************************END HERE******************************************************

                       </div>
                    </Card>
                </Col>
                  </Row>
                   */}
              </div>
            </div>

    );
  }
}

export default CollectionTab ;
