import React from "react";
import {
  FormGroup, Label,
   // Form,
   // Card,
   // Table,
   // Row,
   // Col,
   // Nav,
   // Button,
   Input
} from "reactstrap";
import ReactTooltip from 'react-tooltip'
// import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import EventBus from 'eventing-bus';
import BankForm from "./BankForm.js"
var request = require("request");
// const url = global.baseUrl
var listOfOption=[]
// var malik = []
var valueOfAllCustomer=''
var selectedCustomer =[]
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
class BankAccounts extends React.Component {
  constructor(props) {
    super(props);
    console.log("Online component");
    this.state = {
      idOfSelectedBank:'',
              disableSelectField:false,
      bankOption:[],
      pageToLoad:'',
      dropdownOpen:false,
        // pageToLoad:''

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
                       valueOfAllCustomer=JSON.stringify(item);
                       var  objectOFAccountNo={
                           accountNumber:item.accountNumber,
                           index:this.props.paymentNo,
                           accountId:item._id,
                           bankName:item.bank.name

                         }

                      selectedCustomer.push
                       (<option key ={index} value={JSON.stringify(objectOFAccountNo)}>{`${item.bank.code} (${item.accountTitle} - ${item.accountNumber})`}</option>)})
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

  onSelectBank=e=>{
    console.log("Bank Selected");
      this.setState({
            pageToLoad:<BankForm/>
      })
  }
  toggleDropdown=e=>{
    this.setState(prevState => ({
  dropdownOpen: !prevState.dropdownOpen
}));
  }
  onClickBank=e=>{
    console.log("bank selected");
    this.setState({
      pageToLoad: <BankForm/>
    })

  }
  onClickbankOptionValue=e=>{
    var objOfBank=JSON.parse(e.target.value)

    // var objOfBank=JSON.parse(e.target.value)
    console.log("testing of BANK ACCOUNT " , objOfBank);
    // console.log("testing Of PAYMENT NO" , objOfBank.accountId);
this.setState({
  idOfSelectedBank:e.target.value
})
setTimeout(()=>{
  console.log("Account no" , this.state.idOfSelectedBank);
    EventBus.publish("accountOfBankEventBus",objOfBank);
},1000
);
EventBus.publish("accountOfBankEventBus",objOfBank);

  }

  render() {
    console.log("REnder Of BankACCOUNTS " ,this.props.paymentNo);
    return (

        <div style={{position:"absolute", top:"-9px", width:"36%"}}className="content">
        <ReactTooltip type='info' effect='solid'/>
        <FormGroup>
        <Label data-tip="Mandatory Field" for="exampleSelect"> Select Bank Account <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
        <Input type="select" name="select" id="exampleSelect" onChange={this.onClickbankOptionValue}value={this.state.bankOptionValue}>
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
      </FormGroup>
    {/* <Dropdown color="info"isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
   <DropdownToggle caret>
     Select Bank
   </DropdownToggle>
   <DropdownMenu>
   <DropdownItem onClick={this.onClickBank}>National</DropdownItem>
      <DropdownItem divider />
   <DropdownItem onClick={this.onClickBank}>Allied</DropdownItem>

   <DropdownItem divider />
   <DropdownItem onClick={this.onClickBank}>Al-Falah</DropdownItem>
         <DropdownItem divider />
   <DropdownItem onClick={this.onClickBank}>Askari</DropdownItem>
         <DropdownItem divider />
          <DropdownItem onClick={this.onClickBank}>Punjab</DropdownItem>

   </DropdownMenu>
   </Dropdown>*/}
   <div>
   {this.state.pageToLoad}
   </div>
        </div>
    );
  }
}

export default BankAccounts;
