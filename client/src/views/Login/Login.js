import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';
// import ForgotPassword from "./forgotPassword.js";
import NotificationAlert from "react-notification-alert";
import EventBus from 'eventing-bus';
import './login.css'
import "./Lock.css"


var request = require("request");
// const url = ""
// const url = "http://localhost:1338"


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
  textAlign:"center",
}
// const forgotPasswordText={
//   fontSize:"10px",
//   color:'black',
//   textDecoration:"underline",
//   textAlign:"center",
//   cursor:"pointer"
// }


class Login extends React.Component {
  constructor(props){
    super(props);
    this.state={
      disableAlert:false,
      lock:false,
      email:'' ,
      password:''
    }
  }
  notify = (place, auth) => {
    console.log("Place :: ", place, auth);
    var type;
    var time;
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
  // onKeyUpfunc=(e)=>{
  //   console.log("e.keyCode" ,e.target.name);
  //   console.log(e.keyCode);
  //   if(e.keyCode===13){
  //     switch (e.target.name) {
  //       case 'email': this.emailRef.focus();
  //
  //         break;
  //           case 'password': this.passwordRef.focus();
  //             break;
  //       default:
  //            this.emailRef.focus();
  //     }
  //
  //   }
  // }



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

    console.log("Base URL Set", global.baseUrl);
    this.url = global.baseUrl
    this.user_id=''
    this.token=null
    this.loginUserName=''
    this.loginUserNameType=''
    this.emailOfLogedInUser=''
    this.errMsg=''
    this.email=''
    this.password=''
    EventBus.on("GoBack", this.callbackGoBack.bind(this));
  }
  onClickSignup=e=>{
    console.log("signuping ");
  }

  handleLogin=()=>
  {
    this.setState({
        disableAlert:true
    })
    // window.location.href="/home/dashboard"
    console.log("Email :: ", this.email);
    console.log("Password :: ", this.password);
    if(this.state.email==='' || this.state.password==="")
    {
      this.message="Empty field found"
      this.notify("tc",false);
      this.setState({
          disableAlert:false
      })
    }
    else
    {
      // this.setState({
      //   lock:true
      // })
      //this.notify("tc",true);
      var data={
        email:this.state.email,
        password:this.state.password
      }
      console.log("Call", global.baseUrl + '/authenticate');
      var options = { method: 'POST',
        url: global.baseUrl + '/authenticate',
        headers: {'content-type': 'application/json','cache-control': 'no-cache' },
        form:data,
        json: true
      };
      console.log("options of Login ", options);
      request(options, (error, response, body) =>
      {
        if (error)
        {
          console.log("Erfffror", error);
          this.message="Something Went Wrong .."
          this.notify("tc",false);
          this.setState({
              disableAlert:false
          })

          // window.location.href='/PageNotFound'
        }
        else
        {
          console.log("**Login Respone ::", response);
          this.message=body.message;
          console.log("ff",this.errMsg);
          if(!body.success)
          {
            this.notify("tc",false);
            console.log("status false" , this.errMsg);
            console.log("status false email" , this.state.email);
            console.log("status false password" , this.state.password );

            // sessionStorage.setItem("token", this.token);
            // localStorage.setItem("token",this.token)
            this.setState({
                disableAlert:false
            })

            console.log("status false email  .... " , this.state.email);
            console.log("status false password ...." , this.state.password );
          }
          else {
            this.setState({
              lock:true
            })
            this.message="You Are Logging In"
            this.notify("tc",true);
            this.loginUserName=body.user.name
              this.loginUserNameType=body.user.type
              this.emailOfLogedInUser=body.user.email

            console.log("loginUserName" , this.loginUserName);
            this.token=body.token
            this.user_id=body.user._id
            localStorage.setItem("token",this.token)
            sessionStorage.setItem("token", this.token);
            localStorage.setItem("distribution","true")
                localStorage.setItem("loginUserName",this.loginUserName)
                localStorage.setItem("user_id",  this.user_id)
                localStorage.setItem("user_type",  this.loginUserNameType)
                localStorage.setItem("user_email",  this.emailOfLogedInUser)
      setTimeout(()=>{
        window.location.href='/mainpage'
      },1000)
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

  handleForgotPassword=()=>
  {
    console.log("forgot clicked ");
    this.props.history.push('/forgotpassword');

  }

  handleChange=(event)=>
  {
    console.log("Setting "+event.target.name + " to ", event.target.value);
    this.setState({[event.target.name]: event.target.value});

    if(event.target.name==='email')
    {
      this.setState({
        email:event.target.value
      })
      this.email=event.target.value
    }
    else if (event.target.name==='password')
    {
      this.setState({
        password:event.target.value
      })
      this.password=event.target.value
    }
    // this.setState((state, props) => {
    //   return {counter: state.counter + props.step};
    // });
  }

  render() {
      console.log("Render" , this.state.disableAlert);
      console.log("status false email  ....render " , this.state.email ,this.state.password );
    return (

        <div className="AdminLogin">

          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <div className="loginDiv">
      {    (false)  ?

        <div class="wrapperLock">

          <div class="base">
            <div class="base-bottom">
            </div>
            <div class="lock-inside-top">
            </div>
            <div class="lock-inside-bottom">
            </div>
          </div>

          <div class="lock-cirlce">
            <div class="lock-circle-inside">
            </div>
          </div>

          <div class="lock-box">
          </div>

        </div>
      :
''
    }

            <div className="loginFormDiv">
                 <form onSubmit={this.handleLogin}>

                   <img className="logoimg" src="logo-ammad-small.png"/>
              <p style={loginTitle}>Login To Continue</p>
              <InputGroup style={{width:"100%"}}>
                <div className="fieldIcon"><i className="tim-icons icon-email-85"></i></div>
                <Input ref={(input)=>{
                  this.emailRef=input
                }}
                onKeyUp={this.onKeyUpfunc}type="text" style={InputStyle} placeholder="email" name="email" onChange={this.handleChange}/>
              </InputGroup>
              <InputGroup>
                <div className="fieldIcon"><i className="tim-icons icon-lock-circle"></i></div>

                <Input ref={(input)=>{
                  this.passwordRef=input
                }}onKeyUp={this.onKeyUpfunc} type="password" style={InputStyle} placeholder="password" name="password" onChange={this.handleChange} />
              </InputGroup>
            {/*  <p style={forgotPasswordText} onClick={this.handleForgotPassword}>forgot password?</p>*/}

              <div className="loginBtnDiv">
                <Button       ref={(input)=>{
                        this.submitRef=input
                      }} onKeyUp={this.onKeyUpfunc}
                       color='info' style={{width:"51%", marginTop:"25px"}} name='button' onClick={this.handleLogin} disabled={this.state.disableAlert}>

              {
              (this.state.disableAlert) ?
              <i className="fa fa-spinner fa-spin fa-1x fa-fw"></i>
              :  <span style={{display:'flex' , justifyContent:'center'}}><i style={{marginRight:'12px' , paddingTop:'3px'}}class="fa fa-user fa-fw"></i> <span>Login</span></span>
              }
                </Button>
              </div>
                  </form>
          { /*   <div>
              <span style={{cursor:'pointer',color:'royalblue', marginLeft:'70%',marginTop:'1%',textDecoration:'underline'}}onClick={this.onClickSignup}>Signup</span>
              </div>*/}
            </div>

          </div>


        </div>

    );
  }
}

export default Login;
