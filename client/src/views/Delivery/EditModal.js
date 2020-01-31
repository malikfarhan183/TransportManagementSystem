
import React from 'react';
import axios, { post } from 'axios'
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
   Modal,
   ModalHeader,
   ModalBody,
    ModalFooter
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
// import DatePicker from 'react-datepicker';
import EventBus from 'eventing-bus';
// import FileSaver from 'file-saver';
// import logo from "assets/img/file.png";
// import "./Promos.css"

import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
var request = require("request");
const url = "https://deaftawk-dev-v.herokuapp.com"


class EditModal extends React.Component {



  constructor(props) {
    super(props);
    this.state = {
      modal: true,
      nestedModal: false,
      closeAll: false,
      title:'',
      discription:'',
      mints:'',
      expiry:'',
      code:'',
      file: '',
      imagePreviewUrl: '',
      image:''



    };

    // this.toggle = this.toggle.bind(this);
    // this.toggleNested = this.toggleNested.bind(this);
    this.toggleAll = this.toggleAll.bind(this);
     // this.handleChange = this.handleChange.bind(this);
  }
  notify = (place, auth) => {
    console.log("Place :: ", place, auth);
    var type;
    var time;
    if(auth)
    {
      type="success";
      time=4
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
  fileUpload(file)   {
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
 console.log("url",url+'/uploadPromoImage/'+ this.idOfNewCreatedPromo  , formData,config);
    return  post(url+'/uploadPromoImage/'+ this.idOfNewCreatedPromo  , formData,config)
}
editOrderEventBusFunc=e=>{
  console.log("editOrderEventBusFunc" , e);
  this.setState(prevState => ({
    modal:true
  }));
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
    EventBus.on("editOrderEventBus",this.editOrderEventBusFunc );

    console.log("DID");
    // console.log("id through Prams" ,this.props.match.params.id);

    // this.SelectedFile:''
     this.idOfNewCreatedPromo=''
     this.message=''
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

  toggle=(e)=> {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

  if(e === '1'){
  var  data={
        title:this.state.title,
        description:this.state.discription,
        code:this.state.code,
        expiry:this.state.expiry,
        minutes:this.state.mints,
    }
    var options = { method: 'POST',
          url: global.baseUrl + '/api/createPromo',
          headers: {'Authorization': localStorage.getItem("token") },
            body:data,
          json: true
        };
    console.log("options of Create new promo", options);
        request(options, (error, response, body) =>

        {
          if (error)
          {
            console.log("Error", error);
          }
          else
          {
            console.log("Respone of  Create new promo:: ", response);
               if(response.body.messge==='Promo Created'){
                    this.idOfNewCreatedPromo=response.body.result._id
                    this.message=response.body.messge
                 this.notify("tc",true);
               }
               else{
                    this.message=response.body.messge
                 this.notify("tc",false);
               }

            if(response.statusCode=== 201)
            {
              console.log("NOW Upload Call Implement");

              this.uploadImgAPiCall();
            }
            EventBus.publish("addNewPromoEventbus",'added')

          }
        })
  }

  }
  toggleNested() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: false
    });
  }

  toggleAll() {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: true
    });
  }
  onChangeTitle=e=>{
    console.log("Title clicked" , e.target.value);
    this.setState({
      title:e.target.value
    })
  }

  onChangeDiscription=e=>{
    console.log("Discription clicked" , e.target.value);
    this.setState({
      discription:e.target.value
    })
  }

  onChangeMints=e=>{
    console.log("Mints clicked" , e.target.value);
    this.setState({
      mints:e.target.value
    })
  }

  onChangeExpiry=e=>{
    console.log("Expiry clicked" , e.target.value);
    this.setState({
      expiry:e.target.value
    })
  }


  onChangeCode=e=>{
    console.log("Code clicked" , e.target.value);
    this.setState({
      code:e.target.value
    })
  }



  render() {
    console.log("render of Modal" , this.props.order);
    if(this.props.order===''){
      console.log("Order Data is Recieving");
      // this.setState(prevState => ({
      //   modal:true
      // }));

    }
    else{
      // this.setState(prevState => ({
      //   modal:true
      // }));
    }
    let {imagePreviewUrl} = this.state;
 let $imagePreview = null;
 if (imagePreviewUrl) {
   $imagePreview = (<img alt=''style={{width:'100px',heigh:"100px"}}src={imagePreviewUrl} />);
 }
    return (
      <div className="content">
        <NotificationAlert ref="notificationAlert" />
        <Button name ='x' onClick={this.toggle} style={{background:'#02a5de',color:'white',paddingLeft:'14px',paddingRight:'14px',paddingBottom:'4px',paddingTop:'4px',fontWeight:'500'}}>Edit</Button>
        <Modal isOpen={this.state.modal} name ='x' toggle={this.toggle} className={this.props.className}>
          <ModalHeader style ={{background:'#02a5de'}} name ='selectMonth'toggle={this.toggle}><h4>Add New Promo</h4></ModalHeader>
          <ModalBody>

           <Card>
           <Form style={{marginLeft:'10px'}}>
           <FormGroup row>
             <Label sm={4}>Title</Label>
             <Col sm={8}>
                  <Input onChange={this.onChangeTitle} value={this.state.title} placeholder="Enter Title"  />
             </Col>
           </FormGroup>

           <FormGroup row>
             <Label  sm={4}>Description</Label>
             <Col sm={8}>
                  <Input onChange={this.onChangeDiscription} value={this.state.discription} placeholder="Enter Description" />
             </Col>
           </FormGroup>
           <FormGroup row>
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
           </FormGroup>

           <FormGroup row>
             <Label sm={4}>Minutes</Label>
             <Col sm={8}>
                <Input   type='number' onChange={this.onChangeMints}  value={this.state.mints} placeholder="Enter Mints" />
             </Col>
           </FormGroup>
           <FormGroup row>
             <Label sm={4}>Expiry</Label>
             <Col sm={8}>
                <Input  type='date'  onChange={this.onChangeExpiry}  value={this.state.expiry} placeholder="Enter Expiry" />
             </Col>
           </FormGroup>
           <FormGroup row>
             <Label sm={4}>Code</Label>
             <Col sm={8}>
                <Input onChange={this.onChangeCode}  value={this.state.code} placeholder="Enter Code" />
             </Col>
           </FormGroup>

            </Form>
            </Card>
          </ModalBody>
          <ModalFooter style={{display:'flex',justifyContent:'center'}}>
            <Button color="info" style={{background:'#02a5de' , paddingTop:'3px', paddingBottom:'4px'}} name ='done' onClick={()=>this.toggle('1')}>Done</Button>{' '}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default EditModal;
