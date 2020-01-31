const express = require('express');
var router = express.Router();
var freight = require('../api/delivery.js');
// //routes for user table of database
var user = require('../api/user.js');
var order = require('../api/order.js');
var payment = require('../api/payment.js');
var tax = require('../api/tax.js');


//router.post('/tax', tax.addTax); // <--------------------------

router.post('/changePassword', user.changePassword);
router.post('/updateUser', user.edit);
router.post('/uploadProfilePicture', user.uploadProfilePicture);
router.post('/getAllUsersAdmin', user.getAllUsersAdmin);
router.post('/getUnread', user.getUnread);
router.post('/readNotifications', user.readNotifications);
router.post('/getAllCustomers', user.getAllCustomers);
router.post('/getAllDealers', user.getAllDealers);
router.post('/createUser', user.createUser);
router.post('/getSingleUser', user.getSingleUser);
router.post('/getAllCustomersAndDealers', user.getAllCustomersAndDealers);
router.post('/getCustomersCustomBalance', user.getCustomersCustomBalance);


router.post('/createOrder', order.createOrder);
router.post('/viewOrder', order.viewOrder);
router.post('/viewAllOrders', order.viewAllOrders);
router.post('/updateOrder', order.updateOrderManager);
router.post('/getAllPendingCheques', payment.getAllPendingCheques);

router.post('/getAllUnderProcessCheques', payment.getAllUnderProcessCheques);
router.post('/updateOrderTM', freight.updateOrderTM);
router.post('/getAllBouncedCheques', payment.getAllBouncedCheques);
router.post('/viewAllTaxes',tax.viewAllTaxes);

router.post('/createPayment', payment.createPayment1);
router.post('/updatePayment', payment.updatePayment);
router.post('/getAllPayments', payment.getAllPayments);
router.post('/getSinglePayments', payment.getSinglePayments);
router.post('/createBank', user.createBank);
router.post('/createDealerDeliveryOrder', freight.createDealerDeliveryOrder);
router.post('/createEnduserDeliveryOrder', freight.createEnduserDeliveryOrder);
router.post('/depositCheque', payment.depositCheque);
router.post('/updateChequeStatus', payment.updateChequeStatus);
router.post('/issueCheque', payment.issueCheque);
router.post('/getAllIssuedCheques', payment.getAllIssuedCheques);
router.post('/updateIssuedChequeStatus', payment.updateIssuedChequeStatus);
router.post('/addCashOnHandToBank', payment.addCashOnHandToBank);
router.post('/addTruckInfo', freight.addTruckInfo);
router.post('/getAllTrucksInfo', freight.getAllTrucksInfo);
router.post('/getAllDeposittedCheques', payment.getAllDeposittedCheques);
router.post('/checkBalanceInAccount', payment.checkBalanceInAccount);
router.post('/getTotalCashInHand', payment.getTotalCashInHand);
//router.post('/totalCollectedByPerson', payment.totalCollectedByPerson);
//router.post('/totalDebitedByPerson', payment.totalDebitedByPerson);
//router.post('/getTotalCashInHandByPerson', payment.getTotalCashInHandByPerson);
router.post('/createNewBankAccount', payment.createNewBankAccount);
router.post('/updateBank', user.updateBank);
router.post('/createBankAccount', user.createBankAccount);
router.post('/updateBankAccount', user.updateBankAccount);
router.post('/associateDriverWithTruck', freight.associateDriverWithTruck);
router.post('/addCashOnHandToBankHistory', payment.addCashOnHandToBankHistory);
router.post('/updateOrder', order.updateOrderManager);
// router.post('/updatePayment', payment.updatePayment);
router.post('/getCashInHandManagementHistory', user.getCashInHandManagementHistory);
router.post('/getSingleAccountDetails', user.getSingleAccountDetails);
router.post('/createUpdateTaxInfo',tax.createUpdateTaxInfo);

var reports = require('../api/reports.js');
router.post('/fbrReport',reports.fbrReport);
router.post('/collectionReport',reports.collectionReport);
router.post('/saleReport',reports.saleReport);
router.post('/userBalanceReport',reports.userBalanceReport);
router.post('/balanceTillDate',reports.balanceTillDate);


module.exports = router;
