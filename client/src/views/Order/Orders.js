import React from "react";
// import AdminNavbar from "../../components/Navbars/AdminNavbar.jsx"
// import OrderDetailHome  from "./OrderDetailHome.js"
import ModalComponent from "views/Modal/Modal.js"
import EditModal from "views/Modal/EditModal.js"
import EventBus from 'eventing-bus'
// import { Link } from "react-router-dom";
// import { InputGroup, InputGroupAddon, Input, Button, Alert, UncontrolledAlert } from 'reactstrap';
import './orders.css'
// import NotificationAlert from "react-notification-alert";
// import EventBus from 'eventing-bus';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button
} from "reactstrap";
 var _idVeriable=[]

var request = require("request");
// const url = global.baseUrl
let aRow = ""
class Orders extends React.Component {
  constructor(props){
    super(props);

    console.log("constructor::::::", this.props);
    this.state={
      verifyBtn:'Verify',
      newRow:[],
      response:[],
      responseGetAllUser:[]
    }
    this.handleOrderVerified=this.handleOrderVerified.bind(this)
    this.onEditModalClick=this.onEditModalClick.bind(this)
  }

  // componentWillMount()
  // {
  //   console.log("Will Mount");
  //   this.tableRow=[];
  //
  //   if(this.props.location.pathname=="/home/order/verified")
  //   {
  //     this.setState({
  //       verifyBtn:"Verified"
  //     });
  //      this.disbaleVerify=true
  //   }
  //   else {
  //     this.setState({
  //       verifyBtn:"Verify"
  //     });
  //
  //      this.disbaleVerify=false
  //   }
  //
  // }

