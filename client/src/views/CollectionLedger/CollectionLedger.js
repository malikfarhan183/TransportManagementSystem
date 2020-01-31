import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import 'react-table/react-table.css'
import ReactTable from "react-table";
// import {
  // Router,
//   Route,
//   Switch,
//   Redirect
// } from "react-router-dom";
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
  // Spinner,
  // Table,
  // Row,
  Col,
  // Nav,
  Button,
  // Input,
  Modal,
  ModalHeader,
  ModalBody,
  // ModalFooter
} from "reactstrap";
// import "./CustomerLedgerStyling.css"
var request = require("request");
var moment = require('moment');
// const url = global.baseUrl
let listOfUserRow = '';
let listOfUserArray = [];
let urlPrams = '';
var creditOfEachCustomer = []
var selectedDealer = []
var listOfOptionUser = []
var valueOfAllDealer = ''
var listOfOption = []
var totalNoOfRows=5
var selectedUser = []
var creditOfEachUser = []
var valueOfAllUser = ''
var selectedCustomer = []
var valueOfAllCustomer = ''
var creditOfEachDealer = []
// var creditOfEachCustomer = []
var listOfOptioninCustomer = []
// var ledgerData = []
var bagSum = 0
var collectionAmount = 0
var depositAmount = 0
var tonSum = 0
var valueExcGst = 0
var gstValue = 0
var invoiceAmountValue = 0
var advanceTaxValue = 0
var amountValue = 0
var balanceValue = 0
// var defaultDate = new Date(new Date().getFullYear(), 0, 1);
// var subtr = 0
// var startingBalance = 0
// var finalResult = 0
// var allBalances = []
const className = 'nameChange',
// filename = 'Excel-file',
fields = {
  "manager": "Manager",
  "from": "From",
  "userType": 'User Type',
  "mop": 'MOP',
  "date": 'Date',
  "amount": 'Amount',
  "dateDeposit": 'Date',
  "bank": 'Bank',
  "account": 'Account',
  "SecondAmount": 'Amount',
  "reciptNo": 'Reciept No',
  "remarks": 'Remarks',
  "newBalance": 'Balance',

},
style = {
  padding: "5px"
},
data = [{
  index: 0,
  guid: 'asdf231234'
},
{
  index: 1,
  guid: 'wetr2343af'
}
];
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
class CollectionLedger extends React.Component {
  constructor(props) {
    super(props);
    this.totalSubtr = 0
    this.allBalances = []
    this.startingBalanceNew = 0
    this.arrayToExport = []
    this.ledgerData = []
    this.finalBalanceNew = 0
    this.subtr = 0
    this.startingBalance = 0

    this.curr = 0
    this.totalFinal = 0


    this.state = {
      notdisbaleExportBtn:false,
      nameOfExportFile:"Collector's Ledger",
      exportExel: false,
      isActiveCalculateLedger: false,
      isActiveSingleUser: true,
      searchValue: 0,
      userId: '',
      disableSelectField: false,

      dateToDealer: new Date(),
      dateFromDealer: new Date(new Date().getFullYear(), 0, 1),
      // dateFromDealer:new Date(),
      dealerCode: '',
      formToLoad: '',
      creditOfSelectedCustomer: '',
      DealerOption: [],
      customerOption: [],
      posts: [],
      noDataFound: 'Loading',
      isSuper: false,
      date: '',
      isActive: '',
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
    this.totalSubtr = -this.state.totalBalance
    console.log("Back to Zero");

  }

  // getBalanceForDate=e=>{
  //
  //   var body =
  //   {
  //     user_id:this.props.match.params.id,
  //     date: this.state.dateFromDealer
  //   }
  //
  //
  //   var options = { method: 'POST',
  //       url: global.baseUrl + '/getCustomersCustomBalance',
  //       headers: {'Authorization': localStorage.getItem("token") },
  //       body:body,
  //       json: true
  //     };
  //
  // console.log("Sending Request", options, body);
  //
  //   request(options, (error, response, body) =>
  //   {
  //     if (error)
  //     {
  //       console.log("Error", error);
  //       this.message='SomeThing Went Wrong ..'
  //         this.notify("tc",false);
  //     }
  //     else
  //     {
  //       console.log("**Respone in calculateLedger", response);
  //       if(response.statusCode== 200){
  //
  //         console.log("Initial Balance", body.balance);
  //         this.startingBalance = body.balance
  //
  //         console.log("Starting Balance", body.balance);
  //         this.getLedgerDetails();
  //       }
  //       else{
  //         this.subtr = 0
  //         this.setState({
  //           balanceStart: 0
  //         })
  //       }
  //     }
  //   })
  //
  // }
  //Function To Sort JSON By Date
    datesort_array(a, b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  getCollectionLedgerDetails = e => {
    console.log("getCollectionLedgerDetails" , this.totalSubtr);
    listOfUserArray = []
    console.log("dateToDealer ...", this.state.dateToDealer);
    this.subtr = 0
    // this.totalSubtr = -this.state.totalBalance
    this.setState({
      isActiveCalculateLedger: true
    })
        // {   "to": "2019-09-15T10:41:02.099Z",
    //     "from": "2019-08-28T19:00:00.000Z",
    //     "user_id" : "idOfDealer",
    //     "collectedBy" : "idOfManager"
    //     }
    console.log("this.state.singleUserSearch", this.singleUserSearch);
    if (this.singleUserSearch === true && this.dealerSelected !== true) {
      var body = {
        to: this.state.dateToDealer,
        user_id: this.state.dealerCode,
        // from: this.state.dateFromDealer,
        collectedBy: this.state.userCode
      }
    } else if (this.singleUserSearch === true && this.dealerSelected === true) {
      body = {
        to: this.state.dateToDealer,
        user_id: this.state.dealerCode,
        customerId: this.state.dealerCode,
        // from: this.state.dateFromDealer,
        collectedBy: this.state.userCode
      }
    } else {
      body = {
        to: this.state.dateToDealer,
        user_id: this.state.dealerCode,
        from: this.state.dateFromDealer,
        collectedBy: this.state.userCode
      }

    }
    console.log("Sending Body", body);
    var options = {
      method: 'POST',
      url: global.baseUrl + '/api/collectionReport',
      headers: {
        'Authorization': localStorage.getItem("token")
        },
      body: body,
      json: true
    };
    if (body.collectedBy === undefined && this.singleUserSearch === true){
      console.log("data.collectedBy  .... ", data.collectedBy);
      this.message = 'Please Select Collector'
      this.notify("tc", false);
      this.setState({
        isActiveCalculateLedger: false
      })
      // this.totalSubtr = -this.state.totalBalance
    } else {
      console.log("**options of calculate Collector Ledgerr ", options);
      request(options, (error, response, body) =>
      {
        if (error) {
          console.log("Error", error);
          this.message = 'SomeThing Went Wrong ..'
          this.notify("tc", false);
        } else {
          console.log("**Respone in calculate Collector Ledger", response);
          if(response.body.result.length!==0){
            this.setState({
              notdisbaleExportBtn:true
            })
          }
          if (response.statusCode === 200 && response.body.result !== []) {
            if("Khali")
            this.totalFinal=0
            this.subtr = 0
            this.setState({
              isActiveCalculateLedger: false,
            })
            this.totalSubtr = -this.state.totalBalance
            this.ledgerData1 = response.body.result.map((i, data) => {
              if (i.payments !== []) {
                // console.log("Within MAp" ,i);
                // var checkStatus = []
                // i.payments.forEach((ii, idxx, xx) => {
                //   if (ii.paymentType != undefined) {
                //     checkStatus.push(ii)
                //   }
                //   else{
                //     checkStatus.push(ii)
                //   }
                // })
                // i.payments = checkStatus
                i.payments.map((i, data) => {
                  if (i.user_id.buisnessName === '') {
                    i.user_id.buisnessName = '-'
                  }
                  console.log("Within MAp......>>>>", i);
                  if(i.paymentType !== undefined && i.paymentType === 'cash') {
                    console.log("my cash", i);
                    // console.log("i.paymentType" , i.paymentType);
                    let date = moment(i.date).format('L');
                    listOfUserRow = {
                      id: (i._id),
                      manager: (i.collectedBy.name),
                      from: (`${i.user_id.name} ( ${i.user_id.buisnessName} )`),
                      userType: (i.user_id.type),
                      // buisnessName:(i.user_id.buisnessName),
                      mop: (i.paymentType),
                      date: (`${date}..`),
                      amount: (i.amount),
                      dateDeposit: ('-'),
                      bank: ('-'),
                      account: ("-"),
                      SecondAmount: (0),
                      reciptNo: ("-"),
                      balance: ('-'),
                      remarks: ("-")
                    };
                  }
                  if (i.paymentType !== undefined && i.paymentType === "cheque" && i.status !== 'success') {
                    console.log("my cheque");
                    // console.log("i.paymentType" , i.paymentType);
                    let date = moment(i.date).format('L');

                    // let chequedate = moment(i.chequeDate).format('L');

                    listOfUserRow = {
                      id: (i._id),
                      manager: (i.collectedBy.name),
                      from: (`${i.user_id.name} ( ${i.user_id.buisnessName} )`),
                      userType: (i.user_id.type),
                      // buisnessName:(i.user_id.buisnessName),
                      mop: (i.paymentType),
                      date: (`${date}..`),
                      amount: (i.amount),
                      dateDeposit: ('-'),
                      bank: ('-'),
                      account: ("-"),
                      SecondAmount: (0),
                      reciptNo: ("-"),
                      balance: ('-'),
                      remarks: ("-"),
                    };
                  }
                  if (i.paymentType !== undefined && i.paymentType === 'online'){
                    // console.log("my online" , i.account_id.bank);
                    // console.log("i.paymentType" , i.paymentType);
                    let date = moment(i.date).format('L');
                    // let draftDate = moment(i.draftDate).format('L');
                    if (i.account_id.bank !== undefined) {
                      listOfUserRow = {
                        id: (i._id),
                        manager: (i.collectedBy.name),
                        from: (`${i.user_id.name} ( ${i.user_id.buisnessName} )`),
                        userType: (i.user_id.type),
                        // buisnessName:(i.user_id.buisnessName),
                        mop: (i.paymentType),
                        date: (`${date}..`),
                        amount: (i.amount),
                        dateDeposit:(`${date}..`),
                        bank: (i.account_id.bank.name),
                        account: (`${i.account_id.accountTitle} ( ${i.account_id.accountNumber} )`),
                        SecondAmount: (i.amount),
                        reciptNo: ('-'),
                        balance: ('-'),
                        remarks: (i.remarks),
                      };
                    }
                  }
                  // if condition for deposited Cash Only
                  if (i.paymentType === undefined || i.paymentType === null || i.paymentType === '') {
                    // console.log("my online" , i.account_id.bank);
                    // console.log("i.paymentType" , i.paymentType);
                    let date = moment(i.date).format('L');
                    // let draftDate = moment(i.draftDate).format('L');
                    if (i.account_id.bank !== undefined) {
                      listOfUserRow = {
                        id: (i._id),
                        manager: (i.collectedBy.name),
                        from: ('-'),
                        userType: ('-'),
                        // buisnessName:(i.user_id.buisnessName),
                        mop: ('-'),
                        date: ('-'),
                        amount: (0),
                        dateDeposit: (`${date}..`),
                        bank: (i.account_id.bank.name),
                        account: (`${i.account_id.accountTitle} ( ${i.account_id.accountNumber} )`),
                        SecondAmount: (i.amount),
                        reciptNo: (i.reciptNo),
                        balance: ('-'),
                        remarks: (i.remarks),
                      };
                    }
                  }
                  // if Condition Of Deposited Cheques Only
                  if (i.paymentType === "cheque" && i.status==="success"){
                    // console.log("my online" , i.account_id.bank);
                    // console.log("i.paymentType" , i.paymentType);
                    let date = moment(i.date).format('L');
                    // let draftDate = moment(i.draftDate).format('L');
                    let clearenceDatee = moment(i.clearenceDate).format('L');
                    if (i.account_id.bank !== undefined) {
                      listOfUserRow = {
                        id: (i._id),
                        manager: (i.collectedBy.name),
                        from: (`${i.user_id.name} ( ${i.user_id.buisnessName} )`),
                        userType: (i.user_id.type),
                        // buisnessName:(i.user_id.buisnessName),
                        mop: (i.paymentType),
                        date: (`${clearenceDatee}..`),
                        amount: (i.amount),
                        dateDeposit:(`${date}..`),
                        bank: (i.account_id.bank.name),
                        account: (`${i.account_id.accountTitle} ( ${i.account_id.accountNumber} )`),
                        SecondAmount: (i.amount),
                        reciptNo: (i.chequeNumber),
                        balance: ('-'),
                        remarks: (i.remarks),
                      };
                    }
                  }
                  console.log("Checkingg...>>>" , listOfUserRow);
                  // let date=moment(i.createdAt).format('L');
                  // listOfUserRow =
                  //         {
                  //         id:(i._id),
                  //           manager:(i.collectedBy.name),
                  //         from:(date),
                  //         userType:(i.user_id.type),
                  //         // buisnessName:(i.user_id.buisnessName),
                  //         mop:('modeOfPayment'),
                  //         date:(date),
                  //         amount:(i.amount),
                  //         dateDeposit:(i.amount),
                  //
                  //         bank:(i.bank_id),
                  //         account:(""),
                  //       amount:(i.amount),
                  //       reciptNo:(i.receipt_no),
                  //       balance:("Balance"),
                  //       remarks:(i.remarks),
                  //       };
                  return listOfUserArray.push(listOfUserRow);
                })
              }
            })
            //sort here
            console.log("this.ledgerData1" , listOfUserArray);
            listOfUserArray.sort(this.datesort_array) //Soring JSON by Date
            console.log(" //NOW Calculating  Balance" ,this.totalSubtr );
              // var curr=this.totalSubtr
               this.curr=this.totalSubtr
            listOfUserArray.forEach( (d,dx,dnx) => {
             console.log("//d.amount" , d.amount , "SecondAmount", d.SecondAmount);
              this.curr -= parseInt(d.amount)
              this.curr += parseInt(d.SecondAmount)
              console.log("//Curr" ,this.curr );
              d["newBalance"] = this.curr
              console.log(" //Seting Index ",dx, "To Val: ",this.curr);

              if (dx === dnx.length-1)
              {
                this.totalFinal = this.curr
              }
            })
            console.log("///// Final Answer " ,listOfUserArray);

            this.setState({
              posts: listOfUserArray
            })
            this.totalSubtr = -this.state.totalBalance
                collectionAmount = 0
  console.log("listOfUserArray.length" , listOfUserArray.length );
                  // this.setState({
                  if(listOfUserArray.length<=5){
                    console.log("Less than 5");
                  }
                  else{
                    totalNoOfRows=listOfUserArray.length
                  }
                  // })
            for (let i = 0; i <= listOfUserArray.length; i++) {
              if (listOfUserArray[i] !== undefined && listOfUserArray[i].amount !== '-') {
                console.log("AMOUNT SUM ....>" , i,  listOfUserArray[i]);
                // if(this.ledgerData[i].quantityBags!=undefined){
                //   if(this.ledgerData[i].quantityBags!= '-'){
                //     // console.log("in Loop done" ,this.ledgerData[i].quantityBags );
                collectionAmount += listOfUserArray[i].amount
                //   }
                // }
              }
            }
            console.log("AMOUNT SUM NOW", collectionAmount);

            this.setState({
              collectionAmount: collectionAmount
            })
            this.totalSubtr = -this.state.totalBalance
              depositAmount = 0
            for (let i = 0; i <= listOfUserArray.length; i++) {
              if (listOfUserArray[i] !== undefined && listOfUserArray[i].SecondAmount !== '-') {
                // console.log("AMOUNT SUM ....>", listOfUserArray[i].SecondAmount);
                // if(this.ledgerData[i].quantityBags!=undefined){
                //   if(this.ledgerData[i].quantityBags!= '-'){
                //     // console.log("in Loop done" ,this.ledgerData[i].quantityBags );
                depositAmount += listOfUserArray[i].SecondAmount
                //   }
                // }
              }
            }
            console.log("Deposite AMOUNT SUM NOW", depositAmount);

            this.setState({
              depositAmount: depositAmount
            })
            this.totalSubtr = -this.state.totalBalance          }
            else {
            console.log("khali else");
            this.subtr = 0
            this.setState({
              disableSelectField: false,
              isActiveSingleUser: false,
              isActive: false,
            })
            this.totalSubtr = -this.state.totalBalance
          }
        }

      })
    }



  }

  getLedgerDetailsSearch = e => {

    var body = {
      to: this.state.dateToDealer,
      from: this.state.dateFromDealer,
      user_id: this.props.match.params.id
    }

    var options = {
      method: 'POST',
      url: global.baseUrl + '/calculateLedger',
      headers: {
        'Authorization': localStorage.getItem("token")
      },
      body: body,
      json: true
    };

    console.log("options of Ledger ", options);
    request(options, (error, response, body) =>

    {

      if (error) {
        console.log("Error", error);
        this.message = 'SomeThing Went Wrong ..'
        this.notify("tc", false);
      } else {

        console.log("**Respone in calculateLedger", response);
        if (response.statusCode === 200 && response.body.reslut !== []) {

          this.ledgerData1 = body.result.order.map((i, data) => {
            console.log("Within MAp", i);
            var filer = "*"
            if (i.order !== undefined) {
              if (i.order.isFiler && i.order.isActiveFiler) {
                 filer = "Filer (Active)"
              }
              if (i.order.isFiler && !i.order.isActiveFiler) {
                 filer = "Filer (In Active)"
              }

              if (!i.isFiler) {
                filer = "Non-Filer"
              }

            }

            var date = "*"
            var address = ''
            var fromAddress = ''
            if (i.order.createdAt) {
              var d = i.order.createdAt.split('T')
              // let date=moment(i.createdAt).format('MMMM Do YYYY, h:mm a');
              // let date=moment(i.createdAt).format('LT');
              date = `${d[0]}`
            }

            if (i.order.address === 'Rawalpindi (RWP)') {
              address = 'RWP'
            } else if (i.order.address === 'Sawabi (SWB)') {
              address = 'SWP'
            }
            if (i.order.fromAddress === 'Hattar (HTR)') {
              fromAddress = 'HTR'
            } else if (i.order.fromAddress === 'Chakwal (CHK)') {
              fromAddress = 'CHK'
            } else if (i.order.fromAddress === "Farooqia (FAR)") {
              fromAddress = 'FAR'
            } else if (i.order.fromAddress === 'KalarKahar (KK)') {
              fromAddress = 'KK'
            }
            return {
              "id": i.order._id,
              "date": date,
              "sTaxInvNo": i.order.invoiceNumber,
              "biltyNo": i.order.biltyNumber,
              "address": `${address} - ${fromAddress}`,
              "type": filer,
              "quantityBags": i.order.quantity,
              "quantityTons": i.totalTons,
              "grossRate": i.grossRate,
              "value": i.valueExcGST,
              "gst": i.GSTwithMRP,
              "invoiceAmount": i.order.totalAmount,
              "advanceTax": i.advanceTax,
              "x1": "-",
              "x2": "-",
              "mop": "-",
              "instrumentNo": "-",
              "amount": "0",
              "balance": "-"
            }
          })

          this.ledgerData2 = body.result.payments.map((i, data) => {
            var filer = "-"

            if (i.order !== undefined) {
              if (i.order.isFiler && i.order.isActiveFiler) {
                 filer = "Filer (Active)"
              }
              if (i.order.isFiler && !i.order.isActiveFiler) {
                 filer = "Filer (In Active)"
              }

              if (!i.isFiler) {
                filer = "Non-Filer"
              }

            }

            var date = "-"
            if (i.date) {
              var d = i.date.split('T')
              // let date=moment(i.createdAt).format('MMMM Do YYYY, h:mm a');
              // let date=moment(i.createdAt).format('LT');
              date = `${d[0]}`
            }

            // var instrumentNo = "-"


            return {
              "id": i._id,
              "date": date,
              "sTaxInvNo": "-",
              "biltyNo": "-",
              "address": "-",
              "type": filer,
              "quantityBags": "-",
              "quantityTons": "-",
              "grossRate": 0,
              "value": 0,
              "gst": 0,
              "invoiceAmount": 0,
              "advanceTax": 0,
              "x1": "-",
              "x2": "-",
              "mop": i.paymentType,
              "instrumentNo": "-",
              "amount": i.amount,
              "balance": "-"
            }
          })
          this.ledgerData = this.ledgerData1.concat(this.ledgerData2);
          bagSum = 0
          tonSum = 0
          valueExcGst = 0
          gstValue = 0
          invoiceAmountValue = 0
          advanceTaxValue = 0
          amountValue = 0

          for (let i = 0; i <= this.ledgerData.length; i++) {
            if (this.ledgerData[i] !== undefined) {
              if (this.ledgerData[i].quantityBags !== undefined) {
                if (this.ledgerData[i].quantityBags !== '-') {
                  // console.log("in Loop done" ,this.ledgerData[i].quantityBags );
                  bagSum += this.ledgerData[i].quantityBags
                  console.log("bagSum", bagSum);
                }
              }

            }

          }
          for (let i = 0; i <= this.ledgerData.length; i++) {
            if (this.ledgerData[i] !== undefined) {
              if (this.ledgerData[i].quantityTons !== undefined) {
                if (this.ledgerData[i].quantityTons !== '-') {
                  // console.log("in Loop done" ,this.ledgerData[i].quantityTons );
                  tonSum += this.ledgerData[i].quantityTons
                  console.log("tonSum", tonSum);
                }
              }

            }

          }
          for (let i = 0; i <= this.ledgerData.length; i++) {
            if (this.ledgerData[i] !== undefined) {
              if (this.ledgerData[i].value !== undefined) {
                if (this.ledgerData[i].value !== '-') {
                  // console.log("in Loop done" ,this.ledgerData[i].value );
                  valueExcGst += this.ledgerData[i].value
                  console.log("valueExcGst", valueExcGst);
                }
              }

            }

          }
          for (let i = 0; i <= this.ledgerData.length; i++) {
            if (this.ledgerData[i] !== undefined) {
              if (this.ledgerData[i].gst !== undefined) {
                if (this.ledgerData[i].gst !== '-') {
                  // console.log("in Loop done" ,this.ledgerData[i].gst );
                  gstValue += this.ledgerData[i].gst
                  console.log("gstValue", gstValue);
                }
              }

            }

          }
          for (let i = 0; i <= this.ledgerData.length; i++) {
            if (this.ledgerData[i] !== undefined) {
              if (this.ledgerData[i].invoiceAmount !== undefined) {
                if (this.ledgerData[i].invoiceAmount !== '-') {
                  // console.log("in Loop done" ,this.ledgerData[i].invoiceAmount );
                  invoiceAmountValue += this.ledgerData[i].invoiceAmount
                  console.log("invoiceAmountValue", invoiceAmountValue);
                }
              }

            }

          }
          for (let i = 0; i <= this.ledgerData.length; i++) {
            if (this.ledgerData[i] !== undefined) {
              if (this.ledgerData[i].advanceTax !== undefined) {
                if (this.ledgerData[i].advanceTax !== '-') {
                  // console.log("in Loop done" ,this.ledgerData[i].advanceTax );
                  advanceTaxValue += this.ledgerData[i].advanceTax
                  console.log("advanceTaxValue", advanceTaxValue);
                }
              }

            }

          }
          for (let i = 0; i <= this.ledgerData.length; i++) {
            if (this.ledgerData[i] !== undefined) {
              if (this.ledgerData[i].amount !== undefined) {
                if (this.ledgerData[i].amount !== '-') {
                  // console.log("in Loop done" ,this.ledgerData[i].amount );
                  amountValue += parseInt(this.ledgerData[i].amount)
                  console.log("amountValue", amountValue);
                }
              }

            }

          }
          this.subtr = 0
          this.setState({
            posts: this.ledgerData,
            isActive: false
          })
          this.totalSubtr = -this.state.totalBalance
        } else {
          console.log("Else");
          this.subtr = 0
          this.setState({
            disableSelectField: false,
            isActiveSingleUser: false,
            isActive: false
          })
          this.totalSubtr = -this.state.totalBalance
        }
      }

    })

  }


  getAllCustomerApiCall = e => {
    var options = {
      method: 'POST',
      url: global.baseUrl + '/api/getAllCustomers',
      headers: {
        'Authorization': localStorage.getItem("token")
      },
      // body:data,
      json: true
    };
    console.log("options of Get ALL Customer ", options);
    request(options, (error, response, body) =>

    {
      if (error) {
        console.log("Error", error);
      }
      else{
        console.log("Respone in Get ALL CUSTOMER", response);
        this.subtr = 0
        this.setState({
          disableSelectField: false
        })
        this.totalSubtr = -this.state.totalBalance
        listOfOptioninCustomer = response.body.result;
        selectedDealer = []
        listOfOptioninCustomer.forEach((item, index) => {
          valueOfAllDealer = JSON.stringify(item);
          selectedDealer.push( <option key = {index}  value = {valueOfAllDealer}>
            {item.name}
            </option>)
            creditOfEachDealer.push({
              id: item._id,
              credit: item.credit
            })
          })
          console.log("CREDIT STATUS OBJECT", creditOfEachDealer);
          this.subtr = 0
          this.setState({
            customerOption: selectedDealer
          })
          this.totalSubtr = -this.state.totalBalance

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
    onClickCustomer = e => {
      console.log("Getting Value of full OPTION ", e.target.value);
      this.subtr = 0
      this.setState({
        dealerCode: JSON.parse(e.target.value)._id
      })
      this.totalSubtr = -this.state.totalBalance
       console.log("Dealer CLICKED", JSON.parse(e.target.value)._id);

      creditOfEachCustomer.forEach((item, index) => {
        console.log("ITEM", item.id);
        if (JSON.parse(e.target.value)._id === item.id) {
          this.subtr = 0
          this.setState({
            creditOfSelectedCustomer: item.credit
          })
          this.totalSubtr = -this.state.totalBalance        }
      })
    }
    onClickDealer = e => {
      console.log("Getting Value of full OPTION ", e.target.value);
      //
      this.subtr = 0
      this.setState({
        dealerCode: JSON.parse(e.target.value)._id
      })
      console.log("Dealer CLICKED", JSON.parse(e.target.value)._id);

      creditOfEachDealer.forEach((item, index) => {
        console.log("ITEM", item.id);
        if (JSON.parse(e.target.value)._id === item.id) {
          this.subtr = 0
          this.setState({
            creditOfSelectedCustomer: item.credit
          })
          this.totalSubtr = -this.state.totalBalance        }

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
      if (auth) {
        type = "success";
        time = 2
      } else {
        type = "danger"
        time = 4
      }

      var options = {};
      options = {
        place: place,
        message: ( <
          div > {
            (auth) ?
            <
            div > {
              this.message
            } <
            /div> :
            <
            div > {
              this.message
            }

            <
            /div>
          } <
          /div>
        ),
        type: type,
        icon: "tim-icons icon-bell-55",
        autoDismiss: time
      };
      this.refs.notificationAlert.notificationAlert(options);
    };

    apiCall = e => {
      var data = {
        to: this.state.dateToDealer,
        from: this.state.dateFromDealer,
        user_id: this.props.match.params.id
      }
      listOfUserArray = []
      var options = {
        method: 'POST',
        url: global.baseUrl + '/api/viewAllOrders',
        headers: {
          'Authorization': localStorage.getItem("token")
        },
        body: data,
        json: true
      };
      console.log("options of Customer Ledgers", options);
      request(options, (error, response, body) =>

      {
        if (error) {
          this.message = "Something Went Wrong .."
          this.notify("tc", false);
          this.subtr = 0
          this.setState({
            disableAlert: false
          })
          this.totalSubtr = -this.state.totalBalance
          console.log("Error", error);
        } else {
          console.log("Respone :: of Custonmer Ledger ", response);
          this.subtr = 0

          this.setState({
            isActive: false
          })
          this.totalSubtr = -this.state.totalBalance
                this.isActive = false;

          if (response.body.success !== false) {

            // this.responseToSend = response.body.user;
            if (this.responseToSend === []) {
              this.subtr = 0
              this.setState({
                noDataFound: "Record Not Found"
              })
              this.totalSubtr = -this.state.totalBalance
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
            console.log("after mapping ", this.response);
            // this.setState({
            //     posts:listOfUserArray
            // })
          } else {
            console.log("Else");
            this.message = response.body.message
            this.notify("tc", false);
          }


        }
      })



    }
    componentDidMount() {
      console.log("did");
      amountValue = 0
      bagSum = 0
      collectionAmount = 0
      depositAmount = 0
      this.setState({
        depositAmount: 0,
        collectionAmount: 0

      })
      this.totalSubtr = -this.state.totalBalance
      tonSum = 0
      valueExcGst = 0
      gstValue = 0
      invoiceAmountValue = 0
      advanceTaxValue = 0
      var url = require('url');
      // const fetch = require('node-fetch');
      const urlObj = url.parse(document.location.href, true);

      console.log("urlObj.hostname.indexOf(localhost)", urlObj.hostname, urlObj.hostname.indexOf("localhost"), urlObj.hostname.indexOf("-dev"));
      if (urlObj.hostname.indexOf("localhost") === -1 && urlObj.hostname.indexOf("-dev") === -1) {
        // global.baseUrl = "http://www.atms.pk"
        global.baseUrl = urlObj.protocol + '//' + urlObj.hostname
      } else {
        global.baseUrl = "http://atms-dev.herokuapp.com"
      }
      this.subtr = 0
      this.setState({
        disableSelectField: true
      })
      this.totalSubtr = -this.state.totalBalance      //     var curr = new Date();
      //     curr.setDate(curr.getDate() + 3);
      //     var date = curr.toISOString().substr(0,10);
      // this.setState({
      //       dateToDealer:date
      // })
      var x = localStorage.getItem("profile");
      console.log("DID MOUNT OF LIST OF USER", x);
      // this.getSingleUserApiCall();
      // this.getAllCustomerApiCall();

      // this.getBalanceForDate()
      this.getAllDealerApiCall();
      this.getAllUsersApiCall();
      this.getTotalCashInHand();

      // .toLocaleString('en-US')
      // this.apiCall();
      this.response = '';
      this.responseToSend = '';
      this.index = '';
      this.type = '';
      this.message = '';
      EventBus.on("OrderCreatedEventBuss", this.OrderCreatedEventBussFunc);
      // EventBus.on("dateEventingBus",this.dateEventingBusFunc );
    }
    OrderCreatedEventBussFunc = e => {
      console.log("Order Created Successfully", e);
    }
    componentWillMount() {
      // this.setState( { isChecked: this.props.isChecked } );
    }
    onClickDetail = e => {


      setTimeout(() => {
        console.log("Detail button  clicked", this.index);
        urlPrams = '/admin/listofusersdetail/' + this.index;
        this.props.history.push(urlPrams);
        console.log("URL PARAMS", urlPrams);
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

    deleteRow = id => {
      console.log("ID", id);
      const index = this.state.posts.findIndex(post => {
        return (post.id === id)
      })
      console.log('INDEX', index);
      let copyPosts = [...this.state.posts]
      copyPosts.splice(index, 1)
      this.subtr = 0
      this.setState({
        posts: copyPosts
      })
      this.totalSubtr = -this.state.totalBalance
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
    getTdPropsFunc = (state, rowInfo, column, instance) => {

      return {

        onClick: (e, handleOriginal) => {
          if (rowInfo !== undefined) {
            // console.log("It was in this row:", rowInfo.original.id);
            //                 console.log("It was in this row:", rowInfo.original.type);
            this.index = rowInfo.original.id;
            this.type = rowInfo.original.type;
          }


        }

      };

    }
    onChangeDate = e => {
      // this.setState({
      //   isActive:true
      // })
      // this.isActive=true; 
      console.log("DATE", e.target.value);
      this.subtr = 0
      this.setState({
        date:e
      })
      this.totalSubtr = -this.state.totalBalance      // setTimeout(()=>{
      //   this.apiCall();
      // },1000)


    }
    onChangeDateFromDealer = e => {
      console.log("dateFromDealer", e);
      this.subtr = 0
      // this.setState({
      //   dateFromDealer: e
      // })
      this.totalSubtr = -this.state.totalBalance    }
    onChangeDateToDealer = e => {
      console.log("dateToDealer", e);
      this.subtr = 0
      this.setState({
        dateToDealer: e
      })
      this.totalSubtr = -this.state.totalBalance    }

    onClickDealerCheckBox = e => {
      this.subtr = 0
      this.setState({
        formToLoad: 'dealer'
      })
      this.totalSubtr = -this.state.totalBalance
    }
    onClickEndUserCheckBox = e => {
      this.subtr = 0
      this.setState({
        formToLoad: 'customer'
      })
      this.totalSubtr = -this.state.totalBalance
    }
    onChangeDealer = e => {
      var dealerId = JSON.parse(e.target.value)
      console.log("onChangeDealer............................... ", dealerId._id);
      this.subtr = 0
      this.setState({
        userId: dealerId._id
      })
      this.totalSubtr = -this.state.totalBalance
    }
    onChangeCustomer = e => {
      var customerId = JSON.parse(e.target.value)
      console.log("onChangeCustomer............................... ", customerId._id);
      this.subtr = 0
      this.setState({
        userId: customerId._id
      })
      this.totalSubtr = -this.state.totalBalance
    }
    onClickSearch = e => {
      console.log("dateToDealer", this.state.userCode);
      this.subtr = 0
      this.singleUserSearch = true
      this.dealerSelected = true
      console.log("this.state.singleUserSearch inclickSSEACRHC", this.singleUserSearch);
      // this.totalSubtr = -this.state.totalBalance
          console.log("Search clicked");
      if (this.state.dateFromDealer > this.state.dateToDealer) {
        console.log('dateToDealer is greater');
        this.message = 'End Date Should Not Be Less Than Starting Date '
        this.notify("tc", false);
        this.subtr = 0
        this.setState({
          disableBtn: false,
          isActive: false
        })
        this.totalSubtr = -this.state.totalBalance      } else {
        // this.getCollectionLedgerDetails();
        this.getTotalCashInHand();
      }
    }
    onChangeCustomer = e => {
      var customerId = JSON.parse(e.target.value)
      console.log("onChangeCustomer............................... ", customerId._id);
      this.subtr = 0
      this.setState({
        userId: customerId._id
      })
      this.totalSubtr = -this.state.totalBalance
    }
    onClickPrint = e => {
      console.log("Print Action Clicked");
    }
    balanceFunc = e => {
      console.log("balanceValue ....func", e);
      balanceValue = e
    }
    onClickExportExel = e => {
      if(this.state.notdisbaleExportBtn===true)
      {
    if(this.singleUserSearch===true){
      this.setState({
        nameOfExportFile:`Collector's Ledger (${this.state.userName})`
      })
    }
      console.log("malik.....................................................................", listOfUserArray.length);
      this.arrayToExport = listOfUserArray.map((i, data) => {
        console.log("i of ledgerData ", i);
        // console.log("this.allBalances[data]" ,data ,this.allBalances);
        i.valueOfBalance = this.allBalances[data];
        // i.push(this.allBalances[data])
        console.log("i of ledgerData", i);
      })
      this.subtr = 0
      this.setState({
        exportExel: true,
        data: listOfUserArray
      })
      this.totalSubtr = this.state.totalBalance // only for putting initial value of total balance. (calculating balance reactatble)
      if(listOfUserArray.length!==0)
    {
      console.log("in ifff ...::>", listOfUserArray.length);
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    }
    else{
      this.message='No Records Found';
        this.notify("tc",false);
    }
      this.totalSubtr = -this.state.totalBalance
         }
         else{
           this.message='No Collector Ledger Found';
             this.notify("tc",false);
         }
    }
    onClickJsonToExcel=e=>{
      console.log("onClickJsonToExcel" ,listOfUserArray);
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
    }
    toggle() {
      this.setState(prevState => ({
        modal: !prevState.modal
      }));
      this.totalSubtr = -this.state.totalBalance    }
    getAllDealerApiCall = e => {
      var options = {
        method: 'POST',
        url: global.baseUrl + '/api/getAllDealers',
        headers: {
          'Authorization': localStorage.getItem("token")
        },
        // body:data,
        json: true
      };
      console.log("options of Get ALL Dealer ", options);
      request(options, (error, response, body) =>

      {
        if (error) {
          console.log("Error", error);
        } else {
          console.log("Respone in Get ALL Dealer", response);
          this.setState({
            disableSelectField: false
          })
          this.totalSubtr = -this.state.totalBalance
             listOfOption = response.body.result;
          selectedCustomer = []
          if(listOfOption!==undefined){
          listOfOption.forEach((item, index) => {
            if (item.buisnessName === '') {
              item.buisnessName = '-'
            }

            valueOfAllCustomer = JSON.stringify(item);
            selectedCustomer.push( < option key = {index} value ={valueOfAllCustomer}>
              {item.name}({item.buisnessName})
              </option>)
              creditOfEachCustomer.push({
                id: item._id,
                credit: item.credit
              })})
              console.log("selectedCustomer ...", selectedCustomer);
              this.setState({
                DealerOption: selectedCustomer
              })
              this.totalSubtr = -this.state.totalBalance              // if(body.success){
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
        onClickDealerOfCollectionLedger = e => {
          console.log("Getting Value of full OPTION ", e.target.value);

          this.setState({
            dealerCode: JSON.parse(e.target.value)._id,
          })
          this.totalSubtr = -this.state.totalBalance
              console.log("Dealer CLICKED", JSON.parse(e.target.value).credit);

          creditOfEachCustomer.forEach((item, index) => {
            console.log("ITEM", item.credit);
            if (JSON.parse(e.target.value)._id === item.id) {
              var creditOfSelectedUserValueCustomer = ''
              if (JSON.parse(e.target.value).credit < 0) {
                var m = JSON.parse(e.target.value).credit
                console.log("m:::::::::::::", Math.abs(m));
                creditOfSelectedUserValueCustomer = `(${Math.abs(m).toLocaleString('en-US')})`
              } else {
                creditOfSelectedUserValueCustomer = JSON.parse(e.target.value).credit
              }
              this.setState({
                creditOfSelectedCustomer: creditOfSelectedUserValueCustomer
              })
              this.totalSubtr = -this.state.totalBalance            }
          })
          this.setState((state, props) => {
            return {
              counter: 0 + props.step
            };
          });
          this.totalSubtr = -this.state.totalBalance
        }
        onChangeDealerOfCollectionLedger = e => {
          console.log("Getting Value of full OPTION ", e.target.value);

          this.setState({
            dealerCode: JSON.parse(e.target.value)._id,
          })
          this.totalSubtr = -this.state.totalBalance
               console.log("Dealer CLICKED", JSON.parse(e.target.value)._id);

          creditOfEachCustomer.forEach((item, index) => {
            console.log("ITEM", item.id);
            if (JSON.parse(e.target.value)._id === item.id) {
              this.setState({
                creditOfSelectedCustomer: item.credit
              })
              this.totalSubtr = -this.state.totalBalance            }
          })
          this.setState((state, props) => {
            return {
              counter: 0 + props.step
            };
          });
          this.totalSubtr = -this.state.totalBalance        }
        onClickUser = e => {
          console.log("Getting Value of full OPTION in user", e.target.value);
          //
          this.setState({
            userCode: JSON.parse(e.target.value)._id,
            userName:JSON.parse(e.target.value).name,
          })
          this.totalSubtr = -this.state.totalBalance
                 console.log("User CLICKED", JSON.parse(e.target.value)._id);

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
        onChangeCollectedBy = e => {
          console.log("Getting Value of full OPTION in user", e.target.value);
          //
          this.setState({
            userCode: JSON.parse(e.target.value)._id,
          })
          this.totalSubtr = -this.state.totalBalance
                console.log("User CLICKED", JSON.parse(e.target.value)._id);

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
            return {
              counter: 0 + props.step
            };
          });
          this.totalSubtr = -this.state.totalBalance
        }
        getTotalCashInHand = e => {
          var data = {
            user_id: this.state.userCode,
            date: this.state.dateFromDealer,
            dealer_id: this.state.dealerCode
          }
          var options = {
            method: 'POST',
            url: global.baseUrl + '/api/balanceTillDate',
            headers: {
              'Authorization': localStorage.getItem("token")
            },
            body: data,
            json: true
          };
          console.log("**Options of Get Total Cash In Hand  ", options);
          request(options, (error, response, body) => {
            if (error) {
              this.message = "Something Went Wrong .."
              this.notify("tc", false);
              this.setState({
                disableAlert: false
              })
              this.totalSubtr = -this.state.totalBalance
              console.log("Error", error);
            } else {
              console.log("**Respone in Get Total Cash In Hand", response.body);

   if(response.body && response.body.totalBalance!==null && response.body.totalBalance!==undefined){
console.log("if");
   }else{
     response.body.totalBalance = 0;
   }
              this.setState({
                totalBalance: response.body.totalBalance,
                subtr: response.body.totalBalance
              })

              this.totalSubtr = -response.body.totalBalance
              console.log("totalSubtr Set", this.totalSubtr);
              this.getCollectionLedgerDetails();
              // response.body.reslut.forEach((item, index)=>{
              //  console.log("vvvvv" , item._id);
              //
              // })
              //
            }
          })
        }
        getAllUsersApiCall = e => {
          var data = {
            type: JSON.stringify(["super", "admin", "financeManager", "deliveryManager", "collectionManager"])
          }
          var options = {
            method: 'POST',
            url: global.baseUrl + '/api/getAllUsersAdmin',
            headers: {
              'Authorization': localStorage.getItem("token")
            },
            body: data,
            json: true
          };
          console.log("options of Get ALL User Admin ", options);
          request(options, (error, response, body) =>

          {
            if (error) {
              this.message = "Something Went Wrong .."
              this.notify("tc", false);
              this.setState({
                disableAlert: false
              })
              this.totalSubtr = -this.state.totalBalance
              console.log("Error", error);
            } else {
              console.log("Respone in Get ALL User Admin", response);
              this.setState({
                disableSelectField: false
              })
              this.totalSubtr = -this.state.totalBalance
                        listOfOptionUser = response.body.result;
              selectedUser = []
              listOfOptionUser.forEach((item, index) => {
                if (item.type === '') {
                  item.type = '-'
                }
                valueOfAllUser = JSON.stringify(item);
                selectedUser.push( < option key = {index}  value = {valueOfAllUser}>
                  {item.name}({ item.type })
                  </option>)
                  creditOfEachUser.push({
                    id: item._id,
                    credit: item.credit
                  })
                })
                console.log("CREDIT STATUS OBJECT", creditOfEachUser);
                this.setState({
                  userOption: selectedUser
                })
                this.totalSubtr = -this.state.totalBalance
                              if (body.success) {
                  console.log("success :: ", body)

                } else {
                  console.log("success false :: ", body);
                }
              }
            })

          }
          render() {
            console.log("IN RENDOR OUR isCHECKED STATE:::", totalNoOfRows);
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
            const columns = [{
              Header: 'ID',
              accessor: 'id',

              style: {

                paddingTop: '23px',

              },
              show: false

            },
            {
              Header: 'SNO',
              accessor: 'sNO',
              show: false,
              // width:70,
              Cell: (row) => {
                return <div > {
                  row.index + 1
                } < /div>;},
                filterable: false,
                id: "row",
                style: {

                  paddingTop: '23px',
                  textAlign: 'center'

                },
              },
              {
                Header: 'COLLECTION',
                columns: [{
                  Header: 'Manager',
                  accessor: 'manager',
                  width:160,
                  filterable: false,
                  id: "row",
                  style: {
                    paddingTop: '23px',
                    textAlign: 'center'

                  },
                },
                {
                  Header: 'From',
                  accessor: 'from',
                  width: 220,
                  style: {

                    paddingTop: '23px',
                    textAlign: 'center'
                  },
                  sortMethod: (a, b) => {
                    if (a.length === b.length) {
                      return a > b ? 1 : -1;
                    }
                    return a.length > b.length ? 1 : -1;
                  }
                },
                {
                  Header: 'User Type',
                  accessor: 'userType',
                  width: 160,
                  style: {

                    paddingTop: '23px',
                    textAlign: 'center'

                  },
                  sortMethod: (a, b) => {

                    if (a.length === b.length) {
                      return a > b ? 1 : -1;
                    }
                    return a.length > b.length ? 1 : -1;
                  }
                },
                {
                  Header: 'MOP',
                  accessor: 'mop',
                  width: 160,

                  style: {
                    textAlign: 'center',
                    paddingTop: '23px'
                  },
                  show: true
                },
                {
                  Header: 'Date',
                  accessor: 'date',
                  width: 160,
                  style: {
                    textAlign: 'center',

                    paddingTop: '23px'
                  },
                  filterable: false
                },
                {
                  Header: 'Amount',
                  Footer: ( < span > < strong > Total: < /strong>  {(this.state.collectionAmount!==undefined)? this.state.collectionAmount.toLocaleString('en-US') : this.state.collectionAmount}</span > ),
                  accessor: 'amount',
                  Cell: (row) => {
                    return <div > {
                      (row.original.amount !== undefined) ? row.original.amount.toLocaleString('en-US') : row.original.amount
                    } < /div>;},
                    width: 160,

                    style: {
                      textAlign: 'center',
                      paddingTop: '23px'
                    },
                    filterable: false
                  },
                ]
              },
              {
                Header: 'DEPOSIT',
                columns: [{
                  Header: 'Date',
                  accessor: 'dateDeposit',
                  width: 160,

                  style: {
                    textAlign: 'center',
                    background :"#feff99",
                    paddingTop: '23px'
                  },
                  filterable: false
                },
                {
                  Header: 'Bank',
                  accessor: 'bank',
                  width: 160,
                  style: {
                    textAlign: 'center',
                   background :"#feff99",
                    paddingTop: '23px'
                  },
                  filterable: false
                },
                {
                  Header: 'Account',
                  accessor: 'account',
                  width: 250,

                  style: {
                    textAlign: 'center',
                   background :"#feff99",
                    paddingTop: '23px'
                  },
                  filterable: false
                },
                {
                  Header: 'Amount',
                  accessor: 'SecondAmount',
                  width: 160,
                  Footer: ( < span > < strong > Total: < /strong>  {(this.state.depositAmount!==undefined) ?  this.state.depositAmount.toLocaleString('en-US')  : this.state.depositAmount}</span > ),
                  Cell: (row) => {
                    return <div > {
                      row.original.SecondAmount.toLocaleString('en-US')
                    } < /div>;},
                    style: {
                      textAlign: 'center',
                     background :"#feff99",
                      paddingTop: '23px'
                    },
                    filterable: false
                  },
                  {
                    Header: 'Reciept No',
                    accessor: 'reciptNo',
                    width: 160,
                    // Cell: (row) => {return <div>{Number(row.original.value).toLocaleString('en-US')}</div>;},
                    style: {
                      textAlign: 'center',
                      background :"#feff99",
                      paddingTop: '23px'
                    },
                    filterable: false
                  },
                  {
                    Header: 'Remarks',
                    accessor: 'remarks',
                    width: 200,
                    // Cell: (row) => {return <div>{Number(row.original.invoiceAmount).toLocaleString('en-US')}</div>;},
                    style: {
                      textAlign: 'center',
                      background :"#feff99",
                      paddingTop: '23px'
                    },
                    filterable: false
                  },

                  {
                    Header: 'Balance',
                    width: 160,
                    accessor:'newBalance',
                    Cell: (row) => {return <div>{(row.original.newBalance < 0) ? "(" + Math.abs(row.original.newBalance).toLocaleString('en-US') + ")" : row.original.newBalance.toLocaleString('en-US')}</div>;},
                    Footer: (<span><strong>Total:</strong>  { (this.totalFinal < 0) ? "(" + Math.abs(this.totalFinal).toLocaleString('en-US') + ")" : this.totalFinal.toLocaleString('en-US') }</span>),

                    style: {
                      textAlign: 'center',

                      paddingTop: '23px'
                    },

                  },


                  //     {
                  //       Header:'Balance',
                  //         Footer: (<span><strong>Total:</strong>  { gstValue.toLocaleString('en-US')}</span>),
                  //         Cell: (row) => {
                  //           console.log("this.startingBalance",row.original.amount , "AND" ,row.original.SecondAmount );
                  //           // this.finalBalanceNew=row.original.amount
                  //           console.log("this.startingBalanceNew" , "-",this.startingBalanceNew,"-", row.original.amount , "+" , row.original.SecondAmount);
                  //           this.finalBalanceNew = this.startingBalanceNew- row.original.amount+row.original.SecondAmount
                  //             this.startingBalanceNew=this.finalBalanceNew
                  //               console.log("this.startingBalanceNew ......." , this.finalBalanceNew );
                  //               let toColumn = this.finalBalanceNew.toString();
                  //               // let toColumn = 1;
                  //               console.log("this.startingBalanceNewwwwww ......." , toColumn );
                  //
                  //               return <div>{toColumn}</div>;
                  //
                  //
                  //
                  //
                  // //           var a = this.startingBalance-this.subtr
                  // //           console.log("a" , a);
                  // //           console.log("row.original.invoiceAmount" , row.original.invoiceAmount  , "and " , row.original.amount);
                  // //           var toBeSubtr = row.original.invoiceAmount - row.original.amount
                  // //
                  // //           a = a - toBeSubtr
                  // //
                  // //           console.log("** value: ", a, toBeSubtr);
                  // //
                  // //           this.subtr = this.subtr + toBeSubtr
                  // //
                  // //           this.finalResult = a
                  // //           //this.setState({ subtr: subtr+this.state.subtr })
                  // //           console.log("balanceValue" , this.finalResult);
                  // //           balanceValue=this.finalResult
                  // //           // this.setState({bbb: balanceValue})
                  // //               // this.balanceFunc(balanceValue)
                  // //
                  // //           var finalBalance = (a>0)?Number(a).toLocaleString('en-US'):"("+ (Number(Math.abs(a))).toLocaleString('en-US')+")"
                  // //               var finalBalanceWithoutcomma = (a>0)?Number(a):"("+ (Number(Math.abs(a)))+")"
                  // //           console.log("finalBalance" , finalBalance);
                  // //
                  // //             this.allBalances.push(finalBalanceWithoutcomma)
                  // //
                  // // console.log("this.allBalances" , this.allBalances);
                  //           // this.setState((state, props) => {
                  //           //     return {counter: 0 + props.step};
                  //           //            })
                  //         },
                  //       accessor:'balance',
                  //       width:160,
                  //
                  //       style:{
                  //         textAlign:'center',
                  //
                  //         paddingTop:'23px'
                  //       },
                  //           filterable:false
                  //     },


                ]
              },
              {
                show: false,
                Header: 'Action',
                style: {
                  display: 'flex',
                  justifyContent: 'center'
                },
                width: 160,
                minWidth: 100,
                maxWidth: 200,
                sortable: false,
                filterable: false,
                Cell: props => < span >

                <
                Button onClick = {
                  this.onClickPrint
                }
                style = {
                  {
                    background: 'royalblue',
                    color: 'white',
                    paddingBottom: '4px',
                    paddingTop: '4px',
                    fontWeight: '500',
                    marginTop: '12px'
                  }
                } >
                Print < /Button> <
                /span>


              }
            ]
            return (
              <
              div className = "content ledgerPage" >
              < LoadingOverlay active = {  this.state.isActive  }
              spinner text = 'Loading Collection Ledger' >
              <  Card style = {
                {
                  padding: '15px'
                }
              }>
              <
              div className = "react-notification-alert-container" >
              <
              NotificationAlert ref = "notificationAlert" / >
              <
              /div> <
              h3 style = {
                {
                  padding: '1%',
                  marginBottom: '0px'
                }
              } > Collector 's Ledger</h3> <
              h4 style = {
                {
                  margin: '10px',
                  color: 'green'
                }
              } > < u > AMMAD TRADING < /u></h4 >
              <Form style = {
                {
                  marginLeft: '10px'
                }
              } >
              <
              Form style = {
                {
                  marginLeft: '10px'
                }
              } >
              <
              FormGroup row >
              <
              Col style = {
                {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }
              sm = {
                2
              } >
              <
              Label data-tip = "Mandatory Field" > Collector Name < span style = {
                {
                  color: 'red',
                  fontSize: '15px'
                }
              } > * < /span> </Label >
              <
              select style = {
                {
                  borderRadius: '8px',
                  height: '39px'
                }
              }
              onClick = {
                this.onClickUser
              }
              onChange = {
                this.onChangeCollectedBy
              } > {
                (this.state.disableSelectField) &&
                <
                option disabled selected hidden >
                Loading,
                Please Wait.. <
                /option>
              } <
              option selected hidden > Select User < /option> {
                this.state.userOption
              } <
              /select> <
              /Col> <
              div style = {
                {
                  display: 'flex',
                  flexDirection: 'column',
                  paddingRight: '24px',
                  paddingLeft: '10px',
                  marginTop: '5px'
                }
              } >
              <
              Label
              for = "date" > Start Date < /Label> <
              DatePicker className = 'datePickerCashManagement'
              selected = {
                this.state.dateFromDealer
              }
              onChange = {
                this.onChangeDateFromDealer
              }
              /> {
                /*<Input
                onChange={this.onChangeDate}
                type="Date" name="date" id="date" value={this.state.date} placeholder="Choose a Date" />*/
              } <
              /div> <
              div style = {
                {
                  display: 'flex',
                  flexDirection: 'column',
                  paddingRight: '24px',
                  paddingLeft: '10px',
                  marginTop: '5px'
                }
              } >
              <
              Label
              for = "date" > End Date < /Label> <
              DatePicker className = 'datePickerCashManagement'
              selected = {
                this.state.dateToDealer
              }
              onChange = {
                this.onChangeDateToDealer
              }
              /> {
                /*<Input
                onChange={this.onChangeDate}
                type="Date" name="date" id="date" value={this.state.date} placeholder="Choose a Date" />*/
              } <
              /div> <
              Col style = {
                {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }
              sm = {
                2
              } >
              <
              Label data-tip = "Mandatory Field" > Dealer Name < span style = {
                {
                  color: 'red',
                  fontSize: '15px'
                }
              } > * < /span> </Label >
              <
              select style = {
                {
                  borderRadius: '8px',
                  height: '39px'
                }
              }
              onClick = {
                this.onClickDealerOfCollectionLedger
              }
              onChange = {
                this.onChangeDealerOfCollectionLedger
              } > {
                (this.state.disableSelectField) &&
                <
                option disabled selected hidden >
                Loading,
                Please Wait.. <
                /option>
              } <
              option selected hidden > Select Dealer < /option> {
                this.state.DealerOption
              } <
              /select>

              <
              /Col> <
              Col style = {
                {
                  margin: '18px'
                }
              }
              sm = {
                1
              } >
              <
              Button style = {
                {
                  padding: '6px',
                  marginTop: '11px'
                }
              }
              onClick = {this.onClickSearch} color = "info" disabled = {this.state.isActiveCalculateLedger}>
                 Search

              </Button> <
              /Col>

              <
              /FormGroup > <
              FormGroup style = {
                {
                  display: 'flex',
                  justifyContent: "flex-end",
                  marginRight: '2px'
                }
              }
              row >
              <
              span onClick = {
                this.onClickExportExel
              }
              style = {
                {
                  background: '#02a5de',
                  cursor: 'pointer',
                  borderRadius: '7px',
                  display: 'flex',
                  marginTop: '12px',
                  justifyContent: 'center',
                  alignItems: 'center'
                }
              } > < div style = {
                {
                  color: 'white',
                  fontWeight: "bold",
                  padding: "10px"
                }
              } > Export < /div><img alt='' style={{width:'35px' , height:'23px'}}src='/exportIcon.png '></img></span>

              {
                /*<span style={{paddingRight:'10px' , background:'#02a5de', marginLeft:'61%' ,cursor:'pointer'
                ,borderRadius:'7px',display:'flex' , marginTop:'12px', justifyContent:'center' , alignItems:'center'}}><div style={{color:'white' , fontWeight:"bold" , padding:"10px"}}>Export</div><img style={{width:'23px' , height:'23px'}}src='/exportPDF.png'></img></span>
                */
              } < /FormGroup> <
              /Form>

              <
              LoadingOverlay active={this.state.isActiveCalculateLedger}
              spinner text = 'Loading Collector Ledger' >
              <FormGroup style = {
                {marginTop: '10px'}
              }
              row >
              <Col sm = {
                12
              } >

              <
              ReactTable style = {{
                  height: '500px'
                }
              }
              columns = {
                columns
              }
              data = {
                posts
              }
              showPagination = {false}
              pageSize={totalNoOfRows}
              resizable={false}
                /*minRows={1}
              defaultPageSize={totalNoOfRows}*/
              onFilteredChange = {
                filtered => {
                  this.allBalances = []
                  console.log("Subtr", this.subtr);
                  this.subtr = 0
                  console.log("Subtr", this.subtr);
                  this.setState({
                    a: "test"
                  })
                  this.totalSubtr = -this.state.totalBalance                }
              }

              onPageChange = {
                filtered => {
                  this.allBalances = []
                  console.log("Subtr", this.subtr);
                  this.subtr = 0
                  console.log("Subtr", this.subtr);
                  this.setState({
                    a: "test"
                  })
                  this.totalSubtr = -this.state.totalBalance                }
              } // Called when the page index is changed by the user
              onPageSizeChange = {
                filtered => {
                  this.allBalances = []
                  console.log("Subtr", this.subtr);
                  this.subtr = 0
                  console.log("Subtr", this.subtr);
                  this.setState({
                    a: "test"
                  })
                  this.totalSubtr = -this.state.totalBalance                }
              } // Called when the pageSize is changed by the user. The resolve page is also sent to maintain approximate position in the data
              onSortedChange = {
                filtered => {
                  this.allBalances = []
                  console.log("Subtr", this.subtr);
                  this.subtr = 0
                  console.log("Subtr", this.subtr);
                  this.setState({
                    a: "test"
                  })
                  this.totalSubtr = -this.state.totalBalance                }
              } // Called when a sortable column header is clicked with the column itself and if the shiftkey was held. If the column is a pivoted column, `column` will be an array of columns
              onExpandedChange = {
                filtered => {
                  this.allBalances = []
                  console.log("Subtr", this.subtr);
                  this.subtr = 0
                  console.log("Subtr", this.subtr);
                  this.setState({
                    a: "test"
                  })
                  this.totalSubtr = -this.state.totalBalance                }
              } // Called when an expander is clicked. Use this to manage `expanded`
              onFilteredChange = {
                filtered => {
                  this.allBalances = []
                  console.log("Subtr", this.subtr);
                  this.subtr = 0
                  console.log("Subtr", this.subtr);
                  this.setState({
                    a: "test"
                  })
                  this.totalSubtr = -this.state.totalBalance                }
              } // Called when a user enters a value into a filter input field or the value passed to the onFiltersChange handler by the Filter option.
              onResizedChange = {
                filtered => {
                  this.allBalances = []
                  console.log("Subtr", this.subtr);
                  this.subtr = 0
                  console.log("Subtr", this.subtr);
                  this.setState({
                    a: "test"
                  })
                  this.totalSubtr = -this.state.totalBalance                }
              } // Called when a user clicks on a resizing component (the right edge of a column header)
              noDataText = {
                'Empty'
              }
              /*      sorted={[
              {
              id: 'dateSorted',
              desc: true
            }]}*/

            defaultFilterMethod = {
              this.filterMethod
            }
            sortable = {
              false
            }
            getTdProps = {
              this.getTdPropsFunc
            }><
            /ReactTable>

            <
            /Col> <
            /FormGroup> <
            /LoadingOverlay> <
            /Form>

            <
            hr / >
                <
            /Card> <
            /LoadingOverlay> <
            Modal isOpen = {
              this.state.modal
            }
            toggle = {
              this.toggle
            }
            className = {
              this.props.className
            } >
            <
            ModalHeader toggle = {
              this.toggle
            } > < strong > Please Click On Button Below to Download Excel File < /strong></ModalHeader >
            <
            ModalBody >
              <div    onClick={this.onClickJsonToExcel} >
            <
            JsonToExcel onClick = {
              this.onClickJsonToExcel
            }
            data = {
              this.state.data
            }
            className = {
              className
            }
            filename = {
              this.state.nameOfExportFile
            }
            fields = {
              fields
            }
            style = {
              {
                display: 'flex',
                justifyContent: 'center',
                marginLeft: '130px'
              }
            }
            />
           </div>

            </ModalBody>

            </Modal>
            </div>

          );
        }
      }

      export default CollectionLedger;
