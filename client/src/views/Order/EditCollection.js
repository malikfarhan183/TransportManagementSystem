import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import classnames from 'classnames';
import "../styles/Styling.css"
// import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactTooltip from 'react-tooltip'
import EventBus from 'eventing-bus'
import Cheque from '../Delivery/Cheque.js';
// import CollectionHistory from "./CollectionHistory.js"
import BankAccounts from "views/Delivery/BankAccounts.js"
// import Cash from '../Delivery/Cash.js';
// import OrderHistory from "../Delivery/OrderHistory.js"
import LoadingOverlay from 'react-loading-overlay';

import Online from '../Delivery/Online.js';
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
var listOfOption=[]
var listOfOptioninCustomer=[]
// var malik = []
var valueOfAllCustomer=''
var valueOfAllDealer=''
var selectedCustomer =[]
var selectedDealer =[]
// var data=''
var creditOfEachCustomer=[]
var creditOfEachDealer=[]
// var tempArray=''
// var flag=false
var loginUserName=''
var newPaymentArray = [
  {
    id:'5',
    value:'m5',
    remarks:'Remarks1'
  }
]
// var valueVar=''
//  var remarksVar=''
 // var newVar=''
 // var m = ''
 // var arrayOfPaymentForApiCall=[]
 // var pageToLoadNew=''

// let tabStyle1={color:'black'}
// let tabStyle2={color:'black'}
// let tabStyle3={color:'black'}
// let tabStyle4={color:'black'}
// let bRow=""
class EditCollection extends React.Component {
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
                valueOfAllCustomer=JSON.stringify(item);
               selectedCustomer.push(<option key ={index} value = {valueOfAllCustomer}>{item.name}</option>)
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
                valueOfAllCustomer=JSON.stringify(item);
               selectedCustomer.push(<option key ={index} value = {valueOfAllCustomer}>{item.name}</option>)
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
    this.setState({
        disableSelectField:false
    })

