import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import LoadingOverlay from 'react-loading-overlay';
import 'react-table/react-table.css'
// import ReactTable from "react-table";
import ReactTooltip from 'react-tooltip'

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
   Input
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
var request = require("request");
// const url = global.baseUrl
var regularExpression=''
var var1=''
// let urlPrams='';
let listOfUserRow='';
let listOfUserArray=[];
// var listOfOptionUser=[]
// var valueOfAllUser=''
// var selectedUser=[]
// var creditOfEachUser=[]

// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class EditUser extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isActive:false,
      disableAlert:false,
      onChangeRole:'Select Role',
  dealerCode:'',
  name:'',
  email:'',
  password:'',
  // onChangeRole:'',
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
  uploadImgAPiCall=e=>{
    this.fileUpload(this.state.image).then((response)=>{
        console.log("response file of Uplaod IMG :: ", response);
        if(response.status !== 200)
        {
          this.message="You are uploading Corrupt Image"
               this.notify("tc",false);
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
    getAllUsersApiCall=e=>{
      var data={
        type:JSON.stringify(["super","admin","financeManager","deliveryManager" , "collectionManager"])
      }
      var options = { method: 'POST',
          url: global.baseUrl + '/api/getAllUsersAdmin',
          headers: {'Authorization': localStorage.getItem("token") },
         body:data,
          json: true
        };
    console.log("options of Get ALL User Admin ", options);
        request(options, (error, response, body) =>

        {
          if (error)
          {
            console.log("Error", error);
          }
          else
          {
            console.log("Respone in Get ALL User Admin", response);   
    this.setState({
        disableSelectField:false
    })
    if(this.responseToSend===[])
    {
      this.setState({
        noDataFound:"Record Not Found"
      })
    }
   console.log("BEFORE MAPPING IN LIST OF ALL USER***** ", response.body.result);
    this.response=response.body.result.map((i,data)=>{
      // let date=i.date.split('T');
      // let time=moment(i.date).format('LT');
        listOfUserRow =
          {
          id:(i._id),
          name:(i.name),
          contactNo:(i.mobile),
          type:(i.type),
          credit:(i.credit),
          // date:(date[0]),
          address:(i.address)
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
    getSingleUsersApiCall=e=>{
      this.setState({
        isActive:true
      })
      var data={
            user_id:this.props.match.params.id
      }
      var options = { method: 'POST',
          url: global.baseUrl + '/api/getSingleUser',
          headers: {'Authorization': localStorage.getItem("token") },
         body:data,
          json: true
        };
    console.log("options of Single User", options);
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
            console.log("Respone in Get Single User", response);   
    this.setState({
      isActive:false
    })
    this.setState({
        disableSelectField:false
    })
    if(this.responseToSend===[])
    {
      this.setState({
        noDataFound:"Record Not Found"
      })
    }
   console.log("BEFORE MAPPING IN LIST OF ALL USER***** ", response.body.result);
   if(!response.body.success){
     this.message= 'Customer Not Found';
      this.notify("tc",false);   }
   else{
     let i=response.body.result
     // $imagePreview=response.body.result.nicScan

              this.setState({
                id:(i._id),
                onChangeRole:(i.type),
                name:(i.name),
                email:(i.email),
                // password:(i.nicScan),


      })
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
    isActive:true
  })
  // this.getAllUsersApiCall();
  this.getSingleUsersApiCall();


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
  onChangeDealerCode=e=>{
    console.log("payee",e.target.value);
  this.setState({
    dealerCode:e.target.value
  })
  }

  onBusinessName=e=>{
    console.log("payee",e.target.value);
  this.setState({
    BusinessName:e.target.value
  })
  }
  onDealerName=e=>{
    console.log("payee",e.target.value);
  this.setState({
    dealerName:e.target.value
  })
  }
  onCustomerName=e=>{
    console.log("payee",e.target.value);
  this.setState({
    customerName:e.target.value
  })
  }
  onDealerType=e=>{
    console.log("type",e.target.value);
  this.setState({
    dealerType:e.target.value
  })

  }

  onChangeContactNo=e=>{
    console.log("payee",e.target.value);
  this.setState({
    changeContactNo:e.target.value
  })
  }

  onChangeAlternateContactNo=e=>{
    console.log("payee",e.target.value);
  this.setState({
    changeAlternateContactNo:e.target.value
  })
  }

  onChangeAddress=e=>{
    console.log("payee",e.target.value);
  this.setState({
    adress:e.target.value
  })
  }

  onChangeFrom=e=>{
    console.log("payee",e.target.value);
  this.setState({
    from:e.target.value
  })
  }
  onClickAddDealer=e=>{

    var data = {
       name:this.state.dealerName,

       mobile:this.state.changeContactNo,

        type:'dealer',
       address:this.state.adress,

       alternateContact:this.state.changeAlternateContactNo,
       buisnessName:this.state.BusinessName ,

    }

    var options = { method: 'POST',
        url: global.baseUrl +'/api/createUser',
        headers: {'Authorization': localStorage.getItem("token") },
       body:data,
        json: true
      };
  console.log("options of Create New Dealer", options);
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
          console.log("Respone in Create New Dealer", response);   
  this.setState({
    dealerCode:'',
    adressOfCustomer:'',
    changeContactNoOfCustomer:'',
    changeAlternateContactNoOfCustomer:'',
    customerName:'',
    dealerChecked:false,
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

  })
  this.message= 'Dealer Created Successfully'
   this.notify("tc",true); 
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
  onClickDealer=e=>{
    console.log("onClickDealer" , this.state.dealerChecked);
    this.setState({
      formToLoad:'dealer',
      dealerChecked:true,
        customerChecked:false,
    })
  console.log("onClickDealer" , this.state.dealerChecked);
  }
  onClickEndUser=e=>{
    console.log("onClickEndUser");
    this.setState({
      formToLoad:'endUser',
      customerChecked:true,
        dealerChecked:false
    })

  }
  onChangePassword=e=>{
    console.log("payee",e.target.value);
  this.setState({
    password:e.target.value
  })
  }

  onChangeRetypepassword=e=>{
    console.log("payee",e.target.value);
  this.setState({
    retypePassword:e.target.value
  })
  }
  onChangeRole=e=>{
    console.log("onChangeRole",e.target.value);
  this.setState({
    onChangeRole:e.target.value
  })
}

  onChangeEmail=e=>{
    console.log("payee",e.target.value);
  this.setState({
    email:e.target.value
  })
  }
  onChangeName=e=>{
    console.log("payee",e.target.value);
    let val = e.target.value.replace(/[^A-z\s]/g, '');
  this.setState({
    name:val
  })
  }
  onClickSave=e=>{
    this.setState({
        disableAlert:true
    })
    console.log("email" , this.state.email);
     regularExpression=/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/g
     // console.log("REGEX" , regularExpression.test(this.state.email));
         console.log("email again" , this.state.email);
     var1=regularExpression.test(this.state.email)
     console.log("IN VAR " ,var1 );
   if(this.state.email===''){
     this.message='Email is Required'
      this.notify("tc",false); 
      this.setState({
          disableAlert:false
      })
   }
   else {
     if(var1){
       console.log('if');
         var data={
           user_id:this.props.match.params.id,
           name:this.state.name,
           email:this.state.email,
           password:this.state.password,
           type:this.state.onChangeRole
         }
         if(this.state.name=== ''){
           this.message='Name is Required'
            this.notify("tc",false); 
            this.setState({
                disableAlert:false
            })
         }
         else if (this.state.email==='') {
           this.message='Email is Required'
            this.notify("tc",false); 
            this.setState({
                disableAlert:false
            })
         }
         else if (this.state.onChangeRole==='') {
           this.message='Please Select Role '
            this.notify("tc",false);
            this.setState({
                disableAlert:false
            })
         }
         else{
           var options = { method: 'POST',
               url: global.baseUrl + '/api/updateUser',
               headers: {'Authorization': localStorage.getItem("token") },
               body:data,
               json: true
             };
         console.log("options of createUser ", options);
             request(options, (error, response, body) =>

             {
               if (error)
               {
                 console.log("Error", error);
               }
               else
               {
                 console.log("**Respone in createUser", response);
         this.setState({
             disableAlert:false
         })
         if(response.statusCode===200){
         this.message=response.body.message
          this.notify("tc",true); 
                    this.setState({
                   dealerCode:'',
                   name:'',
                   email:'',
                   password:'',
                   onChangeRole:'',
                   retypePassword:'',
                 })
                 setTimeout(()=>{
                   this.props.history.push('/home/usermanagement')
                 }, 3000);

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
              else{
                this.message=response.body.message
                 this.notify("tc",false); 
              }
               }

             })
         }
     }
     else{
       console.log("else");
       this.message='Please Enter Valid Email as (name@email.com)'
        this.notify("tc",false); 
     }

   }

  }
  _handleImageChange=e=>{
e.preventDefault();

let reader = new FileReader();
let file = e.target.files[0];
console.log("UPLOAD IMAGE" , file);
this.setState({
  image:file
})
reader.onloadend = () => {
  this.setState({
    file: file,
    imagePreviewUrl: reader.result
  });
}

reader.readAsDataURL(file)
}
  render() {
    console.log("Render");
    let {imagePreviewUrl} = this.state;
 let $imagePreview = null;
 if (imagePreviewUrl) {
   $imagePreview = (<img style={{width:'100px',heigh:"100px"}}src={imagePreviewUrl} />);
 }
    return (

        <div className="content">
        <ReactTooltip type='info' effect='solid'/>
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        <LoadingOverlay
              active={this.state.isActive}
              spinner

              text='Loading User Details'
              >
          <Card style={{padding:'15px', marginLeft:'0px'}} className="row">
                  <h3 style={{padding:'1%', marginBottom:'0px'}}>Edit User</h3>
                  <h4 style={{margin:'10px', color:'green'}}><u>Edit User </u></h4>

          <div className="col-md-6 col-sm-6 col-lg-6">
                  <Form style={{padding:'1%'}}>
                   <FormGroup row>
                     <Label  data-tip="Mandatory Field" sm={4}>Name <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                          <Input onChange={this.onChangeName} value={this.state.name} placeholder="Enter Name" />
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
                     <Label  data-tip="Mandatory Field" sm={4}>Email <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                          <Input className='is-invalid' type='email'onChange={this.onChangeEmail} value={this.state.email} placeholder="Enter Email"  invalid/>
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label  ata-tip="Mandatory Field" sm={4}>Password <span style={{color:'red' , fontSize:'15px'}}>*</span> </Label>
                     <Col sm={8}>
                        <Input  disabled type='password' onChange={this.onChangePassword}  value={this.state.password} placeholder="Enter Password" />
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label data-tip="Mandatory Field" sm={4}>Retype password <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                        <Input disabled type='password'  onChange={this.onChangeRetypepassword}  value={this.state.retypePassword} placeholder="Retype Password" invalid />
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label data-tip="Mandatory Field" sm={4}>Assign Role <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                     <Input type="select" name="select" id="exampleSelect" onClick={this.onClickCustomer}  onChange={this.onChangeRole}>
                      <option disabled selected hidden>{this.state.onChangeRole}</option>
                      <option value='admin'>Admin</option>
                          <option value='financeManager'>Financial Manager</option>
                              <option value='deliveryManager'>Delivery Manager</option>
                                  <option value='collectionManager'>Collection Manager</option>


                     </Input>                     </Col>
                   </FormGroup>

                   <FormGroup style={{marginTop:'10%'}}check row>
                     <Col sm={{ size: 10, offset: 10 }}>
                       <Button onClick={this.onClickSave}color="info" disabled={this.state.disableAlert}>
                       {
                       (this.state.disableAlert) ?
                       <span><i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>            </span>
                       :  <span style={{display:'flex' , justifyContent:'center'}}><span>Update User</span></span>
                       }
                       </Button>
                     </Col>
                   </FormGroup>
                 </Form>
           </div>
        </Card>
        </LoadingOverlay>
        </div>

    );
  }
}

export default EditUser;
