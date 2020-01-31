import React from "react";
import ReactTooltip from 'react-tooltip'
import LoadingOverlay from 'react-loading-overlay';
import 'react-table/react-table.css'
import ReactTable from "react-table";
// import EventBus from 'eventing-bus';

// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import ReactPhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/dist/style.css'
// import 'react-phone-number-input/style.css'
// import PhoneInput from 'react-phone-number-input'
import "./Style.css"

import {
   Form,
   FormGroup,
   Label,
   Card,
   // CardBody,
   // Table,
   Row,
   Col,
   // Nav,
   Button,
   Input,
   // FormFeedback
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
import axios, { post } from 'axios'

var request = require("request");
// const url = global.baseUrl
let urlPrams='';
let listOfUserRow='';
let listOfUserArray=[];
var colorOfButton=''
// var listOfOptionUser=[]
// var valueOfAllUser=''
// var selectedUser=[]
// var creditOfEachUser=[]


// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class CustomerManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteBtn:'',
      disableAddBtn:false,
      ntnStatusDealer:'',
      ntnStatusEndUser:'',
      strn:'',
      disableAlert:false,
      strnCustomer:'',

      openningBalanceDealer:0,
      openningBalance:0,
      co: '',
  dealerCode:'',
  ntn:'',
  adressOfCustomer:'',
  nicNumber:'',
  ntnCustomer:'',
  nicNumberCustomer:'',
  changeContactNoOfCustomer:'',
  changeAlternateContactNoOfCustomer:'',
  customerName:'',
  dealerChecked:true,
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
  image:''

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
        time=3
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
      listOfUserArray=[]
      this.setState({
        isActive:true
      })
      var data={
        type:JSON.stringify(["dealer","end user"])
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
      this.setState({
          disableAlert:false
      })

            console.log("Error", error);
          }
          else
          {
            console.log("**Respone in Get ALL User Admin", response); 
    if(response.body.success)  {
      this.setState({
        isActive:false
      })
    }
    this.setState({
        disableSelectField:false,

    })
    if(this.responseToSend===[])
    {
      this.setState({
        noDataFound:"Record Not Found"
      })
    }

   console.log("BEFORE MAPPING IN LIST OF ALL USER***** ", response.body.result);

    this.response=response.body.result.map((i,data)=>{
     var creditValue=''
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
      // let date=i.date.split('T');
      // let time=moment(i.date).format('LT');
      if (i.buisnessName === '') {
        i.buisnessName = '-'
      }
      var deleteBtn=''
      if(i.isDeleted===true)
      {
        console.log("i.name (true)::" , i.isDeleted);
        deleteBtn='Reactivate'
        this.setState({
          deleteBtn:'ReActive'
        })
      }
      else{
        console.log("i.name (False) ::" , i.isDeleted);
        deleteBtn='Deactivate'
        this.setState({
          deleteBtn:'Deactivate'
        })
      }
        listOfUserRow =
          {
          id:(i._id),
          name:(i.name),
          buisnessName:(i.buisnessName),
          contactNo:(i.mobile),
          type:(i.type),
          credit:(creditValue),
          // date:(date[0]),
          address:(i.address),
          deleteBtn:deleteBtn
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
  console.log("Did Mount Of Customer Managemnet" , this.props.match.params.id);
  this.index=''
  this.getAllUsersApiCall();

  console.log("Did of User Management" ,this.props.match.params.id);
  if(this.props.match.params.id==='dealer')
  {
    this.setState({
      formToLoad:'dealer',
      dealerChecked:true,
        customerChecked:false,
    })
  }
  if(this.props.match.params.id==='endUser'){
    this.setState({
            formToLoad:'endUser',
            customerChecked:true,
              dealerChecked:false
    })
  }
  // this.setState({
  //   formToLoad:this.props.match.params.id
  // })
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

      let val = e.target.value.replace(/[^A-z\s]/g, '');


    console.log("payee now", val);
  this.setState({
    dealerName:val
  })
  }
  onCustomerName=e=>{
      let val = e.target.value.replace(/[^A-z\s]/g, '');
    console.log("payee",val);
  this.setState({
    customerName:val
  })
  }
  onDealerType=e=>{
    console.log("type",e.target.value);
  this.setState({
    dealerType:e.target.value
  })

  }

  onChangeContactNo=e=>{
    console.log("Contact No",e);
    let digitSecound =(e.target.value).split('').slice(0,2)
    let now=digitSecound.toString()
    if(now==="0,3" || now==='' || now==='0' ){
      this.setState({
        errorStateForDealerContactNo:""
      })
    }else{
      this.setState({
        errorStateForDealerContactNo:"Wrong Format"
      })
    }
    const re = /^[0-9\b]+$/;
    console.log("onChangeContactNo" , re.test(e.target.value));
        if (e.target.value === '' || re.test(e.target.value)) {
  this.setState({
    changeContactNo:e.target.value
  })
}
  }

  onChangeAlternateContactNo=e=>{
    console.log("payee",e);
    let digitSecound =(e.target.value).split('').slice(0,2)
    let now=digitSecound.toString()
    if(now==="0,3" || now==='' || now==='0' ){
      this.setState({
        errorStateForDealerAlternateContactNo:""
      })
    }else{
      this.setState({
        errorStateForDealerAlternateContactNo:"Wrong Format"
      })
    }
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
    this.setState({
        disableAddBtn:true
    })
    if(this.state.ntnCustomer!== ''){
      var data = {
        strn:this.state.strnCustomer,
        ntnStatus:this.state.ntnStatusEndUser,
        credit:this.state.openningBalance,
         name:this.state.customerName,
         // email:,
         // password:,
         mobile:this.state.changeContactNoOfCustomer,
         // username:,
         type:'end user',
         // address:this.state.adress,
         // country:,
         // city:,
         // state:
         alternateContact:this.state.changeAlternateContactNoOfCustomer,
         buisnessName:this.state.BusinessName,
         address:this.state.adressOfCustomer,
         nic:this.state.nicNumberCustomer,
         ntn:this.state.ntnCustomer,
         careOf:this.state.co,

      }
    }
    else{
      var data = {
        strn:this.state.strnCustomer,
        ntnStatus:'',
        credit:this.state.openningBalance,
         name:this.state.customerName,
         // email:,
         // password:,
         mobile:this.state.changeContactNoOfCustomer,
         // username:,
         type:'end user',
         // address:this.state.adress,
         // country:,
         // city:,
         // state:
         alternateContact:this.state.changeAlternateContactNoOfCustomer,
         buisnessName:this.state.BusinessName,
         address:this.state.adressOfCustomer,
         nic:this.state.nicNumberCustomer,
         ntn:this.state.ntnCustomer,
         careOf:this.state.co,

      }
    }
        if (data.name === "")
        {
          this.message= 'End User Name is Required';
           this.notify("tc",false); 
           this.setState({
               disableAddBtn:false
           })

        }
        else if (data.nic !== "")
        {
          if (data.nic.length < 13)
          {
            this.message= 'Please Enter 13 Digit Nic Number';
             this.notify("tc",false); 
             this.setState({
                 disableAddBtn:false
             })
          }
        }

        else if (data.ntn!== '' && data.ntnStatus==='')
        {
          if(data.ntnStatus===''){
            this.message= 'Please Select Ntn Status';
            this.notify("tc",false); 
            this.setState({
               disableAddBtn:false
            })
          }

        }
        else if (data.careOf === "")
        {
          this.message= 'Care Of  Required';
           this.notify("tc",false); 
           this.setState({
               disableAddBtn:false
           })
        }

        else if (data.mobile === "" || data.mobile === '+92')
        {
          this.message= 'Contact No is Required';
           this.notify("tc",false); 
           this.setState({
               disableAddBtn:false
           })
        }
        else if (this.state.errorState!=='')
            {
              console.log("Please Enter Correct Format Of Contact No (03**-*******)");
              this.message= 'Please Enter Correct Format Of Contact No (03**-*******)';
               this.notify("tc",false); 
               this.setState({
                   disableAlert:false,
                      disableAddBtn:false
               })
            }
        else if (data.mobile.length < 11)
            {
              console.log("Please Enter Correct Phone Number");
              this.message= 'Please Enter Correct Contact Number';
               this.notify("tc",false); 
               this.setState({
                   disableAddBtn:false
               })
            }
            else if (data.alternateContact !== '' && this.state.errorStateForAlternateContactNo!=='')
                {
                  console.log("Please Enter Correct Format Of Alternate Contact No (03**-*******)");
                  this.message= 'Please Enter Correct Format Of Alternate Contact No (03**-*******)';
                   this.notify("tc",false); 
                   this.setState({
                       disableAlert:false,
                          disableAddBtn:false
                   })
                }
            else if(data.alternateContact !== '' && data.alternateContact.length < 11 ){
              console.log("data.alternateContact" , data.alternateContact);


                    console.log("Please Enter Correct Phone Number");
                    this.message= 'Please Enter Correct Alternate Contact Number';
                     this.notify("tc",false); 
                     this.setState({
                         disableAddBtn:false
                     })

            }
                else if (data.address === "")
        {
          this.message= 'Address Required ';
           this.notify("tc",false); 
           this.setState({
               disableAddBtn:false
           })
        }
       else
        {
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
         this.setState({
             disableAddBtn:false
         })

              }
              else
              {
                console.log("Respone in Create New Customer", response);
        if(response.body.success){
          this.setState({
              disableAddBtn:false
          })   
          this.message= 'End User Created Successfully'
           this.notify("tc",true); 
           this.setState({
             dealerCode:'',
             adressOfCustomer:'',
             changeContactNoOfCustomer:'',
             changeAlternateContactNoOfCustomer:'',
             customerName:'',
             dealerChecked:false,
             customerChecked:true,
             BusinessName:'',
             dealerName:'',
             dealerType:'',
             instrumentNo:'',
             changeContactNo:'',
             changeAlternateContactNo:'',
             adress:'',
             from:'',
             co:'',
             ntnCustomer:'',
             nicNumberCustomer:'',
             strnCustomer:''

           })
           setTimeout(()=>{
             this.message= 'Please Go To Add Delivery Section To Place Order'
             this.notify("br",true);
           },4000)
           setTimeout(()=>{
             window.location.reload();
           },6000)
           if(response.statusCode===200)
           {
             console.log("NOW Upload Call Implement");

             this.uploadImgAPiCall(response.body.result._id);
           }

        }
        else{
          this.message= response.body.message;
           this.notify("tc",false); 
           this.setState({
               disableAddBtn:false
           })

        }

              }
            })
        }

  }
  onClickAddDealer=e=>{
    console.log("Dealer Clicked" , this.state.errorStateForDealerContactNo);
    this.setState({
        disableAlert:true,
        disableAddBtn:true
    })
    if(this.state.ntn !==''){
      var data = {
        strn:this.state.strn,
        ntnStatus:this.state.ntnStatusDealer,
        credit:this.state.openningBalanceDealer,
         name:this.state.dealerName,
         mobile:this.state.changeContactNo,
          type:'dealer',
         address:this.state.adress,
         alternateContact:this.state.changeAlternateContactNo,
         buisnessName:this.state.BusinessName ,
         // address:this.state.adress,
         nic:this.state.nicNumber,
         ntn:this.state.ntn
      }
    }
    else {
      var data = {
        strn:this.state.strn,
        ntnStatus:'',
        credit:this.state.openningBalanceDealer,
         name:this.state.dealerName,
         mobile:this.state.changeContactNo,
          type:'dealer',
         address:this.state.adress,
         alternateContact:this.state.changeAlternateContactNo,
         buisnessName:this.state.BusinessName ,
         // address:this.state.adress,
         nic:this.state.nicNumber,
         ntn:this.state.ntn
      }
    }


    if (data.name === "")
    {
      console.log("Dealer Name is Required");
      this.message= 'Dealer Name is Required';
       this.notify("tc",false); 
       this.setState({
           disableAlert:false,
              disableAddBtn:false
       })
    }
    else if (data.buisnessName === "")
        {
          console.log("Buisness Name is Required");
          this.message= 'Buisness Name is Required ';
           this.notify("tc",false); 
           this.setState({
               disableAlert:false,
                  disableAddBtn:false
           })
        }
    //     else if (data.nic!== "")
    // {
    //   if (data.nic.length < 13)
    //      {
    //         console.log("Please Enter 13 Digit Nic Number");
    //         this.message= 'Please Enter 13 Digit Nic Number';
    //          this.notify("tc",false); 
    //          this.setState({
    //              disableAlert:false,
    //                 disableAddBtn:false
    //          })
    //      }
    // }
else if (data.ntn!== '' && data.ntnStatus==='' )
{
  console.log("ntn ");
  if(data.ntnStatus===''){
    console.log("Please Select Ntn Status");
    this.message= 'Please Select Ntn Status';
    this.notify("tc",false); 
    this.setState({
       disableAlert:false,
          disableAddBtn:false
    })
  }

}else if (data.mobile === "" || data.mobile === '+92')
    {
      console.log("Contact No is Required");
      this.message= 'Contact No is Required';
       this.notify("tc",false); 
       this.setState({
           disableAlert:false,
              disableAddBtn:false
       })
    }
    else if (this.state.errorStateForDealerContactNo!=='')
        {
          console.log("Please Enter Correct Format Of Contact No (03**-*******)");
          this.message= 'Please Enter Correct Format Of Contact No (03**-*******)';
           this.notify("tc",false); 
           this.setState({
               disableAlert:false,
                  disableAddBtn:false
           })
        }

    else if (data.mobile.length < 11)
        {
          console.log("Please Enter Correct Phone Number");
          this.message= 'Please Enter Correct Contact Number';
           this.notify("tc",false); 
           this.setState({
               disableAlert:false,
                  disableAddBtn:false
           })
        }
        else if (data.alternateContact !== '' && this.state.errorStateForDealerAlternateContactNo!=='')
            {
              console.log("Please Enter Correct Format Of Alternate Contact No (03**-*******)");
              this.message= 'Please Enter Correct Format Of Alternate Contact No (03**-*******)';
               this.notify("tc",false); 
               this.setState({
                   disableAlert:false,
                      disableAddBtn:false
               })
            }
        else if(data.alternateContact !== ''&& data.alternateContact.length < 11 ){


                console.log("Please Enter Correct Phone Number");
                this.message= 'Please Enter Correct Alternate Contact Number';
                 this.notify("tc",false); 
                 this.setState({
                     disableAlert:false,
                        disableAddBtn:false
                 })

        }
   else if (data.address === "")
  {
    console.log("Business Address is Required");
    this.message= 'Business Address is Required';
     this.notify("tc",false);
     this.setState({
         disableAlert:false,
            disableAddBtn:false
     }) 
  }
 else
    {
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

      this.message="Something Went Wrong .."
     this.notify("tc",false); 

     this.setState({
         disableAlert:false,
         disableAddBtn:false
     })
          }
          else
          {
            console.log("**Respone in Create New Dealer", response);
    this.setState({
        disableAlert:false,
        disableAddBtn:false
    })   


    if(!response.body.success){
      this.message= response.body.message
       this.notify("tc",false);

    }
    else{
      this.message= 'Dealer Created Successfully'
       this.notify("tc",true); 
       this.setState({
         dealerCode:'',
         adressOfCustomer:'',
         changeContactNoOfCustomer:'',
         changeAlternateContactNoOfCustomer:'',
         customerName:'',
         dealerChecked:true,
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
   nicNumber:'',
         ntn: '',
         nicScan: '',

       })
       setTimeout(()=>{
         this.message= 'Please Go To Add Delivery Section To Place Order'
         this.notify("br",true);

       },4000)
       setTimeout(()=>{
         window.location.reload();
       },6000)
    }


                   if(response.statusCode===200)
                   {
                     console.log("NOW Upload Call Implement");

                     this.uploadImgAPiCall(response.body.result._id);
                   }
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
  onChangeContactNoOfCustomer=e=>{

    let digitSecound =(e.target.value).split('').slice(0,2)
    let now=digitSecound.toString()
    if(now==="0,3" || now==='' || now==='0' ){
      this.setState({
        errorState:""
      })
    }else{
      this.setState({
        errorState:"Wrong Format"
      })
    }
    console.log("payee  .............",e.target.value , "2nd" , digitSecound ,"3rd", now);
    const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
  this.setState({
    changeContactNoOfCustomer:e.target.value
  })
}
  }
  onChangeAlternateContactNoOfCustomer=e=>{

    let digitSecound =(e.target.value).split('').slice(0,2)
    let now=digitSecound.toString()
    if(now==="0,3" || now==='' || now==='0' ){
      this.setState({
        errorStateForAlternateContactNo:""
      })
    }else{
      this.setState({
        errorStateForAlternateContactNo:"Wrong Format"
      })
    }
    console.log("payee",e);
    const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
  this.setState({
    changeAlternateContactNoOfCustomer:e.target.value
  })
}
  }
  onChangeAddressOfCustomer=e=>{
    console.log("payee",e.target.value);
  this.setState({
    adressOfCustomer:e.target.value
  })
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
uploadImgAPiCall=e=>{
  console.log("IMG::" , e);
  this.fileUpload(this.state.image , e).then((response)=>{
      console.log("response file of Uplaod IMG :: ", response);
      if(response.status !== 200)
      {
        this.message="You are uploading Corrupt Image"
             this.notify("tc",false);
      }
      })
}
fileUpload(file ,id)   {
  console.log("id" ,this.idOfNewCreatedPromo);
console.log("file :::: ", file);     // const url = 'https://httpbin.org/post';
const formData = new FormData();
formData.append('userFile',file)
const config = {
  headers: {'content-type': 'multipart/form-data',
             'Authorization': localStorage.getItem("token")
            },
 }
console.log("FormData means options", formData);
console.log("url",global.baseUrl+'/uploadNICScan/'+ id  , formData,config);
  return  post(global.baseUrl+'/uploadNICScan/'+ id , formData,config)
}
onChangeNicNumber=e=>{
  const re = /^[0-9\b]+$/;
  console.log("onChangeNicNumber" ,re.test(e.target.value));
      if (e.target.value === '' || re.test(e.target.value)) {
        this.setState({
          nicNumber:e.target.value
        })
      }

}
onChangeNtn=e=>{
  if(e.target.value===''){
    this.setState({
      ntnStatusDealer:e.target.value
    })
  }
  this.setState({
    ntn:e.target.value
  })
}
onChangeSTRN=e=>{
  this.setState({
    strn:e.target.value
  })
}

onChangeNicNumberCustomer=e=>{
  const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        this.setState({
          nicNumberCustomer:e.target.value
        })
      }

}
onChangeNtnCustomer=e=>{
  if(e.target.value===''){
    this.setState({
      onClickNtnStatus:e.target.value
    })
  }
  this.setState({
    ntnCustomer:e.target.value
  })
}
onChangeSTRNCustomer=e=>{
  this.setState({
    strnCustomer:e.target.value
  })
}

onChangeOpenningBalanceDealer=e=>{
  this.setState({
    openningBalanceDealer:e.target.value
  })
}
onChangeOpenningBalance=e=>{
  this.setState({
    openningBalance:e.target.value
  })
}
onChangeCO=e=>{
  console.log("Care off  Changing");
  this.setState({
     co:e.target.value
  })
}
onClickEdit=e=>{
  this.setState({
   disableAlert:true
  })
  console.log("Edit button clicked");

      setTimeout(() => {
        console.log("Detail button  clicked" , this.index );
        urlPrams= '/home/EditCustomer/' + this.index;
         this.props.history.push(urlPrams);
         console.log("URL PARAMS" , urlPrams);
         // EventBus.publish("apiCall",this.responseToSend)
  }, 1000);
}
onClickDelete=e=>{
  this.setState({
      disableAlert:true
  })
  console.log("Delete button clicked" , e.target.name);
  var name=e.target.name
  setTimeout(()=>{
    this.deleteCashInHandToBankApiCall(name);
  },1000)

}
deleteCashInHandToBankApiCall=e=>{
  console.log("Order Id " , e);
var isDeletedCheck=''
if(e==="Deactivate")
{
  isDeletedCheck=true
}
else{
  isDeletedCheck=false
}
  // e.preventDefault();
  console.log("SAved CLICKED");
  // var user_id=localStorage.getItem("user_id")
  var data={
       isDeleted:isDeletedCheck,
    // date:this.state.date,
       user_id:this.index,
       // deliveryType:this.state.deliveryType,
       // user_id:user_id,
       // order_id:this.index,
      //  deliveryItemType:this.state.bagsOrBulk,
      //  quantity:parseInt(this.state.amountOfBags),
      //  biltyNumber:parseInt(this.state.biltyNo),
      //  truckNumber:this.state.truckId,
      // rate:this.state.rate,
      //  totalAmount:this.state.orderPrice,
      //  address:this.state.location
  }


    var options = { method: 'POST',
        url: global.baseUrl + '/api/updateUser',
        headers: {'Authorization': localStorage.getItem("token") },
       body:data,
        json: true
      };
  console.log("options of Delete USER in Customer Management", options);
  this.setState({
   disableAlert:false
  })
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error Of Delete USER in customer Management", error);
}
        else
        {
          console.log("Respone in Delete USER in Customer Management", response); 
  this.getAllUsersApiCall();
  setTimeout(()=>{
    this.setState({
        disableAlert:false
    })

  },1000)


        this.message=response.body.message
          this.notify("tc",true)

         // if(body.success){
         //   console.log("success :: ", body)
         // }
         // else {
         //   console.log("success false :: ", body);
         // }
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
                    this.type=rowInfo.original.type;
  }



              }

            };
          }

