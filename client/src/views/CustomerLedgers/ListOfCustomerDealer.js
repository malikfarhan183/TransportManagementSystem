import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import 'react-table/react-table.css'
import ReactTable from "react-table";
// import { Router, Route, Switch, Redirect } from "react-router-dom";
import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';
import LoadingOverlay from 'react-loading-overlay';
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

var request = require("request");
// const url = global.baseUrl
let  listOfUserRow='';
let listOfUserArray=[];
let urlPrams='';
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
class ListOfCustomerDealer extends React.Component {
  constructor(props){
    super(props);
    this.state={
      searchValue:0,
      isActive:true,
      posts:[],
      noDataFound:'Loading',
      isSuper:false
      // isChecked:true
    }

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
      url: global.baseUrl + '/api/getAllCustomersAndDealers',
      headers: {'Authorization': localStorage.getItem("token") },
      json: true
    };
console.log("options", options);
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
        console.log("Respone :: innn", response);    

        this.setState({
          isActive:false
        })
          // this.responseToSend = response.body.user;
         if(this.responseToSend===[])
         {
           this.setState({
             noDataFound:"Record Not Found"
           })

         }
        console.log("BEFORE MAPPING IN LIST OF ALL USER***** ", response.body.result);
          if(response.body.success===true){
         this.response=response.body.result.map((i,data)=>{
           var creditValue=''
           var ntnStatus=''
           var typeOfCustomer=''
           if(i.ntnStatus === 'active'){
             ntnStatus='Active'
           }
           if(i.ntnStatus === 'nonActive'){
             ntnStatus='Non Active'
           }
           if(i.credit<0){
             var m=i.credit
             console.log("m:::::::::::::" ,Math.abs(m));
             creditValue=`(${Math.abs(m).toLocaleString('en-US')})`
           }
           else{
             if(i.credit!=null){
               creditValue=i.credit.toLocaleString('en-US')
             }
             else{
               creditValue=i.credit
             }

           }
           if (i.name === '') {
             i.name = '-'
           }

           if (i.buisnessName === '') {
             i.buisnessName = '-'
           }

           if (i.type === '') {
             i.type = '-'
           }

           if (i.nic === '') {
             i.nic = '-'
           }

           if (i.ntn === '') {
             i.ntn = '-'
           }

           if (ntnStatus === '') {
             ntnStatus = '-'
           }

           if (i.strn === '') {
             i.strn = '-'
           }

           if (creditValue === '') {
             creditValue = '-'
           }
           if(i.type==='dealer'){
             typeOfCustomer='Dealer'
           }
           if(i.type==='endUser' || i.type==='end user'){
             typeOfCustomer='End User'
           }
               listOfUserRow =
              {
              id:(i._id),
              name:(i.name),
              buisnessName:(i.buisnessName),
              type:(typeOfCustomer),
              nic:(i.nic),
              ntn:(i.ntn),
              ntnStatus:(ntnStatus),
              strn:(i.strn),
              credit:(creditValue),
              remarks:'Your Remarks Here'
            };
          return  listOfUserArray.push(listOfUserRow);
         })
       }
       else
       {
          console.log("Status False", response.body);
       }
         console.log("after mapping " , this.response);
       this.setState({
           posts:listOfUserArray
       })

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
    var x = localStorage.getItem("profile");
    console.log("DID MOUNT OF LIST OF USER" ,x );
      this.apiCall();
     this.response = '';
     this.responseToSend='';
     this.index= '';
     this.type='';
     this.message='';

  // EventBus.on("dateEventingBus",this.dateEventingBusFunc );
  }
  componentWillMount(){
    	// this.setState( { isChecked: this.props.isChecked } );
  }
  onClickDetail=e=>{

    setTimeout(() => {
      console.log("Detail button  clicked" , this.index );
      urlPrams= '/home/customerledgers/' + this.index;
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
    var data={
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
    //                 console.log("It was in this row:", rowInfo.original.id);
    //                 console.log("It was in this row:", rowInfo.original.type);
                    this.index= rowInfo.original.id;
                    this.type=rowInfo.original.type;
}

              }

            };

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
          textAlign:'center',
          // marginLeft:'20px',
          paddingTop:'23px'
        },
        show: false
      },
      {
        Header:'Full Name',
        accessor:'name',
        style:{
          textAlign:'center',

          // marginLeft:'20px',
          paddingTop:'23px'
        },
      },
      {
        Header:'Business Name',
        accessor:'buisnessName',
        width:150,
        style:{
          textAlign:'center',

          // marginLeft:'20px',
          paddingTop:'23px'
        },
      },
      {
          Header:'Type',
          accessor:'type',
          style:{
            textAlign:'center',

          // marginLeft:'20px',
            paddingTop:'23px'
          },
              filterable:true
        },
      {
        Header:'NIC',
        accessor:'nic',
        style:{
          textAlign:'center',

        // marginLeft:'20px',
          paddingTop:'23px'
        },
            filterable:true

      },
      {
        Header:'NTN',
        accessor:'ntn',
        style:{
          textAlign:'center',

        // marginLeft:'20px',
          paddingTop:'23px'
        },
            filterable:true

      },
      {
        Header:'NTN Status',
        accessor:'ntnStatus',
        style:{
          textAlign:'center',

        // marginLeft:'20px',
          paddingTop:'23px'
        },
            filterable:true

      },
      {
        Header:'STRN',
        accessor:'strn',
        style:{
          textAlign:'center',

        // marginLeft:'20px',
          paddingTop:'23px'
        },
            filterable:true

      },
      {
        Header:'Credit',
        accessor:'credit',
        style:{
          textAlign:'center',

        // marginLeft:'20px',
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

        <Button  onClick={this.onClickDetail}
        style={{marginTop:"13px" ,height:"26px",background:'#02a5de',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
        Open Ledgers </Button>
        </span>
      }
    ]
    return (


        <div className="content">
        <LoadingOverlay
          active={this.state.isActive}
          spinner
          text='Loading Customer Ledger Report'
          >
          <Card style={{padding:'15px'}}>
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
        <h3 style={{padding:'1%',marginBottom:'0px'}}>Customer Ledgers</h3>
        <h4 style={{margin:'10px', color:'green'}}><u>View End User/Dealer Ledger Report</u></h4>


        <Form style={{marginLeft:'10px'}}>

                      <FormGroup row>
                      <Col sm={12}>

                      <ReactTable
                      style={{height: '500px'}}

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
   <hr/>
                    </Card>
                        </LoadingOverlay>
        </div>

    );
  }
}

export default ListOfCustomerDealer;
