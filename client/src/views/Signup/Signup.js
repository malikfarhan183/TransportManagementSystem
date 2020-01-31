import React from "react";
// import  { Redirect } from 'react-router-dom'
// import Login from "../Login/Login.js"
import Account from "../Account/Account.js"
import EventBus from 'eventing-bus';



// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";
class Signup extends React.Component {

  constructor()
   {
     super();
      this.state ={
        enabled: true
      }
   }



componentWillMount(){
console.log("Will mount");


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
    console.log('did mount');
     this.password=''
    this.confirmPassword=''

    this.setState((state, props) => {
      return {counter: 0 + props.step};
    });
  }

  onClick=e=>{
    if(e.target.name==='signupBtn')
    {
      this.signupView=<Account/>
      this.setState((state, props) => {
    return {counter: 0 + props.step};
  });

  }
  else if(e.target.name==='aleadyAccount'){

console.log('click ho rha hau')
    // this.signupView=<Login/>
//     this.setState((state, props) => {
//   return {counter: 0 + props.step};
// });
    EventBus.publish("exampleEventName", "farhan");

  }
}
onChange=e=>{
  if(e.target.name==='password'){
     this.password=e.target.value;
     console.log(this.password);
  }
  else if(e.target.name==='confirmPassword'){
     this.confirmPassword=e.target.value;
     console.log(this.confirmPassword);
  }
  if(this.password!==''&&this.confirmPassword!=='')
  {
    if(this.password===this.confirmPassword){
      console.log('password matched');
      this.setState({enabled:false});
      console.log(this.state.enabled);

  }

 }
 else {
   console.log("not ");
 }

 this.setState((state, props) => {
return {counter: 0 + props.step};
});
}
  render() {
    console.log("signup render");

    return (


      <div style={{backgroundColor:'white'}}>
               <Row>
                 <Col md="08" style={{paddingRight:'40%' , paddingLeft:'35%' , paddingTop:'5%'}}>
                   <Card style={{paddingLeft:'10%', paddingRight:'10%' ,paddingTop:'5%' }}>
                     <CardHeader>
                       <h5 style={{color:'rgb(145,146,152)'}}><h2><b>Create a new account</b></h2></h5>
                     </CardHeader>
                     <CardBody>
                       <Form>
                         <Row>
                           <Col md="12">
                             <FormGroup>
                               <label>Username</label>
                               <Input

                                 placeholder="Username"
                                 type="text"
                                 autoFocus
                               />
                             </FormGroup>
                           </Col>
                           </Row>
                           <Row>
                           <Col md="6">
                             <FormGroup>
                               <label htmlFor="firstName">
                                 First Name
                               </label>
                               <Input placeholder="First Name" type="text" />
                             </FormGroup>
                           </Col>
                           <Col md="6">
                             <FormGroup>
                               <label htmlFor="secondName">
                                 Second Name
                               </label>
                               <Input placeholder="Second Name" type="text" />
                             </FormGroup>
                           </Col>
                         </Row>
                           <Row>
                           <Col md="12">
                             <FormGroup>
                               <label htmlFor="emailsignup">
                                 Email address
                               </label>
                               <Input placeholder="malik@email.com" type="email" />
                             </FormGroup>
                           </Col>
                         </Row>
                         <Row>
                           <Col md="6">
                             <FormGroup>
                               <label>password</label>
                               <Input
                                 name='password'
                                 onChange={this.onChange}
                                 placeholder="password"
                                 type="password"
                               />
                             </FormGroup>
                           </Col>

                           <Col style={{paddingRight: '4px' }} md="6">
                             <FormGroup>
                               <label>ReSubmit Password</label>
                           <Input
                                 onChange={this.onChange}
                                 name='confirmPassword'
                                 placeholder="password "
                                 type="password"
                               />
                             </FormGroup>
                           </Col>
                         </Row>
                         <Row>
                           <Col md="12">
                             <FormGroup>
                               <label>Enter Phone</label>
                               <Input
                                 placeholder="Phone number "
                                 type="text"
                               />
                             </FormGroup>
                           </Col>
                           </Row>
                           <p
                           name='aleadyAccount'
                           onClick={this.onClick}
                           style={{cursor:'pointer',textDecorationLine: 'underline'}}
                           >Already have account?</p>

                       </Form>
                     </CardBody>
                     <CardFooter>
                       <Button
                       disabled={this.state.enabled}
                       name='signupBtn'
                       className="btn-fill"
                       color="primary"
                       onClick={this.onClick}
                       >
                         Signup
                       </Button>
                     </CardFooter>
                   </Card>
                 </Col>
               </Row>
             </div>

    );
  }
}

export default Signup;
