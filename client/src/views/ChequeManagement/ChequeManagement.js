import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import 'react-table/react-table.css'
import LoadingOverlay from 'react-loading-overlay';
import ReactTooltip from 'react-tooltip'
import ReactTable from "react-table";
import NotificationAlert from "react-notification-alert";
// import BankAccounts from "../Delivery/BankAccounts.js"
import BankAccountsForCheque from "./BankAccountsForCheque.js"
// import Date from "views/ChequeManagement/Date.js"
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
   Input,

} from "reactstrap";
 import EventBus from 'eventing-bus';
 var request = require("request");
 // const url = global.baseUrl
 // const url = "http://localhost:1338"
 var listOfOptionUser=[]
 var valueOfAllUser=''
 var selectedUser=[]
 var creditOfEachUser=[]

 let  listOfUserRow='';
  let  listOfUserRow1='';
    let  listOfUserRow2='';
 let listOfUserArray=[];
  let listOfUserArray1=[];
    let listOfUserArray2=[];
 var listOfOption=[]
 // var malik = []
 var valueOfAllCustomer=''
 var selectedCustomer =[]
  var accountNo:''
  var statusOfCheque='Deposit'
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';
// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';
class ChequeManagement extends React.Component {
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
  constructor(props){
    super(props);

    this.state={
      disableAlert:false,

      disableSelectField:false,

      status:'Deposit',
      searchValue:0,
      item:'',
      accountNumber:'',
        bankOption:[],
      posts:[],
      posts1:[],
      posts2:[],
      clearOrBounce:'',
      isActiveChequeInHand:false,
      isActiveChequeInProcess:false,
      isActiveChequeIssued:false

    }

  }
  getAllPendingChequeApiCall=e=>{
    this.setState({
        isActiveChequeInHand:true
    })
    console.log("Get All Pending Cheque Api Call Clicked.....................................................????" ,listOfUserArray );

    listOfUserArray=[]
    var options = { method: 'POST',
        url: global.baseUrl + '/api/getAllPendingCheques',
        headers: {'Authorization': localStorage.getItem("token") },
       // body:data,
        json: true
      };
  console.log("options of Get ALL pending Cheques ", options);
  this.isActiveChequeInHand=true;
  this.isActiveChequeInProcess=true;
  this.isActiveChequeIssued=true;
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error", error);
        }
        else
  {
          console.log("Respone  in get all Pending Cheques :: ", response);
  this.setState({
      isActiveChequeInHand:false
  }) 

  // this.isActiveChequeInHand=false;     
        this.responseToSend = response.body.user;
       console.log("BEFORE MAPPING ", response.body.result);
       listOfUserRow=''


         this.response=response.body.result.map((i  , data)=>{
             var amountValue=''
           if(i.amount<0){
             var m=i.amount
             console.log("m:::::::::::::" ,Math.abs(m));
             amountValue=`(${Math.abs(m).toLocaleString('en-US')})`
           }else{
             amountValue=i.amount
           }

       if(i.user_id){
         if (i.user_id.buisnessName === "") {
           i.user_id.buisnessName="-"
         }

         listOfUserRow =
           {
             paymentId:(i._id),
             name:(i.user_id.name),
             buisnessName:(i.user_id.buisnessName),
             type:(i.user_id.type),
         chequeNo:(i.chequeNumber),
         amount:(amountValue).toLocaleString('en-US'),
         remarks:(i.remarks),
         bankAccount:(<BankAccountsForCheque/>),
         status:(i.status),
         collectedBy:(i.collectedBy.name)
         };
       }else{

         if (i.buisnessName === "") {
           i.buisnessName="-"
         }

         listOfUserRow =
           {
             paymentId:(i._id),
             name:(i.name),
             buisnessName:(i.buisnessName),
         chequeNo:(i.chequeNumber),
         amount:(amountValue).toLocaleString('en-US'),
         remarks:(i.remarks),
         status:(i.status)

         };
       }

          return  listOfUserArray.push(listOfUserRow);
         })
         console.log("after mapping " , this.response);
       this.setState({
           posts:listOfUserArray
       })
        }
      })
  }
  getAllDepositedChequeApiCall=e=>{
    this.setState({
        isActiveChequeIssued:true
    })
    listOfUserArray2=[]
      this.isActiveChequeIssued=true;
    var options = { method: 'POST',
        url: global.baseUrl + '/api/getAllDeposittedCheques',
        headers: {'Authorization': localStorage.getItem("token") },
       // body:data,
        json: true
      };
  console.log("options of Get ALL Deposited Cheques ", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error", error);
        }
        else
  {
          console.log("Respone  in get all  Deposited Cheques :: ", response);  
  this.setState({
      isActiveChequeIssued:false
  })   
  this.isActiveChequeIssued=false;  
  listOfUserRow2=''
         this.response=response.body.result.map((i  , data)=>{
           if (i.user_id.buisnessName === '') {
             i.user_id.buisnessName='-'
           }
            listOfUserRow2 =

              {
                paymentId:(i._id),
                name:(i.user_id.name),
                buisnessName:(i.user_id.buisnessName),
                type:(i.user_id.type),
            chequeNo:(i.chequeNumber),
            bank:(i.bank_id.name),
            amount:(i.amount).toLocaleString('en-US'),
            remarks:(i.remarks)
            };
            console.log("clearrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr" , listOfUserRow1);

                   return  listOfUserArray2.push(listOfUserRow2);
         })

         console.log("after mapping ************************************************************ " , listOfUserArray2);
       this.setState({
           posts2:listOfUserArray2
       })
        }
      })
  }
  getAllUnderProcessChequeApiCall=e=>{
    this.setState({
        isActiveChequeInProcess:true
    })
    listOfUserArray1=[]
    // this.isActiveChequeInProcess=true

    var options = { method: 'POST',
        url: global.baseUrl + '/api/getAllUnderProcessCheques',
        headers: {'Authorization': localStorage.getItem("token") },
       // body:data,
        json: true
      };
  console.log("options of Get ALL UnderProcess Cheques ", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error", error);
        }
        else
  {
          console.log("Respone  in get all UnderProcess Cheques :: ", response);
  this.setState({
      isActiveChequeInProcess:false
  })

  // this.isActiveChequeInProcess=false;
  listOfUserRow1=''

         this.response=response.body.result.map((i  , data)=>{
           var amountOfUnderProcessChequeValue=''
           if(i.amount<0){
             var m=i.amount
             console.log("m:::::::::::::" ,Math.abs(m));
             amountOfUnderProcessChequeValue=`(${Math.abs(m).toLocaleString('en-US')})`
           }else{
             amountOfUnderProcessChequeValue=i.amount
           }

           if (i.user_id.buisnessName === '') {
             i.user_id.buisnessName = '-'
           }

            listOfUserRow1 =

              {
                paymentId:(i._id),
                name:(i.user_id.name),
                buisnessName:(i.user_id.buisnessName),
                type:(i.user_id.type),
            chequeNo:(i.chequeNumber),
            bankAccount:(`${i.account_id.bank.code} (${i.account_id.accountTitle} - ${i.account_id.accountNumber})`),
            amount:(amountOfUnderProcessChequeValue).toLocaleString('en-US'),
            remarks:(i.remarks)
            };

          return  listOfUserArray1.push(listOfUserRow1);
         })
         console.log("after mapping ################################ " , listOfUserArray1);
       this.setState({
           posts1:listOfUserArray1
       })
        }
      })

  }
  updateChequestatusApiCall=e=>{
    var data={
      payment_id:this.paymentId,
      status:this.state.clearOrBounce
    }

    var options = { method: 'POST',
        url: global.baseUrl + '/api/updateChequeStatus',
        headers: {'Authorization': localStorage.getItem("token") },
         body:data,
        json: true
      };
  console.log("options of Update Cheque Request ", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error", error);
        }
        else
  {
          console.log("Respone  in Update  Cheque Request  :: ", response);
  this.setState({
   disableAlert:false
  })
        this.getAllDepositedChequeApiCall();
        this.getAllUnderProcessChequeApiCall();
         this.getAllPendingChequeApiCall();

       //   this.response=response.body.result.map((i  , data)=>{
       //
       //      listOfUserRow1 =
       //
       //        {
       //          paymentId:(i._id),
       //          name:(i.user_id.name),
       //      chequeNo:(i.chequeNumber),
       //      bank:(i.bank_id.name),
       //      amount:(i.amount),
       //      remarks:(i.remarks)
       //      };
       //
       //    return  listOfUserArray1.push(listOfUserRow1);
       //   })
       //   console.log("after mapping " , this.response);
       // this.setState({
       //     posts1:listOfUserArray1
       // })
        }
      })

  }
  onClickClear=e=>{
    this.setState({
     disableAlert:true
    })

    console.log("Clear ");
    this.setState({
      clearOrBounce:'clear'
    })
    setTimeout(()=>{
      this.updateChequestatusApiCall();
    },1000)
  }
  onClickBounce=e=>{
    this.setState({
     disableAlert:true
    })
    console.log("bounced ");
    this.setState({
      clearOrBounce:'bounced'
    })

    setTimeout(()=>{
      this.updateChequestatusApiCall();
    },1000)

  }
  getAllBankAccountApiCall=e=>{
    this.setState({
        disableAlert:true
    })
    var options = { method: 'POST',
        url: global.baseUrl + '/getAllBankAccounts',
       // headers: {'Authorization': localStorage.getItem("token") },
       //body:data,
        json: true
      };
  console.log("options of Get All Banks Accounts", options);
      request(options, (error, response, body) =>
      {
        if (error)
        {
          console.log("Error", error);
        }
        else
        {
          console.log("Respone in Get All Bank Accounts", response);
  this.setState({
      disableAlert:false
  })   
  this.setState({
      disableSelectField:false
  })
                       listOfOption = response.body.result;
                    selectedCustomer=[]
                    listOfOption.forEach((item, index)=>{
                      console.log("item.accountNumber>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" ,item);
                       valueOfAllCustomer=JSON.stringify(item);
                       // var  objectOFAccountNo={
                       //     accountNumber:item.accountNumber,
                       //     index:this.props.paymentNo
                       //   }
                      selectedCustomer.push(
                         <option value={item._id}>
                         {item.accountNumber}
                         </option>
                       )
                    })
                    this.setState({
                      bankOption:selectedCustomer
                    })
                      // response.body.result.map((i,data)=>{
                      //   console.log("EAch Value" , i);
                      //   valueOfAllCustomer=JSON.stringify(i);
                      //   listOfOption.push
                      //   (<option key ={i._id} value = {valueOfAllCustomer}>{i.name}</option>)
                      // })
                      // console.log("Array of Pushed Banks " , listOfOption);

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
  accountOfBankEventBusFunc=e=>{
    console.log("THROUGH EVVENT BUS ACCOUNT OF BANK in Cheque Management '''''''''''''''''''''''''''''''''''''''''''''''''" , e);
    // this.setState({
    //   accountNumber:e
    // })
    accountNo=e
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
    EventBus.on("accountOfBankEventBus",this.accountOfBankEventBusFunc);

     this.response = '';
     this.paymentId='';
     this.remarks='';
     this.bank='';
this.getAllUsersApiCall();
    // this.getAllIssuedChequeApiCall();
      this.getAllBankAccountApiCall();
    this.getAllPendingChequeApiCall(); /*Call ALL CHECQUES IN HAND*/
    this.getAllDepositedChequeApiCall();
    this.getAllUnderProcessChequeApiCall();
    // this.getAllBanks();
  EventBus.on("dateEventingBus",this.dateEventingBusFunc);
  }
//   getAllBanks=e=>{
//     var options = { method: 'POST',
//         url: global.baseUrl + '/getAllBanks',
//        // headers: {'Authorization': localStorage.getItem("token") },
//        //body:data,
//         json: true
//       };
//   console.log("options of Get All Banks", options);
//       request(options, (error, response, body) =>
//
//       {
//         if (error)
//         {
//           console.log("Error", error);
//         }
//         else
//         {
//           console.log("Respone in Get All Banks", response);   
//                        listOfOption = response.body.result;
// selectedCustomer=[]
//                        listOfOption.forEach((item, index)=>{
//                           valueOfAllCustomer=JSON.stringify(item);
//
//                        //   selectedCustomer.push
//                        //    (<option key={index} value={item._id}>{item.name}</option>)
//                        // })
//                        //
//                        // this.setState({
//                        //   bankOption:selectedCustomer
//                        // })
//
//
//                       // response.body.result.map((i,data)=>{
//                       //   console.log("EAch Value" , i);
//                       //   valueOfAllCustomer=JSON.stringify(i);
//                       //   listOfOption.push
//                       //   (<option key ={i._id} value = {valueOfAllCustomer}>{i.name}</option>)
//                       // })
//                       // console.log("Array of Pushed Banks " , listOfOption);
//
//          // if(body.success){
//          //   console.log("success :: ", body)
//          //
//          // }
//          // else {
//          //   console.log("success false :: ", body);
//          // }
//   //       }
//       })
//   }

  getAllIssuedChequeApiCall=e=>{
    this.setState({
        disableAlert:true
    })
    var options = { method: 'POST',
        url: global.baseUrl + '/api/getAllIssuedCheques',
        headers: {'Authorization': localStorage.getItem("token") },
       // body:data,
        json: true
      };
  console.log("options of Get ALL Chequed Issued ", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error", error);
        }
        else
  {
          console.log("Respone  in  All  Chequed Issued:: ", response);
  this.setState({
      disableAlert:false
  })  

                          //   this.response=response.body.result.map((i  , data)=>{
                          //
                          //      listOfUserRow2 =
                          //
                          //        {
                          //          paymentId:(i._id),
                          //          name:(i.user_id.name),
                          //      chequeNo:(i.chequeNumber),
                          //      amount:(i.amount),
                          //      remarks:(i.remarks)
                          //      };
                          //
                          //    return  listOfUserArray2.push(listOfUserRow2);
                          //   })
                          //   console.log("after mapping " , this.response);
                          // this.setState({
                          //     posts2:listOfUserArray2
                          // })
                                }    

      })

  }
  dateEventingBusFunc=e=>{

    console.log("date by eventBus",e);
    console.log("variable value of date",this.state.searchValue);
    this.setState({
      searchValue:e
    })
  }

  deleteRow=id=>{
    console.log("ID",id);
    const index=this.state.posts.findIndex(post=>{
      return (post.id===id)
    })
    console.log('INDEX',index  );

    let copyPosts = [...this.state.posts]
       copyPosts.splice(index,1)

     this.setState({posts:copyPosts})﻿

  }
  filterMethod = (filter, row, column) => {

    const id = filter.pivotId || filter.id

    return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase()) : true

  }
DepositApiCall=e=>{
  this.setState({
      disableAlert:true
  })
  console.log("API OF Deposit Cheque.............................",this.state.accountNumber);
  var data={
    depositedBy:localStorage.getItem("user_id"),
    payment_id:this.paymentId,
    remarks:this.remarks,
    account_id:accountNo
  }
  if(data.account_id===undefined){
    this.message='Please Select Bank Account'
          this.notify("tc",false);
          this.setState({
              disableAlert:false
          })
  }
  else if (data.depositedBy===undefined) {
    this.message='Please Select User'
          this.notify("tc",false);
          this.setState({
              disableAlert:false
          })
  }
  else{
    var options = { method: 'POST',
        url: global.baseUrl + '/api/depositCheque',
        headers: {'Authorization': localStorage.getItem("token") },
        body:data,
        json: true
      };
  console.log("options of Deposite Cheque ", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error", error);
        }
        else
  {
          console.log("Respone  in Deposite cheque:: ", response);
  this.setState({
      disableAlert:false
  })
  this.message=response.body.message
        this.notify("tc",true);
                 this.getAllPendingChequeApiCall();
                 this.getAllUnderProcessChequeApiCall();

         // this.responseToSend = response.body.user;
       //  console.log("BEFORE MAPPING ", response.body.result);
       //   this.response=response.body.result.map((i  , data)=>{
       //     const m = (i.time).split('T')
       //      listOfUserRow =
       //
       //        {
       //            id:(i.user_id._id),
       //        time:(m[0]),
       //        name:(i.user_id.name),
       //        callerName:(i.user_id.interpreterStatus),
       //        email:(i.user_id.email),
       //        totalConsumed:(i.consumed),
       //          callStatus:(i.status)
       //      };
       //
       //    return  listOfUserArray.push(listOfUserRow);
       //   })
       //   console.log("after mapping " , this.response);
       // this.setState({
       //     posts:listOfUserArray
       // })
        }
      })
  }

}
onClickBank=e=>{
 e.preventDefault();
 this.bank = e.target.value;
  // setTimeout(()=>{

//       console.log("SET TIME OUT OF 1SEC")
//   }
// , 1000)
}
onChangebankOptionValue=e=>{


}
// onChangeRemarks=e=>{
//   console.log("Remarks ...." , e.target.value);
//   this.setState({
//     remarks:e.target.value
//   })
// }
  getTdPropsFunc=(state, rowInfo, col, instance) => ({
                 onClick: (e , cb) => {
                      if(rowInfo!==undefined){
                        console.log("It was in this row of call History :", rowInfo.original);
                                         this.paymentId= rowInfo.original.paymentId;
                                         this.remarks= rowInfo.original.remarks;

                      }




                 }
             })
             onClickbankOptionValue= (e) =>{
               console.log("onClickbankOptionValue" ,e.target);
               console.log("AND Index From Select Account No" ,);
               this.setState({
                 accountNumber:e.target.value,
                 item:this.paymentId
               })
           //     var objOfBank=JSON.parse(e.target.value)
           //     console.log("testing of BANK ACCOUNT " , objOfBank.accountNumber);
           //     console.log("testing Of PAYMENT NO" , objOfBank.index);
           // this.setState({
           //   idOfSelectedBank:e.target.value
           // })
           // setTimeout(()=>{
           //   console.log("Account no" , this.state.idOfSelectedBank);
           //     EventBus.publish("accountOfBankEventBus",objOfBank);
           // },1000
           // );
           // EventBus.publish("accountOfBankEventBus",objOfBank);

             }
             onClickDelete=e=>{
               this.setState({
                disableAlert:true
               })
               console.log("Delete button clicked");
               setTimeout(()=>{
                 this.deleteChequeApiCall();
               },1000)

             }
             deleteChequeApiCall=e=>{
               console.log("Order Id " , this.paymentId);

               this.setState({
                   disableAlert:true
               })
               // e.preventDefault();
               console.log("SAved CLICKED");
               // var user_id=localStorage.getItem("user_id")

               var data={
                   isDeleted:true,
                 // date:this.state.date,
                    // user_id:this.state.dealerId,
                    // deliveryType:this.state.deliveryType,
                    // user_id:user_id,
                    payment_id:this.paymentId,
                   //  deliveryItemType:this.state.bagsOrBulk,
                   //  quantity:parseInt(this.state.amountOfBags),
                   //  biltyNumber:parseInt(this.state.biltyNo),
                   //  truckNumber:this.state.truckId,
                   // rate:this.state.rate,
                   //  totalAmount:this.state.orderPrice,
                   //  address:this.state.location
               }


                 var options = { method: 'POST',
                     url: global.baseUrl + '/api/updatePayment',
                     headers: {'Authorization': localStorage.getItem("token") },
                    body:data,
                     json: true
                   };
               console.log("options of Delete Bank Cheque", options);
                   request(options, (error, response, body) =>

                   {
                     if (error)
                     {
                       console.log("Error Of Delete Bank Cheque", error);
             }
                     else
                     {
                       console.log("Respone in Delete Bank Cheque", response); 

               this.setState({
                   disableAlert:false
               })
               if(response.body.success){
               this.message='Cheque Returned Successfully'
                   this.notify("tc",true);
this.getAllPendingChequeApiCall();
                // EventBus.publish("OrderCreatedEventBuss",true)
                 }
                   else{
                     this.message=response.body.message
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
                     console.log("Respone in Get ALL User Admin", response);   
             this.setState({
                 disableSelectField:false
             })
                      listOfOptionUser = response.body.result;
                      selectedUser=[]
                      listOfOptionUser.forEach((item, index)=>{
                         valueOfAllUser=JSON.stringify(item);
                        selectedUser.push(<option key ={index} value = {valueOfAllUser}>{item.name}</option>)
                         creditOfEachUser.push(
                           {
                             id:item._id,
                             credit:item.credit
                           }
                         )
                      })
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


  render() {
    console.log("RENDOR Of Cheque Management" , this.state.item);
    console.log("After Push in State" ,this.state.bankOption);
    console.log("Original value of pushed option in veriable" ,selectedCustomer);

    let posts = this.state.posts
  		if (this.state.searchValue) {
  			posts = posts.filter(row => {
  				return row.date.includes(this.state.searchValue) ||
          row.name.includes(this.state.searchValue) ||
            row.chequeNo.includes(this.state.searchValue) ||
              row.amount.includes(this.state.searchValue) ||
                row.bank.includes(this.state.searchValue) ||
                  row.remarks.includes(this.state.searchValue)

  			})
  		}


    const columns1=[
      {
        Header:'Name',
        accessor:'name',
        style:{
          fontSize:'12px',

 textAlign:'center',
          paddingTop:'15px'
        },
      },
      {
        Header:'Business Name',
        accessor:'buisnessName',
        width:150,
        style:{
          fontSize:'12px',

 textAlign:'center',
          paddingTop:'15px'
        },
      },
      {
        Header:'User Type',
        accessor:'type',
        style:{
          fontSize:'12px',
          paddingTop:'15px',
           textAlign:'center',
        },
      },
      {
        Header:'Cheque No.',
        accessor:'chequeNo',


        style:{
          fontSize:'12px',
             textAlign:'center',

          paddingTop:'15px'
        },
      },
      {
        Header:'Amount (PKR)',
        accessor:'amount',
        width:150,
        style:{
          fontSize:'12px',

            textAlign:'center',
          paddingTop:'15px'
        }
      },
      {
        Header:'Bank Account ',
        accessor:'bankAccount',
         width:300,
        style:{
          fontSize:'12px',
            textAlign:'center',
          paddingTop:'15px'
        }
      },
      {
        Header:'Remarks',
        accessor:'remarks',
        style:{
          fontSize:'12px',

          textAlign:'center',
          paddingTop:'15px'
        }

      },
      {
        Header:'ACTION',
        style:{
        display:'flex',

        },
        width:166,
        minWidth:100,
        maxWidth:200,
        sortable:false,
        filterable:false,
        resizable:false,
        Cell: props =>   <span>
        <Button onClick={()=>{
            this.onClickClear();
        }
      } disabled={this.state.disableAlert}
        style={{background:'royalblue',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
         Clear </Button>
        <Button   onClick={()=>{this.deleteRow(props.original.id)
            this.onClickBounce();
        }
      } disabled={this.state.disableAlert}
        style={{background:'red',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
         Bounce  </Button>
        </span>
      }
    ]
   /* const columns2=[
      {
        Header:'Name',
        accessor:'name',
        style:{

          paddingTop:'15px'
        },
      },
      {
        Header:'Cheque No.',
        accessor:'chequeNo',

        style:{

          paddingTop:'15px'
        },
      },
      {
        Header:'Amount (PKR)',
        accessor:'amount',
        style:{

          paddingTop:'15px'
        }
      },
      {
        Header:'Bank Account',
        accessor:'bank',
        style:{

          paddingTop:'15px'
        }
      },
      {
        Header:'Remarks',
        accessor:'remarks',
        style:{

          paddingTop:'15px'
        }

      },
      {
        Header:'ACTION',
        style:{
        display:'flex',
        justifyContent:'center'
        },
        width:200,
        minWidth:100,
        maxWidth:200,
        sortable:false,
        filterable:false,
        Cell: props =>   <span>

        <Button onClick={()=>{this.deleteRow(props.original.id)}}
        style={{background:'royalblue',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
         Clear </Button>
        <Button
        style={{background:'red',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
         Bounce  </Button>
        </span>



      }
    ]*/

    const columns=[
      {
        Header:'Date',
        accessor:'date',
        style:{
          fontSize:'12px',


          paddingTop:'23px'
        },
        show: false

      },
      {
        Header:'Payment Id',
        accessor:'paymentId',
        style:{
          fontSize:'12px',

         textAlign:'center',
          paddingTop:'23px'
        },
        show: false
      },
      {
        Header:'Name',
        accessor:'name',
        style:{
          fontSize:'12px',

               textAlign:'center',
          paddingTop:'23px'
        },
      },
      {
        Header:'Business Name',
        accessor:'buisnessName',
        width:150,
        style:{
          fontSize:'12px',
          paddingTop:'23px',
            textAlign:'center',
        },
      },
      {
        Header:'User Type',
        accessor:'type',
        style:{
          fontSize:'12px',
          marginTop:'6px',
          paddingTop:'15px',
            textAlign:'center',
        },
      },
      {
        Header:'Cheque No.',
        accessor:'chequeNo',

        style:{
          fontSize:'12px',
               textAlign:'center',

          paddingTop:'23px'
        },
      },
      {
        Header:'Amount (PKR)',
        accessor:'amount',
        width:150,
        style:{
          fontSize:'12px',
          textAlign:'center',

          paddingTop:'23px'
        }
      },
      {
        Header:'Collected By',
        accessor:'collectedBy',
        style:{
          fontSize:'12px',
        textAlign:'center',

          paddingTop:'23px'
        }
      },
      {
        Header:'Bank Account',
        id:'banks',
        width:170,
        accessor:data=>{
          console.log("data in react table" ,data);
          return data.bankAccount;
        },
        Cell:props=>
        <span>
        {/*props.original.bankAccount*/}
     <BankAccountsForCheque/>
        </span>,
        style:{

          fontSize:'12px',

          paddingTop:'7px'
        },

            filterable:true
      },
      {
        Header:'Remarks',
        accessor:'remarks',
        style:{
          fontSize:'12px',


          paddingTop:'25px'
        }

      },
      {
        Header:'ACTION',
          id:'action',
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
        accessor:data=>{
          console.log("data in react table of rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr" ,data);
          return data.status;
        },
        Cell:props=> <span>
        {  console.log("Here Status Values" , props.original.status)}
      <div hidden>  {
        (props.original.status==='bounced')?
       statusOfCheque="Re-Deposit"
      :
      statusOfCheque="Deposit"

          }
          </div>
        <Button onClick={()=>{
          console.log("Now Value Of Cheque Status" , props.original.status);

          /*this.deleteRow(props.original.id)*/

            this.DepositApiCall();

        }} disabled={this.state.disableAlert}
        style={{background:'royalblue',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500',marginTop:'12px'}}>
         {statusOfCheque} </Button>
         <Button onClick={()=>{
           /*this.deleteRow(props.original.id)*/

             this.onClickDelete();

         }}
         disabled={this.state.disableAlert}
         style={{background:'red',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500',marginTop:'12px'}}>
          Return </Button>
        </span>
      }
    ]
    console.log("LAST ONE" , this.state.posts2);
    return (
        <div className="content">
<ReactTooltip type='info' effect='solid'/>
        <div className="scrollerclass">
          <Card style={{padding:'15px'}}>
          <div className="react-notification-alert-container">
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          </div>
        <h3 style={{padding:'1%', marginBottom:'0px'}}>Cheque Management</h3>

      <span style={{display:'flex',justifyContent:"space-Between"}}>  <h4 style={{margin:'10px', color:'green'}}><u>View All Cheques Status</u></h4>
                <Col style={{display:'flex',flexDirection:'column' ,marginTop:'3px'}}sm={3}>
                <Label>Deposited By</Label>
                <Input disabled onChange={this.onChangeName} value={localStorage.getItem("loginUserName")} placeholder="User" />

          {/*      <select style={{borderRadius:'8px',height:'39px'}}
                    onClick={this.onClickUser}
                    onChange={this.onChangeName}>
                    {
                      (this.state.disableSelectField) &&
                      <option disabled selected hidden>
                      Loading, Please Wait..
                      </option>
              }
                <option selected hidden>Select User</option>
                            {this.state.userOption}
                </select>*/}

                </Col>

                  </span>


{/*        <Date/>*/}
        <Form style={{marginLeft:'10px'}}>

        <LoadingOverlay
              active={this.state.isActiveChequeInHand}
              spinner

              text='Loading Checque In Hand'
              >
                      <FormGroup row>
                       <h4 style={{paddingLeft:'2%'}}>Cheque In Hand</h4>
                      <Col sm={12}>
                      <ReactTable
                      style={{height: '400px'}}

                      columns={columns}
                      data={this.state.posts}
                      defaultFilterMethod={this.filterMethod}
              getTdProps={this.getTdPropsFunc}
                          filterable
                          noDataText={"Empty"}
                        defaultPageSize={100}
                          >
                      </ReactTable>
                      </Col>
                      </FormGroup>
                        </LoadingOverlay>

   <hr/>
   <LoadingOverlay
         active={this.state.isActiveChequeInProcess}
         spinner
         text='Loading Checque In Process'
         >

   <FormGroup style={{marginTop:'5%'}}row>
      <h4 style={{paddingLeft:'2%'}}>Cheque In Process</h4>
    <Col sm={12}>
        <ReactTable
        style={{height: '400px'}}

        defaultFilterMethod={this.filterMethod}
       getTdProps={this.getTdPropsFunc}
          columns={columns1}
          data={this.state.posts1}
            filterable
            noDataText={"Empty.."}
          defaultPageSize={100}
        >
        </ReactTable>
          </Col>
            </FormGroup>
              </LoadingOverlay>
  {    /*      <hr/>

            <LoadingOverlay
                  active={this.state.isActiveChequeIssued}
                  spinner

                  text='Loading Checque Issued'
                  >

            <FormGroup style={{marginTop:'5%'}}row>
               <h4 style={{paddingLeft:'2%'}}>Cheque Issued</h4>
             <Col sm={12}>
                 <ReactTable
                 style={{overflow:'scroll',height: '400px'}}

                 defaultFilterMethod={this.filterMethod}
                getTdProps={this.getTdPropsFunc}
                   columns={columns2}
                   data={this.state.posts2}
                     filterable
                     noDataText={"Empty"}
                   defaultPageSize={100}
                 >
                 </ReactTable>
                   </Col>
                     </FormGroup>
                         </LoadingOverlay>*/}
                </Form>

                    </Card>
                    </div>
        </div>

    );
  }
}

export default ChequeManagement;
