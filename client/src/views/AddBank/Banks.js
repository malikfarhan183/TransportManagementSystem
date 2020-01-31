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
var valueOfAllCustomer=''
var selectedCustomer =[]
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";



class Banks extends React.Component {
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
    console.log("did" , this.props.bank);
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
    EventBus.on("saveBankInAddBankEventBus", this.getAllBanksApiCall);

    this.setState({
        disableSelectField:true
    })
    console.log("did");
    this.getAllBanksApiCall();
  }
  getAllBanksApiCall=e=>{
    console.log("getting all bank data ::");
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
                      var  objectOFBanks={
                          id:item._id,
                          index:this.props.paymentNo
                        }
                      selectedCustomer.push
                       (<option key ={index} value={JSON.stringify(objectOFBanks)}>{item.name}</option>)  })
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
            // pageToLoad:<BankForm/>
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
      // pageToLoad: <BankForm/>
    })

  }
  onClickbankOptionValue=e=>{
    console.log("ID of Bank In Collection" ,JSON.parse(e.target.value) );
    console.log("testing");
    var objOfBank=JSON.parse(e.target.value)
    console.log("testing0" , objOfBank.id);
    console.log("testing0" , objOfBank.index);

this.setState({
  idOfSelectedBank:  JSON.parse(e.target.value)
})
console.log("id" , this.state.idOfSelectedBank);
setTimeout(()=>{
    EventBus.publish("idOfBankEventBus", objOfBank);
},1000
);
  EventBus.publish("idOfBankEventBus", objOfBank);
  this.setState((state, props) => {
       return {counter: 0 + props.step};
              });
  }
  render() {
    console.log("ONLINE RENDER " , this.props.bank);
    return (

        <div className="content">
        <FormGroup  style={{margin:'0px'}} >
        <Input type="select" name="select" id="exampleSelect" onChange={this.onClickbankOptionValue} value={this.state.bankOptionValue}>
        {
          (this.state.disableSelectField) &&
          <option disabled selected hidden>
      Loading, Please Wait..
          </option>
  }
                    <option selected hidden>
                 {this.props.bank}
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

export default Banks;
