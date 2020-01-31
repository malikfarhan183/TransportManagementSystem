import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin/Admin.jsx";
// import RTLLayout from "layouts/RTL/RTL.jsx";
import Login from "views/Login/Login.js";
import ErrorBoundary from "views/ErrorBoundary/ErrorBoundary.js";
import Signup from "views/Signup/Signup.js";
import Account from "views/Account/Account.js";
import Order from "views/Order/Orders.js";
import Freight from "views/Freight/Freight.js";
import Finance from "views/Finance/Finance.js";
import UserManagement from "views/UserManagement/UserManagement.js";
import OrderDetailHome  from "views/Order/OrderDetailHome.js"
import ModalComponent from "views/Modal/Modal.js"
import OrderDetailTop from "views/Order/OrderDetailTop.js"
import VerificationTab from "views/Order/VerificationTab.js"
import DistributionTab from "views/Order/DistributionTab.js"
import CollectionTab from "views/Order/CollectionTab.js"
import EditCollection from "views/Order/EditCollection.js"
import CollectionHistoryEditModal from "views/Order/CollectionHistoryEditModal.js"
import DepositeTab from "views/Order/DepositeTab.js"
import OrderDetailBottom from "views/Order/OrderDetailBottom.js"
import AllocationHome from "views/Allocation/AllocationHome.js"
import AllocationTop from "views/Allocation/AllocationTop.js"
import AllocationBottom from "views/Allocation/AllocationBottom.js"
import AllocationMid from "views/Allocation/AllocationMid.js"
import ChangePassword from "views/ChangePassword/ChangePassword.js"
import ForgotPassword from "views/ForgotPassword/ForgotPassword.js"
import Delivery from "views/Delivery/Delivery.js"
import FleetManagement from "views/FleetManagement/FleetManagement.js"
import Cheque from "views/Delivery/Cheque.js"
import Cash from "views/Delivery/Cash.js"
import RecieptNo from "views/Delivery/RecieptNo.js"
import Online from "views/Delivery/Online.js"
import BankAccounts from "views/Delivery/BankAccounts.js"
import EditModal from "views/Delivery/EditModal.js"
import ChequeManagement from "views/ChequeManagement/ChequeManagement.js"
import BankForm from "views/Delivery/BankForm.js"
import EditOrder from "views/Delivery/EditOrder.js"
import Dealer from "views/Delivery/Dealer.js"
import Payments from "views/Payments/Payments.js"
import FleetManagementModal from "views/FleetManagement/FleetManagementModal.js"
import MainPage from "views/MainPage/MainPage.js"
import OrderHistory from "views/Delivery/OrderHistory.js"
import CollectionHistory from "views/Order/CollectionHistory.js"
import ListOfCustomerDealer from "views/CustomerLedgers/ListOfCustomerDealer.js"
import BankAccountsForCheque from "views/ChequeManagement/BankAccountsForCheque.js"
import EditCustomer from "views/UserManagement/EditCustomer.js"
import AddBank from "views/AddBank/AddBank.js"
import EditBankAccount from "views/AddBank/EditBankAccount.js"
import Banks from "views/AddBank/Banks.js"
import EditCashDepossiteToBank from "views/CashManagement/EditCashDepossiteToBank.js"
import EditUser from "views/UserManagement/EditUser.js"
import PageNotFound from "views/PageNotFound/PageNotFound.js"
import MRPAndTaxations from "views/MRPAndTaxations/MRPAndTaxations.js"
import EditMRPAndTaxations from "views/MRPAndTaxations/EditMRPAndTaxations.js"
import CollectionLedger from "views/CollectionLedger/CollectionLedger.js"
import CustomerBalances from "views/CustomerBalances/CustomerBalances.js"
import ClearAllData from "views/ClearAllData/ClearAllData.js"
// import { Offline, Online } from "react-detect-offline";
import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
const hist = createBrowserHistory();
ReactDOM.render(
  <Router history={hist}>
    {(sessionStorage.getItem("token"))
    /*(sessionStorage.getItem("token")) */?
    <ErrorBoundary>
  <Switch>
<Route path="/edituser" render={props => <EditUser {...props} />}/>
<Route path="/CustomerBalances" render={props => <CustomerBalances {...props} />}/>
<Route path="/CollectionLedger" render={props => <CollectionLedger {...props} />}/>
<Route path="/EditMRPAndTaxations" render={props => <EditMRPAndTaxations {...props} />}/>
<Route path="/MRPAndTaxations" render={props => <MRPAndTaxations {...props} />}/>
<Route path="/PageNotFound" render={props => <PageNotFound {...props} />}/>
<Route path="/recieptno" render={props => <RecieptNo {...props} />}/>
<Route path="/editbankaccount" render={props => <EditBankAccount {...props} />}/>

<Route path="/editcustomer" render={props => <EditCustomer {...props} />}/>

<Route path="/editorder" render={props => <EditOrder {...props} />}/>

<Route path="/EditCashDepossiteToBank" render={props => <EditCashDepossiteToBank {...props} />}/>

<Route path="/EditCollection" render={props => <EditCollection {...props} />}/>

    <Route path="/orderhistory" render={props => <OrderHistory {...props} />}/>
    <Route path="/editmodal" render={props => <EditModal {...props} />}/>
    <Route path="/banks" render={props => <Banks {...props} />}/>

    <Route path="/addbank" render={props => <AddBank {...props} />}/>


    <Route path="/bankaccountsforcheque" render={props => <BankAccountsForCheque {...props} />}/>
    <Route path="/listofcustomerdealer" render={props => <ListOfCustomerDealer {...props} />}/>
    <Route path="/bankaccounts" render={props => <BankAccounts {...props} />}/>
        <Route path="/collectionhistoryeditmodal" render={props => <CollectionHistoryEditModal {...props} />}/>
      <Route path="/usermanagement" render={props => <UserManagement {...props} />}/>
      <Route path="/collectionhistory" render={props => <CollectionHistory {...props} />}/>
      <Route path="/BankForm" render={props => <BankForm {...props} />}/>
   <Route path="/freight" render={props => <Freight {...props} />}/>
   <Route path="/mainpage" render={props => <MainPage {...props} />}/>
    <Route path="/fleetmanagementmodal" render={props => <FleetManagementModal {...props} />}/>
    <Route path="/payments" render={props => <Payments {...props} />}/>
   <Route path="/dealer" render={props => <Dealer {...props} />}/>
      <Route path="/cash" render={props => <Cash {...props} />}/>
   <Route path="/chequemanagement" render={props => <ChequeManagement {...props} />}/>
   <Route path="/online" render={props => <Online {...props} />}/>
      <Route path="/cheque" render={props => <Cheque {...props} />}/>
   <Route path="/Delivery" render={props => <Delivery {...props} />}/>
     <Route path="/fleetmanagement" render={props => <FleetManagement {...props} />}/>
 <Route path="/allocationbottom" render={props => <AllocationBottom {...props} />}/>
      <Route path="/allocationmid" render={props => <AllocationMid {...props} />}/>
          <Route path="/orderdetailbottom" render={props => <OrderDetailBottom {...props} />}/>
      <Route path="/allocationtop" render={props => <AllocationTop {...props} />}/>
      <Route path="/allocationhome" render={props => <AllocationHome {...props} />}/>
    <Route path="/order" render={props => <Order {...props} />}/>
    // <Route path="/order/:id" render={props => <Order {...props} />}/>
    <Route path="/depositetab" render={props => <DepositeTab {...props} />}/>
  <Route path="/collectiontab" render={props => <CollectionTab {...props} />}/>
    <Route path="/distributiontab" render={props => <DistributionTab {...props} />}/>
  <Route path="/VerificationTab" render={props => <VerificationTab {...props} />}/>
  <Route path="/orderdetailtop" render={props => <OrderDetailTop {...props} />}/>
  <Route path="/modalcomponent" render={props => <ModalComponent {...props} />}/>
  <Route path="/orderdetailhome" render={props => <OrderDetailHome {...props} />}/>
  <Route path="/account" render={props => <Account {...props} />}/>
  <Route path="/home" render={props => <AdminLayout {...props} />}/>
  <Route path="/signup" render={props => <Signup {...props} />}/>
  <Route path="/changePassword" render={props => <ChangePassword {...props} />}/>
  <Route path="/ClearAllData" render={props => <ClearAllData {...props} />}/>
  <Redirect from="/login" to="/home/dashboard"/>
  <Redirect from="/" to="/home/dashboard" />
  <Redirect from="/home" to="/home/dashboard" />
  </Switch>
  </ErrorBoundary>
:
<ErrorBoundary>
<Switch>
  <Route path="/login" render={props => <Login {...props} />}/>
  <Route path="/forgotpassword" render={props => <ForgotPassword {...props} />}/>
   ForgotPassword
        <Redirect from="/" to="/login"/>
</Switch>
</ErrorBoundary>
}
  </Router>
,
  document.getElementById("root")

);
