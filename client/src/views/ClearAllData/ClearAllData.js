import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import 'react-table/react-table.css'
import ReactTable from "react-table";

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
import { InputGroup, InputGroupAddon, Alert, UncontrolledAlert } from 'reactstrap';
var request = require("request");
var moment = require('moment');
// const url = global.baseUrl
// let  listOfUserRow='';
const InputStyle={
  border: "1px solid #f4f4f4",
  color: "#525f7f",
  height:"40px",
  fontSize:"14px",
  borderLeft:"transparent",
  width:"85%",
  padding:"0px"
}

const loginTitle={
  color: "black",
  fontSize: "26px",
  fontWeight: "500",
  marginBottom:"30px",
  textAlign:"center",
}
  // filename = 'Excel-file',
// import NotificationAlert from "react-notification-alert";
class ClearAllData extends React.Component {
  constructor(props){
    super(props);
    // this.email=localStorage.getItem("user_email")
    this.state={
      email:localStorage.getItem("user_email"),
      notdisbaleExportBtn:false,
      exportExel:false,
      deleteAllUsers:"",
      deleteAllPayments:'',
      deleteAllOrders:'',
      deleteMrpAndTexation:'',
      clearCashInHand:'',
      selectAll:''
      // isChecked:true
    }
      // this.isActive=true;
 this.toggle = this.toggle.bind(this);
  }
  componentDidMount(){
    this.password=''

  }

