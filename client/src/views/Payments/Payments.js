import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import NotificationAlert from "react-notification-alert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  FormGroup, Label,
   Form,
   Card,
   // Table,
   // Row,
   Col,
   // Nav,
   Button,
   Input
} from "reactstrap";
import "./Payments.css"
var request = require("request");
// const url = global.baseUrl
var listOfOption=[]
// var malik = []
var valueOfAllCustomer=''
var selectedCustomer =[]
var data= ''
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class Payments extends React.Component {

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
  constructor(props) {
    super(props);
    this.state = {
  payee:'',
    disableSelectField:false,
  amount:'',
  date:new Date(),
  instrumentNo:'',
  from:'',
  idOfSelectedBank:'',
  amountToBank:'',
  remarks:'',
  bankOption:[],
    bankOptionValue:'',
    instrumentType:'online'

    };
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
    console.log("did");
    this.getAllBanksApiCall();

  }
  getAllBanksApiCall=e=>{
    var options = { method: 'POST',
        url: global.baseUrl + '/getAllBanks',
       // headers: {'Authorization': localStorage.getItem("token") },
       //body:data,
        json: true
      };
  console.log("options of Get All Banks", options);
      request(options, (error, response, body) =>
      {
        if (error)
        {
          console.log("Error", error);
        }
        else
        {
          console.log("Respone in Get All Banks", response);   
  this.setState({
      disableSelectField:false
  })
                       listOfOption = response.body.result;
                    selectedCustomer=[]
                    listOfOption.forEach((item, index)=>{
                       valueOfAllCustomer=JSON.stringify(item);

                      selectedCustomer.push(<option key ={index} value={item._id}>{item.name}</option>)
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
  onChangePayee=e=>{
    console.log("onChangePayee",e.target.value);
  this.setState({
    payee:e.target.value
  })
  }

  onChangeAmount=e=>{
    console.log("onChangeAmount",e.target.value);
  this.setState({
    amount:e.target.value
  })
  }

  onChangeinstrumentNo=e=>{
    console.log("onChangeinstrumentNo",e.target.value);
  this.setState({
    instrumentNo:e.target.value
  })
  }
  onChangeInstrument=e=>{
    console.log("INSTRUMENT TYPE" , e.target.value);
    this.setState({
      instrumentType:e.target.value
    })
  }
  onChangeDraftNo=e=>{
    this.setState({
      draftNo:e.target.value
    })

  }

  onChangeFrom=e=>{
    console.log("onChangeFrom",e.target.value);
  this.setState({
    from:e.target.value
  })
  }
  onClickCustomer=e=>{

    console.log("CLicked Bank" , e.target.value);
this.setState({
  idOfSelectedBank:e.target.value
})


  }
  onClickCustomerSave=e=>{
     e.preventDefault();
    console.log("save Button Clicked");
    if(this.state.instrumentType==='cheque')
    {
      data = [{
      name:this.state.payee,
        amount:parseInt(this.state.amount),
        paymentType:this.state.instrumentType,
        chequeNumber:this.state.instrumentNo,
        chequeDate: this.state.date,
         // issueStatus : true
      }]

    }
    if(this.state.instrumentType==='draft'){
     data = [{
    name:this.state.payee,
      amount:parseInt(this.state.amount),
      paymentType:this.state.instrumentType,
        draftNumber:this.state.draftNo,
       draftDate:this.state.date,
        // issueStatus : true
    }]
  }
  if(this.state.instrumentType==='online'){
  data = [{
    name:this.state.payee,
    amount:parseInt(this.state.amount),
    paymentType:this.state.instrumentType,
    bank_id:this.state.idOfSelectedBank,
    // chequeNumber:this.state.instrumentNo,
    bankDate: this.state.date,
     // issueStatus : true
  }]

}


if(this.state.payee===''){
  this.message= 'Name Required';
   this.notify("tc",false); 
}
else if (this.state.amount==='') {
  this.message= 'Amount Required';
   this.notify("tc",false); 
}
else if (this.state.instrumentType==='') {
  this.message= 'Please Payment Type';
   this.notify("tc",false); 
}
else if (this.state.date) {
  this.message= 'Please Select Date';
   this.notify("tc",false); 
}

else{
  var options = { method: 'POST',
      url: global.baseUrl + '/api/createPayment',
     headers: {'Authorization': localStorage.getItem("token") },
     body:data,
      json: true
    };
console.log("options of Create new payment", options);
    request(options, (error, response, body) =>
    {
      if (error)
      {
        console.log("Error", error);
      }
      else
      {
        console.log("Respone in create new payment", response);   
                  //    listOfOption = response.body.result;
                  // selectedCustomer=[]
                  // listOfOption.forEach((item, index)=>{
                  //    valueOfAllCustomer=JSON.stringify(item);
                  //
                  //   selectedCustomer.push
                  //    (<option key ={index} value={item._id}>{item.name}</option>)
                  // })
                  // this.setState({
                  //   bankOption:selectedCustomer
                  // })
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


  }
  onChangeDate=e=>{
    console.log('Date' , e);
    this.setState({
      date:e
    })
  }



  render() {
    return (

        <div className="content" style={{display:'flex'}}>
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
          <Card style={{padding:'15px'}} className="row">
                  <h3 style={{padding:'1%',marginBottom:'0px'}} style={{padding:'1%'}}>PAYMENTS</h3>
                  <h4 style={{margin:'10px', color:'green'}}><u>Miscellaneous Payments</u></h4>
          <div className="col-md-6 col-sm-6 col-lg-6">
        <Form style={{padding:'1%'}}>
         <FormGroup row>
           <Label for="payee" sm={4}>Payee</Label>
           <Col sm={8}>
                <Input   onChange={this.onChangePayee}value={this.state.payee} placeholder="Enter Payee"  />
           </Col>
         </FormGroup>

         <FormGroup row>
           <Label for="amount" sm={4}>Amount (PKR)</Label>
           <Col sm={8}>
                <Input min='0' type='number'onChange={this.onChangeAmount} value={Math.abs(this.state.amount)} placeholder="Enter Amount (PKR)" />
           </Col>
         </FormGroup>
         <FormGroup row>
           <Label for="amount" sm={4}>Type</Label>
           <Col sm={8}>
              <Input  readOnly  value="PKR"  placeholder="Enter Type"/>
                 </Col>
         </FormGroup>
       <FormGroup row>
       <Label sm={4} for="instrument">Instrument</Label>
        <Col sm={8}>
       <Input type="select" name="select" id="instrument" onChange={this.onChangeInstrument}>
       <option value='online'>Online</option>
         <option value='cheque'>Cheque</option>
         <option value='draft'>P.O</option>
      </Input>
        </Col>
     </FormGroup>
      {(this.state.instrumentType === "cheque")
      ?
      <FormGroup row>
        <Label for="instrumentNo" sm={4}>Instrument No.</Label>
        <Col sm={8}>
           <Input    onChange={this.onChangeinstrumentNo}  value={this.state.instrumentNo} placeholder="Enter Instrument No." />
        </Col>
      </FormGroup>
    :
    ''
  }
  {(this.state.instrumentType === "draft")
  ?
  <FormGroup row>
    <Label for="instrumentNo" sm={4}>Draft No.</Label>
    <Col sm={8}>
       <Input    onChange={this.onChangeDraftNo}  value={this.state.draftNo} placeholder="Enter Instrument No." />
    </Col>
  </FormGroup>
:
''
}
{(this.state.instrumentType === "online")
?
<FormGroup row>
<Label sm={4} for="exampleSelect"> Select Bank</Label>
 <Col sm={8}>
 <Input type="select" name="select" id="exampleSelect" onClick={this.onClickCustomer} >
 {
   (this.state.disableSelectField) &&
   <option disabled selected hidden>
Loading,Please Wait
   </option>
}

             <option selected hidden>
          Select Bank
               </option>
                           {this.state.bankOption}
 </Input>
 </Col>
</FormGroup>

:
''
}
         <FormGroup row>
           <Label  sm={4} for="date">Date</Label>
             <Col sm={8}>
             <DatePicker style={{width:'358px !important'}}className='datePickerCashManagement'
                        selected={this.state.date}
                        onChange={this.onChangeDate}
                      />
             {/*<Input
             onChange={this.onChangeDate}
             type="Date" name="date" id="date" value={this.state.date} placeholder="Choose a Date" />*/}
             </Col>
         </FormGroup>
         <FormGroup style={{marginTop:'10%'}}check row>
           <Col sm={{ size: 10, offset: 10 }}>
             <Button  onClick={this.onClickCustomerSave}color="info">Save</Button>
           </Col>
         </FormGroup>
       </Form>
           </div>
        <div className="col-md-6 col-sm-6 col-lg-6">
        <Form style={{marginTop:'18%'}}>
          <Label style={{fontWeight:'bold',marginLeft:'21%'}}for="from" sm={12}>Remarks</Label>
        <FormGroup row>

          <Col sm={8}>

             <Input style={{height: '370%'}} type="textarea"onChange={this.onChangeFrom} value={this.state.from} placeholder="                             Enter Remarks  "/>
          </Col>
        </FormGroup>
        </Form>
          </div>
        </Card>

        </div>

    );
  }
}

export default Payments;