  componentDidMount() {
    console.log("Did Mount");



    var options = { method: 'POST',
      url: global.baseUrl + '/api/viewAllOrders',
      headers: {'content-type': 'application/json','cache-control': 'no-cache' ,'Authorization':localStorage.getItem("token")},
      form:'',
      json: true
    };
    console.log("ooptions :: ", options);
    request(options, (error, response, body) =>
    {
      if (error)
      {
        console.log("Erfffror", error);
      }
      else
      {
        console.log("RESPONSE::",body);
        // var _id=''

        // _id.push(body.result[0][_id])

        var resp=[]
        body.result.forEach((i,idx,x)=>{
          resp.push(
            <tr>
            <td>{' '}</td>
            <td>{idx}</td>
              <td>{i['status']}</td>
                      <td>{i['created_by']['name']}</td>
                    <td>{i['quantity']}</td>
                      <td>{' verified order '}</td>
                      <td>{'dlivered data'}</td>
                        <td>{i['created_by']['address']}</td>
                          <td>{'Order Date'}</td>
                        <td>{i['deliveryDate']}</td>
                        <td>{i['description']}</td>
                        <td>
                        <Button
                             onClick={()=>{this.onCLick('verifyBtn')}}
                            style={{borderRadius: '100px',
                            marginTop:'10px',
                             height: '30px',
                             width: '100px',
                             display: 'flex',
                             justifyContent: 'center',
                             alignItems: 'center',
                             padding: '0px'}} color="info"
                             //disabled={this.disbaleVerify}
                             > Verify
                              {/*<b style={{color:'white'}}>{this.state.verifyBtn} </b>*/}
                             </Button>
                             </td>
                             <td>
                             <Button
                              style={{borderRadius: '100px',
                              marginTop:'10px',
                              height: '30px',
                              width: '100px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '0px'}}
                              onClick={()=>this.onEditModalClick()}

                              color="info"
                            > Edit</Button>

                             </td>


            </tr>
          )
        })
          this.setState({response:resp})

        console.log("res :::: ", resp);
      }
    })
    this.formData=""
     EventBus.on("formDataEventBus", this.handleOrderForm)
     EventBus.on("orderVerifiedEventBus",this.handleOrderVerified)

         this.setState((state, props) => {
         return {counter: 0 + props.step};
                });

                 EventBus.on("newUserAddedEventBus",this.newUserAddedEventBusFunc.bind(this))
    }

    newUserAddedEventBusFunc=e=>{
      console.log("Recieved New User", e);
      var joined = this.state.response.concat(e);
       this.setState({ response: joined })
        console.log("added Order",this.state.response);
    }
    handleOrderVerified=e=>{
      console.log("verified btn recieved ",e);
      this.setState({
        verifyBtn:e
      });

    }

    handleOrderForm=(e)=>{
        this.formData=e;
       console.log("Recieved data :: ",this.formData);
       //
       // aRow =    <tr>
       //   <td>001</td>
       //   <td>Pending</td>
       //   <td >{this.formData.dealerData}</td>
       //   <td>{this.formData.customerOrderData} Bags</td>
       //   <td> 0 Bags</td>
       //    <td>{this.formData.noOfbagsData}0 Bags</td>
       //   <td>{this.formData.deliveryLocationData}</td>
       //   <td style={{width:'91px'}}>{this.formData.orderDateData}2019-03-20</td>
       //    <td>{this.formData.deliveryDateData}</td>
       //    <td>{this.formData.remarksData}</td>
       //   <td>
       //   <Button
       //        onClick={()=>{this.onCLick('verifyBtn')}}
       //       style={{borderRadius: '100px',
       //        height: '30px',
       //        width: '100px',
       //        display: 'flex',
       //        justifyContent: 'center',
       //        alignItems: 'center',
       //        padding: '0px'}} color="info"
       //        disabled={this.disbaleVerify}>
       //          <b style={{color:'white'}}>{this.state.verifyBtn} </b>
       //        </Button>
       //    </td>
       // </tr>

     // this.tableRow.push(aRow);
     // console.log("This.tableRow :: ", this.tableRow);
     // this.setState({newRow:this.tableRow})
     // this.setState((state, props) => {
     // return {counter: 0 + props.step};
     //        });



     }


  onCLick=e=>{
    console.log('clickedd',e);
// <Link to="/home/orderdetailhome">
if(e==='verifyBtn')
{
  this.props.history.push('/home/orderdetailhome')
}
  //  this.orderView=<OrderDetailHome/>

  }

  onModalCLick=e=>{
  //  this.modalView=<ModalComponent/>

 console.log("Modal is Clicked");
    /*GET ALL DEALERS CALL HERE*/
    var options = { method: 'POST',
      url: global.baseUrl + '/api/getAllDealers',
      headers: {'content-type': 'application/json','cache-control': 'no-cache' ,'Authorization':localStorage.getItem("token")},
      form:'',
      json: true
    };
    console.log("ooptions of Get All  dealers Call:: ", options);
    request(options, (error, response, body) =>
    {
      if (error)
      {
        console.log("Error in Get All Dealers Call", error);
      }
      else
      {
         console.log("RESPONSE in Get All Dealers Call",body);
         /* handling response of Get all Users*/

         body.result.forEach((i,idx,x)=>{
           _idVeriable[idx]={
             id:i['_id'],
             name:i['name']
           }


         })
         console.log("users slectedd in add modal",_idVeriable);

           EventBus.publish("allUsersArrayEventBus", _idVeriable);
               EventBus.publish("exampleEventName", true);
      }
    })

  }

  onEditModalClick=(e)=>{
  console.log('clicking');


  /*GET ALL DEALERS CALL HERE*/
  var options = { method: 'POST',
    url: global.baseUrl + '/api/getAllDealers',
    headers: {'content-type': 'application/json','cache-control': 'no-cache' ,'Authorization':localStorage.getItem("token")},
    form:'',
    json: true
  };
  console.log("ooptions of Get All  dealers Call:: ", options);
  request(options, (error, response, body) =>
  {
    if (error)
    {
      console.log("Error in Get All Dealers Call", error);
    }
    else
    {
       console.log("RESPONSE in Get All Dealers Call",body);
       /* handling response of Get all Users*/

       body.result.forEach((i,idx,x)=>{
         _idVeriable[idx]={
           id:i['_id'],
           name:i['name']
         }
       })}
     })
       console.log("users slecteddddd in edit modal",_idVeriable);
        EventBus.publish("editModalEventBus", true);
EventBus.publish("allUsersArrayEditModalEventBus", _idVeriable);



  }
  render() {
    console.log('render');
    const responseArray=this.state.response;
    console.log("hhhh",responseArray);
    return (

       <div className="content">
           <ModalComponent/>
           <EditModal/>
                 <Row>
                   <Col md="12">
                     <Card>
                       <CardHeader style={{paddingTop:'25px'}}>
                         <CardTitle style={{display:'flex'}}><h2>Orders</h2>
                         <Button
                       onClick={this.onModalCLick}
                      style={{
                       height: '30px',
                       width: '90px',
                       display: 'flex',
                       justifyContent: 'center',
                       alignItems: 'center',
                       marginLeft:'80%',
                       padding: '0px'}} color="info">Add Order</Button>


                          </CardTitle>
                       </CardHeader>
                       <CardBody style={{paddingTop:'0px', overflow:'auto'}}>

                       <Table className="tablesorter table" style={{overflow:'auto'}} responsive>
                           <thead className="text-primary">


                             <tr>
                               <th className="header headerSortUp"></th>
                               <th>Id</th>
                               <th>Status</th>
                               <th>Dealer</th>
                               <th>Customer Order</th>
                               <th>Verfied Order</th>
                              <th>Delivered Order</th>
                               <th>Delivery Location</th>
                               <th>Order Date</th>
                               <th>Delivery Date</th>
                                <th>Remarks</th>
                               <th>Action</th>
                               <th>Edit</th>
                             </tr>
                           </thead>
                           <tbody>

                            {this.state.response}
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

export default Orders;
