var tax = require('../models/tax.js');
var order = require('../models/order.js');
var user = require('../models/user.js');
var util = require('../config/util.js');
var taxUtill = require('../config/tax.js');
const { Parser } = require('json2csv');
exports.addTax = function (req, res) {
  var params = req.body;
  if (params.type == null || params.type == undefined || params.type == '') {
    res.status(400).send({ message: "type is required" })
  } else if (params.rate == null || params.rate == undefined || params.rate == '') {
    res.status(400).send({ message: "rate is required" })
  } else if (params.date == null || params.date == undefined || params.date == '') {
    res.status(400).send({ message: "date is required" })
  } else {
    var dt = new Date(params.date);
    dt.addHours(5);
    if (req.body.rate != null) {
      tax.create({
        type: params.type,
        rate: params.rate,
        date: dt.toISOString(),
        description: params.description
      }).then((result) => {
        res.status(201).send({ entry: result })
      }).catch((error) => {
        console.log("Error:", error);
      })
    } else {
      res.status(400).send({ error: "Rate not initialized" });
      console.log("Rate is empty");
    }
  }
};

exports.calculateLedger = function (req, res) {
  var count = 0;
  if(req.body.user_id!=null && req.body.user_id!=undefined && req.body.user_id!=''){
    user.findOne({_id:req.body.user_id}).exec(function(error,resultUser){
      if(error){
        res.status(500).send({success:false , error:error});
      }else{
        if(resultUser){
          var isFiller = false;
          var activeNtn = false;
          if(resultUser.ntn!=null && resultUser.ntn!=undefined && resultUser.ntn!=''){
            isFiller = true;
          }
          if(resultUser.ntnStatus!=null && resultUser.ntnStatus!=undefined && resultUser.ntnStatus!=''){
            if(resultUser.ntn=='active'){
              activeNtn = true;
            }
          }
          util.getOrderLedgers(req.body.user_id,isFiller,req.body.to,req.body.from,activeNtn,resultUser.credit).then((result)=>{

            // console.log("**", result)

            if(result.length>0){
              // var arraySort = require('array-sort');
              // result.order = arraySort(result.order, 'createdAt', {reverse: true})
              // var xxx = arraySort(result.order, 'createdAt', {reverse: true});
              // console.log(xxx);
              var toBeSentResponse = {};
              result.forEach(function(i,idx,x){
                //    console.log("ForEach", idx,i._id);
                if(i.totalPayedYet.length>0){
                  result[idx]['totalPayedByDate'] = 0;
                  i.totalPayedYet.forEach(function (j, jdy, y) {

                    if(i.totalPayedYet[jdy].isDeleted == false){
                      result[idx]['payments'] = i.totalPayedYet;
                    }

                    //    console.log("**********",i.totalPayedYet)
                    if(i.totalPayedYet[jdy].status == 'success' && i.totalPayedYet[jdy].isDeleted == false){
                      // console.log("True123")
                      result[idx]['totalPayedByDate'] = parseInt(result[idx]['totalPayedByDate']) + parseInt(result[idx].totalPayedYet[jdy].amount);
                    }else{

                    }
                    // console.log(i._id+"" , req.body.user_id+"");
                    if(i._id+"" == req.body.user_id+"" && i.totalPayedYet[jdy].isDeleted == false){
                      // console.log("True")
                      toBeSentResponse = i;
                    }else{
                      // console.log("False");
                    }
                    if (jdy == y.length - 1) {
                      count = count + 1;
                      delete result[idx]['totalPayedYet'];
                    }
                  })
                }else{
                  count = count+1;
                  result[idx].order['totalPayedByDate'] = 0
                  if(i._id+"" == req.body.user_id+""){
                    toBeSentResponse = i;
                  }
                }
                if(count == x.length){
                  if (toBeSentResponse.order == undefined)
                  {
                    toBeSentResponse["order"] = []
                  }
                  if (toBeSentResponse.payments == undefined)
                  {
                    toBeSentResponse["payments"] = []
                  }
                  if(toBeSentResponse["payments"].length>0){
                    // console.log("Payments length > 0")
                    var paym = [];
                    toBeSentResponse["payments"].forEach(function(m,mn,n){
                      if(new Date(m.date).getTime()>=new Date(req.body.from).getTime() && new Date(m.date).getTime()<=new Date(req.body.to).getTime() && m.isDeleted==false){
                        // console.log("found 8*******************")
                        paym[paym.length] = m;
                      }
                      if(mn == n.length-1){
                        toBeSentResponse['payments'] = paym;
                        var arraySort = require('array-sort');
                        toBeSentResponse['payments'] = arraySort(toBeSentResponse.payments, 'payment.createdAt', {reverse: false});
                        toBeSentResponse['order'] = arraySort(toBeSentResponse.order, 'order.createdAt', {reverse: false});
                        res.status(200).send({success:true , result:toBeSentResponse})
                      }
                    })
                  }else{
                    // console.log("Payments length is not greater than 0")

                    var arraySort = require('array-sort');
                    toBeSentResponse['order'] = arraySort(toBeSentResponse.order, 'order.createdAt', {reverse: false})
                    if(toBeSentResponse['payments'] && toBeSentResponse['payments'].length>0){
                      toBeSentResponse['payments'] = arraySort(toBeSentResponse.payment, 'payment.createdAt', {reverse: false});
                    }else{
                      toBeSentResponse['payments'] = [];
                    }
                    res.status(200).send({success:true ,result:toBeSentResponse})
                  }

                }
              })
            } else {
              if (result.order == undefined)
              {
                result["order"] = []
              }
              if (result.payments == undefined)
              {
                result["payments"] = []
              }
              res.status(200).send({ success: true, result: result });
            }
          }).catch((error) => {
            console.log(error)
            res.status(500).send({ success: false, error: error });
          })
        }else{
          res.status(403).send({success:false , message : "User details not found."});
        }
      }
    })
  }else{
    res.status(403).send({success:false , message :"user_id required"});
  }

}

