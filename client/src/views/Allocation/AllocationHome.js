import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import classnames from 'classnames';
import "../styles/Styling.css"
// import {Modal} from 'reactstrap';
// import EventBus from 'eventing-bus'
import AllocationTop from "views/Allocation/AllocationTop.js"
import AllocationBottom from "views/Allocation/AllocationBottom.js"
import AllocationMid from "views/Allocation/AllocationMid.js"

// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';

//
// import {
//    Form,
//    Card,
//    Table,
//    Row,
//    Col,
//    Nav,
//    Button,
//    Input
// } from "reactstrap";
// let tabStyle1={color:'black'}
// let tabStyle2={color:'black'}
// let tabStyle3={color:'black'}
// let tabStyle4={color:'black'}
// let aRow = ""
// let bRow=""
// let cRow=""
class AllocationHome extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (

      <div className="content">
        <AllocationTop/>
           <div className="content">
           <AllocationMid/>
              <div className="content">
        <AllocationBottom/>
            </div>
            </div>
        </div>
    );
  }
}

export default AllocationHome ;
