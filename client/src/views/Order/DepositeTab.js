import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import classnames from 'classnames';
import "../styles/Styling.css"
import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import EventBus from 'eventing-bus'
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';

// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';


import {
   Form,
   FormGroup,
   Label,
   Card,
   CardBody,
   Table,
   Row,
   Col,
   // Nav,
   Button,
   Input
} from "reactstrap";
let tabStyle1={color:'black'}
let tabStyle2={color:'black'}
let tabStyle3={color:'black'}
let tabStyle4={color:'black'}
let cRow=""
class DepositeTab extends React.Component {


  handleDepositeForm=e=>{
    console.log(e);
    this.formDepositeData=e;
   console.log("Recieved data :: ",this.formDepositeData);

   cRow =    <tr>
     <td>{this.formDepositeData.typeData}</td>
     <td>Rs.{this.formDepositeData.amountData}</td>
     <td >{this.formDepositeData.dateData}</td>
     <td>{this.formDepositeData.submittedByData}</td>
      <td>{this.formDepositeData.referenceData}</td>
     </tr>
 this.tableDepositeRow.push(cRow);
 console.log('after adding values in table::',this.tableDepositeRow);

  }
  componentWillMount()
  {
    console.log("Will Mount");
    this.tableDepositeRow=[]
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
    this.vehicalsData='';
      this.noOfbagsData='';
          this.depositData='';
          this.typeData='';
          this.amountData='';
          this.dateData='';
            this.collectedByData='';
            this.referenceData='';
            this.submittedByData='';
EventBus.on("formDataDepositeEventBus", this.handleDepositeForm)
  }


  onChangeFormDistribution=e=>{

    if(e.target.name==='type'){
      console.log(e.target.value);
      this.typeData=e.target.value;
    }
    if(e.target.name==='amount'){
      console.log(e.target.value);
      this.amountData=e.target.value;
    }
    if(e.target.name==='date'){
      console.log(e.target.value);
      this.dateData=e.target.value;
    }
    if(e.target.name==='collectedBy'){
      console.log(e.target.value);
      this.collectedByData=e.target.value;
    }

    if(e.target.name==='vehicals'){

       console.log(e.target.value);
       this.vehicalsData=e.target.value;
    }
    if(e.target.name==='noOfbags'){
      console.log(e.target.value);
      this.noOfbagsData=e.target.value;

    }
    if(e.target.name==='reference'){
      console.log(e.target.value);
      this.referenceData=e.target.value;

    }
    if(e.target.name==='deposit'){
      console.log(e.target.value);
          this.depositData=e.target.value;
    }
    if(e.target.name==='submittedBy'){
      console.log(e.target.value);
          this.submittedByData=e.target.value;
    }

  }
  depositeHandleData=e=>{
    var depositeDataObject={
      referenceData:this.referenceData,
    amountData:  this.amountData,
    dateData:  this.dateData,
    submittedByData:this.submittedByData,
    typeData:this.typeData

   }
   EventBus.publish("formDataDepositeEventBus", depositeDataObject);
   this.setState(prevState => ({
     modalDeposit: !prevState.modalDeposit,
   }));
  }
  toggleModal=(e)=> {
    console.log('entered',e);
     if(e==='1'){
      console.log('value recieved1');
    this.setState(prevState => ({
      modalDistribution: !prevState.modalDistribution,
    }));
  }
  if(e==='2'){
    console.log('value recieved2');
  this.setState(prevState => ({
    modalCollection: !prevState.modalCollection,
  }));
}
if(e==='3'){
  console.log('value recieved3');
this.setState(prevState => ({
  modalDeposit: !prevState.modalDeposit,
}));
}
  }

