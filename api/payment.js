var payment = require('../models/payment.js');
var order = require('../models/order.js');
var user = require('../models/user.js');
var cashInHand = require('../models/cashInHand.js');
var bank = require('../models/bank.js');
var bankAccount = require('../models/bankAccount.js');
exports.createPayment = function (req, res) {
  var param = req.body;
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Reuest : ", param);
  }
  // if(req.user.type == 'manager'){
  if (param.user_id != null && param.user_id != undefined && param.user_id != '') {

  } else {
    param.issueStatus = true;
  }
  var check = 0;
  var count = 0;
  var message = [];
  var failed = 0;
  var sent = false;

  if (param.arrayOfPayments && param.arrayOfPayments.length > 0) {
    param.arrayOfPayments.forEach(function (params, idx, x) {
      if (params.collectedBy != null && params.collectedBy != undefined && params.collectedBy != '') {
        params.updatedBy = req.user._id;
      } else {
        params.collectedBy = req.user._id;
        params.updatedBy = req.user._id;
      }

      if (params.amount != null && params.amount != undefined && params.amount != '') {
        if (params.paymentType != null && params.paymentType != undefined && params.paymentType != '') {
          if (params.paymentType == 'cheque') {
            if (params.chequeNumber != undefined && params.chequeNumber != null && params.chequeNumber != '') {
              if (params.chequeDate != undefined && params.chequeDate != null && params.chequeDate != '') {
                payment.findOne({ chequeNumber: params.chequeNumber }).exec(function (error, chequeResult) {
                  if (error) {
                    failed = failed + 1;
                    check = check + 1;
                    if (check == x.length) {
                      console.log("checking", sent)
                      if (!sent) {
                        sent = true;
                        res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                      }
                    }
                    console.log("Server error")
                    //res.status(500).send({success:false, error:error});
                  } else {
                    if (chequeResult) {
                      failed = failed + 1;
                      console.log("Cheque number already exists")
                      message[count] = "Cheque number already exists";
                      check = check + 1;
                      console.log(check)
                      count++;
                      if (check == x.length) {
                        console.log("checking", sent)
                        if (!sent) {
                          sent = true;
                          res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                        }
                      }
                      //res.status(403).send({success:false , message : "Cheque number already exists."});
                    } else {
                      params.date = params.chequeDate;
                      params.status = 'pending';
                      payment.create(params).then(function (result) {
                        //  res.status(200).send({result:result})
                        check = check + 1;
                        if (check == x.length) {
                          console.log("checking", sent)
                          if (!sent) {
                            sent = true;
                            res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                          }
                        }
                      }).catch(function (e) {
                        //res.status(403).send({success:false , error:e});
                        failed = failed + 1;
                        console.log("Server error")

                        check = check + 1;
                        if (check == x.length) {
                          console.log("checking", sent)
                          if (!sent) {
                            sent = true;
                            res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                          }
                        }
                      })
                    }
                  }
                })
              } else {
                //res.status(403).send({success:false , message :"chequeDate required"})
                failed = failed + 1;
                check = check + 1;
                console.log("chequeDate required")
                message[count] = "chequeDate required";
                count++;
                if (check == x.length) {
                  console.log("checking", sent)
                  if (!sent) {
                    sent = true;
                    res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                  }
                }
              }
            } else {
              //  res.status(403).send({success:false , message :"chequeNumber required"})
            }
          } else if (params.paymentType == 'draft') {
            if (params.draftNumber != undefined && params.draftNumber != null && params.draftNumber != '') {
              if (params.draftDate != undefined && params.draftDate != null && params.draftDate != '') {
                payment.findOne({ draftNumber: params.draftNumber }).exec(function (error, chequeResult) {
                  if (error) {
                    failed = failed + 1;
                    check = check + 1;
                    if (check == x.length) {
                      console.log("checking", sent)
                      if (!sent) {
                        sent = true;
                        res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                      }
                    }
                    //res.status(500).send({success:false, error:error});
                  } else {
                    if (chequeResult) {
                      failed = failed + 1;
                      check = check + 1;
                      if (check == x.length) {
                        console.log("checking", sent)
                        if (!sent) {
                          sent = true;
                          res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                        }
                      }
                      // res.status(403).send({success:false , message : "Draft number already exists."});
                    } else {
                      params.date = params.draftDate;
                      payment.create(params).then(function (result) {
                        check = check + 1;
                        res.status(200).send({ result: result })
                      }).catch(function (e) {
                        failed = failed + 1;
                        check = check + 1;
                        if (check == x.length) {
                          console.log("checking", sent)
                          if (!sent) {
                            sent = true;
                            res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                          }
                        }
                        // res.status(403).send({success:false , error:e});
                      })
                    }
                  }
                })
              } else {
                console.log("draft date not found");
                message[count] = "draft date not found";
                count++;
                failed = failed + 1;
                check = check + 1;
                if (check == x.length) {
                  console.log("checking", sent)
                  if (!sent) {
                    sent = true;
                    res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                  }
                }
                //  res.status(403).send({success:false , message :"draftDate required"})
              }
            } else {
              failed = failed + 1;
              check = check + 1;
              if (check == x.length) {
                console.log("checking", sent)
                if (!sent) {
                  sent = true;
                  res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                }
              }
              //res.status(403).send({success:false , message :"draftNumber required"})
            }
          } else if (params.paymentType == 'cash') {
            params.status = 'success';
            params.date = params.cashDate;
            payment.create(params).then(function (result) {
              if (params.user_id != null && params.user_id != undefined && params.user_id != '') {
                user.findOne({ _id: params.user_id }).exec(function (error, userResult) {
                  if (error) {
                    failed = failed + 1;
                    check = check + 1;

                    console.log("checking", sent)


                    var query = {};
                    if (req.body.collectedBy != null && req.body.collectedBy != undefined && req.body.collectedBy != '') {
                      query = { _id: req.body.collectedBy };
                    } else {
                      query = { _id: req.user._id };
                    }
                    user.findOne(query).exec(function (error, userResult) {
                      if (error) {
                        res.status(500).send({ success: false, error: error });
                      } else {
                        userResult.credit = parse(userResult.credit) - parseInt(req.body.amount);
                        userResult.save(function (error, saved) {
                          if (error) {
                            res.status(500).send({ success: false, error: error });
                          } else {
                            if (check == x.length) {
                              if (!sent) {
                                sent = true;
                                res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                              }
                            }
                          }
                        })
                      }
                    })
                    //  }
                    // }
                    // res.status(500).send({success:false , error:error});
                  } else {
                    userResult.credit = parseInt(userResult.credit) + parseInt(params.amount);

                    userResult.save(function (error, done) {
                      if (error) {
                        failed = failed + 1;
                        check = check + 1;
                        if (check == x.length) {
                          console.log("checking", sent)
                          if (!sent) {
                            sent = true;
                            var query = {};
                            if (req.body.collectedBy != null && req.body.collectedBy != undefined && req.body.collectedBy != '') {
                              query = { _id: req.body.collectedBy };
                            } else {
                              query = { _id: req.user._id };
                            }
                            user.findOne(query).exec(function (error, userResult) {
                              if (error) {
                                res.status(500).send({ success: false, error: error });
                              } else {
                                userResult.credit = parse(userResult.credit) - parseInt(req.body.amount);
                                userResult.save(function (error, saved) {
                                  if (error) {
                                    res.status(500).send({ success: false, error: error });
                                  } else {
                                    res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                                  }
                                })
                              }
                            })
                          }
                        }
                        // res.status(500).send({success:false , error:error});
                      } else {
                        cashInHand.findOne({}).exec(function (error, cash) {
                          if (error) {
                            failed = failed + 1;
                            check = check + 1;
                            if (check == x.length) {
                              console.log("checking", sent)
                              if (!sent) {
                                sent = true;
                                res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                              }
                            }
                            // res.status(500).send({success:false , error:error});
                          } else {
                            if (cash) {
                              cash.totalCash = parseFloat(cash.totalCash) + parseFloat(params.amount);
                              cash.save(function (error, complete) {
                                if (error) {
                                  failed = failed + 1;
                                  check = check + 1;
                                  if (check == x.length) {
                                    console.log("checking", sent)
                                    if (!sent) {
                                      sent = true;
                                      res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                                    }
                                  }
                                  //  res.status(500).send({success:false , error:error});
                                } else {
                                  check = check + 1;
                                  if (check == x.length) {
                                    console.log("checking", sent)
                                    if (!sent) {
                                      sent = true;
                                      res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                                    }
                                  }
                                  //res.status(200).send({success:true , user:done , result:result});
                                }
                              })
                            } else {
                              cashInHand.create({
                                totalCash: parseFloat(params.amount)
                              }).then(function (done) {
                                // res.status(200).send({success:true , user:done , result:result});
                                check = check + 1;
                                if (check == x.length) {
                                  console.log("checking", sent)
                                  if (!sent) {
                                    sent = true;
                                    res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                                  }
                                }
                              }).catch(function (e) {
                                failed = failed + 1;
                                check = check + 1;
                                if (check == x.length) {
                                  console.log("checking", sent)
                                  if (!sent) {
                                    sent = true;
                                    res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                                  }
                                }
                              })
                            }
                          }
                        })
                      }
                    })
                  }
                })
              } else {
                cashInHand.findOne({}).exec(function (error, cash) {
                  if (error) {
                    // res.status(500).send({success:false , error:error});
                    failed = failed + 1;
                    check = check + 1;
                    if (check == x.length) {
                      console.log("checking", sent)
                      if (!sent) {
                        sent = true;
                        res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                      }
                    }
                  } else {
                    if (cash) {
                      cash.totalCash = parseFloat(cash.totalCash) + parseFloat(params.amount);
                      cash.save(function (error, complete) {
                        if (error) {
                          // res.status(500).send({success:false , error:error});
                          failed = failed + 1;
                          check = check + 1;
                          if (check == x.length) {
                            console.log("checking", sent)
                            if (!sent) {
                              sent = true;
                              res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                            }
                          }
                        } else {
                          check = check + 1;
                          if (check == x.length) {
                            console.log("checking", sent)
                            if (!sent) {
                              sent = true;
                              res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                            }
                          }
                          // res.status(200).send({success:true , user:done , result:result});
                        }
                      })
                    } else {
                      cashInHand.create({
                        totalCash: parseFloat(params.amount)
                      }).then(function (done) {
                        check = check + 1;
                        if (check == x.length) {
                          console.log("checking", sent)
                          if (!sent) {
                            sent = true;
                            res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                          }
                        }
                        // res.status(200).send({success:true , user:done , result:result});
                      })
                    }
                  }
                })
              }

            }).catch(function (e) {
              // res.status(403).send({success:false , error:e});
              failed = failed + 1;
              check = check + 1;
              if (check == x.length) {
                console.log("checking", sent)
                if (!sent) {
                  sent = true;
                  res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                }
              }
            })
          } else if (params.paymentType == 'online') {
            params.status = 'success';
            params.draftDate = params.draftDate;
            params.date = params.draftDate;
            payment.create(params).then(function (result) {
              if (params.user_id != null && params.user_id != undefined && params.user_id != '') {
                user.findOne({ _id: params.user_id }).exec(function (error, userResult) {
                  if (error) {
                    // res.status(500).send({success:false , error:error});
                    failed = failed + 1;
                    check = check + 1;
                    if (check == x.length) {
                      console.log("checking", sent)
                      if (!sent) {
                        sent = true;
                        res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                      }
                    }
                  } else {
                    console.log("User Found :::::::", userResult.name);
                    userResult.credit = parseInt(userResult.credit) + parseInt(params.amount);
                    console.log("userResult Credit :::::::", userResult.credit);
                    userResult.save(function (error, done) {
                      if (error) {
                        // res.status(500).send({success:false , error:error});
                        failed = failed + 1;
                        check = check + 1;
                        if (check == x.length) {
                          console.log("checking in error", sent, error)
                          if (!sent) {
                            sent = true;
                            res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                          }
                        }
                      } else {
                        check = check + 1;
                        if (check == x.length) {
                          console.log("checking in result", sent)
                          if (!sent) {
                            sent = true;
                            res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                          }
                        }
                        // res.status(200).send({success:true , result:result,user:done});
                      }
                    })
                  }
                })
              } else {
                check = check + 1;
                if (check == x.length) {
                  console.log("checking", sent, "User id not found .....");
                  if (!sent) {
                    sent = true;
                    res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
                  }
                }
                // res.status(200).send({success:true , result:result});
              }

            })
          } else {
            failed = failed + 1;
            check = check + 1;
            console.log("wrong paymentType required")
            message[count] = "wrong paymentType required";
            count++;
            if (check == x.length) {
              console.log("checking", sent)
              if (!sent) {
                sent = true;
                res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
              }
            }
            //res.status(403).send({success: fasle , message:"Wrong payment type selected"})
          }
        } else {
          // res.status(403).send({success:false , message :"paymentType required"});
          console.log("paymentType required")
          message[count] = "paymentType required";
          count++;
          failed = failed + 1;
          check = check + 1;
          if (check == x.length) {
            console.log("checking", sent)
            if (!sent) {
              sent = true;
              res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
            }
          }
        }
      } else {
        // res.status(403).send({success:false , message :"amount required"});
        console.log("amount required")
        message[count] = "amount required";
        count++;
        failed = failed + 1;
        check = check + 1;
        if (check == x.length) {
          console.log("checking", sent)
          if (!sent) {
            sent = true;
            res.status(200).send({ success: true, message: "All Payments processed", failed: failed, completed: x.length - failed, message: message });
          }
        }
      }
      console.log(check, x.length);

    })
  } else {
    res.status(403).send({ success: false, message: "payments required" });
  }
  // }else{
  //   res.status(401).send({success: false, message:"You are not authorized to make this action."});
  // }
}

