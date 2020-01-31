var order = require('../models/order.js');
var tax = require('../models/tax.js');
var User = require('../models/user.js');
//var invNum = require('../config/lib.js');
var taxService = require('../config/tax.js');
exports.createOrder = function (req, res) { //START
  var params = req.body;


  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Reuest : ", params);
  }

  params["gst"] = ObjectId("5d63dc60fd8d7e0016ae452c")
  params["nfat"] = ObjectId("5d63dc60fd8d7e0016ae452d")
  params["fat"] = ObjectId("5d63dc60fd8d7e0016ae452b")
  params["wht"] = ObjectId("5d667c570ca7c5a646627150")
  params["mrp"] = ObjectId("5d63dc60fd8d7e0016ae452a")

  params.created_by = req.user._id;
  if (params.description != null && params.description != undefined && params.description != '') {
    if (params.created_by != null && params.created_by != undefined && params.created_by != '') {
      if (params.deliveryDate != null && params.deliveryDate != undefined && params.deliveryDate != '') {
        if (params.quantity != null && params.quantity != undefined && params.quantity != '') {
          if (params.user_id != null && params.user_id != undefined && params.user_id != '') {
            order.find({}).then((result) => {
              var orderLength = result.length + 1;
              var invoiceStr = orderLength.toString();
              params.invoiceNumber = invoiceStr.padStart(6, '0');
              User.findOne({ _id: req.body.user_id }).exec(function (error, userResultFound) {
                if (error) {
                  console.log("ERROR::::::::::::::::::::::::::::::::", error);
                  res.status(500).send({ success: false, error: error });
                } else {
                  if (userResultFound) {
                    //      console.log("UR::::::::::::::::::::::::::::::::", userResultFound);
                    if (userResultFound.ntn != null && userResultFound.ntn != undefined && userResultFound.ntn != '') {
                      params.isFiller = true;
                    }
                    if (userResultFound.ntnStatus != null && userResultFound.ntnStatus != undefined && userResultFound.ntnStatus != '') {
                      if (userResultFound.ntn == 'active') {
                        params.activeNtn = true;
                      }
                    }
                    console.log("params to be created ::::::",params);
                    order.create(params).then(function (result) {
                      User.findOne({ _id: req.body.user_id }).exec(function (error, userResult) {
                        console.log("RESULT:::::::::::::::::::::::::::::::", userResult);


                        if (error) {
                          res.status(500).send({ success: false, error: error });
                        } else {
                          if (userResult) {
                            userResult.credit = parseInt(userResult.credit) - parseInt(params.totalAmount);
                            tax.find({
                              date: new Date(Date.now()).toISOString().split("T")[0] + "T01:00:00.000Z"
                            }).exec(function (error, taxResult) {
                              console.log(":::::::TAX RESULT::::::", taxResult);

                              if (error) {
                                res.status(500).send({ success: false, error: error });
                              } else {
                                if (taxResult.length > 0) {
                                  console.log("____in tax result:", taxResult);

                                  var updateObject = {};
                                  taxResult.forEach(function (i, idx, x) {
                                    if (i.type == 'gst') {
                                      result['gst'] = i._id;
                                    } else if (i.type == 'nfat') {
                                      result['nfat'] = i._id;
                                      console.log("in tax result nfat:", i._id, idx, x);
                                    } else if (i.type == 'wht') {
                                      result['wht'] = i._id;
                                    } else if (i.type == 'mrp') {
                                      result['mrp'] = i._id;
                                    } else if (i.type == 'fat') {
                                      result['fat'] = i._id;
                                    }
                                    console.log("update Object:", updateObject);
                                    if (idx == x.length - 1) {
                                      if (Object.keys(updateObject).length > 0) {
                                        order.update({ _id: result._id }, result, { multi: false }).then(function (done) {
                                          userResult.save(function (error, saved) {
                                            if (error) {
                                              res.status(500).send({ success: false, error: error });
                                            } else {
                                              res.status(200).send({ success: true, result: result, message: "order created successfully" });
                                            }
                                          })
                                        }).catch(function (error) {
                                          console.log("Tax Ids not updated : ", error);
                                          //res.status(500).send({success:false ,error:error});
                                          userResult.save(function (error, saved) {
                                            if (error) {
                                              res.status(500).send({ success: false, error: error });
                                            } else {
                                              res.status(200).send({ success: true, result: result, message: "order created successfully" });
                                            }
                                          })
                                        })
                                      }
                                    }
                                  })
                                  // order.update({_id:result._id},{gst_id:})
                                } else {
                                  // console.log("**************", "Tax not found", result);
                                  userResult.save(function (error, saved) {
                                    if (error) {
                                      res.status(500).send({ success: false, error: error });
                                    } else {
                                      res.status(200).send({ success: true, result: result, message: "order created successfully" });
                                    }
                                  })
                                }
                              }
                            })

                          } else {
                            console.log("***** ", req.body)
                            res.status(200).send({ success: true, result: result, message: "order created successfully" });
                          }
                        }
                      })
                    })
                  } else {
                    res.status(403).send({ success: false, message: "user details not found" });
                  }
                }
              });
            }).catch(function(error){
              res.status(500).send({success:false , error:error});
            });
          }
          else {
            res.status(403).send({ success: false, message: "user_id required" });
          }
        } else {
          res.status(403).send({ success: false, message: "quantity required" })
        }
      } else {
        res.status(403).send({ success: false, message: "deliveryDate required" })
      }
    } else {
      res.status(403).send({ success: false, message: "created_by required" })
    }
  } else {
    res.status(403).send({ success: false, message: "description required" })
  }
  // } else {
  //   res.status(401).send({ success: false, message: "You are not authorised to perform this action." });
  // }
} // END

