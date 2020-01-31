var order = require('../models/order.js');
var user = require('../models/user.js');
var truck = require('../models/truck.js');
var tax = require('../models/tax.js');
const enums = require('../models/enum.js');
exports.updateOrderTM = function(req,res){
  var params = req.body;
  if(process.env.DEBUG_LOGS == 'true'){
    console.log("Reuest : ",params);
  }
  if(req.user.type  == 'transport manager'){
    order.findOne({_id:params.order_id}).populate("user_id created_by").exec(function(error,result){
      if(error){
        res.status(500).send({success:fasle , error:error});
      }else{
        if(result){
          result.freightCharges = req.body.freightCharges
          ? req.body.freightCharges
          : result.freightCharges;
          result.distance = req.body.distance
          ? req.body.distance
          : result.distance;
          result.fuelConsumed = req.body.fuelConsumed
          ? req.body.fuelConsumed
          : result.fuelConsumed;
          result.deliveryStatus = req.body.deliveryStatus
          ? req.body.deliveryStatus
          : result.deliveryStatus;
          result.deliveryTime = req.body.deliveryTime
          ? req.body.deliveryTime
          : result.deliveryTime;
          result.save(function(error,done){
            if(error){
              res.status(500).send({success:false , error:error});
            }else{
              res.status(200).send({success: true , result:result});
            }
          })
        }else{
          res.status(403).send({success : false , message: "order not found"});
        }
      }
    })
  }else{
    res.status(401).send({success: false , message :"You are not authorised to perform this action"});
  }
}



