import React from "react";
import ReactTooltip from 'react-tooltip'
import Banks from './Banks.js';
import EventBus from 'eventing-bus'
import 'react-table/react-table.css'
import ReactTable from "react-table";
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
let urlPrams='';



// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class AddBank extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      disabledAddBankAccountButton:false,
      disableAlert:false,
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
      // console.log("THROUGH EVVENT BUS Payment ## OF BANK" , e.index);

     // this.state.newOnlineValue[e.index]=e.id
     //  this.setState({
     //    newOnlineValue:this.state.newOnlineValue
     //  })
     //  this.setState({
     //    idOfBank:e
     //  })
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
      disabledAddBankAccountButton:true
    })

    var data={
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
         disabledAddBankAccountButton:false
       })
    }
    else if (data.accountTitle==='') {
      this.message='Please Enter Bank Title'
       this.notify("tc",false); 
       this.setState({
         disabledAddBankAccountButton:false
       })
    }
    else if (data.accountNumber==='') {
      this.message='Please Enter Account Number'
       this.notify("tc",false); 
       this.setState({
         disabledAddBankAccountButton:false
       })
    }
    else{
      var options = { method: 'POST',
          url: global.baseUrl + '/api/createBankAccount',
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
        this.getAllBanksApiCall();
         if(response.body.success){
           this.message='Bank Account Created Successfully'
           this.notify("tc",true);
           this.setState({
             idOfBank:'',
              bankName:'',
         dealerCode:'',
         accountTitle:'',
         accountNo:'',
         branchCode:'',
         branchLocation:'',
         bank:true
           })
         }
         this.setState({
           disabledAddBankAccountButton:false
         })
         // window.location.reload();
    // this.message='User Created Successfully'
    //  this.notify("tc",true); 
    //            this.setState({
    //           dealerCode:'',
    //           name:'',
    //           email:'',
    //           password:'',
    //           onChangeRole:'',
    //           retypePassword:'',
    //         })
            // if(response.statusCode== 201)
            // {
            //   console.log("NOW Upload Call Implement");
            //
            //   this.uploadImgAPiCall();
            // }
             // listOfOption = response.body.result;
             // selectedCustomer=[]
             // listOfOption.forEach((item, index)=>{
             //    valueOfAllCustomer=JSON.stringify(item);
             //   selectedCustomer.push
             //    (<option key ={index} value = {valueOfAllCustomer}>{item.name}</option>)
             // })
             //   this.setState({
             //     DealerOption:selectedCustomer
             //   })
             //
             //
             // console.log("array " , listOfOption);


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
onChange=e=>{
  console.log("Changing Values");
  this.setState({
    [e.target.name]:e.target.value
  })
}
onClickOtherBank=e=>{
  this.setState(prevState => ({
    modal: !prevState.modal
  }));
  console.log("PopUP Clicked");
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
this.setState({
  disabledSaveButtonInModal:true
})
  console.log("togle Save");
  console.log("ID" , this.index);
  console.log("VAlue", this.state.numberToGet);
      var data={
          name:this.state.bankName
              }
      if(data.name===''){
    this.message='Please Enter Bank Name';
         this.notify("tc",false);
         this.setState({
           disabledSaveButtonInModal:false
         })
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
                console.log("**Respone in   Create New Bank :: ", response.body);
        this.setState(prevState => ({
          modal: !prevState.modal
        })); 
        this.setState({
          disabledSaveButtonInModal:false
        })

        if(response.body.success){
          this.message='New Bank Created Successfully';
           this.notify("tc",true); 
           EventBus.publish("saveBankInAddBankEventBus",true);
           this.setState({
             bankName:''
           })
                 }
        // this.message= response.body.message;
        //  this.notify("tc",true); 
        //  //  this.message= response.body.message;
        //  // this.notify("tc",true);

              }
            })
      }

}
deleteBankAccountApiCall=e=>{
  console.log("Order Id " , this.index);
  // e.preventDefault();
  console.log("SAved CLICKED");
  var user_id=localStorage.getItem("user_id")

  var data={
    isDeleted:true,
    // date:this.state.date,
       // user_id:this.state.dealerId,
       // deliveryType:this.state.deliveryType,
       // user_id:user_id,
       account_id:this.index,
      //  deliveryItemType:this.state.bagsOrBulk,
      //  quantity:parseInt(this.state.amountOfBags),
      //  biltyNumber:parseInt(this.state.biltyNo),
      //  truckNumber:this.state.truckId,
      // rate:this.state.rate,
      //  totalAmount:this.state.orderPrice,
      //  address:this.state.location
  }


    var options = { method: 'POST',
        url: global.baseUrl + '/api/updateBankAccount',
        headers: {'Authorization': localStorage.getItem("token") },
       body:data,
        json: true
      };
  console.log("options of Delete Bank Account ", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error Of Delete Bank Account", error);
}
        else
        {
          console.log("Respone in Delete Bank Account", response); 
  this.setState({
      disableAlert:false
  })
  if(response.body.success){
  this.message='Bank Account Deleted Successfully'
      this.notify("tc",true);
      this.getAllBanksApiCall();
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
onClickEdit=e=>{
  this.setState({
    disableAlert:true
  })
  console.log("Edit button clicked");

      setTimeout(() => {
        console.log("Detail button  clicked" , this.index );
        urlPrams= '/home/editbankaccount/' + this.index;
         this.props.history.push(urlPrams);
         console.log("URL PARAMS" , urlPrams);
         // EventBus.publish("apiCall",this.responseToSend)
  }, 1000);
}
onClickDelete=e=>{
  this.setState({
    disableAlert:true
  })
  console.log("Delete button clicked");
  setTimeout(()=>{
    this.deleteBankAccountApiCall();
  },1000)

}
getAllBanksApiCall=e=>{
  this.setState({
    isActive:true
  })
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
  isActive:false
})   
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
getTdPropsFunc=(state, rowInfo, column, instance) => {
     return {

                   onClick: (e, handleOriginal) => {
       if(rowInfo!=undefined){
         console.log("It was in this row:", rowInfo.original.id);
         //                 console.log("It was in this row:", rowInfo.original.type);
                         this.index= rowInfo.original.id;
                         // this.type=rowInfo.original.type;
}
                   }

                 };
          }
  render() {
    console.log("Render" , this.state.bank);
 const columns=[
   {
     Header:'ID',
     accessor:'id',
     style:{
       textAlign:'center',
       paddingTop:'23px'
     },
     show: false
   },
   {
     Header:'Account Title',
     accessor:'accountTitle',
     style:{
       textAlign:'center',
       paddingTop:'23px'
     },
   },
   {
     Header:'Bank',
     accessor:'bank',
     style:{
       textAlign:'center',
       paddingTop:'23px'
     },
   },
   {
     Header:'Address',
     accessor:'address',
     style:{
     textAlign:'center',
       paddingTop:'23px'
     },
         filterable:true

   },

   {
     Header:'Branch Code',
     accessor:'branchCode',
     style:{
       textAlign:'center',
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
        <div className="content scrollerclass">
        <div style={{display:'flex', heigh:'526px'}}>
        <ReactTooltip type='info' effect='solid'/>

        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
          <Card style={{padding:'15px' , marginLeft:'0px' , height:"482px"}} className="row">
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
                  {/* <FormGroup row>
                     <Label  sm={4}>Image</Label>
                     <Col sm={8}>
                                 <input style={{marginLeft:'19px' , opacity:'1'}}
                                     type="file"
                                      accept="image/x-png,image/gif,image/jpeg"
                                     onChange={(value)=>this._handleImageChange(value)}>
                                     </input>
                                     <div style={{marginTop:'40px'}}>
                                     {$imagePreview}
                                     </div>
                     </Col>
                   </FormGroup>*/}
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
                   <FormGroup style={{marginTop:'30px'}}check row>
                     <Col sm={{ size: 10, offset: 10 }}>
                       <Button style={{padding:'8px'}} onClick={this.onClickSave} color="info" disabled={this.state.disabledAddBankAccountButton}>
                       {
                       (this.state.disabledAddBankAccountButton) ?
                       <i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>
                       :
                       <span style={{display:'flex' , justifyContent:'center'}}><i style={{marginRight:'12px' , paddingTop:'3px'}}></i> <span>Add Bank Account</span></span>
                       }
                       </Button>
                     </Col>
                   </FormGroup>
                 </Form>
           </div>
           <div style={{marginTop:'117px'}}className="col-md-6 col-sm-6 col-lg-6">
  <Col sm={2}>
                <Button color='info'  style={{padding:'10px' ,width:'131px'}} onClick={this.onClickOtherBank}>Add New Bank</Button>
           </Col>
           </div>
        </Card>
        <Modal style={{width:'100%'}}isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
<ModalHeader toggle={this.toggle}><h4><strong>Please Enter Bank Name</strong></h4></ModalHeader>
<ModalBody>
<Form style={{marginTop:'15px'}}>
<FormGroup row>
<Label for="exampleEmail" sm={4}>Bank Name <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
<Col sm={8}>
<Input data-tip="Mandatory Field" type='text'onChange={this.onChange} name='bankName'value={this.state.bankName} placeholder="Enter Bank Name" />
</Col>
</FormGroup>
</Form>
</ModalBody>
<ModalFooter>
<Button style={{marginLeft:'40%'}}color="info" onClick={this.toggleSave} disabled={this.state.disabledSaveButtonInModal}>
{
(this.state.disabledSaveButtonInModal) ?
<i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>
:
<span style={{display:'flex' , justifyContent:'center'}}><i style={{marginRight:'12px' , paddingTop:'3px'}}></i> <span>Save</span></span>
}
</Button>

</ModalFooter>
</Modal>
</div>
<LoadingOverlay
      active={this.state.isActive}
      spinner
      text='Loading Bank Accounts'
      >

      <Card style={{padding:'15px' }}>
      <div className="react-notification-alert-container">
        <NotificationAlert ref="notificationAlert" />
      </div>
    <h3 style={{padding:'1%', marginBottom:'0px'}}>BANK ACCOUNTS HISTORY</h3>
    <h4 style={{marginLeft:'10px', color:'green',paddingTop:'-10px'}}><u>View All Bank Accounts </u></h4>
    <Form>
  {/*  <FormGroup row>
    <Label sm={2}>Customer Type</Label>
    <Col sm={2}>
    <Label style={{marginTop:'6px'}}>
        <Input onClick={this.onClickDealerCheckBox}type="radio" name="radio1" defaultChecked/>{' '}
        Dealer
        </Label>
      </Col>
       <Col sm={2}>
       <Label style={{marginTop:'7px'}}>
        <Input  onClick={this.onClickEndUserCheckBox}type="radio" name="radio1" />{' '}
        Customer
        </Label>
         </Col>
    </FormGroup>
    <hr/>
 <FormGroup style={{marginBottom:'2%'}} row>
{
(this.state.formToLoad ==='customer') ?


<Col style={{display:'flex',marginTop:'3px'}}sm={12}>
<Label style={{margin:'12px'}}>Customer Name </Label>
<select style={{borderRadius:'8px',height:'39px',width:'192px'}}
onClick={this.onClickDealer}
onChange={this.onChangeCustomer}>
{
(this.state.disableSelectField) &&
<option disabled selected hidden>
Loading,Please Wait
</option>
}
          <option selected hidden>
       Select Customer
            </option>
                        {this.state.customerOption}
</select>


</Col>
:
<Col style={{display:'flex' ,marginTop:'3px'}}sm={12}>

<Label style={{margin:'12px'}}>Dealer Name </Label>
<select style={{borderRadius:'8px',height:'39px', width:'192px'}}
onClick={this.onClickCustomer}
onChange={this.onChangeDealer}>

{
  (this.state.disableSelectField) &&
  <option disabled selected hidden>
Loading,Please Wait
  </option>
}
<option selected hidden>Select Dealer</option>
        {this.state.DealerOption}
</select>

</Col>

}
</FormGroup>
*/
}
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

    );
  }
}

export default AddBank;
