var payment = require('../models/payment.js');
var reports = require('../config/reports.js');
var bankAccount = require('../models/bankAccount.js');
exports.fbrReport = function(req,res){
  var params = req.body;
  console.log("Request :::",params);
  // if(params.to!=null && params.to!=undefined && params.to!=''){
  //   if(params.from!=null && params.from!=undefined && params.from!=''){
  reports.fbrReport(req.body.user_id,params.from,params.to).then(function(result){
    res.status(200).send({success:true , result:result});
  }).catch(function(error){
    console.log("Error ::::::",error);
    res.status(500).send({success:false , error:error});
  })
  //   }else{
  //     res.status(403).send({success:false , message : "from date required"});
  //   }
  // }else{
  //   res.status(403).send({success:false , message : "to date required"});
  // }
}


exports.saleReport = function(req,res){
  var params = req.body;
  console.log("Request :::",params);
  // if(params.to!=null && params.to!=undefined && params.to!=''){
  //   if(params.from!=null && params.from!=undefined && params.from!=''){
  reports.saleReport(req.body.user_id,params.from,params.to).then(function(result){
    res.status(200).send({success:true , result:result});
  }).catch(function(error){
    console.log("Error ::::::",error);
    res.status(500).send({success:false , error:error});
  })
  //   }else{
  //     res.status(403).send({success:false , message : "from date required"});
  //   }
  // }else{
  //   res.status(403).send({success:false , message : "to date required"});
  // }
}

exports.collectionReport = function(req,res){
  var params = req.body;
  console.log("Request :::",params);

  // if(params.to!=null && params.to!=undefined && params.to!=''){
  //   if(params.from!=null && params.from!=undefined && params.from!=''){
  reports.collectionReport(req.body.user_id,params.collectedBy,params.from,params.to).then(function(result){
    // console.log(result.length)
    var x = result[0];
    if(result.length>0){
      //multiple users search
      result.forEach(function(i,idx,x){
        // console.log(i.payments.length)
        if(i.payments && i.payments.length>0){
          // console.log("Found")
          i.payments.forEach(function(j,jdy,y){
            payment.populate(j,'account_id bank_id').then(function(fResult){
              // console.log(jdy);
              if(jdy == y.length-1 && idx == x.length - 1){
              //  console.log("collectionReport Result IF ************************",result);
                setTimeout(function(){
                res.status(200).send({success:true,result:result});
                },2000)

              }
            }).catch(function(error){
              console.log(error);
            })
          })

        }else{
          console.log("Length issue")
          if(idx == x.length - 1){
      //      console.log("collectionReport Result 1st else ************************",result);
            res.status(200).send({success:true,result:result});
          }
        }
      })
    }else{
    //  console.log("collectionReport Result ELSE************************",result);
      res.status(200).send({success:true , result:result});
    }

    // if(result[0].payments && result[0].payments.length>0){
    //   let promise = new Promise((resolve, reject) => {
    //     x.payments.forEach(function(i,idx,x){
    //       payment.populate(i,'account_id').then(function(acc){
    //         console.log(acc)
    //         i.payments[idx].account_id = acc;
    //         resolve(acc);
    //       }).catch(function(error){
    //         i.payments[idx].account_id = i.account_id;
    //         reject(error);
    //       })
    //     })
    //   })
    //
    //   let result =  promise;
    //console.log("Promise :::",promise)
    // res.status(200).send({success:true , result:result});
    // }else{
    //   res.status(200).send({success:true , result:result});
    // }
  }).catch(function(error){
    res.status(500).send({success:false , error:error});
  })
  //   }else{
  //     res.status(403).send({success:false , message : "from date required"});
  //   }
  // }else{
  //   res.status(403).send({success:false , message : "to date required"});
  // }
}

exports.userBalanceReport = function(req,res){
  console.log("Request :::",req.body);
  reports.userBalanceReport(req.body.from,req.body.to).then(function(result){
    console.log("***********",result.length)
    res.status(200).send({success:true,result:result});
  }).catch(function(error){
    console.log("Error in API call ",error);
    res.status(500).send({success:false, error:error});
  })
}

exports.balanceTillDate = function(req,res){
  var params = req.body;
  console.log("Request : ",req.body);
  if(params.date!=null && params.date!=undefined && params.date!=''){
    // if(params.user_id!=null && params.user_id!=undefined && params.user_id!=''){
    reports.balanceTillDate(params.user_id,params.date,params.dealer_id).then(function(result){
      // console.log(result)
      if(result && result.length>0){
        var totalBalance = 0;
        result.forEach(function(i,idx,x){
          totalBalance = totalBalance + parseFloat(i.balance);
          // console.log(i,totalBalance)
          if(idx == x.length - 1){
            res.status(200).send({success:true, result:result, totalBalance : totalBalance});
          }
        })

      }else{
        if(params.user_id!=null && params.user_id!=undefined && params.user_id!=''){
          res.status(200).send({success:true, result:{_id:params.user_id ,balance : 0}});
        }else{
          res.status(200).send({success:true, result:[{balance : 0}]});
        }

      }
    }).catch(function(error){
      console.log("error:",error);
      res.status(500).send({success:false , error:error});
    })
    // }else{
    //   res.status(403).send({success:false , message : "user_id required"});
    // }
  }else{
    res.status(403).send({success:false , message : "date required"});
  }
}

exports.dealerDeposittedTillDate = function(req,res){
  reports.dealerDeposittedTillDate().then(function(result){
    res.status(200).send({success:true,result:result});
  }).catch(function(error){
    console.log(error)
    res.status(500).send({success:false , error:error});
  })
}