// exports.updateOrder = function(req, res){
//   if (req.user.type == 'Manager') {
//     var gst_rate = gst.findOne({_id: gst_id});
//     var rate = (gst_rate.rate / 100 ) * req.price;
//     return rate;

//     order.updateMany()

//   } else {
//     console.log("Error: USER UNAUTH");

//   }
// }

exports.viewOrder = function (req, res) {
  var params = req.body;
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Reuest : ", params);
  }
  if (params.order_id != null && params.order_id != undefined && params.order_id != '') {
    order.findOne({ _id: params.order_id, isDeleted: false }).populate("user_id created_by truckNumber").exec(function (error, result) {
      if (error) {
        res.status(500).send({ success: false, error: error });
      } else {
        if (result) {
          res.status(200).send({ success: true, result: result });
        } else {
          res.status(404).send({ success: false, message: "Order not found" });
        }
      }
    })
  } else {
    res.status(403).send({ success: false, message: "order_id required" })
  }
}

exports.viewAllOrders = function (req, res) {
  var params = req.body;
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Reuest : ", params);
  }
  var query = {};
  if (req.body.to != undefined && req.body.to != null && req.body.to != '') {
    if (req.body.from != undefined && req.body.from != null && req.body.from != '') {
      if (req.body.user_id != undefined && req.body.user_id != null && req.body.user_id != '') {
        query = { date: { $lte: new Date(req.body.to), $gte: new Date(req.body.from) }, user_id: req.body.user_id, isDeleted: false };
      } else {
        query = { date: { $lte: new Date(req.body.to), $gte: new Date(req.body.from) }, isDeleted: false };
      }
    }
  } else if (req.body.user_id != undefined && req.body.user_id != null && req.body.user_id != '') {
    query = { user_id: req.body.user_id, isDeleted: false };
  } else {
    query = { isDeleted: false };

  }
  console.log("Query : ", query);
  order.find(query).populate("user_id created_by truckNumber").sort({ updatedAt: -1 }).exec(function (error, result) {
    if (error) {
      res.status(500).send({ success: false, error: error });
    } else {
      if (result.length > 0) {
        res.status(200).send({ success: true, result: result });
      } else {
        res.status(404).send({ success: false, message: "Order not found" });
      }
    }
  })
}


