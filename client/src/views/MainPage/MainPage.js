import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import {
//   InputGroupAddon,
//    Input,
//     Button,
//      Alert,
//       UncontrolledAlert,
//       Card,
//         CardHeader,
//         CardBody,
//         CardTitle,
//         Table,
//         Row,
//         Col
//       } from 'reactstrap';
// import ForgotPassword from "./forgotPassword.js";
import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';
import './MainPage.css'

// var request = require("request");
// const url = global.baseUrl
// const url = "http://localhost:1338"


class MainPage extends React.Component {

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
        {
          (this.errMsg)?
            <div>
              {this.errMsg}
            </div>
            :
            <div>
              YOU ARE LOGING IN..
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



  componentDidMount()
  {

  }
onClickTransportation=e=>{
  console.log("Transportaion  clicked");
  localStorage.setItem("transportation","true")
  localStorage.removeItem("distribution");

          window.location.href=('/home/freight');

}
onClickDistribution=e=>{
  console.log("Distribution clicked ");
  localStorage.setItem("distribution","true")
  localStorage.removeItem("transportation");

   window.location.href=('/home/dashboard');

}
  render() {
    return (
        <div style={{paddingTop:'47px'}}>
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>

<nav class="nav-bar-top">
  <a class="navbar-brand" href="#">
    <br />
    <img src="logo-ammad-small.png"/>
    <h2><strong style={{textAlign: 'center', color:'black', textDecoration: 'underline'}}>Welcome To ATMS </strong></h2>
    <h4 style={{textAlign: 'center', paddingLeft:'3px'}}>Please Select Category</h4>
    <br />
  </a>
</nav>
<div className="category row">
<div onClick={this.onClickDistribution} class="col-md-3 col-lg-3">
  <div className="card-stats card" style={{height:"100%"}}>

    <div className="card-body" style={{height:"70px"}}>
      <div className="row">
        <div className="col-5">
          <div  className="cardLogo1">
            <i className="tim-icons icon-chart-bar-32"></i>
          </div>
        </div>
        <div className="col-7">
          <div className="CardHeaderText">
            <p className="card-category" style={{cursor:'pointer' , fontSize:"16px", fontWeight:'bold'}}>Distribution</p>
            <h2 className="card-title"></h2>
          </div>
        </div>
      </div>
    </div>

    <div className="card-footer">
      <hr/>
      <div className="stats">
      <i class="tim-icons icon-chart-bar-32"></i>  Distribution Options
      </div>
    </div>
  </div>
</div>

<div className="category" onClick = {this.onClickTransportation} class="col-md-3 col-lg-3">
  <div className="card-stats card" style={{height:"100%"}}>
    <div className="card-body" style={{height:"70px"}}>
      <div className="row">
        <div className="col-5">
          <div  className="cardLogo2">
            <i className="tim-icons icon-bus-front-12"></i>
          </div>
        </div>
        <div className="col-7">
          <div className="CardHeaderText">
            <p className="card-category" style={{fontSize:"16px" , fontWeight:'bold'}}>Transportation</p>
            <h2 className="card-title"></h2>
          </div>
        </div>
      </div>
    </div>
    <div className="card-footer">
      <hr/>
      <div className="stats">
      <i class="tim-icons icon-bus-front-12"></i> Transportation Options
      </div>
    </div>
  </div>
</div>
</div>
        </div>

    );
  }
}

export default MainPage;