exports.updatePayment1 = function (req, res) {
  var params = req.body;
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Reuest : ", params);
  }
  if (req.user.type == 'manager') {
    if (params.payment_id != null && params.payment_id != undefined && params.payment_id != '') {
      payment.findOne({ _id: params.payment_id, isDeleted: false }).populate("user_id created_by").exec(function (error, result) {
        if (error) {
          res.status(500).send({ success: fasle, error: error });
        } else {
          if (result) {
            result.history = result.history.concate([result])
            result.name = req.body.name
            ? req.body.name
            : result.name;
            result.status = req.body.status
            ? req.body.status
            : result.status;
            result.amount = req.body.amount
            ? req.body.amount
            : result.amount;
            result.updatedBy = req.user._id;
            result.save(function (error, done) {
              if (error) {
                res.status(500).send({ success: false, error: error });
              } else {
                res.status(200).send({ success: true, result: result });
              }
            })
          } else {
            res.status(403).send({ success: fasle, message: "order not found" });
          }
        }
      })
    } else {
      res.status(403).send({ success: false, message: 'payment_id requried' });
    }
  } else {
    res.status(401).send({ success: "fasle", message: "You are not authorised to perform this action" });
  }
}

exports.getAllPayments = function (req, res) {
  var params = req.body;
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Reuest : ", params);
  }

  payment.find({paymentType : {$nin : [undefined , null,"opening balance"]} ,isDeleted: false }).populate("user_id order_id collectedBy depositedBy updatedBy account_id").sort({ date: -1 }).exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      res.status(200).send({ success: true, result: result });
    }
  })
}

