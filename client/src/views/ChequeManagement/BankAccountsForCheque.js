import React from "react";
import {
  FormGroup,
   // Form,
   // Card,
   // Table,
   // Row,
   // Col,
   // Nav,
   // Button,
   Input
} from "reactstrap";
// import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import EventBus from 'eventing-bus';
// import BankForm from "./BankForm.js"
var request = require("request");
// const url = global.baseUrl
// const url = "http://localhost:1338"

var listOfOption=[]
// var malik = []
var valueOfAllCustomer=''
var selectedCustomer =[]
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
class BankAccountsForCheque extends React.Component {
  constructor(props) {
    super(props);
    console.log("Online component");
    this.state = {
      idOfSelectedBank:'',
              disableSelectField:false,
      bankOption:[],
      pageToLoad:'',
      dropdownOpen:false,


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
                      console.log("malkik" , item);
                       valueOfAllCustomer=JSON.stringify(item);
                       var  objectOFAccountNo={
                           accountNumber:item.accountNumber,
                           accountId:item._id,
                           index:this.props.paymentNo
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


  toggleDropdown=e=>{
    this.setState(prevState => ({
  dropdownOpen: !prevState.dropdownOpen
}));
  }
  onClickbankOptionValue=e=>{
    console.log("malik",e.target.value);
    var objOfBank=JSON.parse(e.target.value).accountId
    console.log("testing of BANK ACCOUNT " , objOfBank);
    console.log("testing Of PAYMENT NO" , objOfBank.index);
this.setState({
  idOfSelectedBank:e.target.value
})
setTimeout(()=>{
  console.log("Account no" , this.state.idOfSelectedBank);
    EventBus.publish("accountOfBankEventBus",objOfBank);
},1000
);
EventBus.publish("accountOfBankEventBus",objOfBank);

this.setState((state, props) => {
     return {counter: 0 + props.step};
            });

  }

  render() {
    console.log("REnder Of BankACCOUNTS " ,this.props.paymentNo);
    return (

        <div>
        <FormGroup>

        <Input type="select" name="select" id="exampleSelect" onChange={this.onClickbankOptionValue} value={this.state.bankOptionValue}>
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

export default BankAccountsForCheque;
