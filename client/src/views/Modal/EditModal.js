
import React from 'react';
import { Form,Input,FormGroup,Label, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import EventBus from 'eventing-bus'
import "../styles/Styling.css"
// var request = require("request");
// const url = global.baseUrl
var allUsersDropdownEdit=[]

class EditModal extends React.Component {


  onChangeForm=e=>{

    if(e.target.name==='dealer'){
      console.log(e.target.value);
      this.dealer=e.target.value;

    }
    if(e.target.name==='customerOrder'){

       console.log(e.target.value);
       this.customerOrder=e.target.value;
    }
    if(e.target.name==='noOfbags'){
      console.log(e.target.value);
      this.noOfbags=e.target.value;

    }

    if(e.target.name==='deliveryLocation'){
      console.log(e.target.value);
      this.deliveryLocation=e.target.value;

    }
    if(e.target.name==='orderDate'){
      console.log(e.target.value);
          this.orderDate=e.target.value;
    }
    if(e.target.name==='deliveryDate'){
      console.log(e.target.value);
          this.deliveryDate=e.target.value;
          if(e.target.value<=this.h1){
              this.setState({date:this.handleDeleveryDate})
          }
          else{
          this.h1=e.target.value;
            console.log("after loging", this.h1);
          this.setState({date:this.h1})
              }
    }

    if(e.target.name==='remarks'){
      console.log(e.target.value);
          this.remarks=e.target.value;
    }

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

    this.customerOrder=''
    this.dealer=''
    this.deliveryLocation=''
    this.deliveryDate=''
    this.noOfbags=''
    this.orderDate=''
    this.remarks=''
    this.allUsersArray = [];
    console.log("DID");


    EventBus.on("editModalEventBus", this.editModalEventBusFunc.bind(this));
    EventBus.on("allUsersArrayEditModalEventBus", this.allUsersArrayEditModalEventBusFunc.bind(this));

  }
  allUsersArrayEditModalEventBusFunc=e=>{
    console.log("All users in edit modal",e);
    this.allUsersArray= [e];
    // console.log(this.allUsersArray);
    // const maping = this.allUsersArray.map(x =>{
    //   console.log('this is x', x);
    // });
    this.allUsersArray.forEach((i,idx,x)=>{
      console.log("mappppp",i);
      console.log("mappppp",i['name']);

      allUsersDropdownEdit.push(
      <option value={i.id}>{i.name}</option>
      )
    })
      console.log("pushed DropDown in edit modal",allUsersDropdownEdit);
   }

editModalEventBusFunc=e=>{
  console.log(e);
  this.setState(prevState => ({
    modal: !prevState.modal
  }));
}

componentWillMount(){
  console.log("will mount");
  this.date=new Date();
// console.log("my data::",date);
   this.a=this.date.toISOString()
//   console.log("date setted",a);
  this.b=this.a.split('T');

  this.date1 = new Date();

// add a day
this.date1.setDate(this.date1.getDate() + 1)
this.h=this.date1.toISOString()
this.h1=this.h.split('T');
this.handleDeleveryDate=this.h1[0];
this.setState({date:this.h1[0]})


}

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      date:''
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle(tab) {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
   if(tab==='1'){
    var formDataObject={
        dealerData:this.dealer,
      customerOrderData:this.customerOrder,
        noOfbagsData:this.noOfbags,
        deliveryLocationData:this.deliveryLocation,
        orderDateData:this.orderDate,
        deliveryDateData:this.state.date,
        remarksData:this.remarks
    }
    EventBus.publish("formDataEventBus", formDataObject);
  }
  var formAddDataObject={
        "description": this.remarks,
        "deliveryDate": this.state.date,
        "quantity": this.customerOrder,
        "address" : this.deliveryLocation,
        "user_id" : this.dealer
  }
  console.log("FORM DATA WHEN EDIT",formAddDataObject);

  // var options = { method: 'POST',
  //   url: global.baseUrl + '/api/createOrder',
  //   headers: {'content-type': 'application/json','cache-control': 'no-cache' ,'Authorization':localStorage.getItem("token")},
  //   body:formAddDataObject,
  //   json: true
  // };
  // console.log("ooptions :: ", options);
  // request(options, (error, response, body) =>
  // {
  //   if (error)
  //   {
  //     console.log("Error in Add order", error);
  //   }
  //   else{
  //     console.log("RRSPONSE",body);
  //   }
  // })
  }
  render() {

    return (
      <div>

        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}><h4>Edit Order</h4></ModalHeader>
          <ModalBody>

<Form>
<div style={{display:'flex'}}>


<FormGroup>
<Label for="exampleSelect">Dealer</Label>
<Input style={{width:'190px'}} onChange={this.onChangeForm}  type="select" name="dealer" id="exampleSelect">
              <option disabled selected hidden>Select Dealer</option>
                    {allUsersDropdownEdit}
</Input>
</FormGroup>
<FormGroup>
  <Label for="exampleEmail">Customer Order</Label>
  <Input style={{width:'190px'}}onChange={this.onChangeForm}type="email" name="customerOrder" id="exampleEmail" placeholder="Customer Order" />
</FormGroup>
</div>
<div style={{display:'flex'}}>
<FormGroup>
  <Label for="exampleEmail">Delivery Location</Label>
  <Input  onChange={this.onChangeForm}  type="text" name="deliveryLocation" id="exampleEmail" placeholder="Delivery location" />
</FormGroup>
<FormGroup>
  <Label for="exampleEmail">Order Date</Label>
  <Input onChange={this.onChangeForm} value={this.b[0]}  type="text" name="orderDate" id="exampleEmail" placeholder="Order date"  disabled/>
</FormGroup>
</div>
<div style={{display:'flex'}}>

<FormGroup>
  <Label for="orderdate">Delivery Date</Label>
  <Input  onChange={this.onChangeForm}  type="Date" value={this.state.date} name="deliveryDate" id="deliverydate" placeholder="Choose a Date" />
</FormGroup>
<FormGroup>
              <Label for="remarks">Remarks</Label>
              <Input  onChange={this.onChangeForm}  type="textarea" name="remarks" id="remarks" placeholder="Remarks" />
</FormGroup>
    </div>

</Form>

          </ModalBody>
          <ModalFooter>
          <Button style={{ borderRadius: '10px', paddingBottom: '2px',paddingTop:'2px',marginLeft: '40%'}}
          color="info" onClick={()=>this.toggle('1')}>Save
          </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default EditModal;