exports.getSinglePayments = function (req, res) {
  var params = req.body;
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Reuest : ", params);
  }
  if (params.payment_id != null && params.payment_id != undefined && params.payment_id != '') {
    payment.find({ _id: params.payment_id, isDeleted: false }).populate("user_id order_id collectedBy depositedBy updatedBy account_id deletedBy").sort({ date: -1 }).exec(function (error, result) {
      if (error) {
        res.status(500).send({ success: false, error: error });
      } else {
        res.status(200).send({ success: true, result: result });
      }
    })
  } else {
    res.status(403).send({ success: false, message: "payment_id required" });
  }
}

exports.depositCheque = function (req, res) {
  console.log("Request : ", req.body);
  var params = req.body; //payment_id, bank_id, remarks
  if (params.account_id != null && params.account_id != undefined && params.account_id != '') {
    if (params.payment_id != null && params.payment_id != undefined && params.payment_id != '') {
      payment.findOne({ _id: params.payment_id, isDeleted: false }).exec(function (error, result) {
        if (error) {
          res.status(500).send({ success: false, error: error });
        } else {
          if (result) { //result == payment document
            result.status = 'under process'; // status changed to "under process"
            if (req.body.depositedBy != null && req.body.depositedBy != undefined && req.body.depositedBy != '') {
              result.depositedBy = req.body.depositedBy; //deposited by??
            }
            result.account_id = params.account_id;
            if (params.remarks != null && params.remarks != undefined && params.remarks != '') {
              result.remarks = params.remarks;
            }
            result.save(function (error, done) {
              if (error) {
                res.status(500).send({ success: false, error: error });
              } else {
                res.status(200).send({ success: true, message: "cheque status updated successfully", result: done });
              }
            })
          } else {
            res.status(403).send({ success: false, message: "cheque details not found" });
          }
        }
      })
    } else {
      res.status(403).send({ success: false, message: "cheque_id required" });
    }
  } else {
    res.status(403).send({ success: false, message: "bank_id required" });
  }
}


exports.updateChequeStatus = function (req, res) {
  console.log("Request : ", req.body);
  var params = req.body;
  if (params.payment_id != null && params.payment_id != undefined && params.payment_id != '') {
    if (params.status != null && params.status != undefined && params.status != '') {
      payment.findOne({ _id: params.payment_id, issueStatus: false, isDeleted: false }).exec(function (error, result) {
        if (error) {
          res.status(500).send({ success: false, error: error });
        } else {
          if (result) {
            if (params.status == 'clear') {
              result.status = 'success';
              result.clearenceDate = new Date(Date.now());
            } else {
              result.status = params.status;
            }
            result.save(function (error, done) {
              if (error) {
                res.status(500).send({ success: false, error: error });
              } else {
                if (params.status == 'clear') {
                  user.findOne({ _id: result.user_id }).exec(function (error, userResult) {
                    if (error) {
                      res.status(500).send({ success: false, error: error });
                    } else {
                      userResult.credit = parseFloat(userResult.credit) + parseFloat(result.amount);
                      userResult.save(function (error, completed) {
                        if (error) {
                          res.status(500).send({ success: false, error: error });
                        } else {
                          res.status(200).send({ success: true, message: "cheque status updated successfully", result: done });
                        }
                      })
                    }
                  })
                } else {
                  res.status(200).send({ success: true, message: "cheque status updated successfully", result: done });
                }
              }
            })
          } else {
            res.status(403).send({ success: false, message: "cheque details not found" });
          }
        }
      })
    } else {
      res.status(403).send({ success: false, message: "status required" });
    }
  } else {
    res.status(403).send({ success: false, message: "payment_id required" });
  }
}