exports.updateOrderManager = function (req, res) {
  var params = req.body;
  if (process.env.DEBUG_LOGS == 'true') {
    console.log("Reuest : ", params);
  }
  if (params.order_id != null && params.order_id != undefined && params.order_id != '') {
    order.findOne({ _id: params.order_id, isDeleted: false }).populate("user_id created_by truckNumber").exec(function (error, result) {
      if (error) {
        res.status(500).send({ success: false, error: error });
      } else {
        if (result) {
          if (params.totalAmount != null && params.totalAmount != undefined && params.totalAmount != '') {
            User.findOne({ _id: result.user_id._id }).exec(function (error, resultUser) {
              if (error) {
                console.log(error);
              } else {
                resultUser.credit = parseInt(resultUser.credit) - (parseInt(params.totalAmount) - parseInt(result.totalAmount));
                resultUser.save(function (error, sav) {
                  if (error) {
                    console.log("error: ", error);
                  } else {
                    result.title = req.body.title
                    ? req.body.title
                    : result.title;
                    result.description = req.body.description
                    ? req.body.description
                    : result.description;
                    result.status = req.body.status
                    ? req.body.status
                    : result.status;
                    result.deliveryDate = req.body.deliveryDate
                    ? req.body.deliveryDate
                    : result.deliveryDate;
                    result.price = req.body.price
                    ? req.body.price
                    : result.price;
                    result.address = req.body.address
                    ? req.body.address
                    : result.address;
                    result.fromAddress = req.body.fromAddress
                    ? req.body.fromAddress
                    : result.fromAddress;
                    result.freightCharges = req.body.freightCharges
                    ? req.body.freightCharges
                    : result.freightCharges;
                    result.distance = req.body.distance
                    ? req.body.distance
                    : result.distance;
                    result.totalAmount = req.body.totalAmount
                    ? req.body.totalAmount
                    : result.totalAmount;
                    result.rate = req.body.rate
                    ? req.body.rate
                    : result.rate;
                    result.truckNumber = req.body.truckNumber
                    ? req.body.truckNumber
                    : result.truckNumber;
                    // result.address = req.body.address
                    //   ? req.body.address
                    //   : result.address;
                    result.fuelConsumed = req.body.fuelConsumed
                    ? req.body.fuelConsumed
                    : result.fuelConsumed;
                    result.deliveryStatus = req.body.deliveryStatus
                    ? req.body.deliveryStatus
                    : result.deliveryStatus;
                    result.deliveryTime = req.body.deliveryTime
                    ? req.body.deliveryTime
                    : result.deliveryTime;
                    result.price = req.body.price
                    ? req.body.price
                    : result.price;
                    result.quantity = req.body.quantity
                    ? req.body.quantity
                    : result.quantity;
                    result.quantity = req.body.quantity
                    ? req.body.quantity
                    : result.quantity;
                    result.biltyNumber = req.body.biltyNumber
                    ? req.body.biltyNumber
                    : result.biltyNumber;
                    result.user_id = req.body.user_id
                    ? req.body.user_id
                    : result.user_id;
                    if (req.body.isDeleted && !result.isDeleted) {
                      result.isDeleted = req.body.isDeleted
                      ? req.body.isDeleted
                      : result.isDeleted;
                      result.deletedBy = req.user._id;
                      resultUser.credit = parseInt(resultUser.credit + result.totalAmount);
                    }
                    if(req.body.date!=undefined && req.body.date!=null && req.body.date!=''){
                      result.deliveryDate = req.body.date;
                      result.createdAt = req.body.date;
                      taxService.getTax(req.body.date).then(function(resultTax){
                        console.log("Found : ",resultTax)
                        if(result['fat']!=undefined && result['fat']!=null){
                          result['fat'] = resultTax.fat;
                        }
                        if(result['nfat']!=undefined && result['nfat']!=null){
                          result['nfat'] = resultTax.nfat;
                        }
                        if(result['mrp']!=undefined && result['mrp']!=null){
                            result['mrp'] = resultTax.mrp;
                        }
                        if(result['gst']!=undefined && result['gst']!=null){
                          result['gst'] = resultTax.gst;
                        }
                        if(result['wht']!=undefined && result['wht']!=null){
                          result['wht'] = resultTax.wht;
                        }
                        result.save(function(error,saved){
                          if(error){
                            res.status(500).send({success:false , error:error , message : "Error in saving order"});
                          }else{
                            res.status(200).send({ success: true, result: result });
                          }
                        })
                      })

                    }else{
                      result.save(function (error, done) {
                        if (error) {
                          res.status(500).send({ success: false, error: error });
                        } else {
                          resultUser.save(function(error,saveduser){
                            if(error){
                              res.status(500).send({success:false , error:error});
                            }else{
                              res.status(200).send({ success: true, result: result });
                            }
                          })
                        }
                      })
                    }

                  }
                })
              }
            })
          } else {
            result.title = req.body.title
            ? req.body.title
            : result.title;
            result.description = req.body.description
            ? req.body.description
            : result.description;
            result.status = req.body.status
            ? req.body.status
            : result.status;
            result.deliveryDate = req.body.deliveryDate
            ? req.body.deliveryDate
            : result.deliveryDate;
            result.price = req.body.price
            ? req.body.price
            : result.price;
            result.address = req.body.address
            ? req.body.address
            : result.address;
            result.freightCharges = req.body.freightCharges
            ? req.body.freightCharges
            : result.freightCharges;
            result.distance = req.body.distance
            ? req.body.distance
            : result.distance;
            result.totalAmount = req.body.totalAmount
            ? req.body.totalAmount
            : result.totalAmount;
            result.rate = req.body.rate
            ? req.body.rate
            : result.rate;
            result.truckNumber = req.body.truckNumber
            ? req.body.truckNumber
            : result.truckNumber;
            result.address = req.body.address
            ? req.body.address
            : result.address;
            result.fuelConsumed = req.body.fuelConsumed
            ? req.body.fuelConsumed
            : result.fuelConsumed;
            result.deliveryStatus = req.body.deliveryStatus
            ? req.body.deliveryStatus
            : result.deliveryStatus;
            result.deliveryTime = req.body.deliveryTime
            ? req.body.deliveryTime
            : result.deliveryTime;
            result.price = req.body.price
            ? req.body.price
            : result.price;
            result.quantity = req.body.quantity
            ? req.body.quantity
            : result.quantity;
            result.quantity = req.body.quantity
            ? req.body.quantity
            : result.quantity;
            if (req.body.isDeleted && !result.isDeleted) {
              result.isDeleted = req.body.isDeleted
              ? req.body.isDeleted
              : result.isDeleted;
              result.deletedBy = req.user._id;
              User.findOne({ _id: result.user_id._id }).exec(function (error, resultUser) {
                if (error) {
                  res.status(500).send({ success: false, error: error });
                } else {
                  resultUser.credit = parseInt(resultUser.credit) + parseInt(result.totalAmount);
                  resultUser.save(function (error, savedData) {
                    if (error) {
                      res.status(500).send({ success: false, error: error });
                    } else {
                      result.user_id = req.body.user_id
                      ? req.body.user_id
                      : result.user_id;
                      if(req.body.date!=undefined && req.body.date!=null && req.body.date!=''){
                        result.createdAt = req.body.date;
                        result.deliveryDate = req.body.date;
                        taxService.getTax(req.body.date).then(function(resultTax){
                          console.log("Found : ",resultTax)
                          if(result['fat']!=undefined && result['fat']!=null){
                            result['fat'] = resultTax.fat;
                          }
                          if(result['nfat']!=undefined && result['nfat']!=null){
                            result['nfat'] = resultTax.nfat;
                          }
                          if(result['mrp']!=undefined && result['mrp']!=null){
                              result['mrp'] = resultTax.mrp;
                          }
                          if(result['gst']!=undefined && result['gst']!=null){
                            result['gst'] = resultTax.gst;
                          }
                          if(result['wht']!=undefined && result['wht']!=null){
                            result['wht'] = resultTax.wht;
                          }
                          result.save(function(error,saved){
                            if(error){
                              res.status(500).send({success:false , error:error , message : "Error in saving order"});
                            }else{
                              res.status(200).send({ success: true, result: result });
                            }
                          })
                        })
                      }else{
                        result.save(function (error, done) {
                          if (error) {
                            res.status(500).send({ success: false, error: error });
                          } else {
                            resultUser.save(function(error,saveduser){
                              if(error){
                                res.status(500).send({success:false , error:error});
                              }else{
                                res.status(200).send({ success: true, result: result });
                              }
                            })
                          }
                        })
                      }
                    }
                  })
                }
              })
            } else {
              result.user_id = req.body.user_id
              ? req.body.user_id
              : result.user_id;
              if(req.body.date!=undefined && req.body.date!=null && req.body.date!=''){
                result.createdAt = req.body.date;
                result.deliveryDate = req.body.date;
                taxService.getTax(req.body.date).then(function(resultTax){
                  console.log("Found : ",resultTax)
                  if(result['fat']!=undefined && result['fat']!=null){
                    result['fat'] = resultTax.fat;
                  }
                  if(result['nfat']!=undefined && result['nfat']!=null){
                    result['nfat'] = resultTax.nfat;
                  }
                  if(result['mrp']!=undefined && result['mrp']!=null){
                      result['mrp'] = resultTax.mrp;
                  }
                  if(result['gst']!=undefined && result['gst']!=null){
                    result['gst'] = resultTax.gst;
                  }
                  if(result['wht']!=undefined && result['wht']!=null){
                    result['wht'] = resultTax.wht;
                  }

                  result.save(function(error,saved){
                    if(error){
                      res.status(500).send({success:false , error:error , message : "Error in saving order"});
                    }else{
                      res.status(200).send({ success: true, result: result });
                    }
                  })
                })
              }else{
                result.save(function (error, done) {
                  if (error) {
                    res.status(500).send({ success: false, error: error });
                  } else {
                    resultUser.save(function(error,saveduser){
                      if(error){
                        res.status(500).send({success:false , error:error});
                      }else{
                        res.status(200).send({ success: true, result: result });
                      }
                    })
                  }
                })
              }
            }
          }
        } else {
          res.status(403).send({ success: false, message: "order not found" });
        }
      }
    })
  } else {
    res.status(403).send({ succes: false, message: "order id required" });
  }
}
