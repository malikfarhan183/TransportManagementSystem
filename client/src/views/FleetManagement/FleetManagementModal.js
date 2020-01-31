
import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
// import EventBus from 'eventing-bus';
import {
  FormGroup, Label,
  // Progress ,
   Form,
   // Card,
   // Table,
   Row,
   Col,
   // Nav,
   Button,
   Input
} from "reactstrap";

class FleetManagementModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      buttonState:''
    };

    this.toggle = this.toggle.bind(this);
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
  }
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  render() {
      const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>;

      return (
      <div>
        <Button style={{padding:'7px'}}color="info" onClick={this.toggle}>Other Expenses</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle} close={closeBtn}><h3>Add Other Details</h3></ModalHeader>
          <ModalBody>
            <div style={{display:'flex',justifyContent:'space-evenly'}}>
            <Form>
       <Row form>
         <Col md={6}>
           <FormGroup>
             <Label for="exampleEmail">Title</Label>
             <Input type="email" name="email" id="exampleEmail" placeholder="Title " />
              <Label for="exampleEmail"></Label>
             <Input type="email" name="email" id="exampleEmail" placeholder="Title " />
              <Label for="exampleEmail"></Label>
             <Input type="email" name="email" id="exampleEmail" placeholder="Title " />
           </FormGroup>
         </Col>
         <Col md={6}>
           <FormGroup>
             <Label for="examplePassword">Field</Label>
             <Input type="password" name="password" id="examplePassword" placeholder="Field" />
              <Label for="examplePassword"></Label>
             <Input type="password" name="password" id="examplePassword" placeholder="Field" />
              <Label for="examplePassword"></Label>
             <Input type="password" name="password" id="examplePassword" placeholder="Field" />
           </FormGroup>
         </Col>
         </Row>
         </Form>
          </div>

          </ModalBody>
          <ModalFooter style={{display:'flex', justifyContent:'center'}}>
            <Button color="info" onClick={this.toggle}>Save</Button>

          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default FleetManagementModal;