exports.getAllBanks = function (req, res) {
  bank.find({}).populate("bankAccounts").exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      res.status(200).send({ success: true, result: result });
    }
  })
}
exports.createNewBankAccount = function (req, res) {
  if (req.body.accountTitle != null && req.body.accountTitle != undefined && req.body.accountTitle != "") {
    if (req.body.accountNumber != null && req.body.accountNumber != undefined && req.body.accountNumber != "") {
      if (req.body.address != null && req.body.address != undefined && req.body.address != "") {
        if (req.body.bank_id != null && req.body.bank_id != undefined && req.body.bank_id != "") {
          bankAccount.findOne({ bank: req.body.bank_id }).exec(function (error, findresult) {
            if (error) {
              res.status(403).send({ error: error });
            } else {
              if (findresult) {
                res.status(403).send({ success: false, message: "account already exists" });
              } else {
                bankAccount.create({
                  bank: req.body.bank_id,
                  address: req.body.address,
                  accountNumber: req.body.accountNumber,
                  accountTitle: req.body.accountTitle,
                }).then(function (done) {
                  res.status(200).send({ success: true, message: "account created successfully", result: done })
                })
              }
            }
          })
        } else {
          res.status(403).send({ success: false, message: "bank_id required" });
        }

      } else {
        res.status(403).send({ success: false, message: "address required" });
      }
    } else {
      res.status(403).send({ success: false, message: "accountNumber required" });
    }
  } else {
    res.status(403).send({ success: false, message: "accountTitle required" });
  }
}
exports.getAllBankAccounts = function (req, res) { //====|| bank account instead of bank=====
  bankAccount.find({ isDeleted: false }).populate("bank").exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      res.status(200).send({ success: true, result: result });
    }
  })
  // bank.find({}).populate("bankAccounts").exec(function(error,result){
  //   if(error){
  //     res.status(500).send({success:false , error:error});
  //   }else{
  //
  //     var returningArray = []
  //     var arrayB =[]
  //     result.forEach(function(i,idx, n){
  //
  //       returningArray = returningArray.concat(arrayB);
  //
  //       if (idx == n.length-1)
  //       {
  //         res.status(200).send({success:true , result:returningArray});
  //       }
  //
  //     })
  //     // res.status(200).send({success:true , result:result});
  //   }
  // })
}

exports.issueCheque = function (req, res) {
  var params = req.body;
  console.log("Request : ", req.body);
  if (params.name != null && params.name != undefined && params.name != '') {
    if (params.chequeNumber != null && params.chequeNumber != undefined && params.chequeNumber != '') {
      if (params.amount != null && params.amount != undefined && params.amount != '') {
        if (params.bank_id != null && params.bank_id != undefined && params.bank_id != '') {
          if (params.remarks != null && params.remarks != undefined && params.remarks != '') {
            params.issueStatus = true;
            params.status = 'under process';
            payment.create(params).exec(function (result) {
              res.status(200).send({ success: true, result: result });
            })
          } else {
            res.status(403).send({ success: false, message: "remarks required" });
          }
        } else {
          res.status(403).send({ success: false, message: "bank_id required" });
        }
      } else {
        res.status(403).send({ success: false, message: "amount required" });
      }
    } else {
      res.status(403).send({ success: false, message: "chequeNumber required" });
    }
  } else {
    res.status(403).send({ success: false, message: "name required" });
  }
}

exports.getAllIssuedCheques = function (req, res) {
  payment.find({ issueStatus: true }).exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      res.status(200).send({ success: true, result: result });
    }
  })
}

exports.updateIssuedChequeStatus = function (req, res) {
  var params = req.body;
  console.log("Request : ", params);
  if (params.payment_id != null && params.payment_id != undefined && params.payment_id != '') {
    if (params.status != null && params.status != undefined && params.status != '') {
      payment.findOne({ _id: payment_id, issueStatus: true, isDeleted: false }).exec(function (error, result) {
        if (error) {
          res.status(500).send({ success: false, error: error });
        } else {
          if (result) {
            result.status = params.status;
            result.save(function (error, done) {
              if (error) {
                res.status(500).send({ success: false, error: error });
              } else {
                res.status(200).send({ success: true, result: done, message: "status updated successfully" });
              }
            })
          } else {
            res.status(403).send({ success: false, message: "payment not found or already processed" });
          }
        }
      })
    } else {
      res.status(403).send({ success: false, message: "status required" });
    }
  } else {
    res.status(403).send({ success: false, message: "payment_id required" });
  }
}

exports.addCashOnHandToBank = function (req, res) {
  var params = req.body;
  console.log("Request : ", params);
  if (params.depositSlip != null && params.depositSlip != undefined && params.depositSlip != '') {
    if (params.account_id != null && params.account_id != undefined && params.account_id != '') {
      if (params.amount != null && params.amount != undefined && params.amount != '') {
        cashInHand.findOne({}).exec(function (error, done) {
          if (error) {
            res.status(500).send({ success: false, error: error });
          } else {
            if (done) {
              if (parseFloat(done.totalCash) >= parseFloat(params.amount)) {
                console.log("in Done ***************************", done);

                payment.create({ account_id: params.account_id, cashOnHandAdded: true, amount: params.amount, user_id: req.user._id, collectedBy: req.body.collectedBy, remarks: params.remarks, depositSlip: params.depositSlip }).then(function (result) {
                  done.totalCash = parseFloat(done.totalCash) - parseFloat(params.amount);
                  done.save(function (error, complete) {
                    if (error) {
                      res.status(500).send({ success: false, error: error });
                    } else {
                      user.findOne({ _id: req.body.collectedBy }).exec(function (error, resultUser) {
                        console.log("In user find  ------------*****-----****", resultUser);

                        if (error) {
                          res.status(500).send({ success: false, error: error });
                        } else {
                          if (resultUser) {
                            resultUser.credit = parseInt(resultUser.credit) + parseInt(params.amount);
                            resultUser.save(function (error, saved) {
                              if (error) {
                                res.status(500).send({ success: false, error: error });
                              } else {
                                res.status(200).send({ success: true, result: complete, message: "Cash updated successfully" });
                              }
                            })
                          } else {
                            res.status(200).send({ success: false, message: "Balance not deducted from user.", result: complete });
                          }
                        }
                      })
                    }
                  })
                }).catch(function (e) {
                  res.status(500).send({ success: false, error: e });
                })
              } else {
                res.status(403).send({ success: false, message: "Cash in hand is less than entered amount" });
              }
            } else {
              cashInHand.create({

              }).then(function (complete) {
                cashInHand.findOne({}).exec(function (error, done) {
                  if (error) {
                    res.status(500).send({ success: false, error: error });
                  } else {
                    if (parseFloat(done.totalCash) >= parseFloat(params.amount)) {
                      payment.create({ account_id: params.account_id, cashOnHandAdded: true, amount: params.amount, user_id: req.user._id, collectedBy: req.body.collectedBy, remarks: params.remarks }).then(function (result) {
                        done.totalCash = parseFloat(done.totalCash) - parseFloat(params.amount);
                        done.save(function (error, complete) {
                          if (error) {
                            res.status(500).send({ success: false, error: error });
                          } else {
                            res.status(200).send({ success: true, result: complete, message: "Cash updated successfully" });
                          }
                        })
                      }).catch(function (e) {
                        res.status(500).send({ success: false, error: e });
                      })
                    } else {
                      res.status(403).send({ success: false, message: "Cash in hand is less than entered amount" });
                    }
                  }
                })
              })
            }
          }
        })
      } else {
        res.status(403).send({ success: false, message: "amount required" });
      }
    } else {
      res.status(403).send({ success: false, message: "account_id required" });
    }
  } else {
    res.status(400).send({ success: false, message: "depositSlip Required" })
  }
}

