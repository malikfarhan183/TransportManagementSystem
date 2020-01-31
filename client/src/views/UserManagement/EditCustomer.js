import React from "react";
import ReactTooltip from 'react-tooltip'
import LoadingOverlay from 'react-loading-overlay';
import 'react-table/react-table.css'
// import ReactTable from "react-table";
import EventBus from 'eventing-bus';

// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import ReactPhoneInput from 'react-phone-input-2'
// import 'react-phone-input-2/dist/style.css'
import "./Style.css"

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
   // FormFeedback
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
import { post } from 'axios'

var request = require("request");
const url = global.baseUrl
let urlPrams='';
// let listOfUserRow='';
// let listOfUserArray=[];
// var listOfOptionUser=[]
// var valueOfAllUser=''
// var selectedUser=[]
// var creditOfEachUser=[]


// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class EditCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      strn:'',
      allowNicSend:false,
      ntnStatus:'NTN Status',
      isActiveChequeInHand:false,

      openningBalanceDealer:"",
      openningBalance:'',
      co: '',
  dealerCode:'',
  disableAlert:false,
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
    getSingleUsersApiCall=e=>{
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
        isActiveChequeInHand:false
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
              BusinessName:(i.buisnessName),
                id:(i._id),
                typeOfCustomer:(i.type),
                customerName:(i.name),
                nicNumberCustomer:(i.nic),
                image:(i.nicScan),
                ntnCustomer:(i.ntn),
                ntnStatus:(i.ntnStatus),
                strn:(i.strn),
                  co:(i.careOf),
                      changeContactNoOfCustomer:(i.mobile),
                          // changeAlternateContactNoOfCustomer:(i.changeAlternateContactNoOfCustomer),
                          adressOfCustomer:(i.address),

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
      isActiveChequeInHand:true
  })
  this.getSingleUsersApiCall();

  console.log("Did of User Management" ,this.props.match.params.id);
  if(this.props.match.params.id==='dealer')
  {
    this.setState({
      dealerChecked:true
    })
  }
  if(this.props.match.params.id==='customer'){
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
      let val = e.target.value.replace(/[^A-z\s]/g, '');
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
  this.setState({
    changeContactNo:e
  })
  }

  onChangeAlternateContactNo=e=>{
    console.log("payee",e);
  this.setState({
    changeAlternateContactNo:e
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
    // var user_id=localStorage.getItem("user_id")

    this.setState({
        disableAlert:true
    })
    console.log("this.state.allowNicSend" ,this.state.allowNicSend);
    if(this.state.typeOfCustomer==='dealer')
    {
      if(this.state.allowNicSend){
        if(this.state.ntnCustomer !== ''){
          var data = {
            ntnStatus:this.state.ntnStatus,
             user_id:this.props.match.params.id,
            // credit:-(this.state.openningBalance),
             name:this.state.customerName,
             // email:,
             // password:,
             mobile:this.state.changeContactNoOfCustomer,
             // username:,
             type:this.state.typeOfCustomer,
             // address:this.state.adress,
             // country:,
             // city:,
             // state:
             alternateContact:this.state.changeAlternateContactNoOfCustomer,
             buisnessName:this.state.BusinessName,
             address:this.state.adressOfCustomer,
             nic:this.state.nicNumberCustomer,
             ntn:this.state.ntnCustomer,
             strn:this.state.strn
          }
        }
        // most inner else // if(ntn is empty)
        else{
           data = {
            ntnStatus:'',
             user_id:this.props.match.params.id,
            // credit:-(this.state.openningBalance),
             name:this.state.customerName,
             // email:,
             // password:,
             mobile:this.state.changeContactNoOfCustomer,
             // username:,
             type:this.state.typeOfCustomer,
             // address:this.state.adress,
             // country:,
             // city:,
             // state:
             alternateContact:this.state.changeAlternateContactNoOfCustomer,
             buisnessName:this.state.BusinessName,
             address:this.state.adressOfCustomer,
             nic:this.state.nicNumberCustomer,
             ntn:this.state.ntnCustomer,
              strn:this.state.strn

          }
        }
      }
      //Alowed Nic IF(false)
      else{
        if(this.state.ntnCustomer !== ''){
           data = {
            ntnStatus:this.state.ntnStatus,
             user_id:this.props.match.params.id,
            // credit:-(this.state.openningBalance),
             name:this.state.customerName,
             // email:,
             // password:,
             mobile:this.state.changeContactNoOfCustomer,
             // username:,
             type:this.state.typeOfCustomer,
             // address:this.state.adress,
             // country:,
             // city:,
             // state:
             alternateContact:this.state.changeAlternateContactNoOfCustomer,
             buisnessName:this.state.BusinessName,
             address:this.state.adressOfCustomer,
             // nic:this.state.nicNumberCustomer,
             ntn:this.state.ntnCustomer,
             strn:this.state.strn

          }
        }
        else{
           data = {
            ntnStatus:'',
             user_id:this.props.match.params.id,
            // credit:-(this.state.openningBalance),
             name:this.state.customerName,
             // email:,
             // password:,
             mobile:this.state.changeContactNoOfCustomer,
             // username:,
             type:this.state.typeOfCustomer,
             // address:this.state.adress,
             // country:,
             // city:,
             // state:
             alternateContact:this.state.changeAlternateContactNoOfCustomer,
             buisnessName:this.state.BusinessName,
             address:this.state.adressOfCustomer,
             // nic:this.state.nicNumberCustomer,
             ntn:this.state.ntnCustomer,
             strn:this.state.strn

          }
        }
      }
    }
    //Main Else if(customer)
      else{
        if(this.state.allowNicSend){
          if(this.state.ntnCustomer!== ''){
             data = {
              ntnStatus:this.state.ntnStatus,
               user_id:this.props.match.params.id,
              // credit:-(this.state.openningBalance),
               name:this.state.customerName,
               // email:,
               // password:,
               mobile:this.state.changeContactNoOfCustomer,
               // username:,
               type:this.state.typeOfCustomer,
               // address:this.state.adress,
               // country:,
               // city:,
               // state:
               alternateContact:this.state.changeAlternateContactNoOfCustomer,
               // buisnessName:this.state.BusinessName,
               address:this.state.adressOfCustomer,
               nic:this.state.nicNumberCustomer,
               ntn:this.state.ntnCustomer,
               careOf:this.state.co,
               strn:this.state.strn

            }
          }
          else{
              data = {
              ntnStatus:'',
               user_id:this.props.match.params.id,
              // credit:-(this.state.openningBalance),
               name:this.state.customerName,
               // email:,
               // password:,
               mobile:this.state.changeContactNoOfCustomer,
               // username:,
               type:this.state.typeOfCustomer,
               // address:this.state.adress,
               // country:,
               // city:,
               // state:
               alternateContact:this.state.changeAlternateContactNoOfCustomer,
               // buisnessName:this.state.BusinessName,
               address:this.state.adressOfCustomer,
               nic:this.state.nicNumberCustomer,
               ntn:this.state.ntnCustomer,
               careOf:this.state.co,
               strn:this.state.strn

            }
          }
        }
        else{
          if(this.state.ntnCustomer!== ''){
             data = {
              ntnStatus:this.state.ntnStatus,
               user_id:this.props.match.params.id,
              // credit:-(this.state.openningBalance),
               name:this.state.customerName,
               // email:,
               // password:,
               mobile:this.state.changeContactNoOfCustomer,
               // username:,
               type:this.state.typeOfCustomer,
               // address:this.state.adress,
               // country:,
               // city:,
               // state:
               alternateContact:this.state.changeAlternateContactNoOfCustomer,
               // buisnessName:this.state.BusinessName,
               address:this.state.adressOfCustomer,
               // nic:this.state.nicNumberCustomer,
               ntn:this.state.ntnCustomer,
               careOf:this.state.co,
               strn:this.state.strn
            }
          }
          else{
             data = {
              ntnStatus:'',
               user_id:this.props.match.params.id,
              // credit:-(this.state.openningBalance),
               name:this.state.customerName,
               // email:,
               // password:,
               mobile:this.state.changeContactNoOfCustomer,
               // username:,
               type:this.state.typeOfCustomer,
               // address:this.state.adress,
               // country:,
               // city:,
               // state:
               alternateContact:this.state.changeAlternateContactNoOfCustomer,
               // buisnessName:this.state.BusinessName,
               address:this.state.adressOfCustomer,
               // nic:this.state.nicNumberCustomer,
               ntn:this.state.ntnCustomer,
               careOf:this.state.co,
               strn:this.state.strn

            }
          }
        }
    }
 console.log("mobile:this.state.changeContactNoOfCustomer"  , data.mobile);

 if(this.state.allowNicSend){
   if(this.state.typeOfCustomer!=='dealer'){


             if (data.name === "")
             {
               this.message= 'End User Name is Required';
                this.notify("tc",false); 
                this.setState({
                    disableAddBtn:false,
                     disableAlert:false
                })

             }
             else if (data.nic !== "")
             {
               if (data.nic.length < 13)
               {
                 console.log("Please Enter 13 Digit Nic Number");
                 this.message= 'Please Enter 13 Digit Nic Number';
                  this.notify("tc",false); 
                  this.setState({
                      disableAddBtn:false,
                      disableAlert:false
                  })
               }
             }
             // else if (this.state.allowNicSend) {
             //     console.log("this.state.allowNicSend end user");
             //   if (data.nic == "")
             //   {
             //     this.message= 'NIC No is Required';
             //      this.notify("tc",false); 
             //      this.setState({
             //          disableAddBtn:false,
             //           disableAlert:false
             //      })
             //   }
             //   if (data.nic.length < 13)
             //   {
             //     this.message= 'Please Enter 13 Digit Nic Number';
             //      this.notify("tc",false); 
             //      this.setState({
             //          disableAddBtn:false
             //      })
             //   }
             //   this.setState({
             //       disableAddBtn:false,
             //        disableAlert:false
             //   })
             // }

             else if (data.ntn!== '' && data.ntnStatus==='')
             {
               if(data.ntnStatus===''){
                 this.message= 'Please Select Ntn Status';
                 this.notify("tc",false); 
                 this.setState({
                    disableAddBtn:false,
                     disableAlert:false
                 })
               }

             }
             else if (data.careOf === "")
             {
               this.message= 'Care Of  Required';
                this.notify("tc",false); 
                this.setState({
                    disableAddBtn:false,
                     disableAlert:false
                })
             }else if (data.mobile === "" || data.mobile === '+92')
             {
               this.message= 'Contact No is Required';
                this.notify("tc",false); 
                this.setState({
                    disableAddBtn:false,
                     disableAlert:false
                })
             }
             else if (data.mobile.length < 11)
                 {
                   console.log("Please Enter Correct Phone Number");
                   this.message= 'Please Enter Correct Contact Number';
                    this.notify("tc",false); 
                    this.setState({
                        disableAddBtn:false,
                         disableAlert:false
                    })
                 }
                 else if(data.alternateContact !== ''&& data.alternateContact.length < 11 ){
                   console.log("data.alternateContact" , data.alternateContact);


                         console.log("Please Enter Correct Phone Number");
                         this.message= 'Please Enter Correct Alternate Contact Number';
                          this.notify("tc",false); 
                          this.setState({
                              disableAddBtn:false,
                               disableAlert:false
                          })

                 }
             // else if(data.alternateContact != '' ||  data.alternateContact != undefined){
             //   console.log("data.alternateContact////////////////////////" , data.alternateContact);
             //   if (data.alternateContact.length < 15)
             //       {
             //         console.log("Please Enter Correct Alternate Phone Number");
             //         this.message= 'Please Enter Correct Alternate Phone Number';
             //          this.notify("tc",false); 
             //          this.setState({
             //              disableAddBtn:false
             //          })
             //       }
             // }

             else if (data.address === "")
             {
               this.message= 'Address Required ';
                this.notify("tc",false); 
                this.setState({
                    disableAddBtn:false,
                     disableAlert:false
                })
             }
             else
              {
                console.log("else");
                var options = { method: 'POST',
                    url: global.baseUrl + '/api/updateUser',
                    headers: {'Authorization': localStorage.getItem("token") },
                   body:data,
                    json: true
                  };
              console.log("options of edit CUSTOMER", options);
                  request(options, (error, response, body) =>
                  {
                    if (error)
                    {
                      console.log("Error", error);
              this.message= "Something Went Wrong ..";
               this.notify("tc",false); 
               this.setState({
                   disableAlert:false
               })

                    }
                    else
                    {
                      console.log("Respone in edit Customer", response);

              this.setState({
                  disableAlert:false,
                  // idOfNewCreatedCustomer:response.body.result._id
              })   
              if(response.statusCode!=='200'){
                console.log("response.statusCode" , response.statusCode);
                this.message= response.body.message
                 this.notify("tc",false);

              }
              else{
                this.message= 'Customer Updated Successfully'
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

                 })
              }


               if(response.statusCode===200)
               {
                 setTimeout(()=>{
                   this.props.history.push('/home/customermanagement/:id');
                 },3000)

                 console.log("NOW Upload Call Implement" );
                 this.uploadImgAPiCall(this.props.match.params.id);
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
   else{
             console.log("............................................................................................");
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

           else if (data.nic !== "")
           {
             if (data.nic.length < 13)
             {
               console.log("Please Enter 13 Digit Nic Number");
               this.message= 'Please Enter 13 Digit Nic Number';
                this.notify("tc",false); 
                this.setState({
                    disableAddBtn:false,
                    disableAlert:false
                })
             }
           }



         // else if (this.state.allowNicSend) {
         //   console.log("this.state.allowNicSend");
         //   if (data.nic == "")
         //   {
         //     console.log("NIC No is Required");
         //     this.message= 'NIC No is Required';
         //      this.notify("tc",false); 
         //      this.setState({
         //          disableAddBtn:false,
         //           disableAlert:false
         //      })
         //   }
         //   else if (data.nic.length < 13)
         //   {
         //     console.log("Please Enter 13 Digit Nic Number");
         //     this.message= 'Please Enter 13 Digit Nic Number';
         //      this.notify("tc",false); 
         //      this.setState({
         //          disableAddBtn:false,
         //          disableAlert:false
         //      })
         //   }
         //   else{
         //     console.log("else herer");
         //     this.setState({
         //       disableAlert:false,
         //         disableAddBtn:false
         //     })
         //   }
         //
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
         else if(data.alternateContact !== '' && data.alternateContact.length < 11 ){


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
      console.log("else of call");
       options = { method: 'POST',
          url: global.baseUrl + '/api/updateUser',
          headers: {'Authorization': localStorage.getItem("token") },
         body:data,
          json: true
        };
    console.log("options of edit CUSTOMER", options);
        request(options, (error, response, body) =>
        {
          if (error)
          {
            console.log("Error", error);
    this.message= "Something Went Wrong ..";
     this.notify("tc",false); 
     this.setState({
         disableAlert:false
     })

          }
          else
          {
            console.log("Respone in edit Customer", response);

    this.setState({
        disableAlert:false,
        // idOfNewCreatedCustomer:response.body.result._id
    })   
    if(response.statusCode!=='200'){
      console.log("response.statusCode" , response.statusCode);
      this.message= response.body.message
       this.notify("tc",false);

    }
    else{
      this.message= 'Customer Updated Successfully'
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

       })
    }


     if(response.statusCode===200)
     {
       setTimeout(()=>{
         this.props.history.push('/home/customermanagement/:id');
       },3000)

       console.log("NOW Upload Call Implement" );
       this.uploadImgAPiCall(this.props.match.params.id);
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
 }
 else{
   if(this.state.typeOfCustomer!=='dealer'){


             if (data.name === "")
             {
               this.message= 'End User Name is Required';
                this.notify("tc",false); 
                this.setState({
                    disableAddBtn:false,
                     disableAlert:false
                })

             }
             // else if (data.nic == "")
             // {
             //   console.log("NIC No is Required");
             //   this.message= 'NIC No is Required';
             //    this.notify("tc",false); 
             //    this.setState({
             //        disableAddBtn:false,
             //         disableAlert:false
             //    })
             // }
             // else if (data.nic.length < 13)
             // {
             //   console.log("Please Enter 13 Digit Nic Number");
             //   this.message= 'Please Enter 13 Digit Nic Number';
             //    this.notify("tc",false); 
             //    this.setState({
             //        disableAddBtn:false,
             //        disableAlert:false
             //    })
             // }
             // else if (this.state.allowNicSend) {
             //     console.log("this.state.allowNicSend end user");
             //   if (data.nic == "")
             //   {
             //     this.message= 'NIC No is Required';
             //      this.notify("tc",false); 
             //      this.setState({
             //          disableAddBtn:false,
             //           disableAlert:false
             //      })
             //   }
             //   if (data.nic.length < 13)
             //   {
             //     this.message= 'Please Enter 13 Digit Nic Number';
             //      this.notify("tc",false); 
             //      this.setState({
             //          disableAddBtn:false
             //      })
             //   }
             //   this.setState({
             //       disableAddBtn:false,
             //        disableAlert:false
             //   })
             // }

             else if (data.ntn!== '' && data.ntnStatus==='')
             {
               if(data.ntnStatus===''){
                 this.message= 'Please Select Ntn Status';
                 this.notify("tc",false); 
                 this.setState({
                    disableAddBtn:false,
                     disableAlert:false
                 })
               }

             }
             else if (data.careOf === "")
             {
               this.message= 'Care Of  Required';
                this.notify("tc",false); 
                this.setState({
                    disableAddBtn:false,
                     disableAlert:false
                })
             }else if (data.mobile === "" || data.mobile === '+92')
             {
               this.message= 'Contact No is Required';
                this.notify("tc",false); 
                this.setState({
                    disableAddBtn:false,
                     disableAlert:false
                })
             }
             else if (data.mobile.length < 11)
                 {
                   console.log("Please Enter Correct Phone Number");
                   this.message= 'Please Enter Correct Contact Number';
                    this.notify("tc",false); 
                    this.setState({
                        disableAddBtn:false,
                         disableAlert:false
                    })
                 }
                 else if(data.alternateContact !== '' && data.alternateContact.length < 11 ){
                   console.log("data.alternateContact" , data.alternateContact);


                         console.log("Please Enter Correct Phone Number");
                         this.message= 'Please Enter Correct Alternate Contact Number';
                          this.notify("tc",false); 
                          this.setState({
                              disableAddBtn:false,
                               disableAlert:false
                          })

                 }
             // else if(data.alternateContact != '' ||  data.alternateContact != undefined){
             //   console.log("data.alternateContact////////////////////////" , data.alternateContact);
             //   if (data.alternateContact.length < 15)
             //       {
             //         console.log("Please Enter Correct Alternate Phone Number");
             //         this.message= 'Please Enter Correct Alternate Phone Number';
             //          this.notify("tc",false); 
             //          this.setState({
             //              disableAddBtn:false
             //          })
             //       }
             // }

             else if (data.address === "")
             {
               this.message= 'Address Required ';
                this.notify("tc",false); 
                this.setState({
                    disableAddBtn:false,
                     disableAlert:false
                })
             }
             else
              {
                console.log("else");
                 options = { method: 'POST',
                    url: global.baseUrl + '/api/updateUser',
                    headers: {'Authorization': localStorage.getItem("token") },
                   body:data,
                    json: true
                  };
              console.log("options of edit CUSTOMER", options);
                  request(options, (error, response, body) =>
                  {
                    if (error)
                    {
                      console.log("Error", error);
              this.message= "Something Went Wrong ..";
               this.notify("tc",false); 
               this.setState({
                   disableAlert:false
               })

                    }
                    else
                    {
                      console.log("Respone in edit Customer", response);

              this.setState({
                  disableAlert:false,
                  // idOfNewCreatedCustomer:response.body.result._id
              })   
              if(response.statusCode!=='200'){
                console.log("response.statusCode" , response.statusCode);
                this.message= response.body.message
                 this.notify("tc",false);

              }
              else{
                this.message= 'Customer Updated Successfully'
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

                 })
              }


               if(response.statusCode===200)
               {
                 setTimeout(()=>{
                   this.props.history.push('/home/customermanagement/:id');
                 },3000)

                 console.log("NOW Upload Call Implement" );
                 this.uploadImgAPiCall(this.props.match.params.id);
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
   else{
             console.log("............................................................................................");
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
           //
           // else if (data.nic == "")
           // {
           //   console.log("NIC No is Required");
           //   this.message= 'NIC No is Required';
           //    this.notify("tc",false); 
           //    this.setState({
           //        disableAddBtn:false,
           //         disableAlert:false
           //    })
           // }
           // else if (data.nic.length < 13)
           // {
           //   console.log("Please Enter 13 Digit Nic Number");
           //   this.message= 'Please Enter 13 Digit Nic Number';
           //    this.notify("tc",false); 
           //    this.setState({
           //        disableAddBtn:false,
           //        disableAlert:false
           //    })
           // }


         // else if (this.state.allowNicSend) {
         //   console.log("this.state.allowNicSend");
         //   if (data.nic == "")
         //   {
         //     console.log("NIC No is Required");
         //     this.message= 'NIC No is Required';
         //      this.notify("tc",false); 
         //      this.setState({
         //          disableAddBtn:false,
         //           disableAlert:false
         //      })
         //   }
         //   else if (data.nic.length < 13)
         //   {
         //     console.log("Please Enter 13 Digit Nic Number");
         //     this.message= 'Please Enter 13 Digit Nic Number';
         //      this.notify("tc",false); 
         //      this.setState({
         //          disableAddBtn:false,
         //          disableAlert:false
         //      })
         //   }
         //   else{
         //     console.log("else herer");
         //     this.setState({
         //       disableAlert:false,
         //         disableAddBtn:false
         //     })
         //   }
         //
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

 }
 else if (data.mobile === "" || data.mobile === '+92')
     {
       console.log("Contact No is Required");
       this.message= 'Contact No is Required';
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
         else if(data.alternateContact !==   '' && data.alternateContact.length < 11 ){


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
      console.log("else of call");
       options = { method: 'POST',
          url: global.baseUrl + '/api/updateUser',
          headers: {'Authorization': localStorage.getItem("token") },
         body:data,
          json: true
        };
    console.log("options of edit CUSTOMER", options);
        request(options, (error, response, body) =>
        {
          if (error)
          {
            console.log("Error", error);
    this.message= "Something Went Wrong ..";
     this.notify("tc",false); 
     this.setState({
         disableAlert:false
     })

          }
          else
          {
            console.log("Respone in edit Customer", response);

    this.setState({
        disableAlert:false,
        // idOfNewCreatedCustomer:response.body.result._id
    })   
    if(response.statusCode!=='200'){
      console.log("response.statusCode" , response.statusCode);
      this.message= response.body.message
       this.notify("tc",false);

    }
    else{
      this.message= 'Customer Updated Successfully'
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

       })
    }


     if(response.statusCode===200)
     {
       setTimeout(()=>{
         this.props.history.push('/home/customermanagement/:id');
       },3000)

       console.log("NOW Upload Call Implement" );
       this.uploadImgAPiCall(this.props.match.params.id);
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
 }



  }
  onClickAddDealer=e=>{
    this.setState({
        disableAlert:true
    })
    var data = {
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
    if (data.name === "")
    {
      this.message= 'Dealer Name is Required';
       this.notify("tc",false); 
       this.setState({
           disableAlert:false
       })
    }
    else if (data.buisnessName === "")
        {
          this.message= 'Buisness Name is Required ';
           this.notify("tc",false); 
           this.setState({
               disableAlert:false
           })
        } else if (data.mobile === "")
    {
      this.message= 'Contact No. is Required';
       this.notify("tc",false); 
       this.setState({
           disableAlert:false
       })
    }
   else if (data.address === "")
  {
    this.message= 'Address No. is Required';
     this.notify("tc",false);
     this.setState({
         disableAlert:false
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
    if(response.body!==undefined)
{    this.message= response.body.message;}
     this.notify("tc",false); 

     this.setState({
         disableAlert:false
     })
          }
          else
          {
            console.log("Respone in Create New Dealer", response);

    this.setState({
        disableAlert:false,
        idOfNewCreatedCustomer:response.body.result._id

    })   
    this.setState({
      dealerCode:'',
      credit:'',
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
    this.message= 'Dealer Created Successfully'
     this.notify("tc",true); 
     this.getSingleUsersApiCall();

                   if(response.statusCode===200)
                   {
                     console.log("NOW Upload Call Implement", response.body.result._id);

                       this.uploadImgAPiCall(this.props.match.params.id);

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
    console.log("payee",e);
    const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
  this.setState({
    changeContactNoOfCustomer:e.target.value
  })
 }
  }
  onChangeAlternateContactNoOfCustomer=e=>{
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
  console.log("Image ID :::: ", e);
  this.fileUpload(this.state.image, e).then((response)=>{
      console.log("response file of Uplaod IMG :: ", response);
      if(response.status !== 200)
      {
        this.message="You are uploading Corrupt Image"
             this.notify("tc",false);
      }
      })
}
fileUpload(file, id)   {
  console.log("id==============================================" ,this.state.idOfNewCreatedCustomer);
console.log("file :::: ", file);     // const url = 'https://httpbin.org/post';
const formData = new FormData();
formData.append('userFile',file)
const config = {
  headers: {'content-type': 'multipart/form-data',
             'Authorization': localStorage.getItem("token")
            },
 }
console.log("FormData means options", formData);
console.log("url",url+'/uploadNICScan/:id'+id  , formData,config);
  return  post(url+'/uploadNICScan/'+ id  , formData,config)
}
onChangeNicNumber=e=>{
  this.setState({
    nicNumber:e.target.value
  })
}
onChangeNtn=e=>{
  this.setState({
    ntn:e.target.value
  })
}
onChangeNicNumberCustomer=e=>{
  const re = /^[0-9\b]+$/;
      if (e.target.value === '' || re.test(e.target.value)) {
        this.setState({
          nicNumberCustomer:e.target.value,
          allowNicSend:true
        })
      }
}
onChangeNtnCustomer=e=>{
  if(e.target.value === ''){
    this.setState({
      ntnStatus:e.target.value
    })
  }
  this.setState({
    ntnCustomer:e.target.value
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
  console.log("Edit button clicked");

      setTimeout(() => {
        console.log("Detail button  clicked" , this.index );
        urlPrams= '/home/EditCustomer/' + this.index;
         // this.props.history.push(urlPrams);
         console.log("URL PARAMS" , urlPrams);
         EventBus.publish("apiCall",this.responseToSend)
  }, 1000);
}
onClickDelete=e=>{
  console.log("Delete button clicked");
  setTimeout(()=>{
    this.deleteCashInHandToBankApiCall();
  },1000)

}
deleteCashInHandToBankApiCall=e=>{
  console.log("Order Id " , this.index);

  this.setState({
      disableAlert:true
  })
  // e.preventDefault();
  console.log("SAved CLICKED");
  var user_id=localStorage.getItem("user_id")

  var data={
    isDeleted:true,
    // date:this.state.date,
       // user_id:this.state.dealerId,
       // deliveryType:this.state.deliveryType,
       user_id:user_id,
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
        url: global.baseUrl + '/api/updatePayment',
        headers: {'Authorization': localStorage.getItem("token") },
       body:data,
        json: true
      };
  console.log("options of Delete Payment Call", options);
      request(options, (error, response, body) =>

      {
        if (error)
        {
          console.log("Error Of Delete Payment Call", error);
}
        else
        {
          console.log("Respone in Delete Payment Call", response); 
  this.setState({
      disableAlert:false
  })
  if(response.body.success){
  this.message='Payment Deleted Successfully'
      this.notify("tc",true);
       // EventBus.publish("OrderCreatedEventBuss",true)
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
       this.addCashOnHandToBankHistory();
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
onChangeNtnStatus=e=>{
  this.setState({
    ntnStatus:e.target.value
  })
}
onChangeSTRNCustomer=e=>{
  this.setState({
    strn:e.target.value
  })
}



  render() {
    console.log("Render");
    let {imagePreviewUrl} = this.state;
 let $imagePreview = null;
 if (imagePreviewUrl) {
   $imagePreview = (<img alt='' style={{width:'100px',heigh:"100px"}} src={imagePreviewUrl} />);
 }

    return (
        <div className="content">
              <ReactTooltip type='info' effect='solid'/>
              <LoadingOverlay
                    active={this.state.isActiveChequeInHand}
                    spinner

                    text='Loading Customer Details'
                    >
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
          <Card style={{padding:'15px' , marginLeft:'0px'}} className="row">
                  <h3 style={{padding:'1%', marginBottom:'0px'}}>EDIT CUSTOMER</h3>
                  <h4 style={{margin:'10px', color:'green'}}><u>Edit End User/Dealer</u></h4>

          <div className="col-md-6 col-sm-6 col-lg-6">
          <Form style={{marginLeft:'10px'}}>
              <FormGroup row>
              <Label sm={4}>Customer Type</Label>
              <Col sm={8}>
              <Input disabled onChange={this.onCustomerName} value={this.state.typeOfCustomer} placeholder="Customer Type" />

                   </Col>
              </FormGroup>
              </Form>
                <hr/>

                  <Form style={{padding:'1%'}}>
                  {/* <FormGroup row>
                     <Label sm={4}>Customer Code</Label>
                     <Col sm={8}>
                          <Input readOnly onChange={this.onChangeDealerCode}value={this.state.dealerCode} placeholder="ATMS-C-001"  />
                     </Col>
                   </FormGroup>*/}

                   <FormGroup row>
                     <Label  data-tip="Mandatory Field" sm={4}>Customer Name <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                          <Input onChange={this.onCustomerName} value={this.state.customerName} placeholder="Enter Customer Name" />
                     </Col>
                   </FormGroup>

                   {(this.state.typeOfCustomer==='dealer')
                 ?
                 <FormGroup row>
                   <Label data-tip="Mandatory Field" sm={4}>Business Name <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                   <Col sm={8}>
                        <Input required onChange={this.onBusinessName} value={this.state.BusinessName} placeholder="Enter Business Name" />
                   </Col>
                 </FormGroup>
             :
             <FormGroup row>
               <Label  for="search" sm={4}>Care Of </Label>
               <Col sm={8}>
                 <Input type="text" name="search" id="search" placeholder="C/O" onChange={this.onChangeCO} value= {this.state.co} />
               </Col>
             </FormGroup>
           }


                   <FormGroup row>
                     <Label  sm={4}>NIC Number(Without Dashes) </Label>
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
                                     {<img alt='' style={{width:'96px'}} src={this.state.image}></img>}
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
                       <Input type="select" name="select" id="exampleSelect" onClick={this.onClickCustomer}  onChange={this.onChangeNtnStatus}>
                        <option disabled selected hidden>{this.state.ntnStatus}</option>
                        <option value='active'>Active</option>
                            <option value='nonActive'>Non Active</option>



                       </Input>                              </Col>
                     </FormGroup>
                   }
                   <FormGroup row>
                     <Label  sm={4}>STRN</Label>
                     <Col sm={8}>
                          <Input maxlength="13" type='number' onChange={this.onChangeSTRNCustomer} value={this.state.strn} placeholder="Enter STRN" />
                     </Col>
                   </FormGroup>


                   <FormGroup row>
                     <Label  data-tip="Mandatory Field" sm={4}>Contact No <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                     <Col sm={8}>
                     {/*<ReactPhoneInput data-tip="Mdfffffffsss"
                 defaultCountry="pk"
                 onlyCountries={["pk"]}
                 countryCodeEditable={false}

                 value={this.state.changeContactNoOfCustomer}
                 onChange={this.onChangeContactNoOfCustomer}
               />*/}
               <Input maxlength="11" name="contact" id="contact" placeholder="e.g 03**-*******" value={this.state.changeContactNoOfCustomer}
               onChange={this.onChangeContactNoOfCustomer} />
                </Col>
                   </FormGroup>

                   <FormGroup row>
                     <Label sm={4}>Alternate Contact No</Label>
                     <Col sm={8}>
                    {/* <ReactPhoneInput
                 defaultCountry="pk"
                 onlyCountries={["pk"]}
                 countryCodeEditable={false}

                 value={this.state.changeAlternateContactNoOfCustomer}
                 onChange={this.onChangeAlternateContactNoOfCustomer}
               />*/}
               <Input maxlength="11" name="contact" id="contact" placeholder="e.g 03**-*******"  value={this.state.changeAlternateContactNoOfCustomer}
                onChange={this.onChangeAlternateContactNoOfCustomer} />
                     </Col>
                   </FormGroup>
                   <FormGroup row>
                   {
                     (this.state.typeOfCustomer==='dealer') ?
                      <Label  data-tip="Mandatory Field" sm={4}>Business Address <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>
                      :
                      <Label  data-tip="Mandatory Field" sm={4}>Address <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>

                   }

                     <Col sm={8}>
                        <Input  type='textarea'  onChange={this.onChangeAddressOfCustomer}  value={this.state.adressOfCustomer} placeholder="Enter Address" />
                     </Col>
                   </FormGroup>
                   <FormGroup style={{marginTop:'10%'}}check row>
                     <Col sm={{ size: 10, offset: 10 }}>
                       <Button style={{padding:'8px'}}onClick={this.onClickAddUserCustomer}color="info" disabled={this.state.disableAlert}>


                       {
                       (this.state.disableAlert) ?
                       <span><i className="fa fa-spinner fa-spin fa-1x fa-fw"></i> Udpate Customer</span>
                       :  <span style={{display:'flex' , justifyContent:'center'}}><span>Udpate Customer</span></span>
                       }

                       </Button>
                     </Col>
                   </FormGroup>
                 </Form>
           </div>
        </Card>
          </LoadingOverlay>
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
        </div>

    );
  }
}

export default EditCustomer;
