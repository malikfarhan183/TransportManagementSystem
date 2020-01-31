const express = require('express');
var app = express();

var router = express.Router();
var user = require('../api/user.js');
var payment = require('../api/payment.js');
var freight = require('../api/delivery.js');
var order = require('../api/order.js');

var path = require('path')

var tax = require('../api/tax.js');


router.post('/tax/create', tax.addTax); // <--------------------------

// router.post('/createUpdateTaxInfo',tax.createUpdateTaxInfo);


router.post('/register', user.register);
router.post('/authenticate', user.authenticate);
router.post('/getMobile', user.getMobile);
router.post('/updatePassword', user.updatePassword);
router.post('/sendPushNotification', user.sendPushNotification);
router.post('/registerWithFacebook', user.registerWithFacebook);
router.post('/registerWithGoogle', user.registerWithGoogle);
router.post('/getAllBanks', payment.getAllBanks);
router.post('/getAllBankAccounts', payment.getAllBankAccounts);
// router.post('/getAllTrucksInfo',freight.getAllTrucksInfo);
router.post('/calculateLedger',tax.calculateLedger);
router.post('/calculateSingleUserLedger',tax.calculateSingleUserLedger);
router.post('/getCustomersCustomBalance', user.getCustomersCustomBalance);
router.post('/exportLedgerFile',tax.exportLedgerFile);
var reports = require('../api/reports.js');
router.post('/fbrReport',reports.fbrReport);
router.post('/saleReport',reports.saleReport);
router.post('/collectionReport',reports.collectionReport);
router.post('/userBalanceReport',reports.userBalanceReport);
router.post('/getAllPayments',payment.getAllPayments);
router.post('/balanceTillDate',reports.balanceTillDate);
router.post('/dealerDeposittedTillDate',reports.dealerDeposittedTillDate);
router.post('/userBalanceReport',reports.userBalanceReport);

module.exports = router;