exports.checkBalanceInAccount = function (req, res) {
  var params = req.body;
  console.log("Request : ", params);
  if (params.bank_id != null && params.bank_id != undefined && params.bank_id != '') {
    payment.aggregate({
      $match: {
        $and: [
          { amount: { $gte: 0 } }, { issueStatus: false }, { status: 'success' }, { isDeleted: false }
        ]
      }
    },
    { $group: { _id: null, sum: { $sum: "$amount" } } }).exec(function (error, result) {
      if (error) {
        console.log("eror : ", error);
        res.status(500).send({ success: false, error: error });
      } else {
        res.status(200).send({ success: true, result: result[0].sum });
      }
    })
  } else {
    res.status(403).send({ success: false, message: "bank_id required" });
  }
}

exports.getAllPendingCheques = function (req, res) {
  payment.find({ status: ['pending', 'bounced'], paymentType: 'cheque', isDeleted: false }).populate("bank_id user_id collectedBy depositedBy updatedBy deletedBy").exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      res.status(200).send({ success: true, result: result });
    }
  })
}

exports.getAllDeposittedCheques = function (req, res) { ///------------------------------|-accountid instead of bank_id
  payment.find({ status: 'success', paymentType: 'cheque', isDeleted: false }).populate("account_id bank_id user_id depositedBy collectedBy updatedBy deletedBy").exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      res.status(200).send({ success: true, result: result });
    }
  })
}

exports.getAllUnderProcessCheques = function (req, res) { //-------------------------------------|-------account_id instead of bank_id
  payment.find({ status: 'under process', paymentType: 'cheque', isDeleted: false }).populate("bank_id user_id depositedBy collectedBy updatedBy deletedBy account_id").exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      res.status(200).send({ success: true, result: result });
    }
  })
}

exports.getAllBouncedCheques = function (req, res) {
  payment.find({ status: 'bounced', paymentType: 'cheque', isDeleted: false }).populate("bank_id user_id collectedBy depositedBy updatedBy deletedBy").exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      res.status(200).send({ success: true, result: result });
    }
  })
}


exports.getTotalCashInHand = function (req, res) {
  cashInHand.findOne({}).exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      if (result) {
        res.status(200).send({ success: true, result: result.totalCash });
      } else {
        res.status(200).send({ success: true, result: 0 });
      }
    }
  })
}

exports.addCashOnHandToBankHistory = function (req, res) {

  var query = { cashOnHandAdded: true, isDeleted: false };

  if (req.body.user_id != null && req.body.user_id != undefined && req.body.user_id != '') {
    query = { cashOnHandAdded: true, collectedBy: req.body.user_id, isDeleted: false };
  }

  payment.find(query).populate("bank_id account_id user_id collectedBy depositedBy updatedBy deletedBy").sort({ date: -1 }).exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      res.status(200).send({ success: true, result: result });
    }
  })
}

