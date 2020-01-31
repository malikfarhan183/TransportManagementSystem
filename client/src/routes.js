import Dashboard from "views/Dashboard/Dashboard.jsx";
// import Icons from "views/Icons.jsx";
// import Map from "views/Map.jsx";
// import Notifications from "views/Notifications.jsx";
// import Rtl from "views/Rtl.jsx";
// import TableList from "views/TableList.jsx";
// import Typography from "views/Typography.jsx";
// import UserProfile from "views/UserProfile.jsx";
// import Order from "views/Order/Orders.js";
import Freight from "views/Freight/Freight.js";
// import Finance from "views/Finance/Finance.js";
//import Distribution from "views/Distribution/Distribution.js";
// import DistributionTab from "views/Order/DistributionTab.js"
import CollectionTab from "views/Order/CollectionTab.js"
// import DepositeTab from "views/Order/DepositeTab.js"
import UserManagement from "views/UserManagement/UserManagement.js";
// import OrderDetailHome  from "views/Order/OrderDetailHome.js"
// import AllocationHome from "views/Allocation/AllocationHome.js"
import Delivery from "views/Delivery/Delivery.js"
import CustomerManagement from "views/UserManagement/CustomerManagement.js"
import FleetManagement from "views/FleetManagement/FleetManagement.js"
import ChequeManagement from "views/ChequeManagement/ChequeManagement.js"
// import Philosophy from "views/Philosophy/Philosophy.js"
import CashManagement from "views/CashManagement/CashManagement.js"
// import Payments from "views/Payments/Payments.js"
import CustomerLedgers from "views/CustomerLedgers/CustomerLedgers.js"
// import BankStatement from "views/BankStatement/BankStatement.js"
import TruckDatabase from "views/TruckDatabase/TruckDatabase.js"
import CollectionHistory from "views/Order/CollectionHistory.js"
import OrderHistory from "views/Delivery/OrderHistory.js"
import ListOfCustomerDealer from "views/CustomerLedgers/ListOfCustomerDealer.js"
import AddBank from "views/AddBank/AddBank.js"
import EditOrder from "views/Delivery/EditOrder.js"
import EditCollection from "views/Order/EditCollection.js"
import EditCashDepossiteToBank from "views/CashManagement/EditCashDepossiteToBank.js"
import EditCustomer from "views/UserManagement/EditCustomer.js"
import EditUser from "views/UserManagement/EditUser.js"
import EditBankAccount from "views/AddBank/EditBankAccount.js"
import RecieptNo from "views/Delivery/RecieptNo.js"
import MRPAndTaxations from "views/MRPAndTaxations/MRPAndTaxations.js"
import EditMRPAndTaxations from "views/MRPAndTaxations/EditMRPAndTaxations.js"
import CollectionLedger from "views/CollectionLedger/CollectionLedger.js"
import CustomerBalances from "views/CustomerBalances/CustomerBalances.js"
import ClearAllData from "views/ClearAllData/ClearAllData.js"

