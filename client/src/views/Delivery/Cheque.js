import React from "react";
import EventBus from 'eventing-bus'
import ReactTooltip from 'react-tooltip'
import {
  FormGroup, Label,
   Form,
   // Card,
   // Table,
   // Row,
   // Col,
   // Nav,
   // Button,
   Input
} from "reactstrap";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
class Cheque extends React.Component {

  constructor(props) {
    console.log("Cheque Component!!!");
    super(props);
    this.state = {
       chequeNo:''
    };
  }
  saveCheque=e=>{
    console.log("Cheque Saved");
    EventBus.publish("saveCashEventBus", true);
  }
  onChangeChequeNo=e=>{
    console.log("CHEQUE NO" , e.target.value);
    this.setState({
      chequeNo:e.target.value
    })
    var  objectOFRefNo={
        referenceNo:e.target.value,
        index:this.props.paymentNo
      }
    setTimeout(()=>{
      EventBus.publish("ChequeNoEventBus", objectOFRefNo);
    },1000)

  }

  render() {
    console.log("Render Of Cheque Componenet"  ,this.props.paymentNo);
    return (

        <div style={{width:"36%",position:"absolute", top:"-9px"}}className="content">
        <ReactTooltip type='info' effect='solid'/>
        <Form >
        <FormGroup style={{maxWidth:'75%'}}>
        <Label data-tip="Mandatory Field" for="referenceNo" >Reference No. <span style={{color:'red' , fontSize:'15px'}}>*</span></Label>

          <Input type="text" name="referenceNo" id="referenceNo" onChange={this.onChangeChequeNo} placeholder="Enter Cheque No." />

        </FormGroup>
        {/*  <Col sm={{ size: 10, offset: 2 }}>
            <Button onClick={this.saveCheque}color='info'>Save</Button>
          </Col> */}
        </Form>
        </div>

    );
  }
}

export default Cheque;