exports.updatePayment = function (req, res) {
  console.log("Request : ", req.body);
  if (req.body.payment_id != null && req.body.payment_id != undefined && req.body.payment_id != '') {
    payment.findOne({ _id: req.body.payment_id, isDeleted: false }).exec(function (error, result) {
      if (error) {
        res.status(500).send({ success: false, error: error });
      } else {
        if (result) {
          result.user_id = req.body.user_id
          ? req.body.user_id
          : result.user_id;
          result.order_id = req.body.order_id
          ? req.body.order_id
          : result.order_id;
          result.account_id = req.body.account_id
          ? req.body.account_id
          : result.account_id;
          result.name = req.body.name
          ? req.body.name
          : result.name;
          if (req.body.amount != null && req.body.amount != undefined && req.body.amount != '') {

            user.findOne({ _id: result.user_id }).exec(function (error, userResult) {
              if (error) {
                res.status(500).send({ success: false, error: error });
              } else {
                if (result.paymentType == 'cheque' && result.status == 'success') {
                  userResult.credit = parseInt(userResult.credit) - (parseInt(result.amount) - parseInt(req.body.amount));
                  userResult.save(function (error, saved) {
                    if (error) {
                      res.status(500).send({ success: false, error: error });
                    } else {
                      var previousAmount = parseInt(result.amount);
                      result.amount = req.body.amount
                      ? req.body.amount
                      : result.amount;
                      result.date = req.body.date
                      ? req.body.date
                      : result.date;
                      // result.paymentType = req.body.paymentType
                      // ? req.body.paymentType
                      // :result.paymentType;
                      result.chequeNumber = req.body.chequeNumber
                      ? req.body.chequeNumber
                      : result.chequeNumber;
                      result.draftNumber = req.body.draftNumber
                      ? req.body.draftNumber
                      : result.draftNumber;
                      result.chequeDate = req.body.chequeDate
                      ? req.body.chequeDate
                      : result.chequeDate;
                      result.draftDate = req.body.draftDate
                      ? req.body.draftDate
                      : result.draftDate;
                      result.name = req.body.name
                      ? req.body.name
                      : result.name;
                      result.bank_id = req.body.bank_id
                      ? req.body.bank_id
                      : result.bank_id;
                      result.status = req.body.status
                      ? req.body.status
                      : result.status;
                      result.updatedBy = req.body.updatedBy
                      ? req.body.updatedBy
                      : result.updatedBy;
                      result.history = req.body.history
                      ? req.body.history
                      : result.history;
                      result.remarks = req.body.remarks
                      ? req.body.remarks
                      : result.remarks;
                      result.bank_id = req.body.bank_id
                      ? req.body.bank_id
                      : result.bank_id;
                      result.remarks = req.body.remarks
                      ? req.body.remarks
                      : result.remarks;
                      result.issueStatus = req.body.issueStatus
                      ? req.body.issueStatus
                      : result.issueStatus;
                      result.cashOnHandAdded = req.body.cashOnHandAdded
                      ? req.body.cashOnHandAdded
                      : result.cashOnHandAdded;
                      result.collectedBy = req.body.collectedBy
                      ? req.body.collectedBy
                      : result.collectedBy;
                      result.debitedAmount = req.body.debitedAmount
                      ? req.body.debitedAmount
                      : result.debitedAmount;
                      if (req.body.isDeleted && !result.isDeleted) {
                        result.isDeleted = req.body.isDeleted
                        ? req.body.isDeleted
                        : result.isDeleted;
                        result.deletedBy = req.user._id;
                      }
                      result.save(function (error, saved) {
                        if (error) {
                          res.status(500).send({ success: false, error: error });
                        } else {
                          res.status(200).send({ success: true, result: saved, message: "Payment updated Successfully." });
                        }
                      })
                    }
                  })
                } else {
                  if(result.cashOnHandAdded == true){
                    var previousAmount = result.amount;
                    // userResult.credit = parseInt(userResult.credit) + parseInt(result.amount);
                    // userResult.credit = parseInt(userResult.credit) - parseInt(req.body.amount);
                    user.findOne({_id :result.collectedBy }).exec(function(error,resultCollector){
                      if(error){
                        res.status(500).send({success:false , error:error});
                      }else{
                        if(parseInt(resultCollector.credit)>=0){
                          resultCollector.credit = parseInt(resultCollector.credit) - parseInt(previousAmount);
                          resultCollector.credit = parseInt(resultCollector.credit) + parseInt(req.body.amount);
                        }else{
                          resultCollector.credit = parseInt(resultCollector.credit) - parseInt(previousAmount);
                          resultCollector.credit = parseInt(resultCollector.credit) + parseInt(req.body.amount);
                        }
                        resultCollector.save(function(error,savedCollector){
                          if(error){
                            res.status(500).send({success:false , error:error});
                          }else{
                            cashInHand.findOne({}).exec(function (error, resultCash) {
                              if (error) {
                                console.log("error in cash in hand finding", error);
                              } else {
                                if (resultCash) {
                                  resultCash.totalCash = (parseInt(resultCash.totalCash) + (parseInt(result.amount) - parseInt(req.body.amount)));
                                  resultCash.save(function (error, savedCash) {
                                    if (error) {
                                      console.log("Error ::: ", error);
                                    }
                                  })
                                }
                                userResult.save(function (error, saved) {
                                  if (error) {
                                    res.status(500).send({ success: false, error: error });
                                  } else {
                                    result.amount = req.body.amount
                                    ? req.body.amount
                                    : result.amount;
                                    result.date = req.body.date
                                    ? req.body.date
                                    : result.date;
                                    // result.paymentType = req.body.paymentType
                                    // ? req.body.paymentType
                                    // :result.paymentType;
                                    result.chequeNumber = req.body.chequeNumber
                                    ? req.body.chequeNumber
                                    : result.chequeNumber;
                                    result.draftNumber = req.body.draftNumber
                                    ? req.body.draftNumber
                                    : result.draftNumber;
                                    result.chequeDate = req.body.chequeDate
                                    ? req.body.chequeDate
                                    : result.chequeDate;
                                    result.draftDate = req.body.draftDate
                                    ? req.body.draftDate
                                    : result.draftDate;
                                    result.name = req.body.name
                                    ? req.body.name
                                    : result.name;
                                    result.bank_id = req.body.bank_id
                                    ? req.body.bank_id
                                    : result.bank_id;
                                    result.status = req.body.status
                                    ? req.body.status
                                    : result.status;
                                    result.updatedBy = req.body.updatedBy
                                    ? req.body.updatedBy
                                    : result.updatedBy;
                                    result.history = req.body.history
                                    ? req.body.history
                                    : result.history;
                                    result.remarks = req.body.remarks
                                    ? req.body.remarks
                                    : result.remarks;
                                    result.bank_id = req.body.bank_id
                                    ? req.body.bank_id
                                    : result.bank_id;
                                    result.remarks = req.body.remarks
                                    ? req.body.remarks
                                    : result.remarks;
                                    result.issueStatus = req.body.issueStatus
                                    ? req.body.issueStatus
                                    : result.issueStatus;
                                    result.cashOnHandAdded = req.body.cashOnHandAdded
                                    ? req.body.cashOnHandAdded
                                    : result.cashOnHandAdded;
                                    result.collectedBy = req.body.collectedBy
                                    ? req.body.collectedBy
                                    : result.collectedBy;
                                    result.debitedAmount = req.body.debitedAmount
                                    ? req.body.debitedAmount
                                    : result.debitedAmount;
                                    if (req.body.isDeleted && !result.isDeleted) {
                                      result.isDeleted = req.body.isDeleted
                                      ? req.body.isDeleted
                                      : result.isDeleted;
                                      result.deletedBy = req.user._id;
                                    }
                                    result.save(function (error, saved) {
                                      if (error) {
                                        res.status(500).send({ success: false, error: error });
                                      } else {
                                        res.status(200).send({ success: true, result: saved, message: "Payment updated Successfully." });
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }else{
                    var previousAmount = result.amount;
                    userResult.credit = parseInt(userResult.credit) - (parseInt(result.amount) - parseInt(req.body.amount));
                    user.findOne({_id :result.collectedBy }).exec(function(error,resultCollector){
                      if(error){
                        res.status(500).send({success:false , error:error});
                      }else{
                        resultCollector.credit = parseInt(resultCollector.credit) + parseInt(previousAmount);
                        resultCollector.credit = parseInt(resultCollector.credit) - parseInt(req.body.amount);
                        resultCollector.save(function(error,savedCollector){
                          if(error){
                            res.status(500).send({success:false , error:error});
                          }else{
                            cashInHand.findOne({}).exec(function (error, resultCash) {
                              if (error) {
                                console.log("error in cash in hand finding", error);
                              } else {
                                if (resultCash) {
                                  resultCash.totalCash = (parseInt(resultCash.totalCash) + (parseInt(result.amount) - parseInt(req.body.amount)));
                                  resultCash.save(function (error, savedCash) {
                                    if (error) {
                                      console.log("Error ::: ", error);
                                    }
                                  })
                                }
                                userResult.save(function (error, saved) {
                                  if (error) {
                                    res.status(500).send({ success: false, error: error });
                                  } else {
                                    result.amount = req.body.amount
                                    ? req.body.amount
                                    : result.amount;
                                    result.date = req.body.date
                                    ? req.body.date
                                    : result.date;
                                    // result.paymentType = req.body.paymentType
                                    // ? req.body.paymentType
                                    // :result.paymentType;
                                    result.chequeNumber = req.body.chequeNumber
                                    ? req.body.chequeNumber
                                    : result.chequeNumber;
                                    result.draftNumber = req.body.draftNumber
                                    ? req.body.draftNumber
                                    : result.draftNumber;
                                    result.chequeDate = req.body.chequeDate
                                    ? req.body.chequeDate
                                    : result.chequeDate;
                                    result.draftDate = req.body.draftDate
                                    ? req.body.draftDate
                                    : result.draftDate;
                                    result.name = req.body.name
                                    ? req.body.name
                                    : result.name;
                                    result.bank_id = req.body.bank_id
                                    ? req.body.bank_id
                                    : result.bank_id;
                                    result.status = req.body.status
                                    ? req.body.status
                                    : result.status;
                                    result.updatedBy = req.body.updatedBy
                                    ? req.body.updatedBy
                                    : result.updatedBy;
                                    result.history = req.body.history
                                    ? req.body.history
                                    : result.history;
                                    result.remarks = req.body.remarks
                                    ? req.body.remarks
                                    : result.remarks;
                                    result.bank_id = req.body.bank_id
                                    ? req.body.bank_id
                                    : result.bank_id;
                                    result.remarks = req.body.remarks
                                    ? req.body.remarks
                                    : result.remarks;
                                    result.issueStatus = req.body.issueStatus
                                    ? req.body.issueStatus
                                    : result.issueStatus;
                                    result.cashOnHandAdded = req.body.cashOnHandAdded
                                    ? req.body.cashOnHandAdded
                                    : result.cashOnHandAdded;
                                    result.collectedBy = req.body.collectedBy
                                    ? req.body.collectedBy
                                    : result.collectedBy;
                                    result.debitedAmount = req.body.debitedAmount
                                    ? req.body.debitedAmount
                                    : result.debitedAmount;
                                    if (req.body.isDeleted && !result.isDeleted) {
                                      result.isDeleted = req.body.isDeleted
                                      ? req.body.isDeleted
                                      : result.isDeleted;
                                      result.deletedBy = req.user._id;
                                    }
                                    result.save(function (error, saved) {
                                      if (error) {
                                        res.status(500).send({ success: false, error: error });
                                      } else {
                                        res.status(200).send({ success: true, result: saved, message: "Payment updated Successfully." });
                                      }
                                    })
                                  }
                                })
                              }
                            })
                          }
                        })
                      }
                    })
                  }
                }
              }
            })
          } else {
            result.date = req.body.date
            ? req.body.date
            : result.date;
            // result.paymentType = req.body.paymentType
            // ? req.body.paymentType
            // :result.paymentType;
            result.chequeNumber = req.body.chequeNumber
            ? req.body.chequeNumber
            : result.chequeNumber;
            result.draftNumber = req.body.draftNumber
            ? req.body.draftNumber
            : result.draftNumber;
            result.chequeDate = req.body.chequeDate
            ? req.body.chequeDate
            : result.chequeDate;
            result.draftDate = req.body.draftDate
            ? req.body.draftDate
            : result.draftDate;
            result.name = req.body.name
            ? req.body.name
            : result.name;
            result.bank_id = req.body.bank_id
            ? req.body.bank_id
            : result.bank_id;
            result.status = req.body.status
            ? req.body.status
            : result.status;
            result.updatedBy = req.body.updatedBy
            ? req.body.updatedBy
            : result.updatedBy;
            result.history = req.body.history
            ? req.body.history
            : result.history;
            result.remarks = req.body.remarks
            ? req.body.remarks
            : result.remarks;
            result.bank_id = req.body.bank_id
            ? req.body.bank_id
            : result.bank_id;
            result.remarks = req.body.remarks
            ? req.body.remarks
            : result.remarks;
            result.issueStatus = req.body.issueStatus
            ? req.body.issueStatus
            : result.issueStatus;
            result.cashOnHandAdded = req.body.cashOnHandAdded
            ? req.body.cashOnHandAdded
            : result.cashOnHandAdded;
            result.collectedBy = req.body.collectedBy
            ? req.body.collectedBy
            : result.collectedBy;
            result.debitedAmount = req.body.debitedAmount
            ? req.body.debitedAmount
            : result.debitedAmount;
            if (req.body.isDeleted && !result.isDeleted) {
              result.isDeleted = req.body.isDeleted
              ? req.body.isDeleted
              : result.isDeleted;
              result.deletedBy = req.user._id;
              result.previousAmount = result.amount;
              result.amount = 0;
              user.findOne({ _id: result.user_id }).exec(function (error, resultUser) {
                if (error) {
                  res.status(500).send({ success: false, error: error });
                } else {
                  if (resultUser) {
                    if (result.paymentType == 'cheque' && result.status == 'success') {
                      resultUser.credit = parseInt(resultUser.credit) - parseInt(result.previousAmount);
                    }else if(result.cashInHand == true){
                      resultUser.credit = parseInt(resultUser.credit) - parseInt(result.previousAmount);
                    } else if(result.status == 'success'){
                      resultUser.credit = parseInt(resultUser.credit) - parseInt(result.previousAmount);
                    }
                  }
                  resultUser.save(function (error, savedData) {
                    if (error) {
                      res.status(500).send({ success: false, error: error });
                    } else {
                      result.user_id = req.body.user_id
                      ? req.body.user_id
                      : result.user_id;
                      result.save(function (error, done) {
                        if (error) {
                          res.status(500).send({ success: false, error: error });
                        } else {
                          res.status(200).send({ success: true, result: done, message: "Payment updated Successfully." });
                        }
                      })
                    }
                  })
                }
              })
            } else {
              result.save(function (error, saved) {
                if (error) {
                  res.status(500).send({ success: false, error: error });
                } else {
                  res.status(200).send({ success: true, result: saved, message: "Payment updated Successfully." });
                }
              })
            }

          }
        } else {
          res.status(403).send({ success: false, message: "Payment details not found." });
        }
      }
    })
  } else {
    res.status(403).send({ success: false, message: "Payment id required." });
  }
}



exports.createPayment1 = function (req, res) {
  console.log("Req.body ::::", req.body);
  if (req.body.arrayOfPayments != null && req.body.arrayOfPayments != undefined && req.body.arrayOfPayments != '') {
    var insertionJson = [];
    var totalAmount = 0;
    var message = [];
    var user_id = "";
    var collectedBy = "";
    var cashInHandTotal = 0;
    if (req.body.arrayOfPayments.length > 0) {
      req.body.arrayOfPayments.forEach(function (i, idx, x) {
        if (i.amount != null && i.amount != undefined && i.amount != '') {
          if (i.collectedBy != null && i.collectedBy != undefined && i.collectedBy != '') {
            collectedBy = i.collectedBy;
            if (i.user_id != null && i.user_id != undefined && i.user_id != '') {
              user_id = i.user_id;
              if (i.paymentType != null && i.paymentType != undefined && i.paymentType != '') {
                if (i.paymentType == 'cheque') {
                  i.date = i.chequeDate;
                  insertionJson[insertionJson.length] = i;
                } else {
                  if (i.paymentType == 'cash') {
                    i.date = i.cashDate;
                    i.status = 'success';
                    cashInHandTotal = cashInHandTotal + parseInt(i.amount);
                  }else if(i.paymentType == 'online'){
                    i.date = i.draftDate;
                    i.status = 'success';
                  }
                  totalAmount = totalAmount + parseInt(i.amount);
                  insertionJson[insertionJson.length] = i;
                }
              } else {
                message[message.length] = "paymentType required in " + idx;
              }
            } else {
              message[message.length] = "user_id required in " + idx;
            }
          } else {
            message[message.length] = "collectedBy required in " + idx;
          }
        } else {
          message[message.length] = "amount required in " + idx;
        }
        if (idx == x.length - 1) {
          if (insertionJson.length > 0) {
            payment.insertMany(
              insertionJson, {
                ordered: false
              }).then(function (result) {
                if (cashInHandTotal > 0) {
                  //total cash in hand is greater than zero ,  process is same after this in if and else both
                  cashInHand.findOne({}).exec(function (error, result) {
                    if (error) {
                      res.status(500).send({ success: false, error: error });
                    } else {
                      result.totalCash = parseInt(result.totalCash) + cashInHandTotal;
                      result.save(function (error, savedCash) {
                        if (error) {
                          res.status(500).send({ success: false, error: error });
                        } else {
                          user.findOne({ _id: user_id }).exec(function (error, resultUser) {
                            if (error) {
                              res.status(500).send({ success: false, message: "Error in finding user", error: error });
                            } else {
                              if (resultUser) {
                                resultUser.credit = parseInt(resultUser.credit) + totalAmount;
                                resultUser.save(function (error, savedUser) {
                                  if (error) {
                                    res.status(500).send({ success: false, message: "Error in saving user", error: error });
                                  } else {
                                    user.findOne({ _id: collectedBy }).exec(function (error, resultUser1) {
                                      if (error) {
                                        res.status(500).send({ success: false, message: "Error in finding user", error: error });
                                      } else {
                                        if (resultUser1) {
                                          if (req.body.paymentType != 'online') {
                                            resultUser1.credit = parseInt(resultUser1.credit) - totalAmount;
                                          }
                                          resultUser1.save(function (error, savedUser1) {
                                            if (error) {
                                              res.status(500).send({ success: false, message: "Error in collectedBy user", error: error });
                                            } else {
                                              message[message.length] = "Payments processed successfully";
                                              res.status(200).send({ success: true, result: result, message: message, failed: message.length - 1, completed: result.length });
                                            }
                                          })
                                        } else {
                                          console.log("User not found");
                                        }
                                      }
                                    })
                                  }
                                })
                              } else {
                                console.log("User not found");
                                message[message.length] = "User not found with provided id";
                                user.findOne({ _id: collectedBy }).exec(function (error, resultUser1) {
                                  if (error) {
                                    res.status(500).send({ success: false, message: "Error in finding user", error: error });
                                  } else {
                                    if (resultUser1) {
                                      if (req.body.paymentType != 'online') {
                                        resultUser1.credit = parseInt(resultUser1.credit) - totalAmount;
                                      }
                                      resultUser1.save(function (error, savedUser1) {
                                        if (error) {
                                          res.status(500).send({ success: false, message: "Error in collectedBy user", error: error });
                                        } else {
                                          message[message.length] = "Payments processed successfully";
                                          res.status(200).send({ success: true, result: result, message: message, failed: message.length - 1, completed: result.length });
                                        }
                                      })
                                    } else {
                                      console.log("collected by user not found");
                                      message[message.length] = "User not found with provided id";
                                      res.status(200).send({ success: true, result: result, message: message, failed: message.length - 1, completed: result.length });
                                    }
                                  }
                                })
                              }
                            }
                          })
                        }
                      })
                    }
                  })
                } else {
                  user.findOne({ _id: user_id }).exec(function (error, resultUser) {
                    if (error) {
                      res.status(500).send({ success: false, message: "Error in finding user", error: error });
                    } else {
                      if (resultUser) {
                        resultUser.credit = parseInt(resultUser.credit) + totalAmount;
                        resultUser.save(function (error, savedUser) {
                          if (error) {
                            res.status(500).send({ success: false, message: "Error in saving user", error: error });
                          } else {
                            user.findOne({ _id: collectedBy }).exec(function (error, resultUser1) {
                              if (error) {
                                res.status(500).send({ success: false, message: "Error in finding user", error: error });
                              } else {
                                if (resultUser1) {
                                  if (req.body.paymentType != 'online') {
                                    resultUser1.credit = parseInt(resultUser1.credit) - totalAmount;
                                  }
                                  resultUser1.save(function (error, savedUser1) {
                                    if (error) {
                                      res.status(500).send({ success: false, message: "Error in collectedBy user", error: error });
                                    } else {
                                      message[message.length] = "Payments processed successfully";
                                      res.status(200).send({ success: true, result: result, message: message, failed: message.length - 1, completed: result.length });
                                    }
                                  })
                                } else {
                                  console.log("User not found");
                                }
                              }
                            })
                          }
                        })
                      } else {
                        console.log("User not found");
                        message[message.length] = "User not found with provided id";
                        user.findOne({ _id: collectedBy }).exec(function (error, resultUser1) {
                          if (error) {
                            res.status(500).send({ success: false, message: "Error in finding user", error: error });
                          } else {
                            if (resultUser1) {
                              if (req.body.paymentType != 'online') {
                                resultUser1.credit = parseInt(resultUser1.credit) - totalAmount;
                              }
                              resultUser1.save(function (error, savedUser1) {
                                if (error) {
                                  res.status(500).send({ success: false, message: "Error in collectedBy user", error: error });
                                } else {
                                  message[message.length] = "Payments processed successfully";
                                  res.status(200).send({ success: true, result: result, message: message, failed: message.length - 1, completed: result.length });
                                }
                              })
                            } else {
                              console.log("collected by user not found");
                              message[message.length] = "User not found with provided id";
                              res.status(200).send({ success: true, result: result, message: message, failed: message.length - 1, completed: result.length });
                            }
                          }
                        })
                      }
                    }
                  })
                }
              }).catch(function (error) {
                console.log("Error :::::", error);
                res.status(500).send({ success: false, message: "Something went wrong while processing payments", error: error });
              })
            } else {
              res.status(403).send({ success: false, message: message })
            }
          }
        })
      } else {
        res.status(403).send({ success: false, message: "Payments required to be entered." });
      }
    } else {
      res.status(403).send({ success: false, message: "Payment array required" });
    }
  }
