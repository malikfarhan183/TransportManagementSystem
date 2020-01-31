import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import { InputGroup, Input, Button } from 'reactstrap';
import EventBus from 'eventing-bus';
import NotificationAlert from "react-notification-alert";

//import './login.css'

var request = require("request");
// const url = global.baseUrl

const InputStyle={
  border: "1px solid #f4f4f4",
  color: "#525f7f",
  height:"40px",
  fontSize:"14px",
  borderLeft:"transparent",
  width:"85%",
  padding:"0px"
}

const loginTitle={
  color: "black",
  fontSize: "26px",
  fontWeight: "500",
  marginBottom:"30px",
  textAlign:"left",
}
// const forgotPasswordText={
//   fontSize:"10px",
//   color:'black',
//   textDecoration:"underline",
//   textAlign:"center",
//   cursor:"pointer"
// }


class ChangePassword extends React.Component {
  constructor(props){
    super(props);
    this.state={
      disableAlert:false
    }
  }
  notify = (place, auth) => {
    console.log("Place :: ", place, auth);
    var type;
    var time;
    if(auth)
    {
      type="success";
      time=1
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
          {this.errMsg}
        </div>
      ),
      type: type,
      icon: "tim-icons icon-bell-55",
      autoDismiss: time
    };
    this.refs.notificationAlert.notificationAlert(options);
  };


  componentDidMount()
  {

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


    this.token=null
    this.errMsg=''
    this.oldPassword=''
    this.newPassword=''
    this.RetypeNewPassword=''
    EventBus.on("GoBack", this.callbackGoBack.bind(this));
  }
  handleChangePassword=()=>
  {
    this.setState({
        disableAlert:true
    })
    // window.location.href="/home/dashboard"
    console.log("Email :: ", this.email);
    console.log("Password :: ", this.password);
    if(this.newPassword==='' || this.oldPassword==="" || this.RetypeNewPassword==="")
    {
      this.errMsg="Empty field found"
      this.notify("tc",false);
      this.setState({
          disableAlert:false
      })
    }
    else if (this.newPassword!==this.RetypeNewPassword) {
      this.errMsg="Password Did Not Match"
      this.notify("tc",false);
      this.setState({
          disableAlert:false
      })
    }
    else
    {
      //this.notify("tc",true);
      var data={
        oldPassword:this.oldPassword,
        password:this.newPassword,
          // RetypeNewPassword:this.RetypeNewPassword,
      }
      var options = { method: 'POST',
        url: global.baseUrl + '/api/changePassword',
          headers: {'Authorization': localStorage.getItem("token") },
        form:data,
        json: true
      };
  console.log("options of Change Password ", options);
      request(options, (error, response, body) =>
      {
        if (error)
        {
          console.log("Erfffror", error);

        }
        else
        {
          console.log("**Respone :: Change password ", response);
          this.errMsg=body.message;
          console.log("ff",this.errMsg);
          if(!body.success)
          {
            this.notify("tc",false);
            // localStorage.setItem("token",this.token)
            this.setState({
                disableAlert:false
            })

          }
          else {
            this.notify("tc",true);
            this.setState({
                disableAlert:false
            })
              window.location.href='/mainpage'
          }
        }
      })
    }

  }

  callbackGoBack=(e)=>
  {
    console.log("Go back bus recieved :: ", e);
    this.componentDidMount()
  }

  // handleForgotPassword=()=>
  // {
  //   console.log("forgot clicked ");
  //   this.pageContent=<ForgotPassword />
  //
  //     this.setState((state, props) => {
  //       return {counter: 0 + props.step};
  //     });
  // }

  handleChange=(event)=>
  {
    console.log("Setting "+event.target.name + " to ", event.target.value);
    this.setState({[event.target.name]: event.target.value});

    if(event.target.name==='newPassword')
    {
      this.newPassword=event.target.value
    }
    else if (event.target.name==='oldPassword')
    {
      this.oldPassword=event.target.value
    }
    else if (event.target.name==='RetypeNewPassword')
    {
      this.RetypeNewPassword=event.target.value
    }

    // this.setState((state, props) => {
    //   return {counter: state.counter + props.step};
    // });
  }
  onClickX=e=>{
    this.props.history.push('/mainpage');
  }

  render() {
    return (

        <div className="AdminLogin">

          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />

          </div>

          <div className="loginDiv">

            <div className="loginFormDiv">
                   <Button onClick={this.onClickX} style={{fontSize:'30px' , marginRight:'7px'}}close />
              <p style={loginTitle}>Change Password</p>

              <InputGroup>
                <div className="fieldIcon"><i className="tim-icons icon-lock-circle"></i></div>

                <Input type="password" style={InputStyle} placeholder="Old Password" name="oldPassword" onChange={this.handleChange} />
              </InputGroup>
              <InputGroup style={{width:"100%"}}>
                <div className="fieldIcon"><i className="tim-icons icon-lock-circle"></i></div>
                <Input type="password" style={InputStyle} placeholder="Enter New Password" name="newPassword" onChange={this.handleChange}/>
              </InputGroup>
              <InputGroup style={{width:"100%"}}>
                <div className="fieldIcon"><i className="tim-icons icon-lock-circle"></i></div>
                <Input type="password" style={InputStyle} placeholder="Retype New Password" name="RetypeNewPassword" onChange={this.handleChange}/>
              </InputGroup>

              <div className="loginBtnDiv">
                <Button color='info' style={{width:"90%", marginTop:"25px"}} onClick={this.handleChangePassword} disabled={this.state.disableAlert}>


                {
                (this.state.disableAlert) ?
                <i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>
                :  <span style={{display:'flex' , justifyContent:'center'}}><i style={{marginRight:'12px' , paddingTop:'3px'}}class="fa fa-user fa-fw"></i> <span>  Change Now</span></span>
                }


              </Button>
              </div>
            </div>
          </div>

        </div>

    );
  }
}

export default ChangePassword;
