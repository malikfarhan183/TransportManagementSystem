import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import 'react-table/react-table.css'
// import ReactTable from "react-table";
// import Date from "../ChequeManagement/Date.js"
import NotificationAlert from "react-notification-alert";
import ReactTooltip from 'react-tooltip'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
 import EventBus from 'eventing-bus';
 import LoadingOverlay from 'react-loading-overlay';

 // import "./CashManagement.css"
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
var moment = require('moment');

// const url = "http://localhost:1338"

let  listOfUserRow='';
let listOfUserArray=[];
var listOfOptionUser=[]
var valueOfAllUser=''
var selectedUser=[]
var creditOfEachUser=[]

var listOfOption=[]
// var malik = []
var valueOfAllCustomer=''
var selectedCustomer =[]
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class EditCashDepossiteToBank extends React.Component {
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
      totalAmountOfUser:'',
      isActive:false,
      bankAccount:'Select Bank Account',

      posts:[],
      date:new Date(),
      cashInHand:'',
      disableAlert:false,
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
    // this.getAllUsersApiCall();
    // this.apiCall();
    //   this.getTotalCashInHandApiCall();
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

    console.log("AMont is send");
    this.setState({
        disableAlert:true
    })
    // this.setState({
    //   cashInHand:this.state.cashInHand,
    //   amountToBank:'',
    //   remarks:''
    // })
    var data={
      payment_id:this.props.match.params.id,
      collectedBy:this.state.creditOfSelectedUser,
         account_id:this.state.idOfSelectedBank,
         amount:this.state.amountToBank,
         date:this.state.date,
         remarks:this.state.remarks
    }
    if(data.amount===''){
          this.message='Please Enter Amount'
      this.notify("tc",false);
      this.setState({
          disableAlert:false
      })
    }
    else if (data.account_id==='') {
      this.message='Please Select Bank Account'
      this.notify("tc",false);
      this.setState({
          disableAlert:false
      })
    }
    else if (data.collectedBy==='') {
      this.message='Please Select User'
      this.notify("tc",false);
      this.setState({
          disableAlert:false
      })
    }
    else if (data.date==='') {
      this.message='Please Select Date'
      this.notify("tc",false);
      this.setState({
          disableAlert:false
      })
    }
    // else if (data.amount>-(this.state.totalAmountOfUser)) {
    //   this.message='Your Entered Amount is Greater Than Total Cash Of Selected User'
    //   this.notify("tc",false);
    //   this.setState({
    //       disableAlert:false
    //   })
    // }
    else{
      var options = { method: 'POST',
          url: global.baseUrl + '/api/updatePayment',
          headers: {'Authorization': localStorage.getItem("token") },
          body:data,
          json: true
        };
    console.log("options of addCashOnHandToBank ", options);
        request(options, (error, response, body) =>

        {
          if (error)
          {
            console.log("Error", error);
          }
          else
          {
            console.log("Respone in addCashOnHandToBank", response);
    this.setState({
        disableAlert:false
    })
    this.setState({
        // disableSelectField:false,
      idOfSelectedBank:'',
      amountToBank:'',
      remarks:'',
      bankOption:[],
        bankOptionValue:'',
        date:new Date()
    })
    // this.getAllBanksApiCall();
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
             setTimeout(()=>{
                this.props.history.push("/home/CashManagement")
             },1000)
                 // this.getTotalCashInHandApiCall();
           }
           else {
             console.log("success false :: ", body);
             this.message=response.body.message
             this.notify("tc",false);

           }
          }
        })
    }

  setTimeout(()=>{
     // this.apiCall();
  },1000)
  }
  onChangeAmount=e=>{
    console.log(e.target.value);
    this.setState({
      amountToBank:e.target.value
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
    var options = { method: 'POST',
        url: global.baseUrl + '/api/getAllUsersAdmin',
        headers: {'Authorization': localStorage.getItem("token") },
       // body:data,
        json: true
      };
  console.log("options of Get ALL User Admin ", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
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
    this.message="Something Went Wrong .."
    this.notify("tc",false);
    this.setState({
        disableAlert:false
    })

          console.log("Error", error);
        }
        else
        {
          console.log("Respone in Get Single payment", response.body.result);   
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
             var collectedByType=''
             if(item.collectedBy.type==='admin'){
               collectedByType='Admin'
             }
             else if (item.collectedBy.type==='financeManager') {
               collectedByType='Financial Manager'
             }
             else if (item.collectedBy.type==='collectionManager') {
               collectedByType='Collection Manager'
             }
             else if (item.collectedBy.type==='deliveryManager') {
               collectedByType='Delivery Manager'
             }
             this.setState({
               bankAccount:`${item.account_id.code}(${item.account_id.accountTitle}-${item.account_id.accountNumber})`,
               collectedByName:item.collectedBy.name,
               collectedByType:collectedByType,
                 creditOfSelectedUser:item.collectedBy._id,
                 amountToBank:item.amount,
                 idOfSelectedBank:item.account_id._id,
                 date:new Date(item.date),
                 remarks:item.remarks,
                 totalAmountOfUser:item.collectedBy.credit

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
  apiCall= e=>{
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
console.log("options of addCashOnHandToBank History", options);
    request(options, (error, response, body) =>

    {
      if (error)
      {
        console.log("Error", error);
      }
      else
      {
        console.log("Respone :: of addCashOnHandToBank History ", response);    
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
         let date=i.date.split('T');
         let time=moment(i.date).format('LT');
         if(i.bank_id===null){
           listOfUserRow =
             {
             id:(i._id),
             name:(i.collectedBy.name),
             // bank:(i.bank_id.name),
             amount:(i.amount),
             date:(date[0]),
             time:(time),
             remarks:(i.remarks)
           };
         }
         else{
           listOfUserRow =
             {
             id:(i._id),
             name:(i.collectedBy.name),
             bank:(i.bank_id.name),
             amount:(i.amount),
             date:(date[0]),
             time:(time),
             remarks:(i.remarks)
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
   this.setState({
     creditOfSelectedUser:JSON.parse(e.target.value).credit
   })
//  }
//  })
}
// onClickEdit=e=>{
//   console.log("Edit button clicked");
//
//       setTimeout(() => {
//         console.log("Detail button  clicked" , this.index );
//         urlPrams= '/home/editcollection/' + this.index;
//          this.props.history.push(urlPrams);
//          console.log("URL PARAMS" , urlPrams);
//          // EventBus.publish("apiCall",this.responseToSend)
//   }, 1000);
// }
deleteCashInHandToBankApiCall=e=>{
  console.log("Order Id " , this.index);

  this.setState({
      disableAlert:true
  })
  // e.preventDefault();
  console.log("SAved CLICKED");
  var user_id=localStorage.getItem("user_id")

  var data={
    isDeleted:true,
    // date:this.state.date,
       // user_id:this.state.dealerId,
       // deliveryType:this.state.deliveryType,
       user_id:user_id,
       order_id:this.index,
      //  deliveryItemType:this.state.bagsOrBulk,
      //  quantity:parseInt(this.state.amountOfBags),
      //  biltyNumber:parseInt(this.state.biltyNo),
      //  truckNumber:this.state.truckId,
      // rate:this.state.rate,
      //  totalAmount:this.state.orderPrice,
      //  address:this.state.location
  }


    var options = { method: 'POST',
        url: global.baseUrl + '/api/updateOrder',
        headers: {'Authorization': localStorage.getItem("token") },
       body:data,
        json: true
      };
  console.log("options of Edit Order Call", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error Of Edit Order Call", error);
}
        else
        {
          console.log("Respone in Edit Order Call", response); 
  this.setState({
      disableAlert:false
  })
  if(response.body.success){
  this.message='Order Deleted Successfully'
      this.notify("tc",true);
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
       // this.getAllOrdersApiCall();
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
  console.log("Delete button clicked");
  setTimeout(()=>{
    // this.deleteCashInHandToBankApiCall();

  },1000)

}
  render() {
    console.log("Pushed Banks in Render"  ,listOfOption);
    console.log("After Push in State" , this.state.bankOption);
    console.log("Id of Bank" ,this.state.idOfSelectedBank);
    return (
        <div className="content">
        <ReactTooltip type='info' effect='solid'/>
        <div className="react-notification-alert-container">
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        </div>
        <LoadingOverlay
              active={this.state.isActive}
              spinner

              text='Loading User Details'
              >
                    <Card style={{padding:'15px'}}>
        <h3 style={{padding:'1%', marginBottom:'0px'}}>Edit Cash Deposited To Bank</h3>
        <h4 style={{margin:'10px', color:'green'}}><u>Edit Cash Deposited To Bank</u></h4>

        {/*<Date/>*/}
        <Form style={{marginLeft:'10px'}}>

    { /*   <FormGroup row>
        <Label for="search" sm={2}>Select User</Label>
        <Col style={{display:'flex',flexDirection:'column' ,marginTop:'3px'}}sm={3}>
        <Label>Collected By</Label>
        <select style={{borderRadius:'8px',height:'39px'}}
            onClick={this.onClickUser}
            onChange={this.onChangeName}>
            {
              (this.state.disableSelectField) &&
              <option disabled selected hidden>
          Loading,Please Wait
              </option>
      }
        <option selected hidden>Select User</option>
                    {this.state.userOption}
        </select>
        </Col>
        </FormGroup>*/}
                      <FormGroup row>
                      <Label for="search" sm={2}>User Name</Label>
                      <Col sm={2}>
                        <Input disabled type="text" name="search" id="search" value={this.state.collectedByName} placeholder="User"/>
                      </Col>
                      </FormGroup>
                      <FormGroup row>
                      <Label for="search" sm={2}>User Type</Label>
                      <Col sm={2}>
                        <Input disabled type="text" name="search" id="search" value={this.state.collectedByType} placeholder="User"/>
                      </Col>
                      </FormGroup>
   <hr/>

                    <FormGroup row>
                    <Col sm={2}>
                    <Label data-tip="Mandatory Field">Cash Deposite To Bank <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                      <Input min='0' type="number" name="amount" id="amount" onChange={this.onChangeAmount} value={this.state.amountToBank} placeholder="Enter Amount (PKR)" />
                    </Col>
                    <Col sm={2}>
                    <Label for="exampleSelect"> Bank Account</Label>
                    <Input type="select" name="select" id="exampleSelect" onClick={this.onClickCustomer}  onChange={this.onChangeBankAccount}>
                    {
                      (this.state.disableSelectField) &&
                      <option disabled selected hidden>
                      Loading, Please Wait..
                      </option>
              }

                                <option selected hidden>
                             {this.state.bankAccount}
                                  </option>
                                              {this.state.bankOption}

                    </Input>

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
                    <Col style={{margin:'18px'}}sm={2}>
                    <Button style={{padding:'6px' , marginTop:'11px'}}onClick={this.onClickSendAmount}color="info" disabled={this.state.disableAlert}>

                    {
                    (this.state.disableAlert) ?
                    <span><i className="fa fa-spinner fa-spin fa-1x fa-fw"></i> Deposit</span>
                    :  <span style={{display:'flex' , justifyContent:'center'}}>Deposit</span>
                    }
                    </Button>
                    </Col>
                   </FormGroup >
        </Form>
           </Card>
           </LoadingOverlay>

        </div>

    );
  }
}

export default EditCashDepossiteToBank;