exports.createDealerDeliveryOrder = function(req,res){
  console.log("Request : ",req.body);
  var params = req.body;
  params["gst"] = process.env.gst;
  params["nfat"] = process.env.nfat;
  params["fat"] = process.env.fat;
  params["wht"] = process.env.wht;
  params["mrp"] = process.env.mrp;
  // params["gst"] = "5d63dc60fd8d7e0016ae452c";
  // params["nfat"] = "5d63dc60fd8d7e0016ae452d";
  // params["fat"] = "5d63dc60fd8d7e0016ae452b";
  // params["wht"] = "5d667c570ca7c5a646627150";
  // params["mrp"] = "5d63dc60fd8d7e0016ae452a";
  if(params.user_id!=null && params.user_id!=undefined && params.user_id!=''){
    if(params.deliveryType!=null && params.deliveryType!=undefined && params.deliveryType!=''){
      if(params.deliveryItemType!=null && params.deliveryItemType!=undefined && params.deliveryItemType!=''){
        if(params.quantity!=null && params.quantity!=undefined && params.quantity!=''){
          // if(params.biltyNumber!=null && params.biltyNumber!=undefined && params.biltyNumber!=''){
            // if(params.truckNumber!=null && params.truckNumber!=undefined && params.truckNumber!=''){
              if(params.rate!=null && params.rate!=undefined && params.rate!=''){
                if(params.totalAmount!=null && params.totalAmount!=undefined && params.totalAmount!=''){
                  if(params.date!=null && params.date!=undefined && params.date!=''){
                    order.find({}).then((result) => {
                      var orderLength = result.length + 1;
                      var invoiceStr = orderLength.toString();
                      params.invoiceNumber = invoiceStr.padStart(6, '0');
                      params["createdAt"] = params.date
                      order.create(params).then(function(result){
                        user.findOne({_id:params.user_id}).exec(function(error,resultUser){
                          if(error){
                            res.status(500).send({success:false , error:error});
                          }else{
                            if(resultUser){
                              resultUser.rate = params.rate;
                              resultUser.credit = parseInt(resultUser.credit) - parseInt(params.totalAmount);
                              resultUser.save(function(error,done){
                                if(error){
                                  res.status(500).send({success:false , error:error});
                                }else{
                                  tax.find({
                                    date: new Date(params["createdAt"]).toISOString().split("T")[0] + "T01:00:00.000Z"
                                  }).exec(function (error, taxResult) {
                                    console.log(":::::::TAX RESULT::::::", taxResult);

                                    if (error) {
                                      res.status(500).send({ success: false, error: error });
                                    } else {
                                      if (taxResult.length > 0) {
                                        console.log("____in tax result:", taxResult);
                                        if(resultUser.ntnStatus == 'active'){
                                          result.isActiveFiler = true;
                                        }
                                        if(resultUser.ntn != ''){
                                          result.isFiler = true;
                                        }
                                        var updateObject = {};
                                        taxResult.forEach(function (i, idx, x) {
                                          console.log("i._id", i._id)
                                          if (i.type == 'gst') {
                                            result['gst'] = i._id;
                                            updateObject['gst'] = i._id;
                                          } else if (i.type == 'nfat') {
                                            result['nfat'] = i._id;
                                            updateObject['nfat'] = i._id;
                                            console.log("in tax result nfat:", i._id, idx, x);
                                          } else if (i.type == 'wht') {
                                            result['wht'] = i._id;
                                            updateObject['wht'] = i._id;
                                          } else if (i.type == 'mrp') {
                                            result['mrp'] = i._id;
                                            updateObject['mrp'] = i._id;
                                          } else if (i.type == 'fat') {
                                            result['fat'] = i._id;
                                            updateObject['fat'] = i._id;
                                          }
                                          console.log("update Object:", updateObject);
                                          if (idx == x.length - 1) {
                                            if (Object.keys(updateObject).length > 0) {
                                              order.update({ _id: result._id }, result, { multi: false }).then(function (done) {
                                                res.status(200).send({ success: true, result: result, message: "order created successfully" });
                                              }).catch(function (error) {
                                                console.log("Tax Ids not updated : ", error);
                                                //res.status(500).send({success:false ,error:error});
                                                res.status(200).send({ success: true, result: result, message: "order created successfully" });
                                              })
                                            }else{
                                              res.status(200).send({ success: true, result: result, message: "order created successfully" });
                                            }
                                          }
                                        })
                                        // order.update({_id:result._id},{gst_id:})
                                      } else {
                                        // console.log("**************", "Tax not found", result);
                                        res.status(200).send({ success: true, result: result, message: "order created successfully" });
                                      }
                                    }
                                  })
                                }
                              })
                            }else{
                              res.status(403).send({success:false , message : "User not found"});
                            }
                          }
                        })
                      })
                    }).catch(function(error){
                      res.status(500).send({success:false , error:error});
                    })
                  }else{
                    res.status(403).send({success:false , message : "Date required"});
                  }
                }else{
                  res.status(403).send({success:false , message : "totalAmount required"});
                }
              }else{
                res.status(403).send({success:false , message : "rate required"});
              }
            // }else{
            //   res.status(403).send({success:false , message : "truckNumber required"});
            // }
          // }else{
          //   res.status(403).send({success:false , message : "biltyNumber required"});
          // }
        }else{
          res.status(403).send({success:false , message : "quantity required"});
        }
      }else{
        res.status(403).send({success:false , message : "deliveryItemType required"});
      }
    }else{
      res.status(403).send({success:false , message : "deliveryType required"});
    }
  }else{
    res.status(403).send({success:false , message : "user_id required"});
  }
}


