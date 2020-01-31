import React from "react";
import ReactTooltip from 'react-tooltip'

// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import LoadingOverlay from 'react-loading-overlay';
import 'react-table/react-table.css'
import ReactTable from "react-table";
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
let urlPrams='';
let listOfUserRow='';
let listOfUserArray=[];
// var listOfOptionUser=[]
// var valueOfAllUser=''
// var selectedUser=[]
// var creditOfEachUser=[]
var typeOfUserLogin=localStorage.getItem("user_type")

// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class UserManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      disableAlert:false,
      disableBtn:false,
  dealerCode:'',
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
      this.setState({
        isActive:true
      })
      listOfUserArray=[]
      var data={
        type:JSON.stringify(["admin","financeManager","deliveryManager" , "collectionManager"])
      }
      var options = { method: 'POST',
          url: global.baseUrl + '/api/getAllUsersAdmin',
          headers: {'Authorization': localStorage.getItem("token") },
         body:data,
          json: true
        };
    console.log("**options of Get ALL User Admin ", options);
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
            console.log("**Respone in Get ALL User Admin", response);   
    this.setState({
        disableSelectField:false,
        isActive:false

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
      let type=''
      if(i.type==='admin'){
        type= 'Admin'
      }
      if (i.type==='deliveryManager') {
        type="Delivery Manager"
      }
      if (i.type==="financeManager") {
        type="Financial Manager"
      }
      if (i.type==='collectionManager') {
        type="Collection Manager"
      }

      if(i.isDeleted!==true)
      {
         listOfUserRow =
          {
          id:(i._id),
          name:(i.name),
          email:(i.email),
          type:(type),
          // credit:(i.credit),
          // date:(date[0]),
          // address:(i.address)
                };

           return  listOfUserArray.push(listOfUserRow);
         }
    })
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
  this.getAllUsersApiCall();

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
  onClickAddUserCustomer=e=>{

        var data = {
           name:this.state.customerName,
           // email:,
           // password:,
           mobile:this.state.changeContactNoOfCustomer,
           // username:,
           type:'customer',
           address:this.state.adress,
           // country:,
           // city:,
           // state:
           alternateContact:this.state.changeAlternateContactNoOfCustomer,
           buisnessName:this.state.BusinessName,
           // address:this.state.adressOfCustomer
        }

        var options = { method: 'POST',
            url: global.baseUrl + '/api/createUser',
            headers: {'Authorization': localStorage.getItem("token") },
           body:data,
            json: true
          };
      console.log("options of Create New CUSTOMER", options);
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
              console.log("Respone in Create New Customer", response);   
      this.message= 'Customer Created Successfully'
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
  onClickAddDealer=e=>{

    var data = {
       name:this.state.dealerName,

       mobile:this.state.changeContactNo,

        type:'dealer',
       address:this.state.adress,

       alternateContact:this.state.changeAlternateContactNo,
       buisnessName:this.state.BusinessName ,
       // address:this.state.adress
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
        disableBtn:true
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
          disableBtn:false
      })
   }
   else {
     if(var1){
       console.log('if');
       if(this.state.password === this.state.retypePassword){
         var data={
           name:this.state.name,
           email:this.state.email,
           password:this.state.password,
           type:this.state.onChangeRole
         }

         if(this.state.name=== ''){
           this.message='Name is Required'
            this.notify("tc",false);
            this.setState({
                disableBtn:false
            })   
         }
         else if (this.state.email==='') {
           this.message='Email is Required'
            this.notify("tc",false); 
            this.setState({
                disableBtn:false
            })   
         }
         else if (this.state.password==='') {
           this.message='Password Required'
            this.notify("tc",false); 
            this.setState({
                disableBtn:false
            })   
         }
         else if (this.state.onChangeRole==='') {
           this.message='Please Select Role '
            this.notify("tc",false); 
            this.setState({
                disableBtn:false
            })   
         }
         else{
           var options = { method: 'POST',
               url: global.baseUrl + '/api/createUser',
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
                 console.log("Respone in createUser", response);
         this.setState({
             disableBtn:false
         })   
         this.message='User Created Successfully'
          this.notify("tc",true); 
          if(response.statusCode===200)
          {
            setTimeout(()=>{
              this.props.history.push('/home/usermanagement');
            },3000)
          }
                    this.setState({
                   dealerCode:'',
                   name:'',
                   email:'',
                   password:'',
                   onChangeRole:'',
                   retypePassword:'',
                 })
                 this.getAllUsersApiCall();
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
       else{
         this.message= 'Password Did Not Match';
          this.notify("tc",false);
          this.setState({
              disableBtn:false
          })   
       }

     }
     else{
       console.log("else");
       this.message='Please Enter Valid Email as (name@email.com)'
        this.notify("tc",false); 
        this.setState({
            disableBtn:false
        })  
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
deleteCashInHandToBankApiCall=e=>{
  // e.preventDefault();
  console.log("SAved CLICKED" , this.index);
  // var user_id=localStorage.getItem("user_id")
   var data={
    isDeleted:true,
       user_id:this.index,
  }
    var options = { method: 'POST',
        url: global.baseUrl + '/api/updateUser',
        headers: {'Authorization': localStorage.getItem("token") },
       body:data,
        json: true
      };
  console.log("options of Delete USER in Customer Management", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error Of Delete USER in customer Management", error);
}
        else
        {
          console.log("**Respone in Delete USER in Customer Management", response); 
  this.getAllUsersApiCall();
  this.setState({
      disableAlert:false
  })
  if(response.statusCode===200){
  this.message='Customer Deleted Successfully'
      this.notify("tc",true);
      console.log("this.index" , this.index , "user_id" ,localStorage.getItem('user_id'));
        if(this.index===localStorage.getItem('user_id')){
          console.log("in iffffffffffffffffffffff");
          localStorage.clear();
          sessionStorage.clear();
          setTimeout(function(){
            window.location.href='/login'
          }, 1000);
        }
    }
      else{
        this.message=response.body.message
          this.notify("tc",false)
      }
        }
      })



}
getTdPropsFunc=(state, rowInfo, column, instance) => {

            return {

              onClick: (e, handleOriginal) => {
  if(rowInfo!==undefined){
    //                 console.log("It was in this row:", rowInfo.original.id);
                    console.log("It was in this row:", rowInfo.original);
                    this.index= rowInfo.original.id;
                    // this.type=rowInfo.original.type;
}


              }

            };
          }
onClickDelete=e=>{
  this.setState({
    disableAlert:true
  })
  console.log("Delete button clicked");
  setTimeout(()=>{
    this.deleteCashInHandToBankApiCall();
  },1000)

}
onClickEdit=e=>{
  this.setState({
    disableAlert:true
  })
  console.log("Edit button clicked");

      setTimeout(() => {
        console.log("Detail button  clicked" , this.index );
        urlPrams= '/home/edituser/' + this.index;
         this.props.history.push(urlPrams);
         console.log("URL PARAMS" , urlPrams);
         // EventBus.publish("apiCall",this.responseToSend)
  }, 1000);
}
  render() {
    console.log("Render");
    let {imagePreviewUrl} = this.state;
 let $imagePreview = null;
 if (imagePreviewUrl) {
   $imagePreview = (<img alt='' style={{width:'100px',heigh:"100px"}}src={imagePreviewUrl} />);
 }
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
     Header:'Name',
     accessor:'name',
     style:{
      textAlign:'center',
       paddingTop:'23px'
     },
   },
   {
     Header:'Email',
     accessor:'email',
     style:{
      textAlign:'center',
       paddingTop:'23px'
     },
   },
   {
     Header:'Role',
     accessor:'type',
     style:{
 textAlign:'center',
       paddingTop:'23px'
     },
   },
   {
     Header:'ACTION',
     id:'action',
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
     Cell: props => <span style={{display:'flex'}}>
     {console.log("Typeeeeee" , typeOfUserLogin)}
     {
      (typeOfUserLogin==='admin' || typeOfUserLogin==='super')?
      <span><Button onClick={this.onClickEdit}
      disabled={this.state.disableAlert}

       style={{marginTop:"13px" ,height:"26px",background:'#02a5de',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
        Edit </Button>
     <Button onClick={this.onClickDelete}
     disabled={this.state.disableAlert}

      style={{marginTop:"13px" ,height:"26px",background:'red',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
       Delete  </Button>
       </span>
       :
       <span><Button disabled onClick={this.onClickEdit}
        style={{marginTop:"13px" ,height:"26px",background:'#02a5de',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
         Edit </Button>
      <Button disabled onClick={this.onClickDelete}
       style={{marginTop:"13px" ,height:"26px",background:'red',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
        Delete  </Button>
        </span>

     }



     </span>
   },
 ]
    return (

        <div className="content scrollerclass">
        <ReactTooltip type='info' effect='solid'/>

        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
          <Card style={{padding:'15px', marginLeft:'0px'}} className="row">
                  <h3 style={{padding:'1%', marginBottom:'0px'}}>User Management</h3>
                  <h4 style={{margin:'10px', color:'green'}}><u>Add New User And Manage User Role</u></h4>

          <div className="col-md-6 col-sm-6 col-lg-6">
                  <Form style={{padding:'1%'}}>
                   <FormGroup row>
                     <Label  data-tip="Mandatory Field" sm={4}>Name  <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                          <Input onChange={this.onChangeName} value={this.state.name} placeholder="Enter Name" />
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label data-tip="Mandatory Field" sm={4}>Email  <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                          <Input className='is-invalid' type='email'onChange={this.onChangeEmail} value={this.state.email} placeholder="Enter Email"  invalid/>
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label data-tip="Mandatory Field" sm={4}>Password  <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                        <Input   type='password' onChange={this.onChangePassword}  value={this.state.password} placeholder="Enter Password" />
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label data-tip="Mandatory Field" sm={4}>Retype password  <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                        <Input  type='password'  onChange={this.onChangeRetypepassword}  value={this.state.retypePassword} placeholder="Retype Password" invalid />
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label data-tip="Mandatory Field" sm={4}>Assign Role  <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                     <Input type="select" name="select" id="exampleSelect" onClick={this.onClickCustomer}  onChange={this.onChangeRole}>
                      <option disabled selected hidden>Select Role</option>
                      <option value='admin'>Admin</option>
                          <option value='financeManager'>Financial Manager</option>
                              <option value='deliveryManager'>Delivery Manager</option>
                                  <option value='collectionManager'>Collection Manager</option>


                     </Input>                     </Col>
                   </FormGroup>

                   <FormGroup style={{marginTop:'10%'}}check row>
                     <Col sm={{ size: 10, offset: 10 }}>
                       <Button onClick={this.onClickSave}color="info" disabled={this.state.disableBtn}>
                       {
                       (this.state.disableBtn) ?
                       <span><i className="fa fa-spinner fa-spin fa-1x fa-fw"></i></span>
                       :  <span style={{display:'flex' , justifyContent:'center'}}><span>Create User</span></span>
                       }

                       </Button>
                     </Col>
                   </FormGroup>
                 </Form>
           </div>
        </Card>
        <LoadingOverlay
              active={this.state.isActive}
              spinner

              text='Loading All Users'
              >
              <Card style={{padding:'15px' }}>
              <div className="react-notification-alert-container">
                <NotificationAlert ref="notificationAlert" />
              </div>
            <h3 style={{padding:'1%', marginBottom:'0px'}}>LIST OF ALL USERS</h3>
            <h4 style={{marginLeft:'10px', color:'green',paddingTop:'-10px'}}><u>View All Users' Detail</u></h4>
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
                            defaultPageSize={5}
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

export default UserManagement;
