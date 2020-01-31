import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import 'react-table/react-table.css'
import ReactTable from "react-table";
// import ExcellentExport from 'excellentexport';

// import { Router, Route, Switch, Redirect } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import EventBus from 'eventing-bus';
import LoadingOverlay from 'react-loading-overlay';
import DatePicker from "react-datepicker";
import {
  JsonToExcel
} from 'react-json-excel';
import {
   Form,
   FormGroup,
   Label,
   Card,
   // CardBody,
   // Spinner ,
   // Table,
   // Row,
   Col,
   // Nav,
   Button
   ,Modal, ModalHeader, ModalBody
} from "reactstrap";
// import "./CustomerLedgerStyling.css"
var request = require("request");
var moment = require('moment');
// const url = global.baseUrl
let  listOfUserRow='';
let listOfUserArray=[];
let urlPrams='';
var creditOfEachCustomer=[]
var selectedDealer =[]
var valueOfAllDealer=''
// var listOfOption=[]
// var selectedCustomer =[]
// var valueOfAllCustomer=''
var creditOfEachDealer=[]
// var creditOfEachCustomer=[]
var listOfOptioninCustomer=[]
// var ledgerData=[]
var totalNoOfRows=10
var bagSum = 0
var balanceSum=0
var tonSum=0
var valueExcGst=0
var gstValue=0
var invoiceAmountValue=0
var advanceTaxValue=0
var amountValue=0
var balanceValue=0
// var defaultDate = new Date(new Date().getFullYear(), 0, 1);
// var subtr = 0
// var startingBalance = 0
// var finalResult = 0
// var allBalances = []

const className = 'nameChange',
  // filename = 'Excel-file',
  fields = {
    "name": 'Customer Name',
    "address": 'Customer Address',
    "contact": 'Contact',
    "nic": 'NIC No',
    "ntn": 'NTN No',
    "ntnStatus": 'NTN Status',
    "strn": 'STRN',
    "closingBalance": 'Closing Balance'
  },
  style = {
    padding: "5px"
  },
  data = [
  { index: 0, guid: 'asdf231234'},
  { index: 1, guid: 'wetr2343af'}
];
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
class CustomerBalances extends React.Component {
  constructor(props){
    super(props);
    this.allBalances = []
    this.arrayToExport=[]
    this.ledgerData = []
    this.subtr = 0
    this.startingBalance = 0
    this.state={
      notdisbaleExportBtn:false,
      exportExel:false,
      isActiveCalculateLedger:false,
      isActiveSingleUser:true,
      searchValue:0,
      userId:'',
      disableSelectField:false,

      dateToDealer:new Date() ,
      dateFromDealer:new Date(2017, 0, 1),
      // dateFromDealer:new Date(),
      dealerCode:'',
      formToLoad:'',
      creditOfSelectedCustomer:'',
      DealerOption:[],
      customerOption:[],
      posts:[],
      noDataFound:'Loading',
      isSuper:false,
      date:'',
      isActive:'',
       modal: false

      // isChecked:true
    }
      // this.isActive=true;


 this.toggle = this.toggle.bind(this);
  }

  backToZero = () => {

    this.startingBalance = 0
this.subtr = 0
    this.setState({
      balanceStart: 0
    })

    console.log("Back to Zero");

  }