  toggle(tab) {
    console.log(tab);
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
      this.setState((state, props) => {
      return {counter: 0 + props.step};
             });
    }
    if(tab==='1')
    {
      console.log("Changed 1");
      tabStyle1={color:'royalblue'}
      tabStyle2={color:'black'}
      tabStyle3={color:'black'}
      tabStyle4={color:'black'}

      this.setState((state, props) => {
      return {counter: 0 + props.step};
             });
    }
    if(tab==='2')
    {
      console.log("Changed 2");
      tabStyle1={color:'black'}
      tabStyle2={color:'royalblue'}
      tabStyle3={color:'black'}
      tabStyle4={color:'black'}

      this.setState((state, props) => {
      return {counter: 0 + props.step};
             });
    }
    if(tab==='3')
    {
      console.log("Changed 3");
      tabStyle1={color:'black'}
      tabStyle2={color:'black'}
      tabStyle3={color:'royalblue'}
      tabStyle4={color:'black'}


      this.setState((state, props) => {
      return {counter: 0 + props.step};
             });
    }
    if(tab==='4')
    {
      console.log("Changed 4");
      tabStyle1={color:'black'}
      tabStyle2={color:'black'}
      tabStyle3={color:'black'}
      tabStyle4={color:'royalblue'}

      this.setState((state, props) => {
      return {counter: 0 + props.step};
             });
    }


  }

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
      this.toggleModal = this.toggleModal.bind(this);
    this.state = {
      activeTab: '1',

        modalDistribution: false,
          modalCollection: false,
            modalDeposit: false
    };
  }

  render() {
    return (


              <div className="content">
                    <Row>
                    <Col md="12">
                   <Card>
                     <CardBody>
                   <div className="content">
                     <Table className="tablesorter table" >
                     <thead className="text-primary">
                       <tr>
                         <th className="header headerSortUp">Type</th>
                           <th className="header headerSortUp">Amount</th>
                           <th className="header headerSortUp">Date</th>
                           <th className="header headerSortUp">Submitted By</th>
                             <th className="header headerSortUp">Reference NO.</th>
                      </tr>
                     </thead>
                     <tbody>
                      {this.tableDepositeRow}
                     </tbody>
                   </Table>
                           <div>
                     <Button color="info" onClick={()=>this.toggleModal('3')}>Add</Button>
                     <Modal size='lg' style={{

                       width: '100%', marginTop: '145px',padding: 'opx',height: '262px'

                     }}  isOpen={this.state.modalDeposit} toggleModal={this.toggleModal} className={this.props.className}>
                     <ModalHeader toggle={()=>this.toggleModal('3')}><h4>Deposite</h4></ModalHeader>
                       <ModalBody   style={{paddingTop: '17px',paddingBottom0: '13px'}}>
                       <Form>
                       <div style={{display:'flex'}}>
                    <FormGroup>
                    <Label for="exampleSelect">Type</Label>
                    <Input style={{width:'190px'}}  onChange={this.onChangeFormDistribution}  type="select" name="type" id="exampleSelect">
                        <option>Cheque</option>
                        <option>Online payment</option>
                    </Input>
                   </FormGroup>

                  <FormGroup>
                  <Label for="exampleEmail">Amount</Label>
                  <Input onChange={this.onChangeFormDistribution}type="email" name="amount" id="exampleEmail" placeholder="Amount" />
                  </FormGroup>
                  </div>
                  <div style={{display:'flex'}}>
                  <FormGroup>
                    <Label for="exampleEmail">Date</Label>
                    <Input  onChange={this.onChangeFormDistribution}  type="date" name="date" id="exampleEmail" placeholder="Date" />
                 </FormGroup>
                 <FormGroup>
                   <Label for="exampleEmail">Submitted By</Label>
                   <Input  onChange={this.onChangeFormDistribution}  type="email" name="submittedBy" id="exampleEmail" placeholder="Collected By" />
                </FormGroup>
                 </div>
                 <div style={{display:'flex'}}>
               <FormGroup>
                 <Label for="exampleEmail">Reference No.</Label>
                 <Input  onChange={this.onChangeFormDistribution}  type="email" name="reference" id="exampleEmail" placeholder="Reference No." />
              </FormGroup>
                </div>
             </Form>
                       </ModalBody>
                       <ModalFooter>
                         <Button style={{ borderRadius: '10px', paddingBottom: '2px',paddingTop:'2px',marginLeft: '40%'}}
                         color="info" onClick={()=>this.depositeHandleData('3')}>Save
                         </Button>
                       </ModalFooter>
                     </Modal>
                   </div>
                       </div>
                        </CardBody>

                        <div  style={{textAlign:'center',marginTop:'40px',marginBottom:'40px'}}className="col-md-12">
                           <Button color="info">save</Button>
                        {/*     <Button style={{marginRight:'100px'}}color="info">next</Button> */}
                        </div>
                    </Card>
                        </Col>
                  </Row>


            </div>

    );
  }
}

export default DepositeTab ;