onChangeNtnStatus=e=>{
  console.log("onChangeNtnStatus" , e.target.value);
  this.setState({
    ntnStatusEndUser:e.target.value

  })
}
onChangeNtnStatusDealer=e=>{
  console.log("ntnStatusDealer" , e.target.value);
  this.setState({
    ntnStatusDealer:e.target.value

  })
}
onkeypressInput=e=>{
  console.log("gggggggggggggggggggggggggggggggggggggggggggggggggggggggggg");
}

  render() {
    console.log("Render");
    let {imagePreviewUrl} = this.state;
 let $imagePreview = null;
 if (imagePreviewUrl) {
   $imagePreview = (<img alt=''style={{width:'100px',heigh:"100px"}} src={imagePreviewUrl} />);
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
     Header:'Business Name',
     accessor:'buisnessName',
     style:{
       textAlign:'center',
       paddingTop:'23px'
     },
   },
   {
     Header:'Contact No',
     accessor:'contactNo',
     style:{
       textAlign:'center',
       paddingTop:'23px'
     },
   },
   {
     Header:'Type',
     accessor:'type',
     style:{
       textAlign:'center',
       paddingTop:'23px'
     },
   },
   {
     Header:'Total Credit (PKR)',
     accessor:'credit',
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
     Header:'ACTION',
    accessor:'deleteBtn',
     style:{
     display:'flex',
     justifyContent:'center'
     },
     width:180,
     minWidth:100,
     maxWidth:200,
     sortable:false,
     filterable:false,
     resizable:false,
     Cell: props =>   <span style={{display:'flex'}}>
     <div style={{display:'none'}}>
     {(props.original.deleteBtn ==="Deactivate")
      ?
      colorOfButton="red"
      :
      colorOfButton="#42b883"
    }
    </div>
     <Button onClick={this.onClickEdit}
     disabled={this.state.disableAlert}
      style={{marginTop:"13px" ,height:"26px",background:'#02a5de',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
       Edit </Button>

    <Button name={props.original.deleteBtn}onClick={this.onClickDelete}
    disabled={this.state.disableAlert}
     style={{marginTop:"13px" ,height:"26px",background:colorOfButton,color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>
       {props.original.deleteBtn}
      </Button>
     </span>
   },
 ]
    return (
        <div className="content scrollerclass">

              <ReactTooltip type='info' effect='solid'/>
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
          <Card style={{padding:'15px' , marginLeft:'1px'}} className="row">
                  <h3 style={{padding:'1%', marginBottom:'0px'}}>Customer Management</h3>
                  <h4 style={{margin:'10px', color:'green'}}><u>Add New End User/Dealer</u></h4>
          <div className="col-md-6 col-sm-6 col-lg-6">
          <Form style={{marginLeft:'10px'}}>
              <FormGroup row>
              <Label sm={4}>Customer Type</Label>
              <Col sm={2}>
              <Label style={{marginTop:'7px'}}>
                  <Input onClick={this.onClickDealer}type="radio" name="radio1" checked={this.state.dealerChecked} />{' '}
                  Dealer
                  </Label>
                </Col>
                 <Col>
                 <Label style={{marginTop:'7px'}}>
                  <Input  onClick={this.onClickEndUser}type="radio" name="radio1" checked={this.state.customerChecked}/>{' '}
                   End User
                  </Label>
                   </Col>
              </FormGroup>
              </Form>
                <hr/>
                {
                  (this.state.formToLoad === 'endUser') ?
                  <Form style={{padding:'1%'}}>
                  {/* <FormGroup row>
                     <Label sm={4}>Customer Code</Label>
                     <Col sm={8}>
                          <Input readOnly onChange={this.onChangeDealerCode}value={this.state.dealerCode} placeholder="ATMS-C-001"  />
                     </Col>
                   </FormGroup>*/}

                   <FormGroup row>
                     <Label  data-tip="Mandatory Field" sm={4}>End User Name <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                          <Input onChange={this.onCustomerName} value={this.state.customerName} placeholder="Enter End User Name" />
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label sm={4}>NIC Number(Without Dashes)</Label>
                     <Col sm={8}>
                          <Input maxlength="13" onChange={this.onChangeNicNumberCustomer} value={this.state.nicNumberCustomer} placeholder="Enter NIC " />
                     </Col>
                   </FormGroup>

                   <FormGroup row>
                     <Label  sm={4}>NIC Scan</Label>
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
                   </FormGroup>
                   <FormGroup row>
                     <Label  sm={4}>NTN</Label>
                     <Col sm={8}>
                          <Input maxlength="13" type='number' onChange={this.onChangeNtnCustomer} value={this.state.ntnCustomer} placeholder="Enter NTN" />
                     </Col>
                   </FormGroup>
                   {
                     (this.state.ntnCustomer==='')
                     ?
                      ''
                     :
                     <FormGroup row>
                       <Label data-tip="Mandatory Field" sm={4}>NTN Status <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                       <Col sm={8}>
                       <Input type="select" name="select" id="exampleSelect" onClick={this.onClickNtnStatus}  onChange={this.onChangeNtnStatus}>
                        <option disabled selected hidden>NTN Status</option>
                        <option value='active'>Active</option>
                            <option value='nonActive'>Non Active</option>

                       </Input>                         </Col>
                     </FormGroup>
                   }
                   <FormGroup row>
                     <Label  sm={4}>STRN</Label>
                     <Col sm={8}>
                          <Input maxlength="13" type='number' onChange={this.onChangeSTRNCustomer} value={this.state.strnCustomer} placeholder="Enter STRN" />
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label  sm={4}>Opening Balance(PKR)</Label>
                     <Col sm={8}>
                          <Input maxlength="13" type='number' onChange={this.onChangeOpenningBalance} value={(this.state.openningBalance===0)?'':this.state.openningBalance} placeholder="Opening Balance" />
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label  data-tip="Mandatory Field" for="search" sm={4}>Care Of <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                       <Input type="text" name="search" id="search" placeholder="C/O" onChange={this.onChangeCO} value= {this.state.co} />
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label  data-tip="Mandatory Field" sm={4}>Contact No <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                     {/*< data-tip="Mdfffffffsss"
                 defaultCountry="pk"
                 onlyCountries={["pk"]}
                 countryCodeEditable={false}

                 value={this.state.changeContactNoOfCustomer}
                 onChange={this.onChangeContactNoOfCustomer}
               />
               <PhoneInput
                      placeholder="Enter phone number"
                      value={this.state.changeContactNoOfCustomer}
                      onChange={this.onChangeContactNoOfCustomer} />  */}
                      <span style={{color:'red'}}> {this.state.errorState} </span>
                      <Input maxlength="11" name="contact" id="contact" placeholder="e.g 03**-*******" value={this.state.changeContactNoOfCustomer}
                      onChange={this.onChangeContactNoOfCustomer} />

                </Col>
                   </FormGroup>

                   <FormGroup row>
                     <Label sm={4}>Alternate Contact No</Label>
                     <Col sm={8}>
                     {/*<ReactPhoneInput
                 defaultCountry="pk"
                 onlyCountries={["pk"]}
                 countryCodeEditable={false}

                 value={this.state.changeAlternateContactNoOfCustomer}
                 onChange={this.onChangeAlternateContactNoOfCustomer}
               />
               <PhoneInput
                      placeholder="Enter phone number"
                      value={this.state.changeAlternateContactNoOfCustomer}
                      onChange={this.onChangeAlternateContactNoOfCustomer} />*/}
                      <span style={{color:'red'}}> {this.state.errorStateForAlternateContactNo} </span>
                      <Input maxlength="11" name="contact" id="contact" placeholder="e.g 03**-*******" value={this.state.changeAlternateContactNoOfCustomer}
                      onChange={this.onChangeAlternateContactNoOfCustomer} />
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                     <Label  data-tip="Mandatory Field" sm={4}>Address <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                        <Input  type='textarea'  onChange={this.onChangeAddressOfCustomer}  value={this.state.adressOfCustomer} placeholder="Enter Address" />
                     </Col>
                   </FormGroup>
                   <FormGroup style={{marginTop:'10%'}}check row>
                     <Col sm={{ size: 10, offset: 10 }}>
                       <Button style={{padding:'8px'}}onClick={this.onClickAddUserCustomer}color="info" disabled={this.state.disableAddBtn}>
                       {
                       (this.state.disableAddBtn) ?
                       <i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>
                       :  <span style={{display:'flex' , justifyContent:'center'}}><span>Add End User</span></span>
                       }

                       </Button>
                     </Col>
                   </FormGroup>
                 </Form>
                :
                <Form style={{padding:'1%'}}>
                { /*<FormGroup row>
                   <Label sm={4}>Dealer Code</Label>
                   <Col sm={8}>
                        <Input readOnly onChange={this.onChangeDealerCode}value={this.state.dealerCode} placeholder="ATMS-D-001"  />

                   </Col>
                 </FormGroup>*/}
                 <FormGroup row>
                   <Label   data-tip="Mandatory Field" sm={4}>Dealer Name <span class="tooltiptext" style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                   <Col sm={8}>
                        <Input title="Three letter country code" onChange={this.onDealerName} value={this.state.dealerName} placeholder="Enter Dealer Name" />
                   </Col>
                 </FormGroup>
                 <FormGroup row>
                   <Label data-tip="Mandatory Field" sm={4}>Business Name <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                   <Col sm={8}>
                        <Input required onChange={this.onBusinessName} value={this.state.BusinessName} placeholder="Enter Business Name" />
                   </Col>
                 </FormGroup>
                 <FormGroup row>
                   <Label  sm={4}>NIC Number(Without Dashes) </Label>
                   <Col sm={8}>
                        <Input  maxWidth='13' onChange={this.onChangeNicNumber} value={this.state.nicNumber} placeholder="Enter NIC " invalid maxlength="13" />
                   </Col>
                 </FormGroup>

                 <FormGroup row>
                   <Label  sm={4}>NIC Scan</Label>
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
                 </FormGroup>
                 <FormGroup row>
                   <Label  sm={4}>NTN</Label>
                   <Col sm={8}>
                        <Input type='number' onChange={this.onChangeNtn} value={this.state.ntn} placeholder="Enter NTN" maxlength="13" />
                   </Col>
                 </FormGroup>
                 {
                   (this.state.ntn==='')
                   ?
                  ''
                   :
                   <FormGroup row>
                     <Label data-tip="Mandatory Field" sm={4}>NTN Status <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                     <Input type="select" name="select" id="exampleSelect" onClick={this.onClickCustomer}  onChange={this.onChangeNtnStatusDealer}>
                      <option disabled selected hidden>NTN Status</option>
                      <option value='active'>Active</option>
                          <option value='nonActive'>Non Active</option>
                     </Input>                              </Col>
                   </FormGroup>
                 }
                 <FormGroup row>
                   <Label  sm={4}>STRN</Label>
                   <Col sm={8}>
                        <Input type='number' onChange={this.onChangeSTRN} value={this.state.strn} placeholder="Enter STRN" maxlength="13" />
                   </Col>
                 </FormGroup>
                 <FormGroup row>
                   <Label  sm={4}>Opening Balance(PKR)</Label>
                   <Col sm={8}>
                        <Input maxlength="13" type='number' onChange={this.onChangeOpenningBalanceDealer} value={(this.state.openningBalanceDealer===0)?'':this.state.openningBalanceDealer} placeholder="Opening Balance" />
                   </Col>
                 </FormGroup>
                 <FormGroup row>
                   <Label data-tip="Mandatory Field" sm={4}>Contact No <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                   <Col sm={8}>
                   {/*<ReactPhoneInput
               style={{width:'355px'}}
               defaultCountry="pk"
               onlyCountries={["pk"]}
               countryCodeEditable={false}
               value={this.state.changeContactNo}
               onChange={this.onChangeContactNo}
             />
             <PhoneInput
                    placeholder="Enter phone number"
                    value={this.state.changeContactNo}
                    onChange={this.onChangeContactNo} />*/}
                      <span style={{color:'red'}}> {this.state.errorStateForDealerContactNo} </span>
                    <Input maxlength="11" name="contact" id="contact" placeholder="e.g 03**-*******" value={this.state.changeContactNo}
                    onChange={this.onChangeContactNo} />
                   </Col>
                 </FormGroup>
                 <FormGroup row>
                   <Label sm={4}>Alternate Contact No</Label>
                   <Col sm={8}>
                  {/* <ReactPhoneInput
               defaultCountry="pk"
               onlyCountries={["pk"]}
               countryCodeEditable={false}

               value={this.state.changeAlternateContactNo}
               onChange={this.onChangeAlternateContactNo}
             />
             <PhoneInput
                    placeholder="Enter phone number"
                    value={this.state.changeAlternateContactNo}
                    onChange={this.onChangeAlternateContactNo} />*/}
                      <span style={{color:'red'}}> {this.state.errorStateForDealerAlternateContactNo} </span>
                    <Input maxlength="11"   name="contact" id="contact" placeholder="e.g 03**-*******" value={this.state.changeAlternateContactNo}
                    onChange={this.onChangeAlternateContactNo} />
                   </Col>
                 </FormGroup>
                 <FormGroup row>
                   <Label data-tip="Mandatory Field" sm={4}>Business Address <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                   <Col sm={8}>
                      <Input  type='textarea'  onChange={this.onChangeAddress}  value={this.state.adress} placeholder="Enter Address" />
                   </Col>
                 </FormGroup>
                 <FormGroup style={{marginTop:'10%'}}check row>
                   <Col sm={{ size: 10, offset: 10 }}>
                     <Button style={{padding:'8px'}} onClick={this.onClickAddDealer}color="info" disabled={this.state.disableAddBtn}>
                     {
                     (this.state.disableAddBtn) ?
                    <span> <i className="fa fa-spinner fa-spin fa-1x fa-fw"></i></span>
                     :  <span>Add Dealer</span>
                     }
                     </Button>
                   </Col>
                 </FormGroup>
               </Form>
                }

           </div>
        </Card>

        <LoadingOverlay
              active={this.state.isActive}
              spinner

              text='Loading All Customers'
              >
              <Card style={{padding:'15px' }}>
              <div className="react-notification-alert-container">
                <NotificationAlert ref="notificationAlert" />
              </div>
            <h3 style={{padding:'1%', marginBottom:'0px'}}>LIST OF ALL CUSTOMER/DEALERS</h3>
            <h4 style={{marginLeft:'10px', color:'green',paddingTop:'-10px'}}><u>View All Customers and Dealer</u></h4>

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

export default CustomerManagement;
