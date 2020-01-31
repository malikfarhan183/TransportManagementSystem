import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import LoadingOverlay from 'react-loading-overlay';
import 'react-table/react-table.css'
// import ReactTable from "react-table";
import ReactTooltip from 'react-tooltip'
import DatePicker from "react-datepicker";


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
// var regularExpression=''
// var var1=''
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


class EditMRPAndTaxations extends React.Component {

  constructor(props) {

    super(props);
      console.log("this.props.match.params.id ::", new Date(this.props.match.params.id));

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
  from:'',

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
        time=2
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
      this.message="Something Went Wrong .."
      this.notify("tc",false);
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
    getSingleTaxApiCall=e=>{

      this.setState({
        isActive:true,
      })
      var data={
            to:new Date(this.props.match.params.id),
            from:this.state.dateFromDealer
      }
      var options = { method: 'POST',
          url: global.baseUrl + '/api/viewAllTaxes',
          headers: {'Authorization': localStorage.getItem("token") },
         body:data,
          json: true
        };
    console.log("options of EDIT MRP AND TAXATION", options);
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
            console.log("response ::of EDIT MRP AND TAXATION", response);   
    this.setState({
      isActive:false
    })
    this.setState({
        disableSelectField:false
    })
    // if(this.responseToSend===[])
    // {
    //   this.setState({
    //     noDataFound:"Record Not Found"
    //   })
    // }
   console.log("BEFORE MAPPING IN LIST OF ALL USER***** ", response.body.result);

   if(!response.body.success){
     this.message= 'NO MRP And Taxation FOUND';
      this.notify("tc",false);   }
   else{
     // var dateParams=this.props.match.params.id
     // let i=response.body.result.dateParam
     // $imagePreview=response.body.result.nicScan
               response.body.result.map((i,data)=>{
                 console.log("in map" , i);
                 this.setState({
                   mrp:(i.mrp),
                   gst:(i.gst),
                   filterAdvTax:(i.fat),
                   nonFilterAdvTax:(i.nfat),
                   otherTax1:(i.ot1),
                   otherTax2:(i.ot2),
         })
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
console.log("new Date(this.props.match.params.id)" , new Date(this.props.match.params.id));
  this.setState({
    isActive:true,
    dateFromDealer:new Date(this.props.match.params.id),
    dateToDealer:new Date(this.props.match.params.id)
  })
  // this.getAllUsersApiCall();
  setTimeout(()=>{
    this.getSingleTaxApiCall();

  },1000)
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
    this.message="Something Went Wrong .."
    this.notify("tc",false);
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
  this.setState({
    name:e.target.value
  })
  }
  onClickSave=e=>{
    this.setState({
        disableBtn:true
    })
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
        if(this.state.fromDate=== ''){
          this.message='Date(From) is Required'
           this.notify("tc",false);
           this.setState({
               disableBtn:false
           })   
        }
        else if (this.state.toDate==='') {
          this.message='Date(To) is Required'
           this.notify("tc",false); 
           this.setState({
               disableBtn:false
           })   
        }
        else if (this.state.mrp==='') {
          this.message='MRP Required'
           this.notify("tc",false); 
           this.setState({
               disableBtn:false
           })   
        }
        else if (this.state.gst==='') {
          this.message='GST Required '
           this.notify("tc",false); 
           this.setState({
               disableBtn:false
           })   
        }
        else if (this.state.filterAdvTax==='') {
          this.message='Filter Advance Tax Required'
           this.notify("tc",false); 
           this.setState({
               disableBtn:false
           })   
        }
        else if (this.state.nonFilterAdvTax==='') {
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
        console.log("options of update Tax Info ", options);
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
                console.log("**Respone in Update Tax Info", response);
        this.setState({
            disableBtn:false
        })   
        this.message=response.body.message
         this.notify("tc",true); 
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
                setTimeout(()=>{
                  this.props.history.push("/home/MRPAndTaxations")
                },2000)

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
        // setTimeout(()=>{
        //   window.location.href='/home/MRPAndTaxations'
        // },2000)
            })
        }
      }
    console.log("email" , this.state.email);


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
onChangeInput=e=>{
  this.setState({
    [e.target.name]:e.target.value
  })
}
  render() {
    console.log("Render");
    let {imagePreviewUrl} = this.state;
 let $imagePreview = null;
 if (imagePreviewUrl) {
   $imagePreview = (<img alt='' style={{width:'100px',heigh:"100px"}}src={imagePreviewUrl} />);
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

              text='Loading MRP And Taxation'
              >
          <Card style={{padding:'15px' , marginLeft:'1px'}} className="row">
                  <h3 style={{padding:'1%', marginBottom:'0px'}}>Edit MRP AND TAXATIONS</h3>
                  <h4 style={{margin:'10px', color:'green'}}><u>Edit MRP AND TAXS </u></h4>

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
        <div className="col-md-6 col-sm-6 col-lg-6">
                <Form >
                 <FormGroup row>
                   <Label  data-tip="Mandatory Field" sm={4}>MRP  <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                   <Col sm={8}>
                        <Input type='number'onChange={this.onChangeInput} value={this.state.mrp}name='mrp'  placeholder="Enter MRP" />
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
                   <Label data-tip="Mandatory Field" sm={4}>GST  <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                   <Col sm={8}>
                        <Input type='number'onChange={this.onChangeInput} value={this.state.gst} name='gst' placeholder="Enter GST"  invalid/>
                   </Col>
                 </FormGroup>
                 <FormGroup row>
                   <Label data-tip="Mandatory Field" sm={4}>FILER ADV TAX <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                   <Col sm={8}>
                      <Input   type='number'onChange={this.onChangeInput} value={this.state.filterAdvTax} name='filterAdvTax' placeholder="Enter FILER ADV TAX" />
                   </Col>
                 </FormGroup>
                 <FormGroup row>
                   <Label data-tip="Mandatory Field" sm={4}>NON FILER ADV TAX  <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                   <Col sm={8}>
                        <Input type='number'onChange={this.onChangeInput} value={this.state.nonFilterAdvTax} name='nonFilterAdvTax' placeholder="Enter NON FILER ADV TAX"  invalid/>
                   </Col>
                 </FormGroup>
                 <FormGroup row>
                   <Label  sm={4}>OTHER TAX 1</Label>
                   <Col sm={8}>
                        <Input type='number'onChange={this.onChangeInput} name='otherTax1' value={this.state.otherTax1} placeholder="Enter OTHER TAX 1"  invalid/>
                   </Col>
                 </FormGroup>
                 <FormGroup row>
                   <Label sm={4}>OTHER TAX 2</Label>
                   <Col sm={8}>
                        <Input type='number'onChange={this.onChangeInput} value={this.state.otherTax2} name='otherTax2' placeholder="Enter OTHER TAX 2"  invalid/>
                   </Col>
                 </FormGroup>
                 <FormGroup style={{marginTop:'10%'}}check row>
                   <Col sm={{ size: 10, offset: 10 }}>
                     <Button onClick={this.onClickSave}color="info" disabled={this.state.disableBtn}>
                     {
                     (this.state.disableBtn) ?
                     <span><i className="fa fa-spinner fa-spin fa-1x fa-fw"></i></span>
                     :  <span style={{display:'flex' , justifyContent:'center'}}><span>Update</span></span>
                     }

                     </Button>
                   </Col>
                 </FormGroup>
               </Form>
         </div>
                                </Form>
        </Card>
        </LoadingOverlay>
        </div>

    );
  }
}
export default EditMRPAndTaxations;
