import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import {Form,FormGroup,Label,Input} from "reactstrap"
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
 import EventBus from 'eventing-bus';


class Date extends React.Component {
  constructor(props){
    super(props);
    this.state={
      date:''
    }
  }
  onChangeDate=e=>{
    console.log("DATE",e.target.value);
    EventBus.publish("dateEventingBus", e.target.value);

  }
  onChangeDate=e=>{
    console.log("DATE",e.target.value);
    this.setState({
      date:e.target.value
    })
    // EventBus.publish("dateEventingBus", e.target.value);

  }

  render() {
    return (

        <div className="content">
           <Form>
           <FormGroup>
             <Label style={{fontWeight:'bold'}} for="date">Date</Label>
             <Input
             onChange={this.onChangeDate}
             style={{width:'20%',marginBottom:'30px'}}type="Date" name="date" id="date" placeholder="Choose a Date" />
           </FormGroup>
           </Form>
        </div>


    );
  }
}

export default Date;