exports.createEnduserDeliveryOrder = function(req,res){
  console.log("Request : ",req.body);
  var params = req.body;
  // params["gst"] = "5d63dc60fd8d7e0016ae452c";
  // params["nfat"] = "5d63dc60fd8d7e0016ae452d";
  // params["fat"] = "5d63dc60fd8d7e0016ae452b";
  // params["wht"] = "5d667c570ca7c5a646627150";
  // params["mrp"] = "5d63dc60fd8d7e0016ae452a";
    params["gst"] = process.env.gst;
    params["nfat"] = process.env.nfat;
    params["fat"] = process.env.fat;
    params["wht"] = process.env.wht;
    params["mrp"] = process.env.mrp;
  if(params.user_id!=null && params.user_id!=undefined && params.user_id!=''){
    if(params.deliveryType!=null && params.deliveryType!=undefined && params.deliveryType!=''){
      if(params.deliveryItemType!=null && params.deliveryItemType!=undefined && params.deliveryItemType!=''){
        if(params.quantity!=null && params.quantity!=undefined && params.quantity!=''){
          // if(params.biltyNumber!=null && params.biltyNumber!=undefined && params.biltyNumber!=''){
            // if(params.truckNumber!=null && params.truckNumber!=undefined && params.truckNumber!=''){
              if(params.rate!=null && params.rate!=undefined && params.rate!=''){
                if(params.totalAmount!=null && params.totalAmount!=undefined && params.totalAmount!=''){
                  if(params.date!=null && params.date!=undefined && params.date!=''){
                    params["createdAt"] = params.date
                    order.find({}).then((result) => {
                      var orderLength = result.length + 1;
                      var invoiceStr = orderLength.toString();
                      params.invoiceNumber = invoiceStr.padStart(6, '0');
                      order.create(params
                          //{
                        // user_id : params.user_id,
                        // deliveryType : params.deliveryType,
                        // deliveryItemType : params.deliveryItemType,
                        // quantity : params.quantity,
                        // biltyNumber : params.biltyNumber,
                        // truckNumber : params.truckNumber,
                        // rate : params.rate,
                        // totalAmount : params.totalAmount,
                        // invoiceNumber: invoiceStr
                      //}
                      ).then(function(result){
                        user.findOne({_id:req.body.user_id}).exec(function(error,resultUser){
                          if(error){
                            res.status(500).send({success:false , error:error});
                          }else{
                            if(resultUser){
                              resultUser.rate = params.rate;
                              resultUser.credit = parseInt(resultUser.credit) - parseInt(params.totalAmount);
                              resultUser.save(function(error,done){
                                if(error){
                                  res.status(500).send({success:false , error:error});
                                }else{
                                  tax.find({
                                    date: new Date(params["createdAt"]).toISOString().split("T")[0] + "T01:00:00.000Z"
                                  }).exec(function (error, taxResult) {
                                    console.log(":::::::TAX RESULT::::::", taxResult);

                                    if (error) {
                                      res.status(500).send({ success: false, error: error });
                                    } else {
                                      if (taxResult.length > 0) {
                                        console.log("____in tax result:", taxResult);
                                        if(resultUser.ntnStatus == 'active'){
                                          result.isActiveFiler = true;
                                        }
                                        if(resultUser.ntn != ''){
                                          result.isFiler = true;
                                        }
                                        var updateObject = {};
                                        taxResult.forEach(function (i, idx, x) {
                                          if (i.type == 'gst') {
                                            result['gst'] = i._id;
                                            updateObject['gst'] = i._id;
                                          } else if (i.type == 'nfat') {
                                            result['nfat'] = i._id;
                                            updateObject['nfat'] = i._id;
                                            console.log("in tax result nfat:", i._id, idx, x);
                                          } else if (i.type == 'wht') {
                                            result['wht'] = i._id;
                                            updateObject['wht'] = i._id;
                                          } else if (i.type == 'mrp') {
                                            result['mrp'] = i._id;
                                            updateObject['mrp'] = i._id;
                                          } else if (i.type == 'fat') {
                                            result['fat'] = i._id;
                                            updateObject['fat'] = i._id;
                                          }
                                          console.log("update Object:", updateObject);
                                          if (idx == x.length - 1) {
                                            if (Object.keys(updateObject).length > 0) {
                                              order.update({ _id: result._id }, result, { multi: false }).then(function (done) {
                                                res.status(200).send({ success: true, result: result, message: "order created successfully" });
                                              }).catch(function (error) {
                                                console.log("Tax Ids not updated : ", error);
                                                //res.status(500).send({success:false ,error:error});
                                                res.status(200).send({ success: true, result: result, message: "order created successfully" });
                                              })
                                            }
                                          }
                                        })
                                        // order.update({_id:result._id},{gst_id:})
                                      } else {
                                        // console.log("**************", "Tax not found", result);
                                        res.status(200).send({ success: true, result: result, message: "order created successfully" });
                                      }
                                    }
                                  })
                                }
                              })
                            }else{
                              res.status(403).send({success:false , message : "User not found"});
                            }
                          }
                        })
                      }).catch(function(e){
                        console.log("1",e)
                        res.status(500).send({success:false , error:e});
                      })
                    }).catch(function(error){
                      res.status(500).send({success:false , error:error});
                    })
                  }else{
                    res.status(403).send({success:false , message : "Date required"});
                  }
                }else{
                  res.status(403).send({success:false , message : "totalAmount required"});
                }
              }else{
                res.status(403).send({success:false , message : "rate required"});
              }
            // }else{
            //   res.status(403).send({success:false , message : "truckNumber required"});
            // }
          // }else{
          //   res.status(403).send({success:false , message : "biltyNumber required"});
          // }
        }else{
          res.status(403).send({success:false , message : "quantity required"});
        }
      }else{
        res.status(403).send({success:false , message : "deliveryItemType required"});
      }
    }else{
      res.status(403).send({success:false , message : "deliveryType required"});
    }
  }else{
    res.status(403).send({success:false , message : "user id required"});
  }
}