var routes = []
var userType=localStorage.getItem("user_type") //if loggedIn User is super then clear data will show on side bar otherwise not
{(localStorage.getItem("distribution"))
?
routes = [
  // {
  //   path: "/philosophy",
  //   name: "INTRODUCTION",
  //   icon: "tim-icons icon-chart-pie-36",
  //   component: Philosophy,
  //   layout: "/home"
  // },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-molecule-40",
    component: Dashboard,
    layout: "/home"
  },
  {
    path: "/Delivery",
    name: "Add Delivery",
    icon: "tim-icons icon-delivery-fast",
    component: Delivery,
    layout: "/home"
  },
  {
    path: "/orderhistory",
    name: "Delivery History",
    icon: "tim-icons icon-delivery-fast",
    component: OrderHistory,
    layout: "/home"
  },
  {
    path: "/recieptno",
    name: "RecieptNo",
    icon: "tim-icons icon-delivery-fast",
    component: RecieptNo,
    layout: "/home"
  },
  {
    path: "/addCollection",
    name: "Add Collections",
    icon: "tim-icons icon-bag-16",
    component: CollectionTab,
    layout: "/home"
  },
  {
    path: "/EditOrder/:id",
    name: "Edit Order",
    icon: "tim-icons icon-bag-16",
    component: EditOrder,
    layout: "/home"
  },
  {
    path: "/EditCashDepossiteToBank/:id",
    name: "EditCashDepossiteToBank",
    icon: "tim-icons icon-bag-16",
    component: EditCashDepossiteToBank,
    layout: "/home"
  },
  {
    path: "/EditCollection/:id",
    name: "EditCollection",
    icon: "tim-icons icon-bag-16",
    component: EditCollection,
    layout: "/home"
  },
  {
    path: "/collectionhistory",
    name: "Collection History",
    icon: "tim-icons icon-bag-16",
    component: CollectionHistory,
    layout: "/home"
  },
  {
    path: "/CashManagement",
    name: "Cash Management",
    icon: "tim-icons icon-money-coins",
    component: CashManagement,
    layout: "/home"
  },
  {
    path: "/ChequeManagement",
    name: "Cheque Management",
    icon: "tim-icons icon-paper",
    component: ChequeManagement,
    layout: "/home"
  },
  {
    path: "/CustomerBalances",
    name: "Customer Balances",
    icon: "tim-icons icon-satisfied",
    component: CustomerBalances,
    layout: "/home"
  },
  {
    path: "/CollectionLedger",
    name: "Collector's Ledger",
    icon: "tim-icons icon-bag-16",
    component: CollectionLedger,
    layout: "/home"
  },
  {
    path: "/listofcustomerdealer",
    name: "Customer Ledgers",
    icon: "tim-icons icon-single-02",
    component: ListOfCustomerDealer,
    layout: "/home"
  },
  {
    path: "/MRPAndTaxations",
    name: "MRP And Taxations",
    icon: "tim-icons icon-wallet-43",
    component: MRPAndTaxations,
    layout: "/home"
  },
  {
    path: "/EditMRPAndTaxations/:id",
    name: "EditMRPAndTaxations",
    icon: "tim-icons icon-single-02",
    component: EditMRPAndTaxations,
    layout: "/home"
  },
  {
    path: "/customerledgers/:id",
    name: "Customer Ledgerss",
    icon: "tim-icons icon-satisfied",
    component: CustomerLedgers,
    layout: "/home"
  },
  // {
  //   path: "/Payments",
  //   name: "Payments",
  //   icon: "tim-icons icon-coins",
  //   component: Payments,
  //   layout: "/home"
  // },
  //
  // {
  //   path: "/allocationhome",
  //   name: "allocationhome",
  //   icon: "tim-icons icon-chart-pie-36",
  //   component: AllocationHome,
  //   layout: "/home"
  // },
  // {
  //   path: "/orderdetailhome",
  //   name: "orderdetailhome",
  //   icon: "tim-icons icon-chart-pie-36",
  //   component: OrderDetailHome,
  //   layout: "/home"
  // },
  // {
  //   path: "/order",
  //   name: "Orders",
  //   icon: "tim-icons icon-chart-pie-36",
  //   component: Order,
  //   layout: "/home"
  // },
  // {
  //   path: "/order/:id",
  //   name: "orders",
  //   icon: "tim-icons icon-chart-pie-36",
  //   component: Order,
  //   layout: "/home"}
  // ,
  // {
  //   path: "/distributiontab",
  //   name: "Distribution",
  //   icon: "tim-icons icon-chart-pie-36",
  //   component: DistributionTab,
  //   layout: "/home"
  // },
  // {
  //   path: "/deposit",
  //   name: "Deposit",
  //   icon: "tim-icons icon-chart-pie-36",
  //   component:DepositeTab,
  //   layout: "/home"
  // },
  // {
  //   path: "/bankstatement",
  //   name: "Bank Statement",
  //   icon: "tim-icons icon-bank",
  //   component: BankStatement,
  //   layout: "/home"
  // },
  {
    path: "/customermanagement/:id",
    name: "Customer Management",
    icon: "tim-icons icon-satisfied",
    component: CustomerManagement,
    layout: "/home"
  },
  {
    path: "/EditCustomer/:id",
    name: "EditCustomer",
    icon: "tim-icons icon-image-02",
    component: EditCustomer,
    layout: "/home"
  },
  {
    path: "/editbankaccount/:id",
    name: "EditBankAccount",
    icon: "tim-icons icon-image-02",
    component: EditBankAccount,
    layout: "/home"
  },
  {
    path: "/edituser/:id",
    name: "EditUser",
    icon: "tim-icons icon-image-02",
    component: EditUser,
    layout: "/home"
  },
  {
    path: "/usermanagement",
    name: "User Management",
    icon: "tim-icons icon-single-02",
    component: UserManagement,
    layout: "/home"
  },
  {
    path: "/AddBank",
    name: "Banks Management",
    icon: "tim-icons icon-bank",
    component: AddBank,
    layout: "/home"
  },
  (userType==='super')
  ?
  {
    path: "/ClearAllData",
    name: "Clear All Data",
    icon: "tim-icons icon-trash-simple",
    component: ClearAllData,
    layout: "/home"
  }
  :'',

// {
// path: "/finance",
// name: "Finance",
// icon: "tim-icons icon-notes",
// component: Finance,
// layout: "/home"
// },
  // {
  //   path: "/distribution",
  //   name: "Distribution",
  //   icon: "tim-icons icon-chart-pie-36",
  //   component: Distribution,
  //   layout: "/home"
  // },


  // {
  //   path: "/icons",
  //   name: "Icons",
  //   rtlName: "الرموز",
  //   icon: "tim-icons icon-atom",
  //   component: Icons,
  //   layout: "/home"
  // },
  // {
  //   path: "/map",
  //   name: "Map",
  //   rtlName: "خرائط",
  //   icon: "tim-icons icon-pin",
  //   component: Map,
  //   layout: "/home"
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   rtlName: "إخطارات",
  //   icon: "tim-icons icon-bell-55",
  //   component: Notifications,
  //   layout: "/home"
  // },
  // {
  //   path: "/user-profile",
  //   name: "User Profile",
  //   rtlName: "ملف تعريفي للمستخدم",
  //   icon: "tim-icons icon-single-02",
  //   component: UserProfile,
  //   layout: "/home"
  // },
  // {
  //   path: "/tables",
  //   name: "Table List",
  //   rtlName: "قائمة الجدول",
  //   icon: "tim-icons icon-puzzle-10",
  //   component: TableList,
  //   layout: "/home"
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   rtlName: "طباعة",
  //   icon: "tim-icons icon-align-center",
  //   component: Typography,
  //   layout: "/home"
  // },
  // {
  //   path: "/rtl-support",
  //   name: "RTL Support",
  //   rtlName: "ار تي ال",
  //   icon: "tim-icons icon-world",
  //   component: Rtl,
  //   layout: "/rtl"
  // }
]

:
(localStorage.getItem("transportation"))
?
routes = [
    {
      path: "/freight",
      name: "Freight",
      icon: "tim-icons icon-chart-pie-36",
      component: Freight,
      layout: "/home"
    },
    {
      path: "/fleetmanagement",
      name: "Fleet Management",
      icon: "tim-icons icon-bus-front-12",
      component: FleetManagement,
      layout: "/home"
    },
    {
      path: "/truckdatabase",
      name: "Truck Database",
      icon: "tim-icons icon-paper",
      component: TruckDatabase,
      layout: "/home"
    }
]
:
routes = []
}


export default routes;