exports.calculateSingleUserLedger = function (req, res) {
  util.getSingleUserOrderLedgers(req.body.user_id).then((result) => {
    res.status(200).send({ success: true, result: result });
  }).catch((error) => {
    res.status(500).send({ success: false, error: error });
  })
}

exports.createUpdateTaxInfo = function (req, res) {
  console.log("Request :::", req.body);
  var toDate = new Date(new Date(new Date(req.body.to).getTime()).toISOString().split("T")[0]+"T01:00:00.000Z");

  var fromDate = new Date(new Date(new Date(req.body.from).getTime()).toISOString().split("T")[0]+"T01:00:00.000Z");
  req.body.to = undefined;
  req.body.from = undefined;
  var values = Object.keys(req.body);
  if (values.length > 0) {
    var failed = 0;
    var processed = 0;
    var sent = false;

    var totalDays = parseInt((new Date(toDate).getTime() - new Date(fromDate).getTime()) / 86400000);

    console.log("CreateUpdateTax", "Total Days", totalDays);

    if (totalDays == 0) {
      totalDays = 1;
    }
    for (var j = 0; j < totalDays; j++) {
      var toDateUpdated = new Date(fromDate).getTime() + (j * 86400000);

      console.log("CreateUpdateTax", "Creating Entry for Date", toDateUpdated);

      values.forEach(function (i, idx, x) {
        if (i != 'from' && i != 'to') {
          taxUtill.updateCreateTax(new Date(toDateUpdated), i, req.body[i]).then(function (result) {
            processed = processed + 1;
            if (processed >= totalDays) {
              if(sent == false){
                sent = true;
                res.status(200).send({ success: true, message: "Tax info processed successfully", failed: failed });
              }
            }
          }).catch(function (error) {
            failed = failed + 1;
            processed = processed + 1;
            if (processed >= totalDays) {
              if(sent == false){
                sent = true;
                res.status(200).send({ success: true, message: "Tax info processed successfully", failed: failed });
              }
            }
          })
        } else {
          processed = processed + 1;
          if (processed >= totalDays) {
            if(sent == false){
              sent = true;
              res.status(200).send({ success: true, message: "Tax info processed successfully", failed: failed });
            }
          }
        }
      })
    }
  } else {
    res.status(403).send({ success: false, message: "tax info required" });
  }
}


exports.viewAllTaxes = function(req,res){
  console.log("Request :::: ",req.body);
  if(req.body.to!=null && req.body.to!=undefined && req.body.to!=''){
    if(req.body.from!=null && req.body.from!=undefined && req.body.from!=''){
      tax.aggregate([
        { $match: { date:{
          $gte : new Date(req.body.from),
          $lte: new Date(req.body.to)
        },
        isDefault : false
      },
    },

    { $group: { _id: "$date", "tax": { $push: "$$ROOT" }   }}
  ]).sort({_id:-1}).exec(function(error,result){
    if(error){
      res.status(500).send({success:false, error:error});
    }else{


      var sendFinal = []
      result.map((data,i)=>{


        var sendThis = {}

        data.tax.map((jdata, j)=>{
          var key = jdata.type
          sendThis[key] = jdata.rate
        })



        console.log("sendThis", sendThis);
        var key = new Date(data._id).toISOString()
        sendThis["date"] = key //new Date(data._id).toISOString()

        sendFinal.push(sendThis);

      })

      res.status(200).send({success:true, result:sendFinal});
    }
  })
}else{
  res.status(403).send({success:false , message : "from date required"});
}
}else{
  tax.aggregate([
    { $match: { isDefault : false }},
    { $group: { _id: "$date", "tax": { $push: "$$ROOT" }   }}
  ]).sort({_id:-1}).exec(function(error,result){
    if(error){
      res.status(500).send({success:false, error:error});
    }else{
      var sendFinal = []
      result.map((data,i)=>{
        var sendThis = {}
        data.tax.map((jdata, j)=>{
          var key = jdata.type
          sendThis[key] = jdata.rate
        })
        console.log("sendThis", sendThis);
        var key = new Date(data._id).toISOString()
        sendThis["date"] = key //new Date(data._id).toISOString()
        sendFinal.push(sendThis);
      })
      res.status(200).send({success:true, result:sendFinal, message : "Result is not date specefied"});
    }
  })
}
}


