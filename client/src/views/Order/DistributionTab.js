import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import classnames from 'classnames';
import "../styles/Styling.css"
import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import EventBus from 'eventing-bus'
import { Link } from "react-router-dom";
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

let zRow = ""

class DistributionTab extends React.Component {
    // componentWillMount()
    // {
    //
    // }

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
      console.log("Did Mount",this.props);
      this.tableRow=[]
      this.distributionTableRow=[]
      this.orderVerificationFormData=''
        EventBus.on("verificationBottomObjectEventBus", this.handleVerificationForm)

    }

    handleVerificationForm=e=>{
      console.log('VERIFVENT',e);


      // this.orderVerificationFormData=e;
      // console.log(this.orderVerificationFormData);
                 zRow =    <tr>
               <td>002</td>
               <td>{e.creditData}</td>
               <td>{e.locationData}</td>
               <td >{e.verifyOrderData}</td>
               <td>{e.unitPriceData}</td>
               <td>
               <Link to="/home/allocationhome">       <Button style={{paddingRight:'10px',paddingLeft:'10px'}}color="info" onClick={()=>this.toggleModal('1')}>Allocate Vehicles</Button> </Link>
              </td>
             </tr>
           this.distributionTableRow.push(zRow);
           console.log(this.distributionTableRow);
           this.setState({newRow:this.distributionTableRow})
    }

    constructor(props) {
      super(props);
      this.state = {
                newRow:[]
      };
    }

  render() {
    console.log("render");
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
                               <th>Order No.</th>
                               <th>Dealer</th>
                               <th>No.Of Bags</th>
                               <th>Delivery Location</th>
                               <th>Unit Price</th>
                               <th>Total Price</th>
                               <th>Delivery Date</th>
                               <th>Action</th>
                        </tr>
                       </thead>
                       <tbody>
                       <tr>
                         <td>001</td>
                         <td>Farhan</td>
                         <td>500 Bags</td>
                         <td >Rawalpindi</td>
                         <td>Rs.700</td>
                         <td>Rs.350000</td>
                         <td>2018-12-03</td>
                         <td>
                         <Link to="/home/allocationhome">       <Button style={{paddingRight:'10px',paddingLeft:'10px'}}color="info">Allocate Vehicles</Button> </Link>
                          </td>
                       </tr>


                            {this.state.newRow}
                       </tbody>
                     </Table>
                             <div>
                        {/*   <Button color="info" onClick={()=>this.toggleModal('1')}>Allocate Vehicals</Button>*/}
                           <Modal
                           toggle={this.toggle}
                            size='lg' style={{

                             width: '100%', marginTop: '145px',padding: '0px',height: '262px'

                           }}  isOpen={this.state.modalDistribution} toggleModal={this.toggleModal} className={this.props.className}>
                             <ModalHeader toggle={()=>this.toggleModal('1')}><h4>Distribution</h4></ModalHeader>
                             <ModalBody   style={{paddingTop: '17px',paddingBottom: '13px'}}>
                             <Form>
                             <div style={{display:'flex'}}>
                          <FormGroup>
                          <Label for="exampleSelect">Vehicles</Label>
                          <Input style={{width:'190px'}} onChange={this.onChangeFormDistribution}  type="select" name="vehicals" id="exampleSelect">
                              <option>MK704</option>
                              <option>RM509</option>
                             <option>RI604</option>
                          </Input>
                         </FormGroup>

                        <FormGroup>
                        <Label for="exampleEmail">No.of Bags</Label>
                        <Input onChange={this.onChangeFormDistribution}type="email" name="noOfbags" id="exampleEmail" placeholder="No.of Bags" />
                        </FormGroup>
                         </div>
                         <div style={{display:'flex'}}>
                        <FormGroup>
                          <Label for="exampleEmail">Written Order</Label>
                          <Input  onChange={this.onChangeFormDistribution}  type="email" name="deposit" id="exampleEmail" placeholder="Written Order" />
                       </FormGroup>
                        <FormGroup>
                       <Label for="exampleEmail">Location</Label>
                       <Input  onChange={this.onChangeFormDistribution}  type="email" name="reference" id="exampleEmail" placeholder="Location" />
                       </FormGroup>
                       </div>

                       </Form>
                             </ModalBody>
                            <ModalFooter>
                               <Button style={{ borderRadius: '10px', paddingBottom: '2px',paddingTop:'2px',marginLeft: '40%'}}
                               color="info" onClick={()=>this.distributionHandleData('1')}>Save
                               </Button>
                             </ModalFooter>
                           </Modal>
                         </div>

                     </div>


                      </CardBody>

                    {/*     <div  style={{textAlign:'center',marginTop:'40px',marginBottom:'40px'}}className="col-md-12">
                         <Button color="info">save</Button>

                      <Button
                         onClick={() => { this.toggle('3'); }}
                         style={{marginRight:'100px'}}color="info">next</Button>
                      </div>    */}
                      </Card>
                     </Col>
                    </Row>
                 </div>

    );
  }
}

export default DistributionTab ;
