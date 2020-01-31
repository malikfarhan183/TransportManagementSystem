import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import 'react-table/react-table.css'
import ReactTable from "react-table";
// import Pdf from "react-to-pdf";
import jsPDF from "jspdf"; //json to pdf (Problem is when we have more then 10 Columns)
import "jspdf-autotable";  //json to pdf
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
   Button,
   Input,Modal, ModalHeader, ModalBody
} from "reactstrap";

import "./CustomerLedgerStyling.css"
var request = require("request");
var moment = require('moment');
const ref = React.createRef();
// const url = global.baseUrl
// let  listOfUserRow='';
let listOfUserArray=[];
let urlPrams='';
var totalNoOfRows=5
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
var bagSum = 0
var tonSum=0
var valueExcGst=0
var gstValue=0
var invoiceAmountValue=0
var advanceTaxValue=0
var amountValue=0
var balanceValue=0
var defaultDate = new Date(new Date().getFullYear(), 0, 1);
var subtr = 0
var startingBalance = 0
var finalResult = 0
var allBalances = []
const className = 'nameChange',
  // filename = 'Excel-file',
  fields = {
    "date": "Date",
    "time":"Time",
    "sTaxInvNo": "Invoice No",
    "biltyNo": "Bilty No",
    "address": "Destination",
    "type": "Filer/Non-Filer",
    "quantityBags": "Bags QTY",
    "quantityTons": "Tons QTY",
    "grossRate": "Gross Rate",
    "value": "Value Exc GST",
    "gst": "GST",
    "invoiceAmount": "Invoice Amount",
    "advanceTax": "Adv.Tax",
    "x1": "x1",
    "x2": "x2",
    "mop": "MOP",
    "instrumentNo": "Instrument #",
    "amount": "Amount",
    "newBalance": "Balance",
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
class CustomerLedgers extends React.Component {
  constructor(props){

    super(props);
    this.pdfData=[]
    this.newLedgerData1=[]
    this.newLedgerData2=[]
    this.allBalances = []
    this.arrayToExport=[]
    this.ledgerData = []
    this.subtr = 0
    this.startingBalance = 0
    this.curr = 0
    this.totalFinal = 0
    this.state={
      disableSearchButton:true,
      myData:'Malik Farhan' ,
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
    }
 this.toggle = this.toggle.bind(this);
  }
  //function To Create Pdf From JSON
 //  exportPDF = () => {
 //   const unit = "pt";
 //   const size = "A4"; // Use A1, A2, A3 or A4
 //   const orientation = "landscape"; // portrait or landscape
 //
 //   const marginLeft = 40;
 //   const doc = new jsPDF(orientation, unit, size);
 //   doc.setFontSize(15);
 //   const title = `${this.state.name} (${this.state.type} ${this.state.buisnessName})`;
 //   const headers = [[   "DATE","Time","Invoice No",
 //       "Bilty No",
 //      "Destination",
 //    "Filer/Non-Filer",
 //       "Bags QTY",
 //       "Tons QTY",
 //       "Gross Rate",
 //       "Value Exc GST",
 //     "GST",
 //       "Invoice Amount",
 //       "Adv.Tax",
 //      "x1",
 //      "x2",
 //       "MOP",
 //    "Instrument #",
 //       "Amount",
 //       "Balance"]
 // ];
 //  console.log("..PDF" , this.state.posts);
 //   const data = this.state.posts.map(elt=> [elt.date, elt.time,elt.sTaxInvNo,
 //     elt.biltyNo,elt.address,elt.type,elt.quantityBags,elt.quantityTons,elt.grossRate,elt.value,elt.gst,
 //     elt.invoiceAmount,elt.advanceTax,elt.x1,elt.x2,elt.mop,elt.instrumentNo,elt.amount,elt.newBalance,]);
 //   let content = {
 //     startY: 50,
 //     head: headers,
 //     body: data,
 //     rowPageBreak:'auto,',
 //     headStyles:{overflow: 'hidden'},
 //      bodyStyles:{overflow: 'hidden'},
 //   };
 //
 //   doc.text(title, marginLeft, 40);
 //   doc.autoTable(content);
 //   doc.save(`${this.state.name} (${this.state.type} ${this.state.buisnessName}).pdf`)
 // }

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
          this.getLedgerDetails(body.balance);
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
//Function To Sort JSON By Date
  datesort_array(a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }
  getLedgerDetails=e=>{
    this.newLedgerData1=[]
    this.newLedgerData2=[]
    console.log(" new this.ledgerData" , e);
        this.subtr = 0
        this.setState({
          isActiveCalculateLedger:true
        })
    var body={
      to:this.state.dateToDealer ,
       // to:this.state.dateFromDealer ,
      user_id:this.props.match.params.id,
      from: this.state.dateFromDealer
    }
    console.log("Sending Body", body);
    var options = { method: 'POST',
        url: global.baseUrl + '/calculateLedger',
        headers: {'Authorization': localStorage.getItem("token") },
        body:body,
        json: true
      };

      console.log("**options of Ledger ", options);
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
          if(response.body.result.length!==0){
            this.setState({
              notdisbaleExportBtn:true,
              disableSearchButton:false
            })
          }
          if(response.statusCode=== 200 && response.body.result!==[]){
            this.setState({
              isActiveCalculateLedger:false,
              disableSearchButton:false,
              isActive:false
            })
            if(body.result.payments!==undefined){
            this.subtr = 0
            var checkStatus=[]
            body.result.payments.forEach((ii,idxx,xx)=>{
              if (ii.status === "success") {
                checkStatus.push(ii)
              }
            })
            console.log("test if status success :: ", checkStatus );
            body.result.payments = checkStatus
            var ordersArr = []
            body.result.order.forEach((x, xdx, nm) => {
              if (x.order.description==="Opening Balance" &&  x.order.totalAmount === 0){
                console.log("ORDER ARRAY if ");
              }
              else{
                ordersArr.push(x)
              }

            })

            var paymentsArr = []
            console.log("after check :: ", body.result.payments );
            body.result.payments.forEach((x, xdx, nm) => {
              //here value of payment type from backend recieved with lowercase "opening balance"
              if (x.paymentType === "opening balance" &&  x.amount === 0){
                         console.log("if");
              }
              else{
                console.log("else");
                paymentsArr.push(x)
              }
            })
            console.log("ORDER ARRAY" , ordersArr ,"PAYMENT" , paymentsArr);
            this.ledgerData1 = ordersArr.map((i,data)=>{
              console.log("Within MAp" ,i.order.totalAmount);
              if(i.order.totalAmount!==0){
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
                var time=''
                // var address=''
                // var fromAddress=''
                var oppennigBalanceInInvoiceNo=''
                if (i.order.deliveryDate)
                {
                  var d = i.order.deliveryDate.split('T')
                  // time=i.order.deliveryDate
                   time=moment(new Date(new Date(i.order.deliveryDate).getTime())).format('LTS')
                  // let date=moment(i.createdAt).format('LT');
                  date = `${d[0]}`
                  console.log("time.........................................." , time)
                }
                 // if(i.order.address === 'Rawalpindi (RWP)'){
                 //   address='RWP'
                 // }
                 // else if (i.order.address === 'Sawabi (SWB)') {
                 //   address='SWP'
                 // }
                 // if (i.order.fromAddress === 'Hattar (HTR)') {
                 //   fromAddress='HTR'
                 // }
                 // else if (i.order.fromAddress === 'Chakwal (CHK)') {
                 //   fromAddress='CHK'
                 // }
                 // else if (i.order.fromAddress === "Farooqia (FAR)") {
                 //   fromAddress='FAR'
                 // }
                 // else if (i.order.fromAddress === 'KalarKahar (KK)') {
                 //   fromAddress='KK'
                 // }
                 if(i.order.description==="Opening Balance"){
                   oppennigBalanceInInvoiceNo=i.order.description
                   filer='-'
                 }
                 else{
                   oppennigBalanceInInvoiceNo=`ACT-${i.order.invoiceNumber}`
                 }

                 if ( i.order.description==="Opening Balance" &&  i.order.totalAmount === 0)
                 {
                   console.log("Skippped");
                   return {
                     "id":"-",
                     "date":"-",
                     "time":"-",
                     "sTaxInvNo":"-",
                     "biltyNo":"-",
                     "address":"-",
                     "fromAddress":"-",
                     "type":"-",
                     "quantityBags":"-",
                     "quantityTons":"-",
                     "grossRate":"-",
                     "value":"-",
                     "gst":"-",
                     "invoiceAmount":"-",
                     "advanceTax":"-",
                     "x1":"-",
                     "x2":"-",
                     "mop":"-",
                     "instrumentNo":"-",
                     "amount":"-",
                     "balance":"-",
                     }
                 }
                 else
                 {
                   return {
                     "id":i.order._id,
                     "date":`${date}..` ,
                     "time":`${time}..`,
                     "sTaxInvNo":oppennigBalanceInInvoiceNo,
                     "biltyNo":i.order.biltyNumber,
                     "address":`${i.order.address}`,
                     "fromAddress":`${i.order.fromAddress}`,
                     "type":filer,
                     "quantityBags":i.totalBags,
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
                 }
               }

            })
            console.log("this.ledgerData1",this.ledgerData1);

            this.ledgerData2 = paymentsArr.map((i,data)=>{

              if(i.amount!==0){
                console.log("paymentsArr ....> " , i);
                var filer = "-"
                // if (i.order !== undefined)
                // {
                //   if(i.order.isFiler && i.order.isActiveFiler){
                //      filer="Filer (Active)"
                //   }
                //   if(i.order.isFiler && !i.order.isActiveFiler){
                //      filer="Filer (In Active)"
                //   }
                //
                //   if (!i.isFiler)
                //   {
                //     filer = "Non-Filer"
                //   }
                // }
                var date="-"
                var time=''
                if (i.date)
                {
                  var d = i.date.split('T')
                   time=moment(new Date(new Date(i.date).getTime())).format('LTS')


                  // let date=moment(i.createdAt).format('MMMM Do YYYY, h:mm a');
                  // let date=moment(i.createdAt).format('LT');
                  date = `${d[0]}`
                }
                // var instrumentNo = "-"

                // if (i.paymentType == "Opening Balance" &&  i.amount == 0)
                // {
                //   return null
                // }
                // else
                // {
                var openningBalanceInInvoiceNo=''
                var modeOfPayment=''
                var amountInTable=''
                if(i.paymentType==="opening balance" && i.amount===0 ){
                    openningBalanceInInvoiceNo="Opening Balance"
                    modeOfPayment='-'
                    amountInTable=0
                }
                else if (i.paymentType==="opening balance" && i.amount!==0) {
                  openningBalanceInInvoiceNo="Opening Balance"
                  modeOfPayment='-'
                  amountInTable=i.amount
                }
                else{
                  openningBalanceInInvoiceNo="-"
                  modeOfPayment=i.paymentType
                  amountInTable=i.amount
                 }
                 if(modeOfPayment==='cash'){
                   return {
                     "id":i._id,
                     "date":`${date}..` ,
                     "time":`${time}..`,
                     "sTaxInvNo":openningBalanceInInvoiceNo,
                     "biltyNo":"-",
                     "address":"-",
                     "fromAddress":"-",
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
                     "mop":modeOfPayment,
                     "instrumentNo":(i.receipt_no),
                     "amount":amountInTable,
                     "balance":"-"
                     }
                 }
                 else if(modeOfPayment==='online'){
                   return {
                     "id":i._id,
                     "date":`${date}..` ,
                     "time":`${time}..`,
                     "sTaxInvNo":openningBalanceInInvoiceNo,
                     "biltyNo":"-",
                     "address":"-",
                     "fromAddress":"-",
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
                     "mop":modeOfPayment,
                     "instrumentNo":"-",
                     "amount":amountInTable,
                     "balance":"-"
                     }
                 }
                 else if(modeOfPayment==="cheque"){
                   return {
                     "id":i._id,
                     "date":`${date}..` ,
                     "time":`${time}..`,
                     "sTaxInvNo":openningBalanceInInvoiceNo,
                     "biltyNo":"-",
                     "address":"-",
                     "fromAddress":"-",
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
                     "mop":modeOfPayment,
                     "instrumentNo":(i.chequeNumber),
                     "amount":amountInTable,
                     "balance":"-"
                     }
                 }
                 else{
                  return {
                    "id":i._id,
                    "date":`${date}..` ,
                    "time":`${time}..`,
                    "sTaxInvNo":openningBalanceInInvoiceNo,
                    "biltyNo":"-",
                    "address":"-",
                    "fromAddress":"-",
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
                    "mop":modeOfPayment,
                    "instrumentNo":"-",
                    "amount":amountInTable,
                    "balance":"-"
                    }
                  }
                  }
            })
               console.log("this.ledgerData 2",this.ledgerData2);
               this.ledgerData1.forEach((d,dx,dnx)=>{
                 // console.log("dx 1", d);
                 if(d!==undefined){
                   // console.log("dx 1 iff" ,d);
                 this.newLedgerData1.push(d)
               }
               })
               console.log("//this.newLedgerData1" ,this.newLedgerData1 );
               this.ledgerData2.forEach((d,dx,dnx)=>{
                 console.log("dx 2", d);
                 if(d!==undefined){
                   console.log("dx 2 iff" ,d);
                 this.newLedgerData2.push(d)
               }

               })
                console.log("//this.newLedgerData2" ,this.newLedgerData2);
                this.ledgerData = this.newLedgerData1.concat(this.newLedgerData2);
               // if(this.ledgerData1[0]===undefined){
               //   this.ledgerData =this.ledgerData2;
               // }
               // else if (this.ledgerData2[0]===undefined) {
               //   this.ledgerData = this.ledgerData1;
               // }
               // else{
               //     this.ledgerData = this.ledgerData1.concat(this.ledgerData2);
               // }
            console.log("this.ledgerData" , this.ledgerData);
            this.ledgerData.sort(this.datesort_array) //Soring JSON by Date
              console.log("this.ledgerData after sort" , this.ledgerData);
            var curr = this.startingBalance
            // setting new index for balance column and also calculating total balance for footer(if our balance in "api/customerCustomerBalance" call is zero)
                   if(e===0)
                    {      this.ledgerData.forEach( (d,dx,dnx) => {
                            console.log("atms d['new']" ,  "-" , d.invoiceAmount , "+" ,  d.amount);
                            this.curr -= parseInt(d.invoiceAmount)
                            this.curr += parseInt(d.amount)
                            d["newBalance"] = this.curr
                            console.log("atms d['new']" , d["newBalance"]);
                            console.log("Seting Index ", dx , "To Val: ",this.curr);
                            if (dx === dnx.length-1)
                            {
                              this.totalFinal = this.curr
                            }
                          })
                    }

           // this Foreach is for export amount data when oppening balance entry
           // recieves it will put zero to amount
            this.ledgerData.forEach( (d,dx,dnx) => {
                console.log("d.....>" , d.sTaxInvNo);
                if(d.sTaxInvNo==="Opening Balance"){
                  console.log("d.....> if");
                  d['amount']=0
                  d.invoiceAmount=0
                }

            })
            console.log("Sorted", this.ledgerData);

              console.log("Checking >>" , this.ledgerData);
              if(this.ledgerData.length<=5){
                console.log("g");
              }
              else{
                  totalNoOfRows=this.ledgerData.length
              }

            for (let i = 0; i <= this.ledgerData.length; i++) {
              //
              console.log("checking time : ", this.ledgerData[i] );
              if(this.ledgerData[i]!==undefined){
                // this.ledgerData[i].time = moment(this.ledgerData[i].time).format('LT');
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
                    if(this.ledgerData[i].sTaxInvNo ==="Opening Balance"){
                      console.log("Not Adding");
                    }
                    else{
                      invoiceAmountValue += this.ledgerData[i].invoiceAmount
                      console.log("invoiceAmountValue",invoiceAmountValue);
                    }

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
                    // console.log("in Loop done" ,this.ledgerData[i].sTaxInvNo );
                    if(this.ledgerData[i].sTaxInvNo ==="Opening Balance"){
                      console.log("Not Adding");
                    }
                    else{
                      amountValue += parseInt(this.ledgerData[i].amount)
                      console.log("amountValue",amountValue);
                    }

                  }
                }

              }

            }
      // console.log("balanceValue=this.ledgerData[this.ledgerData.length].balance (in the function)" ,this.allBalances);
      //     console.log("balanceValue=this.ledgerData[this.ledgerData.length].balance (in the function)" ,this.ledgerData);

            this.subtr = 0
            if(this.ledgerData.length===0){
              console.log("opening balance11 " ,e);
              this.ledgerData=[{
                "id":'-',
                "date":'-',
                "time":'-',
                "sTaxInvNo":"Opening Balance",
                "biltyNo":"-",
                "address":"-",
                "fromAddress":"-",
                "type":'-',
                "quantityBags":"-",
                "quantityTons":"-",
                "grossRate":0,
                "value":0,
                "gst":0,
                "invoiceAmount":0,
                "advanceTax":0,
                "x1":"-",
                "x2":"-",
                "mop":'-',
                "instrumentNo":('-'),
                "amount":0,
                "balance":0,
                "newBalance":(e<0) ? `(${Math.abs(e)})` : Math.abs(e)
                }]
                console.log("opening balance" , this.ledgerData );
                this.setState({
                    posts:this.ledgerData,
                    isActive:false ,
                })
            }
            //here i added balance as we recieved in starting balance
            else{
              if(this.ledgerData[0]['sTaxInvNo']!=="Opening Balance"){
                console.log("opening balance22 " ,e);
                this.ledgerData = [{
                  "id":'-',
                  "date":'-',
                  "time":'-',
                  "sTaxInvNo":"Opening Balance ",
                  "biltyNo":"-",
                  "address":"-",
                  "fromAddress":"-",
                  "type":'-',
                  "quantityBags":"-",
                  "quantityTons":"-",
                  "grossRate":0,
                  "value":0,
                  "gst":0,
                  "invoiceAmount":0,
                  "advanceTax":0,
                  "x1":"-",
                  "x2":"-",
                  "mop":'-',
                  "instrumentNo":('-'),
                  "amount":0,
                  "balance":0,
                  "newBalance":(e<0) ? `(${Math.abs(e)})` : Math.abs(e)
                }].concat(this.ledgerData);
                // setting new index for balance column and also calculating total balance for footer(if our balance in "api/customerCustomerBalance" call is not zero)
                this.curr=0
                this.ledgerData.forEach( (d,dx,dnx) => {
                  if(dx === 0 )
                  {
                    d.amount=e
                  }
                  console.log("atms d['new'] here" ,  "-" , d.invoiceAmount , "+" ,  d.amount ,"Dataaaaa" , dx , "m" , this.curr);
                  this.curr -= parseInt(d.invoiceAmount)
                  this.curr += parseInt(d.amount)
                  d["newBalance"] = this.curr
                  console.log("atms d['new']" , d["newBalance"]);
                  console.log("Seting Index ", dx , "To Val: ",this.curr);
                  if (dx === dnx.length-1)
                  {
                    this.totalFinal = this.curr
                  }
                })
                this.setState({
                    posts:this.ledgerData,
                    isActive:false ,
                })
              }else{
                console.log("else");
                this.setState({
                    posts:this.ledgerData,
                    isActive:false ,
                })
              }
            }
          }
          else{
            console.log("///// ELSE");
            amountValue=0
            advanceTaxValue=0
            invoiceAmountValue=0
            gstValue=0
            valueExcGst=0
            tonSum=0
            bagSum=0
            this.totalFinal=0
                      this.subtr = 0
                     this.setState({
                         posts:[],
                         isActive:false
                     })
          }
        //   this.pdfData=this.ledgerData.map((i,data)=>{
        // console.log("dta" , i);
        // return (<table>
        //              <tr>
        //              <tr>
        //                   <br/> <th> Customer Ledger</th>
        //                    <th> </th>
        //                    <th></th>
        //                   <th></th>
        //                </tr>
        //                <tr>
        //                   <br/><td>____________________</td>
        //                   <br/><td>____________________</td>
        //                   <br/><td>____________________</td>
        //                   <br/><td>__</td>
        //                   <br/><td></td>
        //                </tr>
        //
        //              <tr>
        //                   <br/> <th>Date</th>
        //                    <br/><th>Time</th>
        //                    <br/><th>Filer/Non-Filer</th>
        //                         <br/><th>        </th>
        //                    <br/><th>Bags Qty</th>
        //                </tr>
        //                <tr>
        //                   <br/><td>{i.date}</td>
        //                   <br/><td>{i.time}</td>
        //                   <br/><td>{i.type}</td>
        //                   <br/><td>        </td>
        //                   <br/><td>{i.quantityBags}</td>
        //                </tr>
        //                <tr>
        //                     <br/> <th>Invoice No</th>
        //                      <br/><th>Bilty No</th>
        //                      <br/><th>Destination</th>
        //                  </tr>
        //                  <tr>
        //                     <br/><td>{i.sTaxInvNo}</td>
        //                     <br/><td>{i.biltyNo}</td>
        //                     <br/><td>{i.address}</td>
        //
        //                  </tr>
        //                <tr>
        //                 <br/><th>Tons Qty</th>
        //                 <br/><th>Gross Rate</th>
        //                 <br/><th>Value Exc GST</th>
        //                   <br/><th>        </th>
        //                   <br/><th>GST</th>
        //               </tr>
        //               <tr>
        //
        //               <br/><td>{i.quantityTons}</td>
        //               <br/><td>{i.grossRate}</td>
        //               <br/><td>{i.value}</td>
        //                 <br/><td>        </td>
        //               <br/><td>{i.gst}</td>
        //               </tr>
        //               <tr>
        //                 <br/><th>Invoice Amount</th>
        //                 <br/><th>Adv. Tax</th>
        //                 <br/><th>x1</th>
        //                 <br/><th>        </th>
        //                 <br/><th>x2</th>
        //               </tr>
        //               <tr>
        //               <br/><td>{i.invoiceAmount}</td>
        //               <br/><td>{i.advanceTax}</td>
        //               <br/><td>{i.x1}</td>
        //               <br/><td>        </td>
        //               <br/><td>{i.x2}</td>
        //               </tr>
        //               <tr>
        //
        //               </tr>
        //               <tr>
        //                 <br/><th>MOP</th>
        //                 <br/><th>Instrument #</th>
        //                 <br/><th>Amount</th>
        //                 <th>Balance</th>
        //
        //               </tr>
        //               <tr>
        //               <br/><td>{i.mop}</td>
        //               <br/><td>{i.instrumentNo}</td>
        //               <br/><td>{i.amount}</td>
        //               <td>{i.newBalance}</td>
        //
        //               </tr>
        //               <tr>
        //
        //               </tr>
        //               <tr>
        //
        //               </tr>
        //             </tr>
        //         </table>)
        //   })
        //
        //   console.log("this.pdfData" , this.pdfData);
        //
        //   this.setState({
        //     myData:this.pdfData
        //   })
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
  getSingleUserApiCall=e=>{
    var data={
      user_id:this.props.match.params.id
    }
    var options = { method: 'POST',
        url: global.baseUrl + '/api/getSingleUser',
        headers: {'Authorization': localStorage.getItem("token") },
        body:data,
        json: true
      };
  console.log("options of Get Single User ", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error", error);
        }
        else
        {
          console.log("Respone in Get Single user", response);   
  this.subtr = 0
  this.setState({
      disableSelectField:false,
      isActiveSingleUser:false
  })
  if(!response.body.success){
    this.message=response.body.message
    this.notify("tc",false);
  }
  else{
    var i=response.body.result

            if(i.ntnStatus === 'nonActive'){
              this.subtr = 0
              this.setState({ntnStatus:'Non Active'})
            }
            if(i.ntnStatus==="active"){
              this.subtr = 0
              this.setState({ntnStatus:'Active'})
            }
            if(i.type=== "dealer"){
              this.subtr = 0
              this.setState({
                type: 'Dealer'
              })
            }
            if(i.type === 'customer'){
              this.subtr = 0
              this.setState({
                type: 'Customer'
              })
            }
            var typeOfCustomer=''
            if(i.type==='dealer'){
              typeOfCustomer='Dealer'
            }
            if(i.type==='endUser' || i.type==='end user'){
              typeOfCustomer='End User'
            }
this.subtr = 0
             this.setState({
               code:i.code,
               name:i.name,
       buisnessName:i.buisnessName,
               address:i.address,
               mobile:i.mobile,
               nic:i.nic,
               ntn:i.ntn,
               strn:i.strn,
               type:typeOfCustomer
             })
          }
  }

      })
  }
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
  componentDidMount(){
 amountValue=0
 bagSum=0
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
      this.getSingleUserApiCall();
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
  // dateEventingBusFunc=e=>{
  //
  //   console.log("date by eventBus",e);
  //
  //   console.log("variable value of date",this.state.searchValue);
  //   this.setState({
  //     searchValue:e
  //   })
  //
  //
  // }

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
                    console.log("It was in this row:", rowInfo.original.time);
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
  this.setState({
    disableSearchButton:true
  })
  this.curr= 0
  this.subtr = 0
  this.ledgerData = []
  console.log("Search clicked" , this.ledgerData);
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
      this.getBalanceForDate()
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
  if(this.state.notdisbaleExportBtn===true){
console.log("malik....................................................................." , this.ledgerData.length);
  this.arrayToExport = this.ledgerData.map((i,data)=>{
     // console.log("i of ledgerData " , i);
     // console.log("this.allBalances[data]" ,data ,this.allBalances);
     i.valueOfBalance=this.allBalances[data] ;
     // i.push(this.allBalances[data])
     console.log("i of ledgerData" ,i );
  })

this.subtr = 0
  this.setState({
    exportExel:true,
    data:this.ledgerData
  })
  if(this.ledgerData.length!==0)
{
  console.log("in ifff ...::>", this.ledgerData.length);
  this.setState(prevState => ({
    modal: !prevState.modal
  }));
}
else{
  this.message='No Records Found';
    this.notify("tc",false);
}
  this.subtr = 0
// /////////////////////////
// onClickUserReport=e=>{
//   console.log("USER REPORT CLICKED");
//
//
//   axios({
//     method: 'post',
//     url:url + '/api/userReport',
//      headers: {'Authorization': localStorage.getItem("token")},
//      responseType: 'arraybuffer'
//   }).then((response) => {
//      var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//      FileSaver.saveAs(blob, 'user.xlsx');
//         this.notify("tc",true);
//    });
// }
// /////////////////////////
//   console.log("onClickExportExel");
//   var data={
//     user_id:this.props.match.params.id,
//     Start_Date:this.state.dateFromDealer,
//     End_date:this.state.dateToDealer
//
//   }
//   var options = { method: 'POST',
//       url: global.baseUrl + '/api/exportFile',
//       headers: {'Authorization': localStorage.getItem("token") },
//      body:data,
//       json: true
//     };
// console.log("options of exportFile ", options);
//     request(options, (error, response, body) =>
//
//     {
//       if (error)
//       {
//         console.log("Error", error);
//       }
//       else
//       {
//         console.log("Respone in exportFile", response);
//
//       }
//     })
}
else{
  this.message='No Customer Ledger Found';
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
  this.subtr = 0
}
  render() {
    console.log("IN RENDOR OUR isCHECKED STATE:::", this.state.posts);
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
        Header:'SNO',
        accessor:'sNo',
        // width:70,
        Cell: (row) => {return <div>{row.index+1}</div>;},
        filterable: false,
        id:"row",
        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        }
      },

      {
        Header:'Date',
        accessor:'date',
        width:160,
        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
      /*  sortMethod: (a, b) => {

          if (a.length === b.length) {
            return a > b ? 1 : -1;
          }
          return a.length > b.length ? 1 : -1;
        }
        */
      },
      {
        Header:'Time',
        accessor:'time',
        width:160,
        // Cell: (row) => {
        //   return <div>{(row.original.time!=='-') ? moment(new Date(new Date(row.original.time).getTime())).format('h:mm A') : '-'}</div>;
        // },
        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
  /*   sortMethod: (a, b) => {

          if (a.length === b.length) {
            return a > b ? 1 : -1;
          }
          return a.length > b.length ? 1 : -1;
        }*/
      },
      {
        Header:'Invoice No',
        accessor:'sTaxInvNo',
        width:160,

        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
        show: true
      },
      {
          Header:'Bilty No',
          accessor:'biltyNo',
          width:160,

          getProps: (state, rowInfo, column) => {

            return{
              style: {
                  background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                  textAlign:'center',
                  paddingTop:'23px'
              },
            }
          },
              filterable:false
        },

      {
        Header:'Destination',
        accessor:'address',
        width:160,

        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
            filterable:false
      },
      {
        Header:'Brand',
        accessor:'fromAddress',
        width:160,

        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
            filterable:false
      },
      {
        Header:'Filer/Non-Filer',
        accessor:'type',
        width:160,

        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
            filterable:false
      },
      {
        Header:'Bags Qty',
        Footer: (<span><strong>Total:</strong>  {bagSum}</span>),
        accessor:'quantityBags',
        width:160,

        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
            filterable:false
      },
      {
        Header:'Tons Qty',
          Footer: (<span><strong>Total:</strong>  { tonSum}</span>),
        accessor:'quantityTons',
        width:160,

        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
            filterable:false
      },
      {
        Header:'Gross Rate',
        accessor:'grossRate',
        width:160,
        Cell: (row) => {return <div>{Number(row.original.grossRate).toLocaleString('en-US')}</div>;},
        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
            filterable:false
      },
      {
        Header:'Value Exc GST',
        Footer: (<span><strong>Total:</strong>  { valueExcGst.toLocaleString('en-US')}</span>),
        accessor:'value',
        width:160,
        Cell: (row) => {return <div>{Number(row.original.value).toLocaleString('en-US')}</div>;},
        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
            filterable:false
      },

      {
        Header:'GST',
          Footer: (<span><strong>Total:</strong>{gstValue.toLocaleString('en-US')}</span>),
          Cell: (row) => {return <div>{Number(row.original.gst).toLocaleString('en-US')}</div>;},
            accessor:'gst',
            width:160,

            getProps: (state, rowInfo, column) => {

              return{
                style: {
                    background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                    textAlign:'center',
                    paddingTop:'23px'
                },
              }
            },
            filterable:false
      },
      {
        Header:'Invoice Amount',
            Footer: (<span><strong>Total:</strong>  { invoiceAmountValue.toLocaleString('en-US')}</span>),
        accessor:'invoiceAmount',
        width:160,
        Cell: (row) => {return <div>{(row.original.sTaxInvNo ==="Opening Balance") ? "0" : Number(row.original.invoiceAmount).toLocaleString('en-US')}</div>;},
        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
            filterable:false
      },
      {
        Header:'Adv. Tax',
        accessor:'advanceTax',
          Footer: (<span><strong>Total:</strong>  { advanceTaxValue.toLocaleString('en-US')}</span>),
          Cell: (row) => {return <div>{Number(row.original.advanceTax).toLocaleString('en-US')}</div>;},
        width:160,

        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
            filterable:false
      },

           {
              Header:'x1',
              accessor:'x1',
              width:160,

              getProps: (state, rowInfo, column) => {

                return{
                  style: {
                      background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                      textAlign:'center',
                      paddingTop:'23px'
                  },
                }
              },
                  filterable:false
            },
            {
               Header:'x2',
               accessor:'x2',
               width:160,

               getProps: (state, rowInfo, column) => {

                 return{
                   style: {
                       background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                       textAlign:'center',
                       paddingTop:'23px'
                   },
                 }
               },
                   filterable:false
             },

      {
        Header:'MOP',
        accessor:'mop',
        width:160,
        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
            filterable:false
      },
      {
        Header:'Instrument #',
        accessor:'instrumentNo',
        width:160,
        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
            filterable:false
          },
       {
          Header:'Amount',
          Footer: (<span><strong>Total:</strong>  { amountValue.toLocaleString('en-US')}</span>),
        accessor:'amount',
        Cell: (row) => {return <div>{(row.original.sTaxInvNo ==="Opening Balance") ? "0" : Number(row.original.amount).toLocaleString('en-US')}</div>;},
        width:160,
         show:true,
         getProps: (state, rowInfo, column) => {

           return{
             style: {
                 background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                 textAlign:'center',
                 paddingTop:'23px'
             },
           }
         },
            filterable:false
      },
      {
        Header:'Balance',
        accessor:'newBalance',
        Cell: (row) => {return <div>{(row.original.newBalance < 0) ? "(" + Math.abs(row.original.newBalance).toLocaleString('en-US') + ")" : row.original.newBalance.toLocaleString('en-US')}</div>;},
        Footer: (<span><strong>Total:</strong>  { (this.totalFinal < 0) ? "(" + Math.abs(this.totalFinal).toLocaleString('en-US') + ")" : this.totalFinal.toLocaleString('en-US') }</span>),
        width:160,
        getProps: (state, rowInfo, column) => {

          return{
            style: {
                background: (rowInfo!==undefined && rowInfo.original.mop!=="-" && rowInfo.original.mop!==undefined) ?'#feff99' : 'white',
                textAlign:'center',
                paddingTop:'23px'
            },
          }
        },
            filterable:false
      },
      {
        show: false,
        Header:'ACTION',
        style:{
        display:'flex',
        justifyContent:'center'
        },
        width:166,
        minWidth:100,
        maxWidth:200,
        sortable:false,
        filterable:false,
        resizable:false,
        Cell:props=> <span>

        <Button  onClick={this.onClickPrint}
        style={{marginTop:"13px" ,height:"26px",background:'#02a5de',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
        Print</Button>
        </span>


      }
    ]
    return (

              <div className="content ledgerPage">
              <LoadingOverlay
                active={this.state.isActive}
                spinner
                text='Loading Customer Ledgers'
                >

                <div>

      </div>
             {/*<div ref={ref} style={{overflow : 'scroll' , width: 1000, height: 500, background: '#c2e9fb' , position:'fixed' , display:'none'}} >
             {this.state.myData}
             </div>*/}
                <Card style={{padding:'15px 15px 0px 15px'}}>
                <div className="react-notification-alert-container">
                  <NotificationAlert ref="notificationAlert" />
                </div>
              <h3 style={{padding:'1%', marginBottom:'0px'}}>Customer Ledgers</h3>
                <h4 style={{margin:'10px', color:'green'}}><u>AMMAD TRADING</u></h4>
              <Form style={{marginLeft:'10px'}}>
       <LoadingOverlay
           active={this.state.isActiveSingleUser}
           spinner
           text='Loading Customer'
         >
       <div className='widthControl' style={{display:'flex' , justifyContent:'space-between',padding:'2%'}}>
       <div>
       <FormGroup row>
         <Label  style={{paddingTop:'9px'}} className='WidthOfLabel' data-tip="Mandatory Field">Customer Code </Label>
         <Col sm={2}>
              <Input readOnly onChange={this.onChangeName} value={this.state.code} placeholder=" - " />
         </Col>
       </FormGroup> <FormGroup row>
          <Label  style={{paddingTop:'9px'}} className='WidthOfLabel' data-tip="Mandatory Field" >Customer Name </Label>
          <Col sm={2}>
               <Input readOnly onChange={this.onChangeName} value={this.state.name} placeholder=" - " />
          </Col>
        </FormGroup> <FormGroup row>
           <Label style={{paddingTop:'9px'}} className='WidthOfLabel' data-tip="Mandatory Field" >Type </Label>
           <Col sm={2}>
                <Input readOnly onChange={this.onChangeName} value={this.state.type} placeholder=" - " />
           </Col>
         </FormGroup>   <FormGroup row>
             <Label style={{paddingTop:'9px'}} className='WidthOfLabel' data-tip="Mandatory Field" >Contact No </Label>
             <Col sm={2}>
                  <Input readOnly onChange={this.onChangeName} value={this.state.mobile} placeholder=" - " />
             </Col>
           </FormGroup>
          </div>
          <div>
         <FormGroup row>
             <Label style={{paddingTop:'9px'}} className='WidthOfLabel' data-tip="Mandatory Field" >NIC No </Label>
             <Col sm={2}>
                  <Input readOnly onChange={this.onChangeName} value={this.state.nic} placeholder=" - " />
             </Col>
           </FormGroup> <FormGroup row>
              <Label style={{paddingTop:'9px'}} className='WidthOfLabel' data-tip="Mandatory Field" >NTN No </Label>
              <Col sm={2}>
                   <Input readOnly onChange={this.onChangeName} value={this.state.ntn} placeholder=" - " />
              </Col>
            </FormGroup>
            <FormGroup row>
               <Label style={{paddingTop:'9px'}} className='WidthOfLabel' data-tip="Mandatory Field" >NTN Status </Label>
               <Col sm={2}>
                    <Input readOnly onChange={this.onChangeName} value={this.state.ntnStatus} placeholder=" - " />
               </Col>
             </FormGroup> <FormGroup row>
               <Label style={{paddingTop:'9px'}} className='WidthOfLabel' data-tip="Mandatory Field" >STRN No </Label>
               <Col sm={2}>
                    <Input readOnly onChange={this.onChangeName} value={this.state.strn} placeholder=" - " />
               </Col>
             </FormGroup>
             <FormGroup row>
             <span onClick={this.onClickExportExel}style={{background:'#02a5de', marginLeft:'61%' ,cursor:'pointer'
             ,borderRadius:'7px',display:'flex' , marginTop:'12px', justifyContent:'center' , alignItems:'center'}}><div style={{color:'white' , fontWeight:"bold" , padding:"10px"}}>Export</div><img alt="" style={{width:'35px' , height:'23px'}}src='/exportIcon.png'></img></span>

             {/*<span style={{paddingRight:'10px' , background:'#02a5de', marginLeft:'61%' ,cursor:'pointer'
             ,borderRadius:'7px',display:'flex' , marginTop:'12px', justifyContent:'center' , alignItems:'center'}}><div style={{color:'white' , fontWeight:"bold" , padding:"10px"}}>Export</div><img style={{width:'23px' , height:'23px'}}src='/exportPDF.png'></img></span>
    */  }       </FormGroup>
 </div>
             </div>
            </LoadingOverlay>
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

  <Button disabled={this.state.disableSearchButton} style={{height:'40px' , marginLeft:'19px', marginTop:'0px'}} onClick={this.onClickSearch} color='info' >Search</Button>


  </Col>
    </FormGroup>
    <LoadingOverlay
      active={this.state.isActiveCalculateLedger}
      spinner
      text='Loading Customer Ledger'
      >
                            <FormGroup style={{marginTop:'10px'}} row>
                            <Col sm={12}>

                            <ReactTable
                            style={{height:'500px'}}
                            columns={columns}
                            data={posts}
                            resizable={false}
                            showPagination={false}
                            pageSize={totalNoOfRows}
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
                      /*      defaultSorted={[
                              {
                                id: "time",
                                desc: false
                              }
                            ]}*/
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
          <ModalHeader toggle={this.toggle}><strong>Please Click On Button Below to Download File</strong></ModalHeader>
          <ModalBody>
            <div    style={{marginBottom:'3px'}}onClick={this.onClickJsonToExcel} >
          <JsonToExcel
                  data={this.state.data}
                  className={className}
                  filename={`${this.state.name} (${this.state.type} ${this.state.buisnessName})`}
                  fields={fields}
                  style={{display:'flex' , justifyContent:'center' , marginLeft:'130px'}}
                />

                </div>
              {/*  <button onClick={() => this.exportPDF()}>Generate Report</button>
                <Pdf targetRef={ref} filename="CustomerLedger.pdf">
                   {({ toPdf }) => <button  style={{marginLeft:'30%'}} onClick={toPdf}>Convert Json to Pdf</button>}
                </Pdf>*/}
          </ModalBody>
        </Modal>
              </div>

    );
  }
}

export default CustomerLedgers;