exports.exportLedgerFile = function(req,res){
  var count = 0;
  req.body.user_id = "5d6a65cb48e3b60016798eae";
  if(req.body.user_id!=null && req.body.user_id!=undefined && req.body.user_id!=''){
    user.findOne({_id:req.body.user_id}).exec(function(error,resultUser){
      if(error){
        res.status(500).send({success:false , error:error});
      }else{
        if(resultUser){
          var isFiller = false;
          var activeNtn = false;
          if(resultUser.ntn!=null && resultUser.ntn!=undefined && resultUser.ntn!=''){
            isFiller = true;
          }
          if(resultUser.ntnStatus!=null && resultUser.ntnStatus!=undefined && resultUser.ntnStatus!=''){
            if(resultUser.ntnStatus=='active'){
              activeNtn = true;
            }
          }
          util.getOrderLedgers(req.body.user_id,isFiller,req.body.to,req.body.from,activeNtn,resultUser.credit).then((result)=>{

            // console.log("**", result)
            if(result.length>0){
              var toBeSentResponse = {};
              result.forEach(function(i,idx,x){
                console.log("ForEach", idx,i._id);
                if(i.totalPayedYet.length>0){
                  result[idx]['totalPayedByDate'] = 0;
                  i.totalPayedYet.forEach(function (j, jdy, y) {
                    result[idx]['payments'] = i.totalPayedYet;
                    if(i.totalPayedYet[jdy].status == 'success'){
                      result[idx]['totalPayedByDate'] = parseInt(result[idx]['totalPayedByDate']) + parseInt(result[idx].totalPayedYet[jdy].amount);
                    }
                    if(i._id+"" == req.body.user_id+""){
                      toBeSentResponse = i;
                    }
                    if (jdy == y.length - 1) {
                      count = count + 1;
                      delete result[idx]['totalPayedYet'];
                    }
                  })
                }else{
                  count = count+1;
                  result[idx].order['totalPayedByDate'] = 0
                  if(i._id+"" == req.body.user_id+""){
                    toBeSentResponse = i;
                  }
                }
                if(count == x.length){
                  if (toBeSentResponse.order == undefined)
                  {
                    toBeSentResponse["order"] = []
                  }
                  if (toBeSentResponse.payments == undefined)
                  {
                    toBeSentResponse["payments"] = []
                  }
                  if(toBeSentResponse["payments"].length>0){
                    var paym = [];
                    toBeSentResponse["payments"].forEach(function(m,mn,n){
                      if(new Date(m.date).getTime()>=new Date(req.body.from).getTime() && new Date(m.date).getTime()<=new Date(req.body.to).getTime()){
                        paym[paym.length] = m;
                      }
                      paym[paym.length] = m;
                      if(mn == n.length-1){
                        toBeSentResponse['payments'] = paym;
                        var json2xls = require('json2xls');
                        var jsonArr = toBeSentResponse.order.concat(toBeSentResponse.payments);



                        res.xls('data.xlsx', jsonArr);

                        //                        res.status(200).send({success:true,result:toBeSentResponse});
                      }
                    })
                  }else{
                    res.status(200).send({success:true,result:toBeSentResponse});
                  }

                }
              })
            } else {
              if (result.order == undefined)
              {
                result["order"] = []
              }
              if (result.payments == undefined)
              {
                result["payments"] = []
              }
              res.status(200).send({ success: true, result: result });
            }
          }).catch((error) => {
            console.log(error)
            res.status(500).send({ success: false, error: error });
          })
        }else{
          res.status(403).send({success:false , message : "User details not found."});
        }
      }
    })
  }else{
    res.status(403).send({success:false , message :"user_id required"});
  }
}