  // handleLogin=()=>
  // {
  //   this.setState({
  //       disableAlert:true
  //   })
  //   // window.location.href="/home/dashboard"
  //   console.log("Password :: ", this.state.password);
  //   if(this.state.email==='' || this.state.password==="")
  //   {
  //     this.message="Empty field found"
  //     this.notify("tc",false);
  //     this.setState({
  //         disableAlert:false
  //     })
  //   }
  //   else
  //   {
  //     // this.setState({
  //     //   lock:true
  //     // })
  //     //this.notify("tc",true);
  //     var data={
  //       email:this.state.email,
  //       password:this.state.password
  //     }
  //
  //     console.log("Call", global.baseUrl + '/authenticate');
  //     var options = { method: 'POST',
  //       url: global.baseUrl + '/authenticate',
  //       headers: {'content-type': 'application/json','cache-control': 'no-cache' },
  //       form:data,
  //       json: true
  //     };
  //     console.log("options of Clear Data ", options);
  //
  //
  //     request(options, (error, response, body) =>
  //     {
  //       if (error)
  //       {
  //         console.log("Error Of Clear Data", error);
  //         this.message="Something Went Wrong .."
  //         this.notify("tc",false);
  //         this.setState({
  //             disableAlert:false
  //         })
  //
  //         // window.location.href='/PageNotFound'
  //       }
  //       else
  //       {
  //         console.log("**Response Of Clear Data::", response);
  //         this.message=body.message;
  //         console.log("ff",this.errMsg);
  //         if(!body.success)
  //         {
  //           this.notify("tc",false);
  //           sessionStorage.setItem("token", this.token);
  //           localStorage.setItem("token",this.token)
  //           this.setState({
  //               disableAlert:false
  //           })
  //         }
  //         else {
  //           this.setState({
  //             lock:true
  //           })
  //
  //           this.message="You Are Logging In"
  //           this.notify("tc",true);
  //           this.loginUserName=body.user.name
  //             this.loginUserNameType=body.user.type
  //             this.emailOfLogedInUser=body.user.email
  //
  //           console.log("loginUserName" , this.loginUserName);
  //           this.token=body.token
  //           this.user_id=body.user._id
  //           localStorage.setItem("token",this.token)
  //           sessionStorage.setItem("token", this.token);
  //           localStorage.setItem("distribution","true")
  //               localStorage.setItem("loginUserName",this.loginUserName)
  //               localStorage.setItem("user_id",  this.user_id)
  //               localStorage.setItem("user_type",  this.loginUserNameType)
  //               localStorage.setItem("user_email",  this.emailOfLogedInUser)
  //     setTimeout(()=>{
  //       window.location.href='/mainpage'
  //     },1000)
  //         }
  //       }
  //     })
  //   }
  // }
onClickExportExel=e=>{
console.log("Minor ")
  this.setState({
    exportExel:true,
    data:this.ledgerData
  })
  this.setState(prevState => ({
    modal: !prevState.modal
  }));
}
onClickJsonToExcel=e=>{
  console.log("onClickJsonToExcel");
}
toggle(){
  this.setState(prevState => ({
    modal: !prevState.modal
  }));
  this.subtr = 0
}
handleChange=(event)=>
{
  console.log("Setting "+event.target.name + " to ", event.target.value);
  this.setState({[event.target.name]: event.target.value});
  if(event.target.name==='email')
  {
    this.email=event.target.value
  }
  else if (event.target.name==='password')
  {
    this.password=event.target.value
  }
  // this.setState((state, props) => {
  //   return {counter: state.counter + props.step};
  // });
}
onClickCheckBox=e=>{
  console.log("onClickCheckBox" , e.target.checked);
  this.setState({
    [e.target.name]:e.target.checked
  })
}
onClickSelectAll=e=>{
  this.setState({
    deleteAllUsers:e.target.checked,
    deleteAllPayments:e.target.checked,
    deleteAllOrders:e.target.checked,
    deleteMrpAndTexation:e.target.checked,
    clearCashInHand:e.target.checked,
    selectAll:e.target.checked
  })
}
  render() {
    var array=[1,2,3,4]
    // for(var i=1;i<=4;i++){
    //   console.log("indexes"+i , array);
    // }
    // array.forEach((data, i )=>{
    //    console.log("array  here" ,data , i );
    // })
    console.log("render of Clear data" , this.email);
    return (

        <div className="content">
        <Card style={{padding:'15px' , height:'535px'}}>
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        <h3 style={{padding:'1%', marginBottom:'0px'}}>Clear All Data</h3>
        <h4 style={{margin:'10px', color:'green'}}><u>Clear All Data</u></h4>
        <form style={{    width:"fit-content", marginLeft:" 7px"}}>
         <InputGroup style={{width:"100%"}}>
           <div className="fieldIcon"><i className="tim-icons icon-email-85"></i></div>
           <Input readOnly type="text" style={InputStyle} placeholder="email" name="email" onChange={this.handleChange} value={this.state.email}/>
         </InputGroup>
         <InputGroup>
           <div className="fieldIcon"><i className="tim-icons icon-lock-circle"></i></div>
           <Input type="password" style={InputStyle} placeholder="password" name="password" onChange={this.handleChange} value={this.state.password} />
         </InputGroup>
         <FormGroup style={{marginLeft:'49px'}}>
            <Label >
              <Input checked={this.state.deleteAllUsers} type="checkbox" name="deleteAllUsers"onClick={this.onClickCheckBox} />
                  Delete All Users
            </Label>
          </FormGroup>
          <FormGroup style={{marginLeft:'49px'}}>
             <Label >
               <Input  checked={this.state.deleteAllPayments}type="checkbox" name='deleteAllPayments' onClick={this.onClickCheckBox} />
                   Delete All Payments
             </Label>
           </FormGroup>
           <FormGroup style={{marginLeft:'49px'}}>
              <Label >
                <Input checked={this.state.deleteAllOrders} type="checkbox" name='deleteAllOrders'onClick={this.onClickCheckBox} />
                    Delete All Orders
              </Label>
            </FormGroup>
            <FormGroup style={{marginLeft:'49px'}}>
               <Label >
                 <Input checked={this.state.deleteMrpAndTexation} type="checkbox" name="deleteMrpAndTexation"onClick={this.onClickCheckBox} />
                     Delete MRP and Taxations
               </Label>
             </FormGroup>
             <FormGroup style={{marginLeft:'49px'}}>
                <Label >
                  <Input checked={this.state.clearCashInHand} type="checkbox" name="clearCashInHand"onClick={this.onClickCheckBox} />
                      Clear Cash In Hand
                </Label>
              </FormGroup>
              <FormGroup style={{marginLeft:'49px'}}>
                 <Label >
                   <Input checked={this.state.selectAll} type="checkbox" name="selectAll" onClick={this.onClickSelectAll} />
                       Select All
                 </Label>
               </FormGroup>
       {/*  <p style={forgotPasswordText} onClick={this.handleForgotPassword}>forgot password?</p>*/}
         <div className="loginBtnDiv">
           <Button       ref={(input)=>{
                   this.submitRef=input
                 }} onKeyUp={this.onKeyUpfunc}
                  color='info' style={{width:"51%", marginTop:"25px"}} name='button' onClick={this.handleLogin} disabled={this.state.disableAlert}>

         {
         (this.state.disableAlert) ?
         <i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>
         :  <span style={{display:'flex' , justifyContent:'center'}}><i style={{marginRight:'12px' , paddingTop:'3px'}}class="fa fa-user fa-fw"></i> <span>Clear Data</span></span>
         }
           </Button>
         </div>
             </form>
          {/*    <FormGroup row>
              <span onClick={this.onClickExportExel}style={{background:'#02a5de', marginLeft:'45%' ,cursor:'pointer'
              ,borderRadius:'7px',display:'flex' , marginTop:'12px', justifyContent:'center' , alignItems:'center'}}><div style={{color:'white' , fontWeight:"bold" , padding:"10px"}}>Clear Data</div></span>
                  </FormGroup>*/}
         </Card>
      <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}><strong style={{marginLeft:'140px' , fontSize:'20px'}}>Clear All Data</strong></ModalHeader>
          <ModalBody>
      <form>
       <InputGroup style={{width:"100%"}}>
         <div className="fieldIcon"><i className="tim-icons icon-email-85"></i></div>
         <Input readOnly type="text" style={InputStyle} placeholder="email" name="email" onChange={this.handleChange} value={this.state.email}/>
       </InputGroup>
       <InputGroup>
         <div className="fieldIcon"><i className="tim-icons icon-lock-circle"></i></div>
         <Input type="password" style={InputStyle} placeholder="password" name="password" onChange={this.handleChange} value={this.state.password} />
       </InputGroup>
       <FormGroup style={{marginLeft:'49px'}}>
          <Label >
            <Input type="checkbox" onClick={this.onClickCheckBox} />
                By checking this will delete all data from ATMS
          </Label>
        </FormGroup>
     {/*  <p style={forgotPasswordText} onClick={this.handleForgotPassword}>forgot password?</p>*/}
       <div className="loginBtnDiv">
         <Button       ref={(input)=>{
                 this.submitRef=input
               }} onKeyUp={this.onKeyUpfunc}
                color='info' style={{width:"51%", marginTop:"25px"}} name='button' onClick={this.handleLogin} disabled={this.state.disableAlert}>

       {
       (this.state.disableAlert) ?
       <i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>
       :  <span style={{display:'flex' , justifyContent:'center'}}><i style={{marginRight:'12px' , paddingTop:'3px'}}class="fa fa-user fa-fw"></i> <span>Clear Data</span></span>
       }
         </Button>
       </div>
           </form>
          </ModalBody>
        </Modal>
    </div>

    );
  }
}

export default ClearAllData;
