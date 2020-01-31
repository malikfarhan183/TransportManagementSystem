import React from "react";
// nodejs library that concatenates classes
// import classNames from "classnames";
// react plugin used to create charts
// import {
//   Line,
//   Bar
// } from "react-chartjs-2";

// reactstrap components
import {
  Button,
  // ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  // Form,
  CardText,
  // CardTitle,
  // DropdownToggle,
  // DropdownMenu,
  // DropdownItem,
  // UncontrolledDropdown,
  // Label,
  // FormGroup,
  // Input,
  // Table,
  Row,
  Col,
  // Dropdown,
  // UncontrolledTooltip
} from "reactstrap";




// core components
// import {
  // chartExample1,
//   chartExample2,
//   chartExample3,
//   chartExample4
// } from "variables/charts.jsx";
class Philosophy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
        dropdownOpen: false
    }
  }
  toggleDropdown=e=>{
    this.setState(prevState => ({
  dropdownOpen: !prevState.dropdownOpen
}));
  }
  setBgChartData = name => {
    this.setState({
      bigChartData: name
    });
  };
  render() {
    return (

      <
      div style = {{backgroundImage: 'url(favicon.png)'}} className = "content" >

      <Row>

        <Col md="12">
          <Card style={{background:'transparent'}} className="card-user">
            <CardBody>
              <CardText />
              <div className="author">
                <div style={{background:'linear-gradient(to right, rgba(132,112 , 255, 0.6) 0%, rgba(132, 112, 255, 0) 100%)'}}className="block block-one " />
                <div style={{background:'linear-gradient(to right, rgba(132,112 , 255, 0.6) 0%, rgba(132, 112, 255, 0) 100%)'}} className="block block-two " />
                <div style={{background:'linear-gradient(to right, rgba(132,112 , 255, 0.6) 0%, rgba(132, 112, 255, 0) 100%)'}} className="block block-three "  />
                <div style={{background:'linear-gradient(to right, rgba(132,112 , 255, 0.6) 0%, rgba(132, 112, 255, 0) 100%)'}} className="block block-four " />
                <a href="#pablo" onClick={e => e.preventDefault()}>

                  <h5 className="title">TRANSPORT MANAGEMENT SYSTEM</h5>
                </a>
                <p className="description">WEB APPLICATION</p>
              </div>
              <div className="card-description">
                Do not be scared of the truth because we need to restart the
                human foundation in truth And I love you like Kanye loves
                Kanye I love Rick Owens’ bed design but the back is...

                Do not be scared of the truth because we need to restart the
                human foundation in truth And I love you like Kanye loves
                Kanye I love Rick Owens’ bed design but the back is...

              </div>
              {/*<div style={{marginLeft:'43%', marginTop:'5%'}} >
              <Dropdown color="primary" isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
         <DropdownToggle caret>
            White Paper
         </DropdownToggle>
         <DropdownMenu>
         <DropdownItem onClick={this.onClickCash}>Full Version</DropdownItem>
         <DropdownItem onClick={this.onClickCheque}>Short Version</DropdownItem>
         </DropdownMenu>
         </Dropdown>
              </div>*/}

            </CardBody>
            <CardFooter>
              <div className="button-container">
                <Button className="btn-icon btn-round" color="facebook">
                  <i className="fab fa-facebook" />
                </Button>
                <Button className="btn-icon btn-round" color="twitter">
                  <i className="fab fa-twitter" />
                </Button>
                <Button className="btn-icon btn-round" color="google">
                  <i className="fab fa-google-plus" />
                </Button>

              </div>

            </CardFooter>
          </Card>
        </Col>
      </Row>
  </div>
    );
  }
}

export default Philosophy;
