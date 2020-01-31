import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
import EventBus from 'eventing-bus'
// import { Link } from "react-router-dom";
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';
// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';
import {
  Card,
  // CardHeader,
  CardBody,
  // CardTitle,
  Table,
  Row,
  Col,
  // Button
} from "reactstrap";
let aRow = ""
class AllocationMid extends React.Component {
  constructor(props){
    super(props);
    console.log("constructor::::::", this.props);
    this.state={
      newRow:[]
    }
  }

  componentWillMount()
  {
    console.log("Will Mount");
    this.tableRow=[];
  }

  componentDidMount() {
    console.log("Did Mount");
    this.formData=""
      this.allocationFormData=""
          EventBus.on("allocationBottomObjectEventBus",this.handleAllocationBottomForm)
    }
    handleAllocationBottomForm=e=>{
      console.log("Allocation Bottom DATA::",e);
      this.allocationFormData=e;
             aRow =    <tr>
               <td>002</td>
               <td>{this.allocationFormData.vehiclesData}</td>
               <td>{this.allocationFormData.noofbagsData}</td>
               <td >{this.allocationFormData.writtenorderData}</td>
               <td>{this.allocationFormData.locationData}</td>


             </tr>
           this.tableRow.push(aRow);
           console.log(this.tableRow);
           this.setState({newRow:this.tableRow})



    }
  onCLick=e=>{
    console.log('clickedd');

  //  this.orderView=<OrderDetailHome/>

  }

  render() {
    console.log('render');

    return (


       <div className="content">
                 <Row>
                   <Col md="12">
                     <Card>
                       <CardBody style={{paddingTop:'0px', overflow:'auto'}}>
                      <Table className="tablesorter table" style={{overflow:'auto'}} responsive>
                           <thead className="text-primary">
                           <tr>
                           <th>Allocated Vehicles</th>
                           </tr>
                           </thead>
                           <tbody>
                             <tr>
                               <td>001</td>
                               <td>RIM-712</td>
                                <td>700 Bags</td>
                               <td >Order Done</td>
                               <td>Rawalpindi</td>
                             </tr>
                            {this.state.newRow}
                           </tbody>
                         </Table>

                       </CardBody>
                     </Card>
                   </Col>

                 </Row>
               </div>





    );
  }
}

export default AllocationMid;
