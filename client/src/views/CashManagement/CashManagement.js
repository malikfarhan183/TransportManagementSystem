import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import 'react-table/react-table.css'
import ReactTable from "react-table";
import ReactTooltip from 'react-tooltip'
// import Date from "../ChequeManagement/Date.js"
import NotificationAlert from "react-notification-alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
 import EventBus from 'eventing-bus';
 import LoadingOverlay from 'react-loading-overlay';
 import "./CashManagement.css"
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
var request = require("request");
// const url = global.baseUrl
// var moment = require('moment');

// const url = "http://localhost:1338"

let  listOfUserRow='';
let listOfUserArray=[];
var listOfOptionUser=[]
var valueOfAllUser=''
var selectedUser=[]
var creditOfEachUser=[]
let urlPrams='';

var listOfOption=[]
// var malik = []
var valueOfAllCustomer=''
var selectedCustomer =[]
var amountSum = 0
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class CashManagement extends React.Component {
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
            {  this.message}
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
  constructor(props){
    super(props);
    this.state={
      disableAlertBtn:false,
      disableAlert:false,

      posts:[],
      date:new Date(),
      cashInHand:'',

        disableSelectField:false,
      idOfSelectedBank:'',
      amountToBank:'',
      remarks:'',
      bankOption:[],
        bankOptionValue:'',

    }
  }

  getAllBanksApiCall=e=>{
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
    this.message="Something Went Wrong .."
    this.notify("tc",false);
    this.setState({
        disableAlert:false
    })

          console.log("Error", error);
        }
        else
        {
          console.log("Respone in Get All Bank Accounts", response);   
  this.setState({
      disableSelectField:false
  })
                       listOfOption = response.body.result;
                    selectedCustomer=[]
                    listOfOption.forEach((item, index)=>{
                      console.log("malkik" , item);
                       valueOfAllCustomer=JSON.stringify(item);
                       // var  objectOFAccountNo={
                       //     accountNumber:item.accountNumber,
                       //     accountId:item._id,
                       //     index:this.props.paymentNo
                       //   }

                      selectedCustomer.push(<option key ={index} value={item._id}>{`${item.bank.code} (${item.accountTitle} - ${item.accountNumber})`}</option>)
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


  getTotalCashInHandApiCall=e=>{
 var data={
   date:this.state.date
 }

    var options = { method: 'POST',
        url: global.baseUrl + '/api/getTotalCashInHand',
        headers: {'Authorization': localStorage.getItem("token") },
         body:data,
        json: true
      };
  console.log("options of Total Cash In Hand ", options);
      request(options, (error, response, body) =>
      {
        if (error)
        {
          console.log("Error", error);
        }
        else
        {
          console.log("Response in Total Cash In Hand ", response);   
             this.setState({
               cashInHand:response.body.result
             })
           // response.body.result.map((i,data)=>{
           //   console.log("VALUE of ))))))))))))))))))))))))))))))))))))))))))))))))))))))))" , i);
           //   valueOfAllCustomer=JSON.stringify(i);
           //   listOfOption.push
           //   (<option key ={i} value = {valueOfAllCustomer}>{i.name}</option>)
           // })
           // console.log("array " , listOfOption);
           //

         // if(body.success){
         //   console.log("success :: ", body)
         //   this.notify("tc",true);
         //
         // }
         // else {
         //   console.log("success false :: ", body);
         //   this.notify("tc",false);
         //
         // }
        }
      })

  }
  componentDidMount(){
  var url = require('url');
  // const fetch = require('node-fetch');
  const urlObj = url.parse(document.location.href, true);
console.log("urlObj" , urlObj);
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
      this.index=''
    this.getAllUsersApiCall();
    this.addCashOnHandToBankHistoryapiCall();
      this.getTotalCashInHandApiCall();
    this.setState({
        disableSelectField:true,
        isActive:true
    })

    console.log("did");
    this.getAllBanksApiCall();

    EventBus.on("dateEventingBus",this.dateEventingBusFunc );

  }
  dateEventingBusFunc=e=>{
    console.log("dateEventingBusFunc ........................................" , e);
    this.setState({
      date:e
    })
    setTimeout(()=>{
        this.getTotalCashInHandApiCall();
    },1000)
  }
  onClickSendAmount=e=>{
this.setState({
  disableAlertBtn:true
})
    console.log("AMont is send");

    // this.setState({
    //   cashInHand:this.state.cashInHand,
    //   amountToBank:'',
    //   remarks:''
    // })
    var data={
      collectedBy:this.state.userCode,
         account_id:this.state.idOfSelectedBank,
         amount:(this.state.amountToBank),
         date:this.state.date,
         remarks:this.state.remarks,
         depositSlip:this.state.depositSlip
    }
    if(data.collectedBy===undefined){
          this.message='Please Select User'
      this.notify("tc",false);
      this.setState({
          disableAlertBtn:false
      })
    }
    else if (data.amount==='') {
      this.message='Please Enter Amount'
      this.notify("tc",false);
      this.setState({
          disableAlertBtn:false
      })
    }
    else if (data.account_id==='') {
      this.message='Please Select Bank Account'
      this.notify("tc",false);
      this.setState({
          disableAlertBtn:false
      })
    }
    else if (data.depositSlip===undefined) {
      this.message='Please Enter Deposit Slip No.'
      this.notify("tc",false);
      this.setState({
          disableAlertBtn:false
      })
    }


    // else if (data.amount>-(this.state.creditOfSelectedUser)) {
    //   console.log("data.amonut" ,data.amount );
    //   console.log("this.state.creditOfSelectedUser" ,this.state.creditOfSelectedUser );
    //   this.message='Your Entered Amount is Greater Than Total Cash Of Selected User'
    //   this.notify("tc",false);
    //   this.setState({
    //       disableAlertBtn:false
    //   })
    // }
    else{
      var options = { method: 'POST',
          url: global.baseUrl + '/api/addCashOnHandToBank',
          headers: {'Authorization': localStorage.getItem("token") },
          body:data,
          json: true
        };
    console.log("**options of addCashOnHandToBank ", options);
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
            console.log("**Respone in addCashOnHandToBank", response);
    this.setState({
        disableAlertBtn:false
    })
    this.setState({
        // disableSelectField:false,
      idOfSelectedBank:'',
      amountToBank:'',
      remarks:'',
      bankOption:[],
        bankOptionValue:'',
        date:new Date(),
        depositSlip:''
    })
    this.getAllBanksApiCall();
    this.getAllUsersApiCall();
    // EventBus.publish("cashPaymentsEventBus",true)
             // response.body.result.map((i,data)=>{
             //   console.log("VALUE of ))))))))))))))))))))))))))))))))))))))))))))))))))))))))" , i);
             //   valueOfAllCustomer=JSON.stringify(i);
             //   listOfOption.push
             //   (<option key ={i} value = {valueOfAllCustomer}>{i.name}</option>)
             // })
             // console.log("array " , listOfOption);
             //
           if(body.success){
             console.log("success :: ", body)
             this.message=response.body.message

             this.notify("tc",true);
                 this.getTotalCashInHandApiCall();
                 this.addCashOnHandToBankHistoryapiCall();

           }
           else {
             console.log("success false :: ", body);
             this.message=response.error._message
             this.notify("tc",false);

           }
          }
        })
    }

  }
  onChangeAmount=e=>{
    console.log(e.target.value);
    this.setState({
      amountToBank:e.target.value
    })

  }
  onChangedepositSlip=e=>{
    console.log("onChangedepositSlip" , e.target.value);
    this.setState({
      depositSlip:e.target.value
    })
  }
  onChangebankOptionValue=e=>{
    console.log("Onchange func called");
    this.setState({
      bankOptionValue:e.target.value
    })

  }
  onChangeRemarks=e=>{
    this.setState({
      remarks:e.target.value
    })
  }
  onChangeBankAccount=e=>{
    console.log("CLicked Bank" , e.target.value);
this.setState({
  idOfSelectedBank:e.target.value
})
this.setState((state, props) => {
     return {counter: 0 + props.step};
            });


  }
  onClickCustomer=e=>{

    console.log("CLicked Bank" , e.target.value);
this.setState({
  idOfSelectedBank:e.target.value
})


  }
  onChangeDate=e=>{
    this.setState({
      date:e
    })
  }
  getAllUsersApiCall=e=>{
    this.setState({
      userOption:'',
      creditOfSelectedUser:''
    })
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
    // this.message="Oops (404) - Please Check Your Internet Connection"
    // this.notify("tc",false);
    // this.setState({
    //     disableAlert:false
    // })

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
  addCashOnHandToBankHistoryapiCall= e=>{
    this.setState({
        // disableSelectField:true,
        isActive:true
    })

    listOfUserArray=[]
  var options = { method: 'POST',
      url: global.baseUrl + '/api/addCashOnHandToBankHistory',
      headers: {'Authorization': localStorage.getItem("token") },
      json: true
    };
console.log("**options of addCashOnHandToBank History", options);
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
        console.log("**Respone :: of addCashOnHandToBank History ", response);    
this.isActive=false;   
this.setState({
  isActive:false
})
        // this.responseToSend = response.body.user;
       if(this.responseToSend===[])
       {
         this.setState({
           noDataFound:"Record Not Found"
         })
       }
      console.log("BEFORE MAPPING IN LIST OF ALL USER***** ", response.body.result);
       this.response=response.body.result.map((i,data)=>{
         var amountValue=''
         var collectedByType=''
         var remarks=i.remarks
         let date=i.date.split('T');
         console.log("amount  ff" , i.amount);
         if(i.amount<0){
           var m=i.amount
           console.log("m:::::::::::::" ,Math.abs(m));
           amountValue=`(${Math.abs(m).toLocaleString('en-US')})`
         }else{
           amountValue=i.amount
         }
         if(i.collectedBy.type==='admin'){
           collectedByType='Admin'
         }
         else if (i.collectedBy.type==='financeManager') {
           collectedByType='Financial Manager'
         }
         else if (i.collectedBy.type==='collectionManager') {
           collectedByType='Collection Manager'
         }
         else if (i.collectedBy.type==='deliveryManager') {
           collectedByType='Delivery Manager'
         }
         if(i.remarks=== '' || i.remarks=== null  || i.remarks=== undefined){
           remarks = '-'
         }

         // console.log("amountValue" ,amountValue);
         // let date=moment(i.date).format('LT');
         // let date=moment(i.date).format('MMMM Do YYYY, h:mm a');
         if(response.body.result===undefined){
           listOfUserRow =
           {
           id:(i._id),
           // name:(i.collectedBy.name),
           bank:(i.account_id.bank.name),
           amount:(amountValue).toLocaleString('en-US'),
           amountForTotal:(i.amount),
           date:(date[0]),
           depositSlipNo:(i.depositSlip),
           // time:(time),
           remarks:(remarks)
         };

         }
         else{
           if (i.collectedBy) {
             listOfUserRow =
             {
                 id:(i._id),
                 name:(i.collectedBy.name),
                 type:(collectedByType),
                 bank:(i.account_id.bank.name),
                 amount:(amountValue).toLocaleString('en-US'),
                 amountForTotal:(i.amount),
                 date:(date[0]),
                 // time:(time),
                 remarks:(remarks),
                 depositSlipNo:(i.depositSlip),
           };
           }
         }
              return  listOfUserArray.push(listOfUserRow);
       })


for (let i = 0; i <= listOfUserArray.length; i++) {
  if(listOfUserArray[i]!==undefined){
    console.log("in Loop done" ,listOfUserArray[i].amountForTotal );
   amountSum += listOfUserArray[i].amountForTotal
   console.log("amountSum",amountSum);
  }

}
       console.log("malik" , amountSum);
     this.setState({
         posts:listOfUserArray
     })

      }
    })
}
onChangeName=e=>{
  console.log("Getting Value of full OPTION in user" ,e.target.value);
  //
  this.setState({
    userCode:JSON.parse(e.target.value)._id,
  })
    console.log("User CLICKED vv" , JSON.parse(e.target.value).credit);
    var creditOfSelectedUserValue=''
    if(JSON.parse(e.target.value).credit<0){
      var m=JSON.parse(e.target.value).credit
      console.log("m:::::::::::::" ,Math.abs(m));
      creditOfSelectedUserValue=`(${Math.abs(m).toLocaleString('en-US')})`
    }else{
      creditOfSelectedUserValue=JSON.parse(e.target.value).credit
    }

  // creditOfEachCustomer.forEach((item, index)=>{
  //   console.log("ITEM" ,item.id);
  //  if(JSON.parse(e.target.value)._id === item.id)
  //  {
     this.setState({
       creditOfSelectedUser:creditOfSelectedUserValue
     })
  //  }
  //  })
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
  var creditOfSelectedUserValue=''
  if(JSON.parse(e.target.value).credit<0){
    var m=JSON.parse(e.target.value).credit
    console.log("m:::::::::::::" ,Math.abs(m));
    creditOfSelectedUserValue=`(${Math.abs(m).toLocaleString('en-US')})`
  }else{
    creditOfSelectedUserValue=JSON.parse(e.target.value).credit
  }
// creditOfEachCustomer.forEach((item, index)=>{
//   console.log("ITEM" ,item.id);
//  if(JSON.parse(e.target.value)._id === item.id)
//  {
   this.setState({
     creditOfSelectedUser:creditOfSelectedUserValue
   })
//  }
//  })
this.setState((state, props) => {
     return {counter: 0 + props.step};
            });
}
onClickEdit=e=>{
  this.setState({
    disableAlert:true

  })
  console.log("Edit button clicked");

      setTimeout(() => {
        console.log("Detail button  clicked" , this.index );
        urlPrams= '/home/EditCashDepossiteToBank/' + this.index;
         this.props.history.push(urlPrams);
         console.log("URL PARAMS" , urlPrams);
         // EventBus.publish("apiCall",this.responseToSend)
  }, 1000);
}
deleteCashInHandToBankApiCall=e=>{
  console.log("Order Id " , this.index);

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
       payment_id:this.index,
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
  console.log("options of Delete Payment Call", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
    this.message="Something Went Wrong .."
    this.notify("tc",false);
    this.setState({
        disableAlert:false
    })

          console.log("Error Of Delete Payment Call", error);
}
        else
        {
          console.log("Respone in Delete Payment Call", response); 
  this.setState({
      disableAlert:false,

  })
  if(response.body.success){
  this.message='Payment Deleted Successfully'
      this.notify("tc",true);
      this.getAllUsersApiCall();
       // EventBus.publish("OrderCreatedEventBuss",true)
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
     rate:750,
     deliveryType:'Delivered',
     pageToLoad3:'',
     bagsOrBulk:'Bags',
     biltyNo:'',
     truckNo:'',
DealerOption:'',
trucksOption:'',
trucksOptionLocation:''
       })
       this.addCashOnHandToBankHistoryapiCall();
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
onClickDelete=e=>{
  this.setState({
    disableAlert:true

  })
  console.log("Delete button clicked");
  setTimeout(()=>{
    this.deleteCashInHandToBankApiCall();
  },1000)

}
getTdPropsFunc=(state, rowInfo, column, instance) => {
     return {

                   onClick: (e, handleOriginal) => {


                      console.log("Checking Row is empty or not" , e.target);
                      if(rowInfo!==undefined){
                        console.log("It was in this row:", rowInfo);
                                        console.log("It was in this row:", rowInfo.original.type);
                                        this.index= rowInfo.original.id;
                                        // this.type=rowInfo.original.type;
                      }
           
                   }

                 };
          }
  render() {
    console.log("Pushed Banks in Render"  ,listOfOption);
    console.log("After Push in State" , this.state.bankOption);
    console.log("Id of Bank" ,this.state.idOfSelectedBank);
    const columns=[
      {
        Header:'ID',
        accessor:'id',
        width:130,

        style:{
          textAlign:"center"
,
          paddingTop:'23px'
        },
        show: false
      },
      {
        Header:'Collected From',
        accessor:'name',
        width:130,

        style:{
          textAlign:"center"
,
          paddingTop:'23px',

        },
      },
      {
        Header:'User Type',
        accessor:'type',
        width:130,

        style:{
          textAlign:"center",
          paddingTop:'23px',
        },
      },
      {
        Header:'Amount (PKR)',
         Footer: (<span><strong>Total:</strong>  { amountSum.toLocaleString('en-US')}</span>),
        accessor:'amount',
        width:130,

        style:{
          textAlign:"center"
,
          paddingTop:'23px'
        },
      },
      {
        Header:'Bank',
         // Footer: (<span><strong>Total:</strong>  { amountSum}</span>),
        accessor:'bank',
        width:130,

        style:{
          textAlign:"center"
,
          paddingTop:'23px'
        },
      },
      {
        Header:'Deposit Slip No.',
         // Footer: (<span><strong>Total:</strong>  { amountSum}</span>),
        accessor:'depositSlipNo',
        width:160,

        style:{
          textAlign:"center"
,
          paddingTop:'23px'
        },
      },
      {
        Header:'Date',
        accessor:'date',
        width:130,

        style:{
          textAlign:"center"
,
          paddingTop:'23px'
        },
            filterable:true

      },

      {
        Header:'Remarks',
        accessor:'remarks',
        width:130,

        style:{
          textAlign:"center"
,
          paddingTop:'23px'
        },
      },
      {
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
        Cell: props =>   <span style={{display:'flex'}}>
        <Button onClick={this.onClickEdit}
        disabled={this.state.disableAlert}

         style={{marginTop:"13px" ,height:"26px",background:'#02a5de',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
          Edit </Button>
       <Button onClick={this.onClickDelete}
       disabled={this.state.disableAlert}
        style={{marginTop:"13px" ,height:"26px",background:'red',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
         Delete  </Button>
        </span>
      },
    ]
    return (
        <div className="content">
        <ReactTooltip type='info' effect='solid'/>
        <div className="react-notification-alert-container">
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        </div>
        <div className="scrollerclass">
        <Card style={{padding:'15px'}}>
                      <h3 style={{padding:'1%', marginBottom:'0px'}}>CASH MANAGEMENT</h3>
                      <h4 style={{margin:'10px', color:'green'}}><u>Process Bank Deposit</u></h4>

                      {/*<Date/>*/}
                      <Form style={{marginLeft:'10px'}}>

                      <FormGroup row>
                      <Label data-tip="Mandatory Field" for="search" sm={2}>Select User <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                      <Col style={{display:'flex',flexDirection:'column' ,marginTop:'3px'}}sm={3}>
                      <Label>Collected By</Label>
                      <select style={{borderRadius:'8px',height:'39px'}}
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
                      </select>
                      </Col>
                      </FormGroup>
                      <FormGroup row>
                      <Label for="search" sm={2}>Total Cash (PKR)</Label>
                      <Col sm={2}>
                        <Input style={{border:'transparent',color:'green',
                          borderRadius: '0px',
                          borderBottom: 'solid 1px' , fontWeight:'bold'}}type="text" name="search" id="search" value={this.state.creditOfSelectedUser} placeholder="" />
                      </Col>
                      </FormGroup>
                      <hr/>
                    <FormGroup row>
                    <Col sm={2}>
                    <Label data-tip="Mandatory Field">Cash Deposit To Bank <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                      <Input min='0' type="number" name="amount" id="amount" onChange={this.onChangeAmount} value={this.state.amountToBank} placeholder="Amount (PKR)" />
                    </Col>
                    <Col sm={2}>
                    <Label data-tip="Mandatory Field" for="exampleSelect"> Bank Account <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                    <Input type="select" name="select" id="exampleSelect" onClick={this.onClickCustomer} onChange={this.onChangeBankAccount}>
                    {
                      (this.state.disableSelectField) &&
                      <option disabled selected hidden>
                      Loading, Please Wait..
                      </option>
                    }

                                <option selected hidden>
                             Select Bank Account
                                  </option>
                                              {this.state.bankOption}

                    </Input>

                    </Col>
                    <Col sm={2}>
                    <Label data-tip="Mandatory Field">Deposit Slip <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                      <Input type="text" name="depositSlip" id="depositSlip" onChange={this.onChangedepositSlip} value = {this.state.depositSlip} placeholder="Deposit Slip" />
                    </Col>
                     <div style={{display:'flex',flexDirection:'column' ,marginTop:'3px' , paddingRight:'24px' , paddingLeft:'10px'}}>
                      <Label for="date">Date</Label>
                      <DatePicker className='datePickerCashManagement'
                                 selected={this.state.date}
                                 onChange={this.onChangeDate}
                               />
                      {/*<Input
                      onChange={this.onChangeDate}
                      type="Date" name="date" id="date" value={this.state.date} placeholder="Choose a Date" />*/}
                      </div>
                    <Col sm={2}>
                    <Label>Remarks</Label>
                      <Input type="text" name="remarks" id="remarks" onChange={this.onChangeRemarks} value = {this.state.remarks}placeholder="Remarks" />
                    </Col>

                    <Col style={{margin:'18px'}}sm={1}>
                    <Button style={{padding:'6px' , marginTop:'11px'}} onClick={this.onClickSendAmount}color="info" disabled={this.state.disableAlertBtn}>

                    {
                    (this.state.disableAlertBtn) ?
                    <span><i className="fa fa-spinner fa-spin fa-1x fa-fw"></i></span>
                    :  <span style={{display:'flex' , justifyContent:'center'}}>Deposit</span>
                    }
                    </Button>
                    </Col>
                   </FormGroup >
                   </Form>
           </Card>

           <LoadingOverlay
                 active={this.state.isActive}
                 spinner

                 text='Loading Cash Deposited To Bank'
                 >
           <Card style={{padding:'15px' }}>
                 <div className="react-notification-alert-container">
                   <NotificationAlert ref="notificationAlert" />
                 </div>
                 <h3 style={{padding:'1%', marginBottom:'0px'}}>CASH DEPOSIT TO BANK</h3>
                 <h4 style={{marginLeft:'10px', color:'green',paddingTop:'-10px'}}><u>View All Cash Deposits </u></h4>

                 <Form>
                 <FormGroup row>
                 <Col sm={12}>
                 <ReactTable
                    style={{height: '420px'}}
                 columns={columns}
                 data={this.state.posts}
                 defaultFilterMethod={this.filterMethod}
                 getTdProps={this.getTdPropsFunc}
                     filterable
                   defaultPageSize={100}
                     >
                 </ReactTable>

                 </Col>
                 </FormGroup>
                 </Form>
             </Card>
             </LoadingOverlay>

             </div>
        </div>

    );
  }
}

export default CashManagement;
