import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import 'react-table/react-table.css'
import ReactTable from "react-table";

// import { Router, Route, Switch, Redirect } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import EventBus from 'eventing-bus';
import LoadingOverlay from 'react-loading-overlay';
// import EditModal from "views/Delivery/EditModal.js"
import {
   Form,
   FormGroup,
   // Label,
   Card,
   // CardBody,
   // Spinner ,
   // Table,
   // Row,
   Col,
   // Nav,
   Button,
   // Input,
} from "reactstrap";
// const url = global.baseUrl
var request = require("request");


// const url = "http://localhost:1338"

let  listOfUserRow='';
let listOfUserArray=[];
let urlPrams='';
var collectedBy=''
var creditOfEachCustomer=[]
var selectedDealer =[]
var valueOfAllDealer=''
var listOfOption=[]
var selectedCustomer =[]
var valueOfAllCustomer=''
var creditOfEachDealer=[]
// var creditOfEachCustomer=[]
var listOfOptioninCustomer=[]
// var moment = require('moment');

// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
class ListOfUsers extends React.Component {

  constructor(props){
    console.log("constructor");
    super(props);
    this.state={
      disableAlert:false,
      isActive:false,
      wholeOrder:'',
        disableSelectField:false,
      searchValue:0,
      userId:'',
      formToLoad:'',
      posts:[],
      noDataFound:'Loading',
      isSuper:false

      // isChecked:true
    }
      this.isActive=true;
  }
  onChangeCustomer=e=>{
    var customerId=JSON.parse(e.target.value)
    console.log("onChangeCustomer............................... " , customerId._id );
    this.setState({
      userId:customerId._id
    })

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

    apiCall= e=>{
      listOfUserArray=[]
    var options = { method: 'POST',
      url: global.baseUrl + '/api/getAllUsers',
      headers: {'Authorization': localStorage.getItem("token") },
      json: true
    };
console.log("options", options);
    request(options, (error, response, body) =>

    {
      if (error)
      {

        console.log("Error", error);
      }
      else
      {
        console.log("Respone :: ", response);    
this.isActive=false;   
          // this.responseToSend = response.body.user;
         if(this.responseToSend===[])
         {
           this.setState({
             noDataFound:"Record Not Found"
           })

         }
        console.log("BEFORE MAPPING IN LIST OF ALL USER***** ", response.body.user);
         this.response=response.body.user.map((i,data)=>{

           if (i.buisnessName === '') {
             i.buisnessName = '-'
           }

           if(response.body.success !== false){
             listOfUserRow =
               {
               id:(i._id),
               name:(i.name),
               buisnessName:(i.buisnessName),
               type:(i.type),
               email:(i.email),
               admin:(i.isAdmin),
               bank:'HBL(111-1111-111)',
               remarks:'Your Remarks Here'
             };
           }
           else{
             this.message='Order Created Successfully'
                 this.notify("tc",true);
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
  getAllOrdersApiCall=e=>{
    this.setState({
      isActive:true
    })
    listOfUserArray=[]
  var options = { method: 'POST',
      url: global.baseUrl +'/api/viewAllOrders',
      headers: {'Authorization': localStorage.getItem("token") },
      json: true
    };
    console.log("options of Get ALL orders", options);
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
  console.log("Respone :: in get all orders ", response);    
//         console.log("Respone :: in get all order ", body);    
this.isActive=false;   
this.setState({
  isActive:false
})
       if(response.body.success !== false){
         console.log("BEFORE MAPPING IN LIST OF ALL USER***** ", response);
          this.response=response.body.result.map((i,data)=>{
            if(i.description !=="Opening Balance")
            {
              console.log(" i.description" ,  i.description);
            }
            var biltyNumber=''
            if(i.description !=="Opening Balance"){
              if(i.biltyNumber=== undefined){
                i.biltyNumber='-'
              }

              if(i.user_id!==null){
              // console.log(i.user_id.type);
             var d=i.createdAt.split('T')
             // let date=moment(i.createdAt).format('MMMM Do YYYY, h:mm a');
             // let date=moment(i.createdAt).format('LT');

             if (i.user_id.buisnessName === '') {
               i.user_id.buisnessName = '-'
             }

             if(i.deliveryItemType ==="Bulk"){
               listOfUserRow =
                 {
                   inVoiceNo:`ACT-${i.invoiceNumber}`,
                 id:(i._id),
                 name:(i.user_id.name),
                 buisnessName:(i.user_id.buisnessName),
                 userType:(i.user_id.type),
                 type:(i.deliveryItemType),
                 biltyNo:(i.biltyNumber),
                 // email:(i.email),
                 date:(`${d[0]}`),
                 quantity:`${(i.quantity)} Ton(s) `,
                 remarks:'Your Remarks Here',
                 rate:(i.rate),
                 totalAmount:(i.totalAmount).toLocaleString('en-IN'),
                 isDeletedCheck:i.user_id.isDeleted
               };
             }
             else{
               listOfUserRow =
                 {
                   inVoiceNo:`ACT-${i.invoiceNumber}`,
                 id:(i._id),
                 biltyNo:(i.biltyNumber),
                  userType:(i.user_id.type),
                  buisnessName:(i.user_id.buisnessName),
                 name:(i.user_id.name),
                 type:(i.deliveryItemType),
                 // email:(i.email),
             date:(`${d[0]}`),
                 quantity:`${(i.quantity)} Bag(s) `,
                 remarks:'Your Remarks Here',
                 rate:(i.rate),
                 totalAmount:(i.totalAmount).toLocaleString('en-IN'),
                 isDeletedCheck:i.user_id.isDeleted

               };
             }

             return  listOfUserArray.push(listOfUserRow);
            }
            else{

                            // console.log(i.user_id.type);
                            d=i.createdAt.split('T')
                           // let date=moment(i.createdAt).format('MMMM Do YYYY, h:mm a');
                           // let date=moment(i.createdAt).format('LT');

                           // if (i.user_id.buisnessName === '') {
                           //   i.user_id.buisnessName = '-'
                           // }

                           if(i.deliveryItemType ==="Bulk"){
                             listOfUserRow =
                               {
                                 inVoiceNo:`ACT-${i.invoiceNumber}`,
                               id:(i._id),
                               // name:(i.user_id.name),
                               // buisnessName:(i.user_id.buisnessName),
                               // userType:(i.user_id.type),
                               type:(i.deliveryItemType),
                               biltyNo:(i.biltyNumber),
                               // email:(i.email),
                               date:(`${d[0]}`),
                               quantity:`${(i.quantity)} Ton(s) `,
                               remarks:'Your Remarks Here',
                               rate:(i.rate),
                               totalAmount:(i.totalAmount).toLocaleString('en-IN')
                             };
                           }
                           else{
                             listOfUserRow =
                               {
                                 inVoiceNo:`ACT-${i.invoiceNumber}`,
                               id:(i._id),
                               biltyNo:(i.biltyNumber),

                               //  userType:(i.user_id.type),
                               //  buisnessName:(i.user_id.buisnessName),
                               // name:(i.user_id.name),
                               type:(i.deliveryItemType),
                               // email:(i.email),
                           date:(`${d[0]}`),
                               quantity:`${(i.quantity)} Bag(s) `,
                               remarks:'Your Remarks Here',
                               rate:(i.rate),
                               totalAmount:(i.totalAmount).toLocaleString('en-IN')
                             };
                           }

                           return  listOfUserArray.push(listOfUserRow);
            }
           }
          })
       }
       else{
         this.message=response.body.message
             this.notify("tc",true);
       }

       console.log("after mapping " , this.response);
     this.setState({
         posts:listOfUserArray
     })

      }
    })
  }
  getAllDealerApiCall=e=>{
    var options = { method: 'POST',
        url: global.baseUrl + '/api/getAllDealers',
        headers: {'Authorization': localStorage.getItem("token") },
       // body:data,
        json: true
      };
  console.log("options of Get ALL Dealer ", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error", error);
        }
        else
        {
          console.log("Respone in Get ALL Dealer", response);   
  this.setState({
      disableSelectField:false
  })
           listOfOption = response.body.result;
           selectedCustomer=[]
           listOfOption.forEach((item, index)=>{
              valueOfAllCustomer=JSON.stringify(item);
             selectedCustomer.push  (<option key ={index} value = {valueOfAllCustomer}>{item.name}</option>)
              creditOfEachCustomer.push(
                {
                  id:item._id,
                  credit:item.credit
                }
              )
           })
           console.log("CREDIT STATUS OBJECT" , creditOfEachCustomer);
             this.setState({
               DealerOption:selectedCustomer
             })
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
  getAllCustomerApiCall=e=>{
    var options = { method: 'POST',
        url: global.baseUrl + '/api/getAllCustomers',
        headers: {'Authorization': localStorage.getItem("token") },
       // body:data,
        json: true
      };
  console.log("options of Get ALL Customer ", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error", error);
        }
        else
        {
          console.log("Respone in Get ALL CUSTOMER", response);
  this.setState({
      disableSelectField:false
  })

    listOfOptioninCustomer = response.body.result;
    selectedDealer=[]
    listOfOptioninCustomer.forEach((item, index)=>{
       valueOfAllDealer=JSON.stringify(item);
      selectedDealer.push (<option key ={index} value = {valueOfAllDealer}>{item.name}</option>)
       creditOfEachDealer.push({
           id:item._id,
           credit:item.credit
         }
       )
    })
    console.log("CREDIT STATUS OBJECT" , creditOfEachDealer);
      this.setState({
        customerOption:selectedDealer
      })


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
    var x = localStorage.getItem("profile");
    console.log("DID MOUNT OF LIST OF USER" ,x );
this.getAllOrdersApiCall();
// this.getAllDealerApiCall();
// this.getAllCustomerApiCall();
     this.response = '';
     this.responseToSend='';
     this.index= '';
     this.wholeOrder= '';
     this.type='';
     this.message='';
 EventBus.on("OrderCreatedEventBuss",this.OrderCreatedEventBussFunc );
  // EventBus.on("dateEventingBus",this.dateEventingBusFunc );
  }
  OrderCreatedEventBussFunc=e=>{
    console.log("Order Created Successfully" , e);
    if(e){
      this.getAllOrdersApiCall();
    }
  }
  componentWillMount(){
    	// this.setState( { isChecked: this.props.isChecked } );
  }
  onClickDetail=e=>{

  }
  // dateEventingBusFunc=e=>{
  //
  //   console.log("date by eventBus",e);
  //
  //   console.log("variable value of date",this.state.searchValue);
  //   this.setState({
  //     searchValue:e
  //   })
  //
  //
  // }

  deleteRow=id=>{
    console.log("ID",id);
    const index=this.state.posts.findIndex(post=>{
      return (post.id===id)
    })
    console.log('INDEX',index  );


    let copyPosts = [...this.state.posts]
       copyPosts.splice(index,1)

     this.setState({posts:copyPosts})﻿

  }
  filterMethod = (filter, row, column) => {

    const id = filter.pivotId || filter.id

    return row[id] !== undefined ? String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase()) : true

  }
onChangeAdmin=e=>{
// if(e.target.checked){
//
//   // this.setState({
//   //   isChecked:true
//   // });
// }
// else{
//   // this.setState({
//   //   isChecked:false
//   // });
// }


console.log("ON OFF VALUE",e.target.checked);
if(e.target.checked=== true){
  console.log("true");
  var data={
       user_id:this.index,
  }
  var options = { method: 'POST',
        url: global.baseUrl + '/api/makeAdmin',
        headers: {'Authorization': localStorage.getItem("token") },
        body:data,
        json: true
      };
  console.log("options of MAKE ADMIN", options);
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
          console.log("Respone of MAKE ADMIN :: ", response);   
         this.message=response.body.message
         console.log(   "MESSAGE" , this.message);
    if(response.body.success)
    {
      console.log("UNAUTHORIZEDDD PERSON");
     this.message='Edited User Successfully'


    }
    else{

    }
           this.apiCall();
       // if(body.success){
       //   console.log("success :: ", body)
       //
       // }
       // else {
       //   console.log("success false :: ", body);
       // }
        }
      })


  // AGAIN API CALL OF ALL USER Detail

}
else{
  console.log('false');
    data={
         user_id:this.index,
        // type:this.type
        type:'null'
    }
    options = { method: 'POST',
          url: global.baseUrl + '/api/removeAdmin',
          headers: {'Authorization': localStorage.getItem("token") },
       body:data,
          json: true
        };
    console.log("options of REMOVE ADMIN", options);
        request(options, (error, response, body) =>

        {
          if (error)
          {
            console.log("Error", error);
          }
          else
          {
            console.log("Respone of REMOVE ADMIN :: ", response);   
            this.message=response.body.message
    if(response.body.message)
    {
      console.log("UNAUTHORIZEDDD PERSON");

    }
             this.apiCall();
          // window.location.reload();
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
getTdPropsFunc=(state, rowInfo, column, instance) => {

            return {

              onClick: (e, handleOriginal) => {
  if(rowInfo!==undefined){
    console.log("It was in this row:", rowInfo.original);
    //                 console.log("It was in this row:", rowInfo.original.type);
    this.wholeOrder= rowInfo.original;
    this.setState({
      wholeOrder:rowInfo.original
    })
    console.log("Checking" ,this.state.wholeOrder );
    EventBus.publish("editOrderEventBus",rowInfo.original)

                    this.index= rowInfo.original.id;
                    this.type=rowInfo.original.type;
  }
         
              }

            };
          }
onClickDealerCheckBox=e=>{
  this.setState({
    formToLoad:'dealer'
  })

}
onClickEndUserCheckBox=e=>{
  this.setState({
    formToLoad:'customer'
  })

}
onClickEdit=e=>{
  this.setState({
      disableAlert:true
  })
  console.log("Edit button clicked" , e);
 if(!e){
   setTimeout(() => {
     console.log("Detail button  clicked" , this.index );
     urlPrams= '/home/editorder/' + this.index;
      this.props.history.push(urlPrams);
      console.log("URL PARAMS" , urlPrams);
      // EventBus.publish("apiCall",this.responseToSend)
}, 1000);
 }
 else{
   this.message="User Is InActive"
   this.notify("tc",false);
   this.setState({
       disableAlert:false
   })
 }

}
deleteOrderApiCall=e=>{
  console.log("Order Id " , this.index);
  // e.preventDefault();
  console.log("SAved CLICKED");
  // var user_id=localStorage.getItem("user_id")
  var data={
    isDeleted:true,
    // date:this.state.date,
       // user_id:this.state.dealerId,
       // deliveryType:this.state.deliveryType,
       // user_id:user_id,
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
    this.message="Something Went Wrong .."
    this.notify("tc",false);
    this.setState({
        disableAlert:false
    })
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
  this.setState({
      disableAlert:true
  })
  console.log("Delete button clicked");
  setTimeout(()=>{
    this.deleteOrderApiCall();

  },1000)

}
  render() {
    console.log("IN RENDOR OUR isCHECKED STATE:::", this.state.isChecked);
    console.log("RENDOR of Order History" ,this.state.wholeOrder);

    let posts = this.state.posts
  		if (this.state.searchValue) {
  			posts = posts.filter(row => {
  				return row.date.includes(this.state.searchValue) ||
          row.name.includes(this.state.searchValue) ||
            row.type.includes(this.state.searchValue) ||
              row.email.includes(this.state.searchValue) ||
                row.bank.includes(this.state.searchValue) ||
                  row.remarks.includes(this.state.searchValue)

  			})
  		}
    const columns=[
      {
        Header:'ID',
        accessor:'isDeletedCheck',
        style:{
          paddingTop:'23px'
        },
        show: false
      },
      {
        Header:'Invoice No',
        accessor:'inVoiceNo',
        style:{
          textAlign:"center",
          paddingTop:'23px'
        },
      },
      {
        Header:'Name',
        accessor:'name',
        style:{
          textAlign:"center",
          paddingTop:'23px'
        },
      },
      {
        Header:'Business Name',
        accessor:'buisnessName',
        width:150,
        style:{
          textAlign:"center",
          paddingTop:'23px'
        },
      },
      {
        Header:'User Type',
        accessor:'userType',
        style:{
          textAlign:"center",
          paddingTop:'23px'
        },
      },
      {
          Header:'Type',
          accessor:'type',
          style:{
            textAlign:"center",
            paddingTop:'23px'
          },
              filterable:true
        },
        {
            Header:'Bilty No',
            accessor:'biltyNo',
            style:{
              textAlign:"center",
              paddingTop:'23px'
            },
                filterable:true
          },
      {
        Header:'Date',
        accessor:'date',
        style:{
          textAlign:"center",
          paddingTop:'23px'
        },
            filterable:true

      },
      {
        Header:'Quantity',
        accessor:'quantity',
        style:{
          textAlign:"center",
          paddingTop:'23px'
        },
            filterable:true

      },
      {
        Header:'Unit Rate (PKR)',
        accessor:'rate',
        style:{
          textAlign:"center",
          paddingTop:'23px'
        },
            filterable:true

      },
      {
        Header:'Order Price (PKR)',
        accessor:'totalAmount',
        style:{
          textAlign:"center",
          paddingTop:'23px'
        },
            filterable:true

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
        <Button onClick={()=>this.onClickEdit(props.original.isDeletedCheck)}
           disabled={this.state.disableAlert}
         style={{marginTop:"13px" , height:"26px",background:'#02a5de',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
          Edit </Button>
       <Button onClick={this.onClickDelete}
          disabled={this.state.disableAlert}
        style={{marginTop:"13px" , height:"26px",background:'red',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
         Delete  </Button>
        </span>
      }
    ]
    return (
  <div className="content">
    <LoadingOverlay
          active={this.state.isActive}
          spinner

          text='Loading Order History'
          >
          <Card style={{padding:'15px' }}>
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
        <h3 style={{padding:'1%', marginBottom:'0px'}}>Order History</h3>
        <h4 style={{marginLeft:'10px', color:'green',paddingTop:'-10px'}}><u>View All Order</u></h4>

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
                      data={posts}
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

export default ListOfUsers;
