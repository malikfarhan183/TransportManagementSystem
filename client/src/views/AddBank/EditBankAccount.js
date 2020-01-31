import React from "react";
import ReactTooltip from 'react-tooltip'
import Banks from './Banks.js';
import EventBus from 'eventing-bus'
import 'react-table/react-table.css'
// import ReactTable from "react-table";
import LoadingOverlay from 'react-loading-overlay';

// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
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
   Input,
   Modal, ModalHeader, ModalBody, ModalFooter

} from "reactstrap";
import './AddBank.css'

import NotificationAlert from "react-notification-alert";
var request = require("request");
// const url = global.baseUrl
// const url = "http://localhost:1338"

// var regularExpression=''
// var var1=''
let  listOfUserRow='';
let listOfUserArray=[];


// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class EditBankAccount extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      disabledUpdateBankAccountButton:false,
      isActive:false,
      bank:'Select Bank',
      idOfBank:'',
bankName:'',
  dealerCode:'',
  accountTitle:'',
  accountNo:'',
  branchCode:'',
  branchLocation:'',
  otherBank:false,
  name:'',
  email:'',
  password:'',
  onChangeRole:'',
  retypePassword:'',
  adressOfCustomer:'',
  changeContactNoOfCustomer:'',
  changeAlternateContactNoOfCustomer:'',
  customerName:'',
  dealerChecked:true,
      imagePreviewUrl: '',
  customerChecked:false,
  formToLoad:'',
  BusinessName:'',
  dealerName:'',
  dealerType:'',
  instrumentNo:'',
  changeContactNo:'',
  changeAlternateContactNo:'',
  adress:'',
  from:''

    };
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
    idOfBankEventBusFunc=e=>{
      console.log("THROUGH EVVENT BUS ID OF BANK.................................." , e.id);
      this.setState({
        idOfBank:e.id
      })
    }
    getSingleBankAccountApiCall=e=>{
      this.setState({
        isActive:true
      })
      var data={
        account_id:this.props.match.params.id
      }
      var options = { method: 'POST',
          url: global.baseUrl + '/api/getSingleAccountDetails',
          headers: {'Authorization': localStorage.getItem("token") },
         body:data,
          json: true
        };
    console.log("options of Get Single Bank Account ", options);
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
            console.log("Respone in Get Single Bank Account", response.body.result); 
    this.setState({
      isActive:false
    })  
    // this.setState({
    //     disableSelectField:false
    // })
    //          listOfOptionUser = response.body.result;
    //          selectedUser=[]
          let item=response.body.result

               console.log("itemssssssssssssssssssssssssssssssssss" , item.bank_id);
               // let orignalDate=item.date
               //   let date=orignalDate.toISOString()
               this.setState({
                   bank:item.bank.name,
                   idOfBank:item.bank._id,
                   accountTitle:item.accountTitle,
                   accountNo:item.accountNumber,
                   branchCode:item.branchCode,
                   branchLocation:item.address
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
  this.getAllBanksApiCall();
  this.getSingleBankAccountApiCall();
  this.index='';
  console.log("Did of User Management" ,this.props.match.params.id);
  if(this.props.match.params.id==='dealer')
  {
    this.setState({
      dealerChecked:true
    })
  }
  else{
    this.setState({
      customerChecked:true
    })
  }
  this.setState({
    formToLoad:this.props.match.params.id
  })
    this.message=''
}


  onChangeRole=e=>{
    console.log("onChangeRole",e.target.value);
  this.setState({
    onChangeRole:e.target.value
  })
}

  onClickSave=e=>{
    this.setState({
      disabledUpdateBankAccountButton:true
    })
    var data={
      account_id:this.props.match.params.id,
      bank:this.state.idOfBank,
      accountTitle:this.state.accountTitle,
      accountNumber:this.state.accountNo,
      branchCode:this.state.branchCode,
      address:this.state.branchLocation
    }
    if(data.bank===''){
      this.message='Please Select/Enter Bank'
       this.notify("tc",false); 
       this.setState({
         disabledUpdateBankAccountButton:false
       })
    }
    else if (data.accountTitle==='') {
      this.message='Please Enter Bank Title'
       this.notify("tc",false); 
       this.setState({
         disabledUpdateBankAccountButton:false
       })
    }
    else if (data.accountNumber==='') {
      this.message='Please Enter Account Number'
       this.notify("tc",false); 
       this.setState({
         disabledUpdateBankAccountButton:false
       })
    }
    else{
      var options = { method: 'POST',
          url: global.baseUrl + '/api/updateBankAccount',
          headers: {'Authorization': localStorage.getItem("token") },
          body:data,
          json: true
        };
    console.log("options of Create Bank Account  ", options);
        request(options, (error, response, body) =>
        {
          if (error)
          {
            console.log("Error", error);
          }
          else
          {
            console.log("**Respone in Create Bank Account", response);
         if(response.body.success){
           this.message='Bank Account Updated Successfully'
           this.notify("tc",true);
           this.setState({
             idOfBank:'',
       bankName:'',
         dealerCode:'',
         accountTitle:'',
         accountNo:'',
         branchCode:'',
         branchLocation:'',
           })
           this.setState({
             disabledUpdateBankAccountButton:false
           })
         }setTimeout(()=>{
           this.props.history.push("/home/AddBank")
         }, 3000)

          }
  })

   }

  }
onChange=e=>{
  console.log("Changing Values");
  this.setState({
    [e.target.name]:e.target.value
  })
}
onClickBanks=e=>{
  console.log("BANK Component Called .............................................");
  EventBus.on("idOfBankEventBus",this.idOfBankEventBusFunc);

}
toggle=e=>{
  this.setState(prevState => ({
    modal: !prevState.modal
  }));
}
toggleSave=e=>{

  console.log("togle Save");
  console.log("ID" , this.index);
  console.log("VAlue", this.state.numberToGet);
      var data={
          name:this.state.bankName
              }
      if(data.name===''){
        this.message='Please Enter Bank Name';
         this.notify("tc",false);
      }
      else{
        var options = { method: 'POST',
              url: global.baseUrl + '/api/createBank',
              headers: {'Authorization': localStorage.getItem("token") },
           body:data,
              json: true
            };
        console.log("options of Create New Bank", options);
            request(options, (error, response, body) =>

            {
              if (error)
              {
                console.log("Error", error);
               this.message= response.body.message;
                this.notify("tc",false);
              }
              else
              {

                console.log("Respone in   Create New Bank :: ", response.body);
        this.setState(prevState => ({
          modal: !prevState.modal
        })); 

        if(response.body.success){
          this.message='New Bank Created Successfully';
           this.notify("tc",true);         }
        // this.message= response.body.message;
        //  this.notify("tc",true); 
        //  //  this.message= response.body.message;
        //  // this.notify("tc",true);

              }
            })
      }

}
getAllBanksApiCall=e=>{
  listOfUserArray=[]
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
this.response=response.body.result.map((i,data)=>{
  // let date=i.date.split('T');
  // let date=moment(i.date).format('LT');
  // let date=moment(i.date).format('MMMM Do YYYY, h:mm a');
    listOfUserRow =
    {
    id:(i._id),
    accountTitle:(i.accountTitle),
    bank:(i.bank.name),
    address:(i.address),
    branchCode:(i.branchCode),
    // time:(time),
    // remarks:(i.remarks)
  };


       return  listOfUserArray.push(listOfUserRow);
})
console.log("after mapping " , this.response);
this.setState({
  posts:listOfUserArray
})

      }
    })
}
  render() {
    console.log("Render of Edit Bank Account");
    return (
        <div className="content">
        <div style={{ heigh:'526px'}}>
        <ReactTooltip type='info' effect='solid'/>
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        <LoadingOverlay
              active={this.state.isActive}
              spinner

              text='Loading Bank Details'
              >
          <Card style={{padding:'15px', marginLeft:'0px'}} className="row">
                  <h3 style={{padding:'1%', marginBottom:'0px'}}>Add Bank Account</h3>
                  <h4 style={{margin:'10px', color:'green'}}><u>Add New Bank And Bank Account </u></h4>

          <div className="col-md-6 col-sm-6 col-lg-6">
                  <Form style={{padding:'1%'}}>
                   <FormGroup row>
                     <Label  data-tip="Mandatory Field" sm={4}>Bank Name <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                     <span onClick={this.onClickBanks}>
                       <Banks bank={this.state.bank}/>
                       </span>
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label data-tip="Mandatory Field" sm={4}>Account Title <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                          <Input type='text'onChange={this.onChange} name='accountTitle'value={this.state.accountTitle} placeholder="Enter Account Title"  invalid/>
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label data-tip="Mandatory Field" sm={4}>Account No <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                        <Input   type='number' onChange={this.onChange} name='accountNo' value={this.state.accountNo} placeholder="Enter Account No" />
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label sm={4}>Branch Code</Label>
                     <Col sm={8}>
                        <Input  type='number'  onChange={this.onChange} name='branchCode' value={this.state.branchCode} placeholder="Enter Branch Code" invalid />
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label sm={4}>Bank Location </Label>
                     <Col sm={8}>
                        <Input  type='text'  onChange={this.onChange} name='branchLocation' value={this.state.branchLocation} placeholder="Enter Branch Location" invalid />
                     </Col>
                   </FormGroup>
                   <FormGroup style={{marginTop:'10%'}}check row>
                     <Col sm={{ size: 10, offset: 10 }}>
                       <Button style={{padding:'8px'}}onClick={this.onClickSave}color="info" disabled={this.state.disabledUpdateBankAccountButton}>
                       {
                       (this.state.disabledUpdateBankAccountButton) ?
                       <i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>
                       :
                       <span style={{display:'flex' , justifyContent:'center'}}><i style={{marginRight:'12px' , paddingTop:'3px'}}></i> <span>Update Bank Account</span></span>
                       }
                       </Button>
                     </Col>
                   </FormGroup>
                 </Form>


           </div>
        </Card>
        </LoadingOverlay>
</div>
        </div>

    );
  }
}

export default EditBankAccount;