      listOfOptioninCustomer = response.body.result;
      selectedDealer=[]
      listOfOptioninCustomer.forEach((item, index)=>{
         valueOfAllDealer=JSON.stringify(item);
        selectedDealer.push (<option key ={index} value = {valueOfAllDealer}>{item.name}</option>)
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
        })

    }
    getSinglePaymentApiCall=e=>{
      this.setState({
        isActive:true
      })
      var data={
        payment_id:this.props.match.params.id
      }
      var options = { method: 'POST',
          url: global.baseUrl + '/api/getSinglePayments',
          headers: {'Authorization': localStorage.getItem("token") },
         body:data,
          json: true
        };
    console.log("options of Get Single getSinglePaymentApiCall ", options);
        request(options, (error, response, body) =>

        {
          if (error)
          {
            console.log("Error", error);
          }
          else
          {
            console.log("Respone in Get Single payment", response);   
    this.setState({
      isActive:false
    })
    // this.setState({
    //     disableSelectField:false
    // })
    //          listOfOptionUser = response.body.result;
    //          selectedUser=[]
             response.body.result.forEach((item, index)=>{
               console.log("itemssssssssssssssssssssssssssssssssss" , item.bank_id);
               // let orignalDate=item.date
               //   let date=orignalDate.toISOString()
               this.setState({
                   creditOfSelectedUser:item.user_id._id,
                   newAmountOfPayment:item.amount,
                   // idOfSelectedBank:item.account_id._id,
                   // date:date,
                   newRemarksOfPayment:item.remarks,
                   userName:item.user_id.name,
                   CustomerType:item.user_id.type,
                   modeOfPayment:item.paymentType

               })

             })
    //          console.log("CREDIT STATUS OBJECT" , creditOfEachUser);
    //            this.setState({
    //              userOption:selectedUser
    //            })
    //        if(body.success){
    //          console.log("success :: ", body)
    //
    //        }
    //        else {
    //          console.log("success false :: ", body);
    //        }
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
      this.getSinglePaymentApiCall();

      this.setState({
          disableSelectField:true
      })
      console.log("Did Of Collection");
      // this.getAllUsersApiCall();
         // this.getAllDealerApiCall();
         // this.getAllCustomerApiCall();
           this.message=''
      this.paymentArray=[];
      this.UniqueAccountPAymentNo=[]
      this.SerialNoOfStaticCheque=''
      this.UniqueOnlinePAymentNo='';
        this.UniqueChequePAymentNo=[];
      EventBus.on("saveCashEventBus",this.saveCashEventBusFunc );
        EventBus.on("saveBankEventBus",this.saveBankEventBusFunc );
    }
    ChequeNoEventBusFunc=e=>{
      console.log("New PAYMNET Account REF NO ......................................................" ,e);
      console.log("and Serial No" ,this.SerialNoOfStaticCheque );
      // this.state.newChequeValue[e.index]=e.referenceNo
          // this.state.newOnlineOfPayment[e.target.id]=''
      this.setState({
        newChequeValue:e.referenceNo
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

     // this.state.newOnlineValue[e.index]=e.id
      this.setState({
        newOnlineValue:e.id
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
      // this.state.newOnlineAccountValue[e.index]=e.accountId
      this.setState({
        newOnlineAccountValue:e.accountId
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
      isActive:false,
      modeOfPayment:'',

      CustomerType:'Customer type',
      userName:'Customer Name',

      date: new Date(),
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
      pageToLoad2:'',
      modalCollection: false,
      dropdownOpen: false,
      dues:'PKR -20,000',
      orderPrice:0,
        pageToLoadNew:'',
      pageToLoad1:'',
      pageToLoad2AndBanks:'',
           pageToLoad3AndBanks:'',
                pageToLoad4AndBanks:'',
      amountOfBags:'',
      tons:'',
      rate:750,
      pageToLoad3:'',
      collectedBy:"ali",
      paymentArray:[],
        pageToLoad4:'',
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
     if(e==='0'){
       // pageToLoadNew=''
     this.setState({
       pageToLoadNew:'',
       type:'cash'
     })
   }
     if(e==='1'){
     this.setState({
       pageToLoad1:'',
       pageToLoad1AndBanks:'',
            // pageToLoad2AndBanks:'',
            //      pageToLoad3AndBanks:'',
            //           pageToLoad4AndBanks:'',
       type:'cash'
     })
   }
   if(e==='2'){
   this.setState({
     pageToLoad2:'',
     // pageToLoad1AndBanks:'',
     pageToLoad2AndBanks:'',
          // pageToLoad3AndBanks:'',
          //      pageToLoad4AndBanks:'',

      type:'cash'

   })
 }
 if(e==='3'){
 this.setState({
   pageToLoad3:'',
   // pageToLoad1AndBanks:'',
   // pageToLoad2AndBanks:'',
        pageToLoad3AndBanks:'',
             // pageToLoad4AndBanks:'',

    type:'cash'

 })
}
if(e==='4'){
this.setState({
  pageToLoad4:'',
  // pageToLoad1AndBanks:'',
  // pageToLoad2AndBanks:'',
  //      pageToLoad3AndBanks:'',
            pageToLoad4AndBanks:'',

   type:'cash'

})
}
if(e==='5'){
  console.log("entered in Payment 5 cash");
this.setState({
  pageToLoad5:'',
   type:'cash'
})
}



   }
   onClickCheque=e=>{
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
   onClickOnline=e=>{
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
    EventBus.publish("AddingNewPaymentsEventBus", this.state.noOfPayments);
    this.setState({
      newAddedPayments:[...this.state.newAddedPayments,'']
    })
}
newDisplayFunc=e=>{
  console.log("value of recieved posts" , e);
  return e.pageToLoadNew;
}
paymentApiCall=e=>{
console.log("IN paymentApiCall" ,this.state.newOnlineAccountValue);
  var data={}
  if(this.state.type ==='cash'){
    data={
      payment_id:this.props.match.params.id,
      user_id:this.state.creditOfSelectedUser,
      remarks:this.state.newRemarksOfPayment,
      amount:this.state.newAmountOfPayment,
      paymentType:'cash',
    }
  }
  else if (this.state.type==='cheque') {
    data={
      payment_id:this.props.match.params.id,

      user_id:this.state.creditOfSelectedUser,
      remarks:this.state.newRemarksOfPayment,
      amount:this.state.newAmountOfPayment,
      paymentType:'cheque',
      chequeNumber:this.state.newChequeValue,
        // chequeDate:this.state.date,
        bank_id:this.state.newOnlineValue
    }

  }
  else{
    data={
      payment_id:this.props.match.params.id,

      user_id:this.state.creditOfSelectedUser,
      remarks:this.state.newRemarksOfPayment,
      amount:this.state.newAmountOfPayment,
      paymentType:'online',
      // chequeNumber:this.state.newChequeValue[i],
      //   chequeDate:this.state.date,
        account_id:this.state.newOnlineAccountValue,
        // draftDate:this.state.date
    }

  }
  console.log("data.amount");
  if(data.amount==='' || data.amount<1){
    console.log("data.amount if ");
    this.message='Please Enter Amount'
          this.notify("tc",false);
          this.setState({
              disableAlert:false
          })
  }
  else{
    var options = { method: 'POST',
        url: global.baseUrl + '/api/updatePayment',
        headers: {'Authorization': localStorage.getItem("token") },
         body:data,
        json: true
      };
  console.log("options of Payment collectionTab", options);
      request(options, (error, response, body) =>
      {
        if (error)
        {

          console.log("Error", error);

        }
        else
        {
    console.log("Respone in Payment CollectionTAB", response);

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
    this.message="Payment Updated Successfully"
         this.notify("tc",true);

  }
  // setTimeout(()=>{
  //   window.location.reload();
  //
  // },2000)
           // EventBus.publish("collectionPayments",true)
           setTimeout(()=>{
             this.props.history.push("/home/collectionhistory");

           },2000)
        }
      })
  }



}
onClickSave=e=>{
  this.setState({
      disableAlert:true
  })
  console.log("SAVE Button Clicked now.............");

     this.paymentApiCall();

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
  // this.state.newAmountOfPayment[e.target.id]=e.target.value
  this.setState({
    newAmountOfPayment:e.target.value
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
  // this.state.newRemarksOfPayment[e.target.id]=e.target.value
  this.setState({
    newRemarksOfPayment:e.target.value
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

      this.setState({
        newChequeOfPayment:this.state.newChequeOfPayment
      })
      if(this.state.newChequeOfPayment[e.target.id]==='on'){
        console.log("CHEQUE COMPONENT LOADEDDDDDDDDDDDDDDd");
        this.setState({
            pageToLoadNewPaymentCheque:<Cheque/>,
            pageToLoadNewPaymentChequeAndBank:<Online paymentNo={parseInt(e.target.id)+5}/>
        })
      }
      console.log("IN State cheque" , this.state.newChequeOfPayment);
      console.log("IN State online" , this.state.newOnlineOfPayment);
}
onClickNewPaymentCash=e=>{
  console.log("OnChange in cash of new Payment _________________________________________________",e.target.id);
      this.state.newCashOfPayment[e.target.id]='cash'
          this.state.newOnlineOfPayment[e.target.id]=''
              this.state.newChequeOfPayment[e.target.id]=''

      this.setState({
        newCashOfPayment:this.state.newCashOfPayment
      })
      if(this.state.newCashOfPayment[e.target.id]==='cash'){
        console.log("CHEQUE COMPONENT LOADEDDDDDDDDDDDDDDd");
        this.setState({
            pageToLoadNewPaymentCash:''
        })

      }
      console.log("IN State cheque" , this.state.newChequeOfPayment);
      console.log("IN State online" , this.state.newOnlineOfPayment);
}
onClickNewPaymentOnline=e=>{
    this.UniqueAccountPAymentNo=parseInt(e.target.id)+5;
    EventBus.on("accountOfBankEventBus",this.accountOfBankEventBusFunc);
  console.log("OnChange in Online of new Payment _________________________________________________",e.target.id);
      this.state.newOnlineOfPayment[e.target.id]=e.target.value
        this.state.newChequeOfPayment[e.target.id]=''
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


  render() {
  console.log("Render of Collection" , this.state.modeOfPayment);
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
              <LoadingOverlay
                    active={this.state.isActive}
                    spinner
                    text='Loading Collection Details'
                    >
              <Card style={{padding:'15px'}}>
            {  /* {this.state.pageToLoadNew}*/}
                       <h3 style={{margin:'10px 0px'}}>Edit Collection</h3>
            <h4 style={{margin:'10px', color:'green'}}><u>Edit Collection From Dealers/Customers</u></h4>
                <Form style={{marginLeft:'10px'}}>
                <FormGroup row>

                <Label for="search" sm={2}>Customer Name</Label>
                <Col  sm={2}>
                <Input readOnly type="text" name="select" id="typeOfDelivery" className="typeOfDelivery" onChange={this.oChangeDeliveredOrPermit} value={this.state.userName}>


                </Input>
                </Col>

                </FormGroup>
                <FormGroup row>
                <Label for="search" sm={2}>Customer Type</Label>
                <Col  sm={2}>
                <Input readOnly type="text" name="select" id="typeOfDelivery" className="typeOfDelivery" onChange={this.oChangeDeliveredOrPermit} value={this.state.CustomerType}>
                </Input>
                </Col>

                </FormGroup>
{     /*            <FormGroup row>
                 <Label sm={2}>Customer Type</Label>
                 <Col sm={2}>
                 <Label style={{marginTop:'7px'}}>
                     <Input onClick={this.onClickDealerCheckBox}type="radio" name="radio1" defaultChecked/>{' '}
                     Dealer
                     </Label>
                   </Col>
                    <Col sm={2}>
                    <Label style={{marginTop:'7px'}}>
                     <Input  onClick={this.onClickEndUserCheckBox}type="radio" name="radio1" />{' '}
                     Customer
                     </Label>
                      </Col>
                 </FormGroup>
                 <hr/>
              <FormGroup style={{marginLeft:'13%',marginTop:'4%'}} row>
      {
        (this.state.formToLoad ==='customer') ?
        <Col style={{display:'flex',flexDirection:'column' ,marginTop:'3px'}}sm={3}>
        <Label>Customer Name </Label>
        <select style={{borderRadius:'8px',height:'39px'}}
            onClick={this.onClickDealer}
            onChange={this.onChangeName}>
            {
              (this.state.disableSelectField) &&
              <option disabled selected hidden>
          Loading,Please Wait
              </option>
      }
                        <option selected hidden>
                     Select Customer
                          </option>
                                      {this.state.customerOption}

        </select>
        </Col>
         :
         <Col style={{display:'flex',flexDirection:'column' ,marginTop:'3px'}}sm={3}>
         <Label>Dealer Name </Label>
         <select style={{borderRadius:'8px',height:'39px'}}
             onClick={this.onClickCustomer}
             onChange={this.onChangeName}>
             {
               (this.state.disableSelectField) &&
               <option disabled selected hidden>
           Loading,Please Wait
               </option>
       }
         <option selected hidden>Select Dealer</option>
                     {this.state.DealerOption}
         </select>
         </Col>
      }

             <Col sm={3} style={{display:'flex',flexDirection:'column' ,marginTop:'3px'}}>
              <Label>Collection Date</Label>

              <DatePicker className='datePicker'
                         selected={this.state.date}
                         onChange={this.onChangeDate}
                       />

              </Col>

              <Col style={{display:'flex',flexDirection:'column' ,marginTop:'3px'}}sm={3}>
              <Label>Collected By</Label>
              <select style={{borderRadius:'8px',height:'39px'}}
                  onClick={this.onClickCustomer}
                  onChange={this.onChangeName}>
                  {
                    (this.state.disableSelectField) &&
                    <option disabled selected hidden>
                Loading,Please Wait
                    </option>
            }
              <option selected hidden>Select Dealer</option>
                          {this.state.DealerOption}
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
                   value={(this.state.creditOfSelectedCustomer).toLocaleString('en-IN')} placeholder="" />
              </Col>

              </FormGroup>

                  <hr/>*/}
              <h4 style={{float:'left'}}>PAYMENTS</h4>
          {/*    <div>
              <Button onClick={(e)=>{this.onClickAddPaymentFunc(e)}}
              style={{float:'right' , marginRight:'5%',padding: '4px 6px'}} color='info'>+</Button>
              </div>*/}
              <div style={{clear:'both'}}></div>
              <FormGroup row>
              <Label style={{minWidth:'100px'}} className='Payment' for="orderPrice" sm={1}>PAYMENTS</Label>
              <Col sm={2}>
              <Label data-tip="Mandatory Field" style={{marginTop: '35px',fontWeight:'bold',marginLeft:"10%"}}>Amount (PKR) <span style={{color:'red' , fontSize:'15px'}}>*</span> </Label>
              </Col>
              <Col sm={2}>
              <Label  className='main'style={{marginTop: '35px',fontWeight:'bold',marginLeft:"11%"}}>Mode Of Payment</Label>
              </Col>
              <Col sm={2}>
              <Label  style={{marginTop: '35px',fontWeight:'bold',marginLeft:"14%"}}>Remarks</Label>
              </Col>
              </FormGroup>
              <FormGroup row>
              <Label style={{minWidth:'100px'}} className='Payment' for="orderPrice" sm={1}>Payment</Label>
              <Col sm={2}>
                <Input min='0' style={{marginTop: '24px'}} type="number" placeholder="Amount (PKR)" id={'1'} value={this.state.newAmountOfPayment}onChange={this.onChangeAmont1}/>
              </Col>
              <Col sm={2}>
                <Input disabled min='0' style={{marginTop: '24px'}} type="text" placeholder="Mode Of Payment" id={'1'} value={this.state.modeOfPayment}/>
              </Col>
          {/*    <Col>
              <div style={{display:'flex',paddingTop:'10px', width:"60%"}}>
              <div  style={{marginTop: '24px', display:'none'}} className="optionDiv">
                <div hidden className="checkboxStyle">
                  <Label style={{marginRight:'26px'}} >
                  <Input readOnly onClick={()=>this.onClickCash('1')}type="radio" name="radio2" />{' '}
                  Cash
                    </Label>
                </div>
              <div hidden className="checkboxStyle">
                <Label>
                  <Input readOnly style={{marginLeft:'-14px'}}onClick={()=>this.onClickCheque('1')} type="radio" name="radio2" />{' '}
                  Cheque
                    </Label>
                </div>
                  <div hidden className="checkboxStyle" style={{marginLeft:"19px"}}>
                    <Label>
                    <Input readOnly style={{marginLeft:'-14px'}} onClick={()=>this.onClickOnline('1')} type="radio" name="radio2" />{' '}
                    Online
                      </Label>
                  </div>
                  </div>
                  <div hidden className="checkboxStyle1" >
                        {this.state.pageToLoad1}

                  </div>
                  <div style={{marginLeft:"220px"}}className="checkboxStyle1" >

                        {this.state.pageToLoad1AndBanks}
                  </div>
               </div >
              </Col>*/}
              <Col style={{marginRight:'60px',marginLeft:'-25px'}}sm={2}>

                <Input  style={{marginTop: '24px' , marginLeft:"14%"}} type="text"placeholder="Remarks" id={'1'}onChange={this.onChangeRemarks1} value={this.state.newRemarksOfPayment}/>

              </Col>

              </FormGroup>


              {/*<FormGroup row>
              <Label style={{minWidth:'100px'}} className='Payment' for="orderPrice" sm={1}>Payment 2</Label>
              <Col sm={2}>

                <Input  min='0' style={{marginTop: '24px'}} type="number" placeholder="Amount (PKR)" id={'2'}  value={Math.abs(this.state.newAmountOfPayment[2])} onChange={this.onChangeAmont2}  />

              </Col>
              <Col>

              <div style={{display:'flex',paddingTop:'10px', width:"60%"}}>
              <div   style={{marginTop: '24px'}} className="optionDiv">
                <div className="checkboxStyle">
                <Label style={{marginRight:'26px'}}>
                  <Input  onClick={()=>this.onClickCash('2')}type="radio" name="radio3" defaultChecked/>{' '}
                  Cash
                    </Label>
                </div>

              <div className="checkboxStyle">
                <Label>
                  <Input  style={{marginLeft:'-14px'}} onClick={()=>this.onClickCheque('2')} type="radio" name="radio3" />{' '}
                  Cheque
                    </Label>
                </div>
                  <div className="checkboxStyle" style={{marginLeft:"19px"}}>
                    <Label>
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
              <Col style={{marginRight:'60px',marginLeft:'-25px'}}sm={2}>
                <Input
                 style={{marginTop: '24px'}}
                 placeholder="Remarks"   id={'2'} onChange={this.onChangeRemarks2} />
              </Col>

              </FormGroup>
              <FormGroup row>
              <Label style={{minWidth:'100px'}} className='Payment' for="orderPrice" sm={1}>Payment 3</Label>
              <Col sm={2}>

                <Input min='0' style={{marginTop: '24px'}} type="number" placeholder="Amount (PKR)" id={'3'}  value={Math.abs(this.state.newAmountOfPayment[3])} onChange={this.onChangeAmont3} />

              </Col>
              <Col>

              <div style={{display:'flex',paddingTop:'10px', width:"60%"}}>
              <div  style={{marginTop: '24px'}}  className="optionDiv">
                <div className="checkboxStyle">
              <Label style={{marginRight:'26px'}}>
                  <Input  onClick={()=>this.onClickCash('3')}type="radio" name="radio4" defaultChecked/>{' '}
                  Cash
                    </Label>
                </div>

              <div className="checkboxStyle">
                <Label>
                  <Input  style={{marginLeft:'-14px'}} onClick={()=>this.onClickCheque('3')} type="radio" name="radio4" />{' '}
                  Cheque
                    </Label>
                </div>

                  <div className="checkboxStyle" style={{marginLeft:"19px"}}>
                    <Label>
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
              <Col style={{marginRight:'60px',marginLeft:'-25px'}}sm={2}>

                <Input  style={{marginTop: '24px'}} type="text" placeholder="Remarks"  id={'3'} onChange={this.onChangeRemarks3}/>

              </Col>

              </FormGroup>

                            <FormGroup row>
                            <Label style={{minWidth:'100px'}} className='Payment' for="orderPrice" sm={1}>Payment 4</Label>
                            <Col sm={2}>

                              <Input min='0' style={{marginTop: '24px'}}  type="number"  placeholder="Amount (PKR)" id={'4'}  value={Math.abs(this.state.newAmountOfPayment[4])} onChange={this.onChangeAmont4}/>

                            </Col>
                            <Col>

                            <div style={{display:'flex',paddingTop:'10px', width:"60%"}}>
                            <div  style={{marginTop: '24px'}} className="optionDiv">
                              <div className="checkboxStyle">
                              <Label style={{marginRight:'26px'}}>
                                <Input  onClick={()=>this.onClickCash('4')}type="radio" name="radio5" defaultChecked/>{' '}
                                Cash
                                  </Label>
                              </div>

                            <div className="checkboxStyle">
                              <Label>
                                <Input   style={{marginLeft:'-14px'}}onClick={()=>this.onClickCheque('4')} type="radio" name="radio5" />{' '}
                                Cheque
                                  </Label>
                              </div>

                                <div className="checkboxStyle" style={{marginLeft:"19px"}} >
                                  <Label>
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
                            <Col style={{marginRight:'60px',marginLeft:'-25px'}}sm={2}>

                              <Input  style={{marginTop: '24px'}} type="text" placeholder="Remarks"  id={'4'} onChange={this.onChangeRemarks4} />

                            </Col>

                            </FormGroup>

                                  {
                                    this.state.newAddedPayments.map((e,i)=>{
                                      return(
                                        <FormGroup key={i} row>
                                        <Label style={{minWidth:'100px'}} className='Payment' sm={1}>Payment {i+5}</Label>
                                        <Col sm={2}>
                                          <Input min='0' style={{marginTop: '24px'}} id={i} name='amount'  value={Math.abs(this.state.newAmountOfPayment[i+5])}
                                            onChange={(e)=>this.onChangeAmount(e)} type="number" placeholder="Amount (PKR)" />
                                        </Col>
                                        <Col>
                                        <div style={{display:'flex',paddingTop:'10px', width:"60%"}}>
                                        <div  style={{marginTop: '24px'}} className="optionDiv">
                                          <div className="checkboxStyle">
                                            <Label style={{marginRight:'26px'}}>
                                            <Input  id={i} onClick={(e)=>this.onClickNewPaymentCash(e)} type="radio" name={i} defaultChecked/>{' '}
                                            Cash
                                              </Label>
                                          </div>
                                        <div className="checkboxStyle">
                                          <Label>
                                            <Input  style={{marginLeft:'-14px'}}  id={i} onClick={(e)=>this.onClickNewPaymentCheque(e)} type="radio" name={i} />{' '}
                                            Cheque
                                              </Label>
                                          </div>
                                            <div className="checkboxStyle" style={{marginLeft:"19px"}}>
                                              <Label>
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
                                        <Col style={{marginRight:'60px',marginLeft:'-25px'}}sm={2}>

                                          <Input
                                           style={{marginTop: '24px'}} id={i}
                                          type="text" placeholder="Remarks" name='remarks'
                                          onChange={(e)=>this.onChangeRemarks(e)} />

                                        </Col>

                                        </FormGroup>
                                      )
                                    })
                                  }*/}
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
   </LoadingOverlay>


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

    );
  }
}

export default EditCollection ;
