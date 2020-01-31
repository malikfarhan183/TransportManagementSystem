import React from "react";
import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import {
   Form,
   FormGroup,
   Label,
   Card,
   CardBody,
   Table,
   Row,
   Col,
   Nav,
   Button,
   Input
} from "reactstrap";
import Date from "../ChequeManagement/Date.js"
var request = require("request");
// const url = global.baseUrl
const url = "http://localhost:1338"

var listOfOption=[]
var selectedCustomer =[]
var valueOfAllCustomer=''
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';
class BankStatement extends React.Component {
  checkBalanceInAccountAPiCall=e=>{
    var data={
         bank_id:this.state.idOfSelectedBank,
         // date:this.state.date
    }

    var options = { method: 'POST',
        url: global.baseUrl + '/api/checkBalanceInAccount',
        headers: {'Authorization': localStorage.getItem("token") },
       body:data,
        json: true
      };
  console.log("options of check Balance In Account", options);
      request(options, (error, response, body) =>
      {
        if (error)
        {
          console.log("Error", error);
        }
        else
        {
          console.log("Respone in check Balance In Account", response);   
                     this.setState({
                       amount:response.body.result
                     })
                     console.log("AMOUNT " , this.state.amount);
                       // listOfOption = response.body.result;
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
  constructor(props){
    super(props);
    this.state={
          disableSelectField:false,
      bankOption:[],
          idOfSelectedBank:'',
          amount:''
    }
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

                      selectedCustomer.push
                       (<option key ={index} value={item._id}>{item.name}</option>)
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

  onClickCustomer=e=>{

    console.log("CLicked Bank" , e.target.value);
this.setState({
  idOfSelectedBank:e.target.value
})


  }

  componentDidMount(){

  var url = require('url');
  const fetch = require('node-fetch');
  const urlObj = url.parse(document.location.href, true);

  console.log("urlObj.hostname.indexOf(localhost)",urlObj.hostname, urlObj.hostname.indexOf("localhost"), urlObj.hostname.indexOf("-dev"));
  if (urlObj.hostname.indexOf("localhost") == -1 && urlObj.hostname.indexOf("-dev") == -1 )
  {
    // global.baseUrl = "http://www.atms.pk"
    global.baseUrl = urlObj.protocol + '//' + urlObj.hostname
  }
  else
  {
    global.baseUrl = "http://atms-dev.herokuapp.com"
  }
    this.setState({
        disableSelectField:true,
        date:''
    })

    console.log("did");
    this.getAllBanksApiCall();

  }
  onChangeBank=e=>{
    setTimeout(()=>{
                        this.checkBalanceInAccountAPiCall();
                      },1000)
  }
  onChangeDate=e=>{
    this.setState({
      date:e.target.value
    })
  }


  render() {
    return (
          <div className="content">

           <Card style={{padding:'15px',paddingBottom:'27%'}}>
             <h3 style={{padding:'1%', marginBottom:'0px'}}>BANK STATEMENT</h3>
             <h4 style={{margin:'10px', color:'green'}}><u>View Bank Account Status</u></h4>

          { /*    <div>
                  <Date/>
               </div>
               <hr/>*/ }
           <Form style={{marginLeft:'10px',marginTop:'2%'}}>
           <FormGroup row>
           {/*<Col sm={3}>
            <Label for="date">Date</Label>
            <Input
            onChange={this.onChangeDate}
            type="Date" name="date" id="date" placeholder="Choose a Date" />
            </Col>*/}
           <Col sm={3}>
           <Label for="exampleSelect"> Select Bank</Label>
           <Input type="select" name="select" id="exampleSelect" onClick={this.onClickCustomer} onChange={this.onChangeBank}>
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
           <Col sm={3}>
           <Label>Amount (PKR) </Label>
             <Input type="text" name="amount" id="amount" placeholder="Amount (PKR)" value={this.state.amount}/>
           </Col>

           </FormGroup>


            </Form>
             </Card>
          </div>
    );
  }
}

export default BankStatement;
