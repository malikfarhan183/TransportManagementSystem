import React from "react";
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
import ReactTooltip from 'react-tooltip'
import EventBus from 'eventing-bus';

// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


class RecieptNo extends React.Component {
  constructor(props) {
    super(props);
    console.log("REciept No component");
    this.state = {
      recieptNo:''

    };
  }

onChangeRecieptnO=e=>{
  console.log("Changing Reciept No" , e.target.value  , "&& INDEX" , e.target.name);
  this.setState({
    recieptNo:e.target.value
  })
  var  objectOFRecieptNo={
      index:this.props.recieptNo,
      recieptNo:e.target.value
    }
  setTimeout(()=>{
    console.log("Reciept No" , this.state.recieptNo);
      EventBus.publish("recieptNoOfCashEventBus",objectOFRecieptNo);
  },1000
  );
}
recieptNo=e=>{
  console.log("Clicked Reciept " , e.target.id);
  EventBus.publish("changingIndexOfRecieptNoEventBus",true);

}
  render() {
    return (

        <div style={{position:"absolute", top:"-9px", width:"149px"}}className="content">
          <ReactTooltip type='info' effect='solid'/>
        <Form>
        <FormGroup style={{marginLeft:'10px'}}row>
        <Label data-tip="Mandatory Field" for="cash">Reciept No <span style={{color:'red' , fontSize:'15px'}}>*</span> </Label>

          <Input key={this.props.recieptNo} name={this.props.recieptNo}type="text" id={this.props.recieptNo} placeholder=" Enter RecieptNo" onClick={this.recieptNo}onChange={this.onChangeRecieptnO} value={this.state.recieptNo}/>
        </FormGroup>
        </Form>

        </div>

    );
  }
}

export default RecieptNo;