exports.getAllTrucksInfo = function(req,res){
  console.log("Request : ",req.body);

  truck.find().then(function(result){
    enums.findOne({}).exec(function(error,resultEnum){
      if(error){
        res.status(500).send({success:false , error:error});
      }else{
        res.status(200).send({success:true , result:result,enum:resultEnum});
      }
    })
  }).catch(function(e){
    res.status(500).send({success:false , error:e});
  })
}

exports.addTruckInfo = function(req,res){
  console.log("Request : ",req.body);
  var params = req.body;
  if(params.registrationNumber!=null && params.registrationNumber!=undefined && params.registrationNumber!=''){
    truck.create(params).then(function(result){
      res.status(200).send({success:true , result:result});
    }).catch(function(e){
      res.status(500).send({success:false , error:e});
    })
  }else{
    res.status(403).send({success:false , message : "registrationNumber required"});
  }
}

exports.associateDriverWithTruck = function(req,res){
  console.log("Request : ",req.body);
  var params = req.body;
  if(params.user_id!=null && params.user_id!=undefined && params.user_id!=""){
    if(params.truck_id!=null && params.truck_id!=undefined && params.truck_id!=""){
      truck.findOne({_id:params.truck_id}).exec(function(error,result){
        if(error){
          console.log(error)
          res.status(500).send({success:false , error:error});
        }else{
          if(result){
            result.updatedBy = req.user._id;
            var upd = result;
            upd._id = undefined;
            // if(result.updatedSaved.length>0){
            //   result.updatedSaved = result.updatedSaved.concat([{
            //     updater : req.user._id,
            //     lastDriver : result.user_id
            //   }]);
            // }else{
            //   result.updatedSaved = [{
            //     updater : req.user._id,
            //     lastDriver : result.user_id
            //   }];
            // }

            result.user_id = params.user_id;
            result.save(function(error,saved){
              if(error){
                console.log("1221121212121",error)
                res.status(500).send({succes:false , error:error});
              }else{
                res.status(200).send({success:true, result:saved,message: "Driver Info updated successfully."});
              }
            })
          }else{
            res.status(403).send({success:false , message: "Truck details not found."});
          }
        }
      })
    }else{
      res.status(403).send({success:false , message : "Truck required"});
    }
  }else{
    res.status(403).send({success:false , message : "User required"});
  }
}
