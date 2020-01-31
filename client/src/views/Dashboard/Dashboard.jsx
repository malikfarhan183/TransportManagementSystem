import React from "react";
// nodejs library that concatenates classes
// import classNames from "classnames";
// react plugin used to create charts
// import { Line, Bar } from "react-chartjs-2";
import Delivery from "views/Delivery/Delivery.js"
import ChequeManagement from "views/ChequeManagement/ChequeManagement.js"
import Freight from "views/Freight/Freight.js";
import FleetManagement from "views/FleetManagement/FleetManagement.js"
import Order from "views/Order/Orders.js";
import DistributionTab from "views/Order/DistributionTab.js"
import CollectionTab from "views/Order/CollectionTab.js"

// reactstrap components
// import {
  // Button,
  // ButtonGroup,
  // Card,
  // CardHeader,
  // CardBody,
  // CardTitle,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
  // UncontrolledDropdown,
  // Label,
  // FormGroup,
  // Input,
  // Table,
  // Row,
  // Col,
  // UncontrolledTooltip
// } from "reactstrap";

// core components
// import {
//   chartExample1,
//   chartExample2,
//   chartExample3,
//   chartExample4
// } from "variables/charts.jsx";
import "./dashboard.css"
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
      pageToLoad:false
    };
  }
  setBgChartData = name => {
    this.setState({
      bigChartData: name
    });
  };
  onClickSeeMore=e=>{
    console.log("clickedd see morenn here");
    this.setState({
        pageToLoad:!this.state.pageToLoad
    })
  }
  render() {

    return (

        <div className="content">


            <div className="row">
              <div class="col-md-6 col-lg-3">
                <div className="card-stats card" style={{height:"100%"}}>

                  <div className="card-body" style={{height:"70px"}}>
                    <div className="row">
                      <div className="col-5">
                        <div className="cardLogo1">
                          <i className="tim-icons icon-molecule-40"></i>
                        </div>
                      </div>
                      <div className="col-7">
                        <div className="CardHeaderText">
                          <p className="card-category" style={{fontSize:"16px"}}>All Customers</p>
                          <h2 className="card-title">12</h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-footer">
                    <hr/>
                    <div className="stats">
                    <i class="tim-icons icon-watch-time"></i>  All Customers
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-lg-3">
                <div className="card-stats card" style={{height:"100%"}}>
                  <div className="card-body" style={{height:"70px"}}>
                    <div className="row">
                      <div className="col-5">
                        <div className="cardLogo2">
                          <i className="tim-icons icon-molecule-40"></i>
                        </div>
                      </div>
                      <div className="col-7">
                        <div className="CardHeaderText">
                          <p className="card-category" style={{fontSize:"16px"}}>All Processed Orders</p>
                          <h2 className="card-title">05</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <hr/>
                    <div className="stats">
                    <i class="tim-icons icon-sound-wave"></i>  All Processed Orders
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-lg-3">
                <div className="card-stats card" style={{height:"100%"}}>
                  <div className="card-body" style={{height:"70px"}}>
                    <div className="row">
                      <div className="col-5">
                        <div className="cardLogo3">
                          <i className="tim-icons icon-molecule-40"></i>
                        </div>
                      </div>
                      <div className="col-7">
                        <div className="CardHeaderText">
                          <p className="card-category" style={{fontSize:"16px"}}>Undeposited Collections</p>
                          <h2 className="card-title">08</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <hr/>
                    <div className="stats">
                      <i class="tim-icons icon-trophy"></i>  Undeposited Collections
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6 col-lg-3">
                <div className="card-stats card" style={{height:"100%"}}>
                  <div className="card-body" style={{height:"70px"}}>
                    <div className="row">
                      <div className="col-5">
                        <div className="cardLogo4">
                          <i className="tim-icons icon-molecule-40"></i>
                        </div>
                      </div>
                      <div className="col-7">
                        <div className="CardHeaderText">
                          <p className="card-category" style={{fontSize:"16px"}}>Receivables</p>
                          <h2 className="card-title">08</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer">
                    <hr/>
                    <div className="stats">
                      <i class="tim-icons icon-trophy"></i>  Receivables
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*    <div style={{marginTop:'5%'}}>
                <span
                onClick={this.onClickSeeMore}

                style={{background:'transparent',color:'royalblue',textDecoration:'underline',marginLeft:'40%',marginTop:'100%', cursor:'pointer'}}>
                See All Here </span>
                </div>
*/}
            {(this.state.pageToLoad===true)?

<div>
            <div style={{background:'royalblue'}}>

              <hr/>
              </div>
                         <div>
                          <Delivery/>
                         </div>
                         <div style={{background:'royalblue'}}>

                           <hr/>
                           </div>
                                    <div>

                                    <ChequeManagement/>
                                    </div>
                                    <div style={{background:'royalblue'}}>

                                      <hr/>
                                      </div>
                                               <div>

                                               <Freight/>
                                               </div>
                                               <div style={{background:'royalblue'}}>

                                                 <hr/>
                                                 </div>
                                                          <div>

                                                          <FleetManagement/>
                                                          </div>
                                                          <div style={{background:'royalblue'}}>

                                                            <hr/>
                                                            </div>
                                                                     <div>

                                                                     <Order/>
                                                                     </div>
                                                                     <div style={{background:'royalblue'}}>

                                                                       <hr/>
                                                                       </div>
                                                                                <div>

                                                                                <DistributionTab/>
                                                                                </div>
                                                                                <div style={{background:'royalblue'}}>

                                                                                  <hr/>
                                                                                  </div>
                                                                                           <div>

                                                                                           <CollectionTab/>
                                                                                           </div>
                                                                                           </div>
                              :
                              null





          }




        </div>

    );
  }
}

export default Dashboard;