  getBalanceForDate=e=>{

    var body =
    {
      user_id:this.props.match.params.id,
      date: this.state.dateFromDealer
    }


    var options = { method: 'POST',
        url: global.baseUrl + '/getCustomersCustomBalance',
        headers: {'Authorization': localStorage.getItem("token") },
        body:body,
        json: true
      };

  console.log("Sending Request", options, body);

    request(options, (error, response, body) =>
    {
      if (error)
      {
        console.log("Error", error);
        this.message='SomeThing Went Wrong ..'
          this.notify("tc",false);
      }
      else
      {
        console.log("**Respone in getCustomersCustomBalance", response);
        if(response.statusCode=== 200){

          console.log("Initial Balance", body.balance);
          this.startingBalance = body.balance

          console.log("Starting Balance", body.balance);
          this.customerBalancesApiCall();
        }
        else{
          this.subtr = 0
          this.setState({
            balanceStart: 0
          })
        }
      }
    })

  }
  getLedgerDetailsSearch=e=>{

    var body={
      to:this.state.dateToDealer ,
       from:this.state.dateFromDealer ,
      user_id:this.props.match.params.id
    }

    var options = { method: 'POST',
        url: global.baseUrl + '/calculateLedger',
        headers: {'Authorization': localStorage.getItem("token") },
        body:body,
        json: true
      };

      console.log("options of Ledger ", options);
      request(options, (error, response, body) =>

      {

        if (error)
        {
          console.log("Error", error);
          this.message='SomeThing Went Wrong ..'
            this.notify("tc",false);
        }
        else{

          console.log("**Respone in calculateLedger", response);
          if(response.statusCode=== 200 && response.body.reslut!==[]){

            this.ledgerData1 = body.result.order.map((i,data)=>{
              console.log("Within MAp" ,i);
                var filer = "*"
                if (i.order !== undefined)
                {
                  if(i.order.isFiler && i.order.isActiveFiler){
                     filer="Filer (Active)"
                  }
                  if(i.order.isFiler && !i.order.isActiveFiler){
                     filer="Filer (In Active)"
                  }

                  if (!i.isFiler)
                  {
                    filer = "Non-Filer"
                  }

                }

                var date="*"
                var address=''
                var fromAddress=''
                if (i.order.createdAt)
                {
                  var d = i.order.createdAt.split('T')
                  // let date=moment(i.createdAt).format('MMMM Do YYYY, h:mm a');
                  // let date=moment(i.createdAt).format('LT');
                  date = `${d[0]}`
                }

                if(i.order.address === 'Rawalpindi (RWP)'){
                  address='RWP'
                }
                else if (i.order.address === 'Sawabi (SWB)') {
                  address='SWP'
                }
                if (i.order.fromAddress === 'Hattar (HTR)') {
                  fromAddress='HTR'
                }
                else if (i.order.fromAddress === 'Chakwal (CHK)') {
                  fromAddress='CHK'
                }
                else if (i.order.fromAddress === "Farooqia (FAR)") {
                  fromAddress='FAR'
                }
                else if (i.order.fromAddress === 'KalarKahar (KK)') {
                  fromAddress='KK'
                }
                return {
                  "id":i.order._id,
                  "date":date,
                  "sTaxInvNo":i.order.invoiceNumber,
                  "biltyNo":i.order.biltyNumber,
                  "address":`${address} - ${fromAddress}`,
                  "type":filer,
                  "quantityBags":i.order.quantity,
                  "quantityTons":i.totalTons,
                  "grossRate":i.grossRate,
                  "value":i.valueExcGST,
                  "gst":i.GSTwithMRP,
                  "invoiceAmount":i.order.totalAmount,
                  "advanceTax":i.advanceTax,
                  "x1":"-",
                  "x2":"-",
                  "mop":"-",
                  "instrumentNo":"-",
                  "amount":"0",
                  "balance":"-"
                  }
            })

            this.ledgerData2 = body.result.payments.map((i,data)=>{
                var filer = "-"

                if (i.order !== undefined)
                {
                  if(i.order.isFiler && i.order.isActiveFiler){
                     filer="Filer (Active)"
                  }
                  if(i.order.isFiler && !i.order.isActiveFiler){
                     filer="Filer (In Active)"
                  }

                  if (!i.isFiler)
                  {
                    filer = "Non-Filer"
                  }

                }

                var date="-"
                if (i.date)
                {
                  var d = i.date.split('T')
                  // let date=moment(i.createdAt).format('MMMM Do YYYY, h:mm a');
                  // let date=moment(i.createdAt).format('LT');
                  date = `${d[0]}`
                }

                // var instrumentNo = "-"


                return {
                  "id":i._id,
                  "date":date,
                  "sTaxInvNo":"-",
                  "biltyNo":"-",
                  "address":"-",
                  "type":filer,
                  "quantityBags":"-",
                  "quantityTons":"-",
                  "grossRate":0,
                  "value":0,
                  "gst":0,
                  "invoiceAmount":0,
                  "advanceTax":0,
                  "x1":"-",
                  "x2":"-",
                  "mop":i.paymentType,
                  "instrumentNo":"-",
                  "amount":i.amount,
                  "balance":"-"
                  }
            })
            this.ledgerData = this.ledgerData1.concat(this.ledgerData2);
           bagSum=0

           tonSum=0
           valueExcGst=0
           gstValue=0
           invoiceAmountValue=0
           advanceTaxValue=0
           amountValue=0

            for (let i = 0; i <= this.ledgerData.length; i++) {
              if(this.ledgerData[i]!==undefined){
                if(this.ledgerData[i].quantityBags!==undefined){
                  if(this.ledgerData[i].quantityBags!== '-'){
                    // console.log("in Loop done" ,this.ledgerData[i].quantityBags );
                   bagSum += this.ledgerData[i].quantityBags
                   console.log("bagSum",bagSum);
                  }
                }

              }

            }
            for (let i = 0; i <= this.ledgerData.length; i++) {
              if(this.ledgerData[i]!==undefined){
                if(this.ledgerData[i].quantityTons!==undefined){
                  if(this.ledgerData[i].quantityTons!== '-'){
                    // console.log("in Loop done" ,this.ledgerData[i].quantityTons );
                   tonSum += this.ledgerData[i].quantityTons
                   console.log("tonSum",tonSum);
                  }
                }

              }

            }
            for (let i = 0; i <= this.ledgerData.length; i++) {
              if(this.ledgerData[i]!==undefined){
                if(this.ledgerData[i].value!==undefined){
                  if(this.ledgerData[i].value!== '-'){
                    // console.log("in Loop done" ,this.ledgerData[i].value );
                   valueExcGst += this.ledgerData[i].value
                   console.log("valueExcGst",valueExcGst);
                  }
                }

              }

            }
            for (let i = 0; i <= this.ledgerData.length; i++) {
              if(this.ledgerData[i]!==undefined){
                if(this.ledgerData[i].gst!==undefined){
                  if(this.ledgerData[i].gst!== '-'){
                    // console.log("in Loop done" ,this.ledgerData[i].gst );
                   gstValue += this.ledgerData[i].gst
                   console.log("gstValue",gstValue);
                  }
                }

              }

            }
            for (let i = 0; i <= this.ledgerData.length; i++) {
              if(this.ledgerData[i]!==undefined){
                if(this.ledgerData[i].invoiceAmount!==undefined){
                  if(this.ledgerData[i].invoiceAmount!== '-'){
                    // console.log("in Loop done" ,this.ledgerData[i].invoiceAmount );
                   invoiceAmountValue += this.ledgerData[i].invoiceAmount
                   console.log("invoiceAmountValue",invoiceAmountValue);
                  }
                }

              }

            }
            for (let i = 0; i <= this.ledgerData.length; i++) {
              if(this.ledgerData[i]!==undefined){
                if(this.ledgerData[i].advanceTax!==undefined){
                  if(this.ledgerData[i].advanceTax!== '-'){
                    // console.log("in Loop done" ,this.ledgerData[i].advanceTax );
                   advanceTaxValue += this.ledgerData[i].advanceTax
                   console.log("advanceTaxValue",advanceTaxValue);
                  }
                }

              }

            }
            for (let i = 0; i <= this.ledgerData.length; i++) {
              if(this.ledgerData[i]!==undefined){
                if(this.ledgerData[i].amount!==undefined){
                  if(this.ledgerData[i].amount!== '-'){
                    // console.log("in Loop done" ,this.ledgerData[i].amount );
                   amountValue += parseInt(this.ledgerData[i].amount)
                   console.log("amountValue",amountValue);
                  }
                }

              }

            }
             this.subtr = 0
            this.setState({
                posts:this.ledgerData,
                isActive:false
            })

          }
          else
          {
            console.log("Else");
this.subtr = 0
            this.setState({
              disableSelectField: false,
              isActiveSingleUser: false,
              isActive:false
            })

          }
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
  this.subtr = 0
  this.setState({
      disableSelectField:false
  })

    listOfOptioninCustomer = response.body.result;
    selectedDealer=[]
    listOfOptioninCustomer.forEach((item, index)=>{
       valueOfAllDealer=JSON.stringify(item);
      selectedDealer.push(<option key ={index} value = {valueOfAllDealer}>{item.name}</option>)
       creditOfEachDealer.push(
         {
           id:item._id,
           credit:item.credit
         }
       )
    })
    console.log("CREDIT STATUS OBJECT" , creditOfEachDealer);
    this.subtr = 0
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
//   getSingleUserApiCall=e=>{
//     var data={
//       user_id:this.props.match.params.id
//     }
//     var options = { method: 'POST',
//         url: global.baseUrl + '/api/getSingleUser',
//         headers: {'Authorization': localStorage.getItem("token") },
//         body:data,
//         json: true
//       };
//   console.log("options of Get Single User ", options);
//       request(options, (error, response, body) =>
//
//       {
//         if (error)
//         {
//           console.log("Error", error);
//         }
//         else
//         {
//           console.log("Respone in Get Single user", response);   
//   this.subtr = 0
//   this.setState({
//       disableSelectField:false,
//       isActiveSingleUser:false
//   })
//   if(!response.body.success){
//     this.message=response.body.message
//     this.notify("tc",false);
//   }
//   else{
//     var i=response.body.result
//
//             if(i.ntnStatus === 'nonActive'){
//               this.subtr = 0
//               this.setState({ntnStatus:'Non Active'})
//             }
//             if(i.ntnStatus==="active"){
//               this.subtr = 0
//               this.setState({ntnStatus:'Active'})
//             }
//             if(i.type=== "dealer"){
//               this.subtr = 0
//               this.setState({
//                 type: 'Dealer'
//               })
//             }
//             if(i.type === 'customer'){
//               this.subtr = 0
//               this.setState({
//                 type: 'Customer'
//               })
//             }
// this.subtr = 0
//              this.setState({
//                code:i.code,
//                name:i.name,
//        buisnessName:i.buisnessName,
//                address:i.address,
//                mobile:i.mobile,
//                nic:i.nic,
//                ntn:i.ntn,
//                strn:i.strn,
//                type:i.type
//
//
//
//              })
//           }
//   }
//
//       })
//   }
  onClickCustomer=e=>{
  console.log("Getting Value of full OPTION " ,e.target.value);
this.subtr = 0
  this.setState({
    dealerCode:JSON.parse(e.target.value)._id
  })
    console.log("Dealer CLICKED" , JSON.parse(e.target.value)._id);

  creditOfEachCustomer.forEach((item, index)=>{
    console.log("ITEM" ,item.id);
   if(JSON.parse(e.target.value)._id === item.id)
   {
     this.subtr = 0
     this.setState({
       creditOfSelectedCustomer:item.credit
     })
   }
   })
  }
  onClickDealer=e=>{
  console.log("Getting Value of full OPTION " ,e.target.value);
  //
  this.subtr = 0
  this.setState({
    dealerCode:JSON.parse(e.target.value)._id
  })
    console.log("Dealer CLICKED" , JSON.parse(e.target.value)._id);

  creditOfEachDealer.forEach((item, index)=>{
    console.log("ITEM" ,item.id);
   if(JSON.parse(e.target.value)._id === item.id)
   {
     this.subtr = 0
     this.setState({
       creditOfSelectedCustomer:item.credit
     })
   }

   })
  }
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

    apiCall= e=>{
   var data={
     to:this.state.dateToDealer ,
      from:this.state.dateFromDealer ,
      user_id:this.props.match.params.id
    }
   listOfUserArray=[]
 var options = { method: 'POST',
      url: global.baseUrl + '/api/viewAllOrders',
      headers: {'Authorization': localStorage.getItem("token") },
     body:data,
      json: true
    };
console.log("options of Customer Ledgers", options);
    request(options, (error, response, body) =>

    {
      if (error)
      {
  this.message="Something Went Wrong .."
  this.notify("tc",false);
  this.subtr = 0
  this.setState({
      disableAlert:false
  })

        console.log("Error", error);
      }
      else
      {
        console.log("Respone :: of Custonmer Ledger ", response);
this.subtr = 0

          this.setState({
            isActive:false
          })
        this.isActive=false; 

        if(response.body.success!==false){

      // this.responseToSend = response.body.user;
       if(this.responseToSend===[])
       {
         this.subtr = 0
         this.setState({
           noDataFound:"Record Not Found"
         })

       }
  //    console.log("BEFORE MAPPING IN LIST OF ALL USER***** ", response.body.user);
  //    this.response=response.body.result.map((i,data)=>{
  //      var d=i.createdAt.split('T')
  //      if(i.deliveryItemType === 'Bulk'){
  //        listOfUserRow =
  //          {
  //          id:(i._id),
  //          date:('date'),
  //          sNo:(data),
  //          sTaxInvNo:('sTaxInvNo'),
  //          biltyNo:('biltyNo'),
  //          address:('address'),
  //          type:('type'),
  //          quantityBags:('BAGS'),
  //          quantityTons:("TONS"),
  //          x1:('-'),
  //          x2:('-'),
  //          grossRate:('grossRate'),
  //          value:('value'),
  //          gst:('gst'),
  //          invoiceAmount:('invoiceAmount'),
  //          wht:("W.H.T"),
  //          mop:('mop'),
  //          instrumentNo:('instrumentNo'),
  //          amount:('amount'),
  //          balance:('balance'),
  //        };
  //      }
  // else
  //   {    listOfUserRow =
  //     {
  //     id:(i._id),
  //     sNo:(data),
  //     date:('date'),
  //     sTaxInvNo:('sTaxInvNo'),
  //     biltyNo:('biltyNo'),
  //     address:('address'),
  //     quantityBags:('BAGS'),
  //     quantityTons:("TONS"),
  //     type:('type'),
  //     quantity:('quantity'),
  //     grossRate:('grossRate'),
  //     value:('value'),
  //     gst:('gst'),
  //     invoiceAmount:('invoiceAmount'),
  //     wht:("W.H.T"),
  //     x1:('-'),
  //     x2:('-'),
  //     mop:('mop'),
  //     instrumentNo:('instrumentNo'),
  //     amount:('amount'),
  //     balance:('balance'),
  //   };
  //     }
  //     return  listOfUserArray.push(listOfUserRow);
  //    })
     console.log("after mapping " , this.response);
   // this.setState({
   //     posts:listOfUserArray
   // })
} 
else{
  console.log("Else");
  this.message=response.body.message
  this.notify("tc",false);
}   


      }
    })



  }
  customerBalancesApiCall=e=>{
    this.setState({
      isActiveCalculateLedger:true,
      balanceSum:0
    })
  listOfUserArray=[]
this.subtr = 0
    var body={
      to:this.state.dateToDealer ,
      // user_id:this.state.dealerCode,
      from: this.state.dateFromDealer,
      // collectedBy:this.state.userCode
             }
    console.log("Sending Body", body);
    var options = { method: 'POST',
        url: global.baseUrl + '/api/userBalanceReport',
        headers: {'Authorization': localStorage.getItem("token") },
        body:body,
        json: true
      };
      console.log("options of userBalanceReport ", options);
      request(options, (error, response, body) =>
      {
  var paymentData=[]
        if (error)
        {
          console.log("Error", error);
          this.message='SomeThing Went Wrong ..'
            this.notify("tc",false);
        }
        else{
          console.log("**Respone in userBalanceReport", response);
          if(response.body.result.length!==0){
            this.setState({
              notdisbaleExportBtn:true
            })
          }
          this.setState({
            isActiveCalculateLedger:false,

          })
          if(response.statusCode=== 200 && response.body.result!==[]){
            this.subtr = 0
            this.setState({
              isActiveCalculateLedger:false
            })

            this.ledgerData1 = response.body.result.map((i,data)=>{
              // console.log("Within MAp" ,i);
              if(i.user_id.type==='dealer' || i.user_id.type==='end user'){
                   console.log("Within MAp......>>>>" , i);
                   var ntnStatus=''
                   if(i.user_id.ntnStatus==="active"){
                     ntnStatus="Active"
                   }
                   if(i.user_id.ntnStatus==="nonActive"){
                     ntnStatus="Non Active"
                   }
                   console.log("");
                    var commaOfAdressTODot=i.user_id.address
                     console.log("commaOfAdressTODot" , commaOfAdressTODot);
                    var res=commaOfAdressTODot.replace(/,/g, " ");
                    var removedLineBreaks=res.replace(/(\r\n|\n|\r)/gm,"");
                    console.log("commaOfAdressTODot after replace " , removedLineBreaks);
                   listOfUserRow =
                           {
                           id:(i._id),
                             name:(i.user_id.name),
                           address:(removedLineBreaks),
                           contact:(i.user_id.mobile)+"..",
                           // buisnessName:(i.user_id.buisnessName),
                           nic:i.user_id.nic+"..",
                           ntn:(i.user_id.ntn+".."),
                           ntnStatus:(ntnStatus),
                           strn:(i.user_id.strn)+"..",
                           closingBalance:(i.balance),
                         };
                 return  listOfUserArray.push(listOfUserRow);
               }
            }
          )
            totalNoOfRows=listOfUserArray.length
            // console.log("after mapping... " , listOfUserRow);
          this.setState({
              posts:listOfUserArray
          })
          setTimeout(()=>{
            console.log('after mapping....', this.state.posts);
          },1000)
          balanceSum=0
            for (let i = 0; i <= listOfUserArray.length; i++) {
              if(listOfUserArray[i]!==undefined){
                console.log("AMOUNT SUM ...>>> " , listOfUserArray[i].closingBalance);
                // if(this.ledgerData[i].quantityBags!=undefined){
                //   if(this.ledgerData[i].quantityBags!= '-'){
                //     // console.log("in Loop done" ,this.ledgerData[i].quantityBags );
                   balanceSum += listOfUserArray[i].closingBalance
                //   }
                // }
              }
            }
            this.setState({
              balanceSum:balanceSum
            })
            console.log("AMOUNT SUM AFTER",balanceSum);
            for (let i = 0; i <= this.ledgerData.length; i++) {
              if(this.ledgerData[i]!==undefined){
                if(this.ledgerData[i].gst!==undefined){
                  if(this.ledgerData[i].gst!== '-'){
                    // console.log("in Loop done" ,this.ledgerData[i].gst );
                   gstValue += this.ledgerData[i].gst
                   console.log("gstValue",gstValue);
                  }
                }

              }

            }

          }
          else
          {
            console.log("Else");
this.subtr = 0
            this.setState({
              disableSelectField: false,
              isActiveSingleUser: false,
              isActive:false
            })

          }
        }

  })

  }
  componentDidMount(){
    console.log(".......did" , balanceSum);
 amountValue=0
 bagSum=0
 // balanceSum=0
 tonSum=0
 valueExcGst=0
 gstValue=0
 invoiceAmountValue=0
 advanceTaxValue=0
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
  this.subtr = 0
    this.setState({
        disableSelectField:true
    })
//     var curr = new Date();
//     curr.setDate(curr.getDate() + 3);
//     var date = curr.toISOString().substr(0,10);
// this.setState({
//       dateToDealer:date
// })
    var x = localStorage.getItem("profile");
    console.log("DID MOUNT OF LIST OF USER" ,x );
      // this.getSingleUserApiCall();
    // this.getAllCustomerApiCall();
    this.getBalanceForDate()
    // this.apiCall();
     this.response = '';
     this.responseToSend='';
     this.index= '';
     this.type='';
     this.message='';
EventBus.on("OrderCreatedEventBuss",this.OrderCreatedEventBussFunc );
  // EventBus.on("dateEventingBus",this.dateEventingBusFunc );
  }
  OrderCreatedEventBussFunc=e=>{
    console.log("Order Created Successfully" , e);
  }
  componentWillMount(){
    	// this.setState( { isChecked: this.props.isChecked } );
  }
  onClickDetail=e=>{
    setTimeout(() => {
      console.log("Detail button  clicked" , this.index );
      urlPrams= '/admin/listofusersdetail/' + this.index;
       this.props.history.push(urlPrams);
       console.log("URL PARAMS" , urlPrams);
       // EventBus.publish("apiCall",this.responseToSend)
}, 1000);
  }
  deleteRow=id=>{
    console.log("ID",id);
    const index=this.state.posts.findIndex(post=>{
      return (post.id===id)
    })
    console.log('INDEX',index  );
    let copyPosts = [...this.state.posts]
       copyPosts.splice(index,1)
this.subtr = 0
     this.setState({posts:copyPosts})﻿

  }
  filterMethod = (filter, row, column) => {
    console.log("row" ,filter.pivotId , "AND" , filter.id);

    const id = filter.pivotId || filter.id

    return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase()) : true

  }
// onChangeAdmin=e=>{
// // if(e.target.checked){
// //
// //   // this.setState({
// //   //   isChecked:true
// //   // });
// // }
// // else{
// //   // this.setState({
// //   //   isChecked:false
// //   // });
// // }
//
//
// console.log("ON OFF VALUE",e.target.checked);
// if(e.target.checked=== true){
//   console.log("true");
//   var data={
//        user_id:this.index,
//   }
//   var options = { method: 'POST',
//         url: global.baseUrl + '/api/makeAdmin',
//         headers: {'Authorization': localStorage.getItem("token") },
//         body:data,
//         json: true
//       };
//   console.log("options of MAKE ADMIN", options);
//       request(options, (error, response, body) =>
//
//       {
//         if (error)
//         {
//           console.log("Error", error);
//         }
//         else
//         {
//           console.log("Respone of MAKE ADMIN :: ", response);   
//          this.message=response.body.message
//          console.log(   "MESSAGE" , this.message);
//     if(response.body.success)
//     {
//       console.log("UNAUTHORIZEDDD PERSON");
//      this.message='Edited User Successfully'
//
//
//     }
//     else{
//
//     }
//            this.apiCall();
//        // if(body.success){
//        //   console.log("success :: ", body)
//        //
//        // }
//        // else {
//        //   console.log("success false :: ", body);
//        // }
//         }
//       })
//
//
//   // AGAIN API CALL OF ALL USER Detail
//
// }
// else{
//   console.log('false');
//     var data={
//          user_id:this.index,
//         // type:this.type
//         type:'null'
//     }
//     var options = { method: 'POST',
//           url: global.baseUrl + '/api/removeAdmin',
//           headers: {'Authorization': localStorage.getItem("token") },
//        body:data,
//           json: true
//         };
//     console.log("options of REMOVE ADMIN", options);
//         request(options, (error, response, body) =>
//
//         {
//           if (error)
//           {
//             console.log("Error", error);
//           }
//           else
//           {
//             console.log("Respone of REMOVE ADMIN :: ", response);   
//      this.message=response.body.message
//     if(response.body.message)
//     {
//       console.log("UNAUTHORIZEDDD PERSON");
//
//     }
//              this.apiCall();
//           // window.location.reload();
//          // if(body.success){
//          //   console.log("success :: ", body)
//          //
//          // }
//          // else {
//          //   console.log("success false :: ", body);
//          // }
//           }
//         })
// }
//
//   }
getTdPropsFunc=(state, rowInfo, column, instance) => {

            return {

              onClick: (e, handleOriginal) => {
  if(rowInfo!==undefined){
    // console.log("It was in this row:", rowInfo.original.id);
    //                 console.log("It was in this row:", rowInfo.original.type);
                    this.index= rowInfo.original.id;
                    this.type=rowInfo.original.type;
}

     
              }

            };

          }
onChangeDate=e=>{
  // this.setState({
  //   isActive:true
  // })
      // this.isActive=true; 
  console.log("DATE",e.target.value);
  this.subtr = 0
this.setState({
  date:e.target.value
})
// setTimeout(()=>{
//   this.apiCall();
// },1000)


}
onChangeDateFromDealer=e=>{
  console.log("dateFromDealer",e);
  this.subtr = 0
this.setState({
  dateFromDealer:e
})
}
onChangeDateToDealer=e=>{
  console.log("dateToDealer",e);
  this.subtr = 0
  this.setState({
    dateToDealer:e
  })
}

onClickDealerCheckBox=e=>{
  this.subtr = 0
  this.setState({
    formToLoad:'dealer'
  })

}
onClickEndUserCheckBox=e=>{
  this.subtr = 0
  this.setState({
    formToLoad:'customer'
  })

}
onChangeDealer=e=>{
  var dealerId=JSON.parse(e.target.value)
  console.log("onChangeDealer............................... " , dealerId._id );
  this.subtr = 0
  this.setState({
    userId:dealerId._id
  })

}
onChangeCustomer=e=>{
  var customerId=JSON.parse(e.target.value)
  console.log("onChangeCustomer............................... " , customerId._id );
  this.subtr = 0
  this.setState({
    userId:customerId._id
  })
}
onClickSearch=e=>{
  this.subtr = 0
  // this.setState({
  //   isActive:true
  // })
  console.log("Search clicked");
  if(this.state.dateFromDealer > this.state.dateToDealer){
      console.log('dateToDealer is greater');
      this.message='End Date Should Not Be Less Than Starting Date '
       this.notify("tc",false); 
       this.subtr = 0
       this.setState({
           disableBtn:false,
           isActive:false
       })  
    }else{
      this.customerBalancesApiCall();
    }
}
onChangeCustomer=e=>{
  var customerId=JSON.parse(e.target.value)
  console.log("onChangeCustomer............................... " , customerId._id );
  this.subtr = 0
  this.setState({
    userId:customerId._id
  })

}
onClickPrint=e=>{
  console.log("Print Action Clicked");
}
balanceFunc=e=>{
  console.log("balanceValue ....func" , e);
balanceValue=e
}
onClickExportExel=e=>{
console.log("malik....................................................................." , listOfUserArray.length);
  this.arrayToExport = listOfUserArray.map((i,data)=>{
     // console.log("i of ledgerData " , i);
     // console.log("this.allBalances[data]" ,data ,this.allBalances);
     i.valueOfBalance=this.allBalances[data] ;
     // i.push(this.allBalances[data])
     console.log("i of ledgerData" ,i );
  })
this.subtr = 0
  this.setState({
    exportExel:true,
    data:listOfUserArray
  })
  if(this.state.notdisbaleExportBtn &&  listOfUserArray.length!==0)
  {
    console.log("in iff" , );
  this.setState(prevState => ({
    modal: !prevState.modal
  }));
}
else{
  this.message='No Customer Balances Found'
    this.notify("tc",false);
}
}
onClickJsonToExcel=e=>{
  console.log("onClickJsonToExcel");
  this.setState(prevState => ({
    modal: !prevState.modal
  }));
}
toggle() {
  this.setState(prevState => ({
    modal: !prevState.modal
  }));

}

// exellentExcelExport=e=>{
//   console.log("exellentExcelExport"  ,e.target);
// return ExcellentExport.excel(this, 'datatable', 'Sheet Name Here');
//   console.log("exellentExcelExport ... ", ExcellentExport.excel(this, 'datatable', 'Sheet Name Here'));
// }
  render() {
    console.log(".......render ...", totalNoOfRows);
    console.log("RENDOR");
    let posts = this.state.posts
  		if (this.state.searchValue) {
  			posts = posts.filter(row => {
  				return row.date.includes(this.state.searchValue) ||
          row.name.includes(this.state.searchValue) ||
            row.type.includes(this.state.searchValue) ||
              row.email.includes(this.state.searchValue) ||
                row.bank.includes(this.state.searchValue) ||
                  row.remarks.includes(this.state.searchValue)
  			})
  		}
    const columns=[
      {
        Header:'ID',
        accessor:'id',

        style:{

          paddingTop:'23px',

        },
        show: false

      },
      {
        Header:'Customer Name',
        accessor:'name',
        width:160,

        filterable: true,
        id:"row",
        style:{

          paddingTop:'23px',
          textAlign:'center'

        },
      },

      {
        Header:'Customer Address',
        accessor:'address',
      /*  Cell: (row) => {
          console.log("before change :: ", row.original.address);
          var res=row.original.address.replace(//g, ',')
          console.log("after change :: " , res);
          return <div>{res}</div>;
        },*/
        width:160,
        style:{

          paddingTop:'23px',
                textAlign:'center'

        },
        sortMethod: (a, b) => {

          if (a.length === b.length) {
            return a > b ? 1 : -1;
          }
          return a.length > b.length ? 1 : -1;
        }
      },
      {
        Header:'Contact',
        accessor:'contact',
        width:160,
        style:{

          paddingTop:'23px',
                textAlign:'center'

        },
        sortMethod: (a, b) => {

          if (a.length === b.length) {
            return a > b ? 1 : -1;
          }
          return a.length > b.length ? 1 : -1;
        }
      },
      {
        Header:'NIC No',
        accessor:'nic',
        width:160,
        style:{
          textAlign:'center',

          paddingTop:'23px'
        },
        show: true
      },
      {
          Header:'NTN No',
          accessor:'ntn',
          width:160,

          style:{
            textAlign:'center',

            paddingTop:'23px'
          },
              filterable:true
        },
      {
        Header:'NTN Status',
        accessor:'ntnStatus',
        width:160,

        style:{
          textAlign:'center',

          paddingTop:'23px'
        },
            filterable:true
      },
      {
        Header:'STRN',
        accessor:'strn',
        width:160,

        style:{
          textAlign:'center',

          paddingTop:'23px'
        },
            filterable:true
      },
      {
        Header:'Closing Balance',
        Footer: (<span><strong>Total:</strong>  {(this.state.balanceSum!==undefined && this.state.balanceSum<0 ) ? `( ${Math.abs(this.state.balanceSum).toLocaleString('en-US')} )` : this.state.balanceSum}.</span>),
        accessor:'closingBalance',
        Cell: (row) => {
          return <div>{(row.original.closingBalance<0) ? `( ${Math.abs(row.original.closingBalance).toLocaleString('en-US')} )` : row.original.closingBalance.toLocaleString('en-US')}</div>;
        },
        width:160,
        style:{
          textAlign:'center',
          paddingTop:'23px'
        },
            filterable:false
      },
      {
        show: false,
        Header:'Action',
        style:{
        display:'flex',
        justifyContent:'center'
        },
        width:160,
        minWidth:100,
        maxWidth:200,
        sortable:false,
        filterable:false,


        Cell:props=> <span>

        <Button  onClick={this.onClickPrint}
        style={{background:'royalblue',color:'white',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500',marginTop:'12px'}}>
        Print</Button>
        </span>


      }
    ]
    return (
              <div className="content ledgerPage">
              <LoadingOverlay
                active={this.state.isActive}
                spinner
                text='Loading Customer Balances'
                >
                <Card style={{padding:'15px'}}>
                <div className="react-notification-alert-container">
                  <NotificationAlert ref="notificationAlert" />
                </div>
              <h3 style={{padding:'1%', marginBottom:'0px'}}>Customer Balances</h3>
                <h4 style={{margin:'10px', color:'green'}}><u>AMMAD TRADING
</u></h4>
              <Form style={{marginLeft:'10px'}}>
  <FormGroup row>
  <Col style={{display:'flex',marginTop:'3px' ,marginBottom:'16px'}}sm={12}>
  <Label style={{margin:'12px'}} for="date">Start Date</Label>
{ /* <Input
  onChange={this.onChangeDateFromDealer}
  style={{width:'20%',marginBottom:'30px'}}type="Date" name="date" id="date" placeholder="Choose a Date" />*/}
  <DatePicker className='datePickerCashManagement'
             selected={this.state.dateFromDealer}
             onChange={this.onChangeDateFromDealer}
           />
  <Label style={{marginTop:'12px' , marginLeft:'20px' , marginRight:'12px'}} for="date">End Date</Label>
{/*  <Input
  onChange={this.onChangeDateToDealer}
  defaultValue={this.state.dateToDealer}
  style={{width:'20%',marginBottom:'30px'}}type="Date" name="date" id="date" placeholder="Choose a Date" />*/}
  <DatePicker className='datePickerCashManagement'
             selected={this.state.dateToDealer}
             onChange={this.onChangeDateToDealer}
           />

  <Button disabled ={this.state.isActiveCalculateLedger} style={{height:'40px' , marginLeft:'19px', marginTop:'0px'}} onClick={this.onClickSearch} color='info' >Search</Button>


  </Col>
    </FormGroup>
    <FormGroup style={{display:'flex' , justifyContent:"flex-end",marginRight:'2px'}}row>
    <span disabled={true} onClick={this.onClickExportExel}style={{background:'#02a5de',cursor:'pointer'
    ,borderRadius:'7px',display:'flex' , marginTop:'12px', justifyContent:'center' , alignItems:'center'}}>
    <div style={{color:'white' , fontWeight:"bold" , padding:"10px"}}>Export</div><img style={{width:'35px' , height:'23px'}}src='/exportIcon.png'></img></span>
    {/*<span style={{paddingRight:'10px' , background:'#02a5de', marginLeft:'61%' ,cursor:'pointer'
    ,borderRadius:'7px',display:'flex' , marginTop:'12px', justifyContent:'center' , alignItems:'center'}}><div style={{color:'white' , fontWeight:"bold" , padding:"10px"}}>Export</div><img style={{width:'23px' , height:'23px'}}src='/exportPDF.png'></img></span>
*/  }       </FormGroup>
    <LoadingOverlay
      active={this.state.isActiveCalculateLedger}
      spinner
      text='Loading Customer Balances'
      >
                            <FormGroup style={{marginTop:'10px'}} row>
                            <Col sm={12}>

                            <ReactTable
                            defaultPageSize={100}
                            filterable={true}
                            style={{height:'500px'}}
                            columns={columns}
                            data={posts}
                            showPagination={true}
                            onFilteredChange={filtered => {
                              this.allBalances = []
                               console.log("Subtr", this.subtr);
                               this.subtr = 0
                               console.log("Subtr", this.subtr);
                               this.setState({
                                 a: "test"
                               })
                           }}

                           onPageChange={filtered => {
                             this.allBalances = []
                              console.log("Subtr", this.subtr);
                              this.subtr = 0
                              console.log("Subtr", this.subtr);
                              this.setState({
                                a: "test"
                              })
                          }} // Called when the page index is changed by the user
                          onPageSizeChange={filtered => {
                            this.allBalances = []
                             console.log("Subtr", this.subtr);
                             this.subtr = 0
                             console.log("Subtr", this.subtr);
                             this.setState({
                               a: "test"
                             })
                         }} // Called when the pageSize is changed by the user. The resolve page is also sent to maintain approximate position in the data
                          onSortedChange={filtered => {
                            this.allBalances = []
                             console.log("Subtr", this.subtr);
                             this.subtr = 0
                             console.log("Subtr", this.subtr);
                             this.setState({
                               a: "test"
                             })
                         }} // Called when a sortable column header is clicked with the column itself and if the shiftkey was held. If the column is a pivoted column, `column` will be an array of columns
                          onExpandedChange={filtered => {
                            this.allBalances = []
                             console.log("Subtr", this.subtr);
                             this.subtr = 0
                             console.log("Subtr", this.subtr);
                             this.setState({
                               a: "test"
                             })
                         }} // Called when an expander is clicked. Use this to manage `expanded`
                          onFilteredChange={filtered => {
                            this.allBalances = []
                             console.log("Subtr", this.subtr);
                             this.subtr = 0
                             console.log("Subtr", this.subtr);
                             this.setState({
                               a: "test"
                             })
                         }} // Called when a user enters a value into a filter input field or the value passed to the onFiltersChange handler by the Filter option.
                          onResizedChange={filtered => {
                            this.allBalances = []
                             console.log("Subtr", this.subtr);
                             this.subtr = 0
                             console.log("Subtr", this.subtr);
                             this.setState({
                               a: "test"
                             })
                         }} // Called when a user clicks on a resizing component (the right edge of a column header)
                            noDataText={'Empty'}
                      /*      sorted={[
                                        {
                                         id: 'dateSorted',
                                         desc: true
                                       }]}*/

                            defaultFilterMethod={this.filterMethod}
                            sortable={false}
                            getTdProps={this.getTdPropsFunc}


                                >
                            </ReactTable>

                            </Col>
                            </FormGroup>
                            </LoadingOverlay>
                            </Form>

         <hr/>





                          </Card>
                            </LoadingOverlay>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}><strong>Please Click On Button Below to Download Excel File</strong></ModalHeader>
          <ModalBody>
          <div    onClick={this.onClickJsonToExcel} >
          <JsonToExcel

                  data={this.state.data}
                  className={className}
                  filename={`Customer Balances`}
                  fields={fields}
                  style={{display:'flex' , justifyContent:'center' , marginLeft:'130px'}}
                />
                </div>
          </ModalBody>

        </Modal>
              </div>

    );
  }
}

export default CustomerBalances;
