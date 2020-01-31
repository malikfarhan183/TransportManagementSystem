import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import 'react-table/react-table.css'
import ReactTable from "react-table";
import ReactTooltip from 'react-tooltip'


// import { Router, Route, Switch, Redirect } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
import EventBus from 'eventing-bus';
import LoadingOverlay from 'react-loading-overlay';
import DatePicker from "react-datepicker";
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
   Input,
} from "reactstrap";
// import "./CustomerLedgerStyling.css"
var request = require("request");
var moment = require('moment');

// const url = global.baseUrl
let  listOfUserRow='';
let listOfUserArray=[];
let urlPrams='';
var creditOfEachCustomer=[]
var selectedDealer =[]
var valueOfAllDealer=''
var listOfOption=[]
var selectedCustomer =[]
var valueOfAllCustomer=''
var creditOfEachDealer=[]
// var creditOfEachCustomer=[]
var listOfOptioninCustomer=[]
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
class MRPAndTaxations extends React.Component {
  constructor(props){
    super(props);
    this.state={
      mrp:'',
      gst:'',
      filterAdvTax:'',
      nonFilterAdvTax:'',
      otherTax1:'',
      otherTax2:'',
      disableEdit:false,
      searchValue:0,
      userId:'',
        disableSelectField:false,
      // userId:'',
      dateToDealer:new Date(),
      dateFromDealer:new Date(),
      dealerCode:'',
        formToLoad:'',
          creditOfSelectedCustomer:'',
            DealerOption:[],
                customerOption:[],
      posts:[],
      noDataFound:'Loading',
      isSuper:false,
      date:'',
      isActive:true

      // isChecked:true
    }
      // this.isActive=true;
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
    this.message="Something Went Wrong .."
    this.notify("tc",false);
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
      selectedDealer.push(<option key ={index} value = {valueOfAllDealer}>{item.name}</option>)
       creditOfEachDealer.push(
         {
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
    this.message="Something Went Wrong .."
    this.notify("tc",false);
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
             selectedCustomer.push(<option key ={index} value = {valueOfAllCustomer}>{item.name}</option>)
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
  onClickCustomer=e=>{
  console.log("Getting Value of full OPTION " ,e.target.value);

  this.setState({
    dealerCode:JSON.parse(e.target.value)._id
  })
    console.log("Dealer CLICKED" , JSON.parse(e.target.value)._id);

  creditOfEachCustomer.forEach((item, index)=>{
    console.log("ITEM" ,item.id);
   if(JSON.parse(e.target.value)._id === item.id)
   {
     this.setState({
       creditOfSelectedCustomer:item.credit
     })
   }
   })
  }
  onClickDealer=e=>{
  console.log("Getting Value of full OPTION " ,e.target.value);
  //
  this.setState({
    dealerCode:JSON.parse(e.target.value)._id
  })
    console.log("Dealer CLICKED" , JSON.parse(e.target.value)._id);

  creditOfEachDealer.forEach((item, index)=>{
    console.log("ITEM" ,item.id);
   if(JSON.parse(e.target.value)._id === item.id)
   {
     this.setState({
       creditOfSelectedCustomer:item.credit
     })
   }

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
      time=4
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
   var data={
     from:this.state.dateFromDealer,
     to:this.state.dateToDealer,
    }
   listOfUserArray=[]
 var options = { method: 'POST',
      url: global.baseUrl + '/api/viewAllTaxes',
      headers: {'Authorization': localStorage.getItem("token") },
     // body:data,
      json: true
    };
console.log("options of View All Taxes", options);
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
        console.log("Respone ::in View All Taxes ", response);
this.setState({
  isActive:false
})
    this.isActive=false; 
if(response.body.success!==false){

      this.responseToSend = response.body.result;
     if(this.responseToSend===[])
     {
       this.setState({
         noDataFound:"Record Not Found"
       })
       this.message="Empty Record Found"
         this.notify("tc",false);

     }
     this.response=response.body.result.map((i,data)=>{
     //   var d=i.createdAt.split('T')
     // console.log('Data >>>' , i);
     //   var d=i.date.split('T')
     //   let date=moment(i.date).format('L');
// console.log("Data >>" , i);
  // var d=i.createdAt.split('T')
console.log('Data >>>' , i);
  // var d=i.date.split('T')
  let date=moment(i.date).format('L');
listOfUserRow =
 {
 id:(i.date),
 // sNo:(dat),
 date:(date),
 mrp:(i.mrp),
 gst:(i.gst),
 filterAdvTax:(i.fat),
 nonFilterAdvTax:(i.nfat),
 otherTax1:(i.ot1),
 otherTax2:(i.ot2)
};
 return  listOfUserArray.push(listOfUserRow);

     })

     console.log("after mapping " , this.response);
   this.setState({
       posts:listOfUserArray
   })
} 
else{
  console.log("Else");
  this.message=response.body.message
  this.notify("tc",false);
}   


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
//     var curr = new Date();
//     curr.setDate(curr.getDate() + 3);
//     var date = curr.toISOString().substr(0,10);
// this.setState({
//       dateToDealer:date
// })
    var x = localStorage.getItem("profile");
    console.log("DID MOUNT OF LIST OF USER" ,x );
    // this.getAllDealerApiCall();
    // this.getAllCustomerApiCall();
    this.apiCall();
     this.response = '';
     this.responseToSend='';
     this.index= '';
     this.type='';
     this.message='';
EventBus.on("OrderCreatedEventBuss",this.OrderCreatedEventBussFunc );
  // EventBus.on("dateEventingBus",this.dateEventingBusFunc );
  }
  OrderCreatedEventBussFunc=e=>{
    console.log("Order Created Successfully" , e);
  }
  componentWillMount(){
    	// this.setState( { isChecked: this.props.isChecked } );
  }
  onClickDetail=e=>{


    setTimeout(() => {
      console.log("Detail button  clicked" , this.index );
      urlPrams= '/admin/listofusersdetail/' + this.index;
       this.props.history.push(urlPrams);
       console.log("URL PARAMS" , urlPrams);
       // EventBus.publish("apiCall",this.responseToSend)
}, 1000);
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
// onChangeAdmin=e=>{
// // if(e.target.checked){
// //
// //   // this.setState({
// //   //   isChecked:true
// //   // });
// // }
// // else{
// //   // this.setState({
// //   //   isChecked:false
// //   // });
// // }
//
//
// console.log("ON OFF VALUE",e.target.checked);
// if(e.target.checked=== true){
//   console.log("true");
//   var data={
//        user_id:this.index,
//   }
//   var options = { method: 'POST',
//         url: global.baseUrl + '/api/makeAdmin',
//         headers: {'Authorization': localStorage.getItem("token") },
//         body:data,
//         json: true
//       };
//   console.log("options of MAKE ADMIN", options);
//       request(options, (error, response, body) =>
//
//       {
//         if (error)
//         {
//           console.log("Error", error);
//         }
//         else
//         {
//           console.log("Respone of MAKE ADMIN :: ", response);   
//          this.message=response.body.message
//          console.log(   "MESSAGE" , this.message);
//     if(response.body.success)
//     {
//       console.log("UNAUTHORIZEDDD PERSON");
//      this.message='Edited User Successfully'
//
//
//     }
//     else{
//
//     }
//            this.apiCall();
//        // if(body.success){
//        //   console.log("success :: ", body)
//        //
//        // }
//        // else {
//        //   console.log("success false :: ", body);
//        // }
//         }
//       })
//
//
//   // AGAIN API CALL OF ALL USER Detail
//
// }
// else{
//   console.log('false');
//     var data={
//          user_id:this.index,
//         // type:this.type
//         type:'null'
//     }
//     var options = { method: 'POST',
//           url: global.baseUrl + '/api/removeAdmin',
//           headers: {'Authorization': localStorage.getItem("token") },
//        body:data,
//           json: true
//         };
//     console.log("options of REMOVE ADMIN", options);
//         request(options, (error, response, body) =>
//
//         {
//           if (error)
//           {
//             console.log("Error", error);
//           }
//           else
//           {
//             console.log("Respone of REMOVE ADMIN :: ", response);   
//      this.message=response.body.message
//     if(response.body.message)
//     {
//       console.log("UNAUTHORIZEDDD PERSON");
//
//     }
//              this.apiCall();
//           // window.location.reload();
//          // if(body.success){
//          //   console.log("success :: ", body)
//          //
//          // }
//          // else {
//          //   console.log("success false :: ", body);
//          // }
//           }
//         })
// }
//
//   }
getTdPropsFunc=(state, rowInfo, column, instance) => {

            return {

              onClick: (e, handleOriginal) => {
              if(rowInfo!==undefined){
                console.log("It was in this row:", rowInfo.original.id);
                                console.log("It was in this row:", rowInfo.original.type);
                               this.index= rowInfo.original.id;
                              this.type=rowInfo.original.type;
              }
             
              }

            };

          }
onChangeDate=e=>{
  // this.setState({
  //   isActive:true
  // })
      // this.isActive=true; 
  console.log("DATE",e.target.value);
this.setState({
  date:e.target.value
})
// setTimeout(()=>{
//   this.apiCall();
// },1000)


}
onChangeDateFromDealer=e=>{
  console.log("dateFromDealer",e);
this.setState({
  dateFromDealer:e
})
}
onChangeDateToDealer=e=>{
  console.log("dateToDealer",e);
  this.setState({
    dateToDealer:e
  })
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
onChangeDealer=e=>{
  var dealerId=JSON.parse(e.target.value)
  console.log("onChangeDealer............................... " , dealerId._id );
  this.setState({
    userId:dealerId._id
  })

}
onChangeCustomer=e=>{
  var customerId=JSON.parse(e.target.value)
  console.log("onChangeCustomer............................... " , customerId._id );
  this.setState({
    userId:customerId._id
  })

}
onClickSearch=e=>{
  this.setState({
    isActive:true
  })
  console.log("Search clicked");
  this.apiCall();

}
onChangeCustomer=e=>{
  var customerId=JSON.parse(e.target.value)
  console.log("onChangeCustomer............................... " , customerId._id );
  this.setState({
    userId:customerId._id
  })

}
onClickPrint=e=>{
  console.log("Print Action Clicked");
}
onChange=e=>{
  this.setState({
    [e.target.name]:e.target.value
  })
}
onClickSave=e=>{
  this.setState({
      disableBtn:true
  })
  console.log("dateFromDealer ..... " , this.state.dateFromDealer);
  console.log("dateToDealer ..... " , this.state.dateToDealer);
if(this.state.dateFromDealer > this.state.dateToDealer){
    console.log('dateToDealer is greater');
    this.message='End Date Should Not Be Less Than Starting Date '
     this.notify("tc",false); 
     this.setState({
         disableBtn:false
     })  
  }
  else{
    var data={
      from:this.state.dateFromDealer,
      to:this.state.dateToDealer,
      mrp:this.state.mrp,
      gst:this.state.gst,
      fat:this.state.filterAdvTax,
      nfat:this.state.nonFilterAdvTax,
      ot1:this.state.otherTax1,
      ot2:this.state.otherTax2
    }
    console.log("mrp" ,data.from );
    if(data.from=== ''){
      this.message='Date(From) is Required'
       this.notify("tc",false);
       this.setState({
           disableBtn:false
       })   
    }
    else if (data.to==='') {
      this.message='Date(To) is Required'
       this.notify("tc",false); 
       this.setState({
           disableBtn:false
       })   
    }

    else if (data.mrp==='') {
      this.message='MRP Required'
       this.notify("tc",false); 
       this.setState({
           disableBtn:false
       })   
    }
    else if (data.gst==='') {
      this.message='GST Required '
       this.notify("tc",false); 
       this.setState({
           disableBtn:false
       })   
    }
    else if (data.fat==='') {
      this.message='Filter Advance Tax Required'
       this.notify("tc",false); 
       this.setState({
           disableBtn:false
       })   
    }
    else if (data.nfat==='') {
      this.message='Non filter Advance Tax Required'
       this.notify("tc",false); 
       this.setState({
           disableBtn:false
       })   
    }

    else{
      var options = { method: 'POST',
          url: global.baseUrl + '/api/createUpdateTaxInfo',
          headers: {'Authorization': localStorage.getItem("token") },
          body:data,
          json: true
        };
    console.log("options of create New Tax Info ", options);
        request(options, (error, response, body) =>

        {
          if (error)
          {
      this.message='SomeThing Went Wrong ..'
      this.notify("tc",false); 
            console.log("Error", error);
          }
          else
          {
            console.log("Respone in New Tax Info", response);
    this.setState({
        disableBtn:false
    })   
    this.message=response.body.message
     this.notify("tc",true); 
     this.apiCall();
               this.setState({

              dateToDealer:new Date(),
              dateFromDealer:new Date(),
               mrp:'',
              gst:'',
              filterAdvTax:'',
              nonFilterAdvTax:'',
           otherTax1:'',
           otherTax2:''
            })
            // this.getAllUsersApiCall();
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


}
onClickEdit=e=>{
  this.setState({
    disableAlert:true ,
    disableEdit:true
  })
  console.log("Edit button clicked");

      setTimeout(() => {
        console.log("Detail button  clicked" , this.index );
        urlPrams= '/home/EditMRPAndTaxations/' + this.index;
         this.props.history.push(urlPrams);
         console.log("URL PARAMS" , urlPrams);
         // EventBus.publish("apiCall",this.responseToSend)
  }, 1000);
}
  render() {
    console.log("IN RENDOR OUR isCHECKED STATE:::", this.state.isChecked);
    console.log("RENDOR");
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
        accessor:'id',

        style:{

          paddingTop:'23px',

        },
        show: false

      },
      {
        Header:'SNO',
        accessor:'sNo',
        width:60,
        Cell: (row) => {return <div>{row.index+1}</div>;},
        filterable: false,
        id:"row",


        style:{
          textAlign:'center',

          paddingTop:'23px',

        },
      },

      {
        Header:'Date',
        accessor:'date',
        width:160,


        style:{
          textAlign:'center',

          paddingTop:'23px',

        },
      },
      {
        Header:'MRP ',
        accessor:'mrp',
        width:160,

        style:{
          textAlign:'center',

          paddingTop:'23px'
        },
        show: true
      },
      {
          Header:'GST (%)',
          accessor:'gst',
          width:160,

          style:{
            textAlign:'center',

            paddingTop:'23px'
          },
              filterable:true
        },
      {
        Header:'FILTER ADV TAX (%)',
        accessor:'filterAdvTax',
        width:160,

        style:{
          textAlign:'center',

          paddingTop:'23px'
        },
            filterable:true
      },
      {
        Header:'NON FILTER ADV TAX (%)',
        accessor:'nonFilterAdvTax',
        width:160,

        style:{
          textAlign:'center',

          paddingTop:'23px'
        },
            filterable:true
      },
      {
        Header:'OTHER TAX 1',
        accessor:'otherTax1',
        width:160,

        style:{
          textAlign:'center',

          paddingTop:'23px'
        },
            filterable:true
      },
      {
        Header:'OTHER TAX 2',
        accessor:'otherTax2',
        width:160,

        style:{
          textAlign:'center',

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

        Cell:props=> <span>

        <Button  onClick={this.onClickEdit} disabled={this.state.disableEdit}
        style={{marginTop:"13px" ,height:"26px",background:'#02a5de',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
        Edit</Button>
        </span>
      }



    ]
    return (

              <div className="content" >
      <ReactTooltip type='info' effect='solid'/>

                <div className="react-notification-alert-container">
                  <NotificationAlert ref="notificationAlert" />
                </div>
                <div style={{  height:'95vh',
                  overflow: 'auto',
                  paddingBottom: '100px'}}>
                  <Card style={{padding:'15px'}}>
              <h3 style={{padding:'1%', marginBottom:'0px'}}>MRP AND TAXATIONS</h3>
                <h4 style={{margin:'10px', color:'green'}}><u>MRP AND TAX RATES</u></h4>
              <Form style={{marginLeft:'10px'}}>
  <FormGroup row>
  <Col style={{display:'flex',marginTop:'3px' ,marginBottom:'16px'}}sm={12}>
  <Label style={{margin:'12px'}} for="date">Start Date</Label>
{ /* <Input
  onChange={this.onChangeDateFromDealer}
  style={{width:'20%',marginBottom:'30px'}}type="Date" name="date" id="date" placeholder="Choose a Date" />*/}
  <DatePicker className='datePickerCashManagement'
             selected={this.state.dateFromDealer}
             onChange={this.onChangeDateFromDealer}
           />
  <Label style={{marginLeft:'20px' , marginTop:'12px' , marginRight:"12px"}} for="date">End Date</Label>
{/*  <Input
  onChange={this.onChangeDateToDealer}
  defaultValue={this.state.dateToDealer}
  style={{width:'20%',marginBottom:'30px'}}type="Date" name="date" id="date" placeholder="Choose a Date" />*/}
  <DatePicker className='datePickerCashManagement'
             selected={this.state.dateToDealer}
             onChange={this.onChangeDateToDealer}
           />
  </Col>
    </FormGroup>
             <FormGroup row>
               <Label  data-tip="Mandatory Field" sm={2}>MRP  <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
               <Col sm={4}>
                    <Input type='number'onChange={this.onChange} name='mrp' value={this.state.mrp}  placeholder="Enter MRP" />
               </Col>
             </FormGroup>
             <FormGroup row>
               <Label data-tip="Mandatory Field" sm={2}>GST (%) <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
               <Col sm={4}>
                    <Input type='number'onChange={this.onChange} name='gst'  value={this.state.gst}  placeholder="Enter GST"  invalid/>
               </Col>
             </FormGroup>
             <FormGroup row>
               <Label data-tip="Mandatory Field" sm={2}>FILER ADV TAX <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
               <Col sm={4}>
                  <Input   type='number'onChange={this.onChange} name='filterAdvTax'  value={this.state.filterAdvTax}  placeholder="Enter FILER ADV TAX" />
               </Col>
             </FormGroup>
             <FormGroup row>
               <Label data-tip="Mandatory Field" sm={2}>NON FILER ADV TAX  <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
               <Col sm={4}>
                    <Input type='number'onChange={this.onChange} name='nonFilterAdvTax'  value={this.state.nonFilterAdvTax}  placeholder="Enter NON FILER ADV TAX"  invalid/>
               </Col>
             </FormGroup>
             <FormGroup row>
               <Label  sm={2}>OTHER TAX 1</Label>
               <Col sm={4}>
                    <Input type='number'onChange={this.onChange} name='otherTax1' value={this.state.otherTax1}  placeholder="Enter OTHER TAX 1"  invalid/>
               </Col>
             </FormGroup>
             <FormGroup row>
               <Label sm={2}>OTHER TAX 2</Label>
               <Col sm={4}>
                    <Input type='number'onChange={this.onChange} name='otherTax2'  value={this.state.otherTax2}  placeholder="Enter OTHER TAX 2"  invalid/>
               </Col>
             </FormGroup>
             <FormGroup style={{marginTop:'2%'}}check row>
               <Col sm={{ size: 10, offset: 5 }}>
                 <Button onClick={this.onClickSave}color="info" disabled={this.state.disableBtn}>
                 {
                 (this.state.disableBtn) ?
                 <span><i className="fa fa-spinner fa-spin fa-1x fa-fw"></i></span>
                 :  <span style={{display:'flex' , justifyContent:'center'}}><span>Save</span></span>
                 }

                 </Button>
               </Col>
             </FormGroup>
    </Form>
      </Card>

                            <LoadingOverlay
                             active={this.state.isActive}
                             spinner
                             text='Loading MRP And Taxation History'
                             >
                                <Card style={{padding:'15px' }}>
                                <h3 style={{padding:'1%', marginBottom:'0px'}}>MRP AND TAXATIONS HISTORY</h3>
                                <h4 style={{marginLeft:'10px', color:'green',paddingTop:'-10px'}}><u>View All MRP AND TAX RATES </u></h4>
                                 <Form>
                            <FormGroup style={{marginTop:'10px'}} row>
                            <Col sm={12}>

                            <ReactTable
                            style={{ height:'500px'}}
                            columns={columns}
                            data={posts}
                            noDataText='Empty'
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



         <hr/>





  </div>

              </div>

    );
  }
}

export default MRPAndTaxations;
