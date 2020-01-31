var payment = require('../models/payment.js');
var order = require('../models/order.js');
var mongoose = require('mongoose');
module.exports = {
  fbrReport: async (user_id, from, to) => {
    var query = {};
    console.log(to, from)
    if (user_id != null && user_id != undefined && user_id != '' && to != null && to != undefined && to != '' && from != null && from != undefined && from != '') {
      query = { user_id: mongoose.Types.ObjectId(user_id), date: { $gte: new Date(from), $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) }, isDeleted: false }
    } else if (to != null && to != undefined && to != '' && from != null && from != undefined && from != '') {
      query = { date: { $gte: new Date(from), $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) }, isDeleted: false }
    } else if (from != null && from != undefined && from != '') {
      query = { date: { $gte: new Date(from) }, isDeleted: false }
    } else if (to != null && to != undefined && to != '') {
      query = { date: { $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) }, isDeleted: false }
    } else if (user_id != null && user_id != undefined && user_id != '') {
      query = { user_id: mongoose.Types.ObjectId(user_id), isDeleted: false }
    }
    console.log("Query :::::", query)
    return payment.aggregate([
      { $match: query },
      { $sort: { date: 1 } },
      {
        $lookup: {
          from: "users",
          localField: "collectedBy",
          foreignField: "_id",
          as: "collectedBy"
        }
      },
      { $unwind: "$collectedBy" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_id"
        }
      },
      { $unwind: "$user_id" },
      { $group: { _id: "$user_id", "payment": { $push: "$$ROOT" } } }
    ])
  },


  saleReport: async (user_id, from, to) => {
    var query = {};
    // console.log(to,from)
    if (user_id != null && user_id != undefined && user_id != '' && to != null && to != undefined && to != '' && from != null && from != undefined && from != '') {
      query = { user_id: mongoose.Types.ObjectId(user_id), createdAt: { $gte: new Date(from), $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) } }
    } else if (to != null && to != undefined && to != '' && from != null && from != undefined && from != '') {
      query = { createdAt: { $gte: new Date(from), $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) } }
    } else if (from != null && from != undefined && from != '') {
      query = { createdAt: { $gte: new Date(from) } }
    } else if (to != null && to != undefined && to != '') {
      query = { createdAt: { $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) } }
    } else if (user_id != null && user_id != undefined && user_id != '') {
      query = { user_id: mongoose.Types.ObjectId(user_id) }
    }

    return order.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "created_by",
          foreignField: "_id",
          as: "created_by"
        }
      },
      { $unwind: "$created_by" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_id"
        }
      },
      { $unwind: "$user_id" },
      { $group: { _id: "$user_id", "order": { $push: "$$ROOT" } } }
    ])
  },


  collectionReport: async (user_id, collectedBy, from, to) => {
    var query = {};
    // console.log(to,from)
    if (user_id != null && user_id != undefined && user_id != '' && to != null && to != undefined && to != '' && from != null && from != undefined && from != '' && collectedBy != null && collectedBy != undefined && collectedBy != '') {

      query = { collectedBy: mongoose.Types.ObjectId(collectedBy), user_id: mongoose.Types.ObjectId(user_id), date: { $gte: new Date(from), $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) }, isDeleted: false }
    } else if (to != null && to != undefined && to != '' && from != null && from != undefined && from != '' && collectedBy != null && collectedBy != undefined && collectedBy != '') {
      query = { collectedBy: mongoose.Types.ObjectId(collectedBy), date: { $gte: new Date(from), $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) }, isDeleted: false }
    } if (to != null && to != undefined && to != '' && from != null && from != undefined && from != '' && user_id != null && user_id != undefined && user_id != '') {
      query = { user_id: mongoose.Types.ObjectId(user_id), date: { $gte: new Date(from), $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) }, isDeleted: false }
    } else if (from != null && from != undefined && from != '' && user_id != null && user_id != undefined && user_id != '') {
      query = { user_id: mongoose.Types.ObjectId(user_id), date: { $gte: new Date(from) }, isDeleted: false }
    } else if (from != null && from != undefined && from != '' && collectedBy != null && collectedBy != undefined && collectedBy != '') {
      query = { collectedBy: mongoose.Types.ObjectId(collectedBy), date: { $gte: new Date(from) }, isDeleted: false }
    } else if (to != null && to != undefined && to != '' && user_id != null && user_id != undefined && user_id != '') {
      query = { user_id: mongoose.Types.ObjectId(user_id), date: { $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) }, isDeleted: false }
    } else if (to != null && to != undefined && to != '' && collectedBy != null && collectedBy != undefined && collectedBy != '') {
      query = { collectedBy: mongoose.Types.ObjectId(collectedBy), date: { $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) }, isDeleted: false }
    } else if (user_id != null && user_id != undefined && user_id != '' && collectedBy != null && collectedBy != undefined && collectedBy != '') {
      query = { user_id: mongoose.Types.ObjectId(user_id), collectedBy: mongoose.Types.ObjectId(collectedBy), isDeleted: false }
    } else if (user_id != null && user_id != undefined && user_id != '') {
      query = { user_id: mongoose.Types.ObjectId(user_id), isDeleted: false }
    } else if (collectedBy != null && collectedBy != undefined && collectedBy != '') {
      query = { collectedBy: mongoose.Types.ObjectId(collectedBy), isDeleted: false }
    } else if (to != null && to != undefined && to != '') {
      query = { date: { $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) }, isDeleted: false }
    } else if (from != null && from != undefined && from != '') {
      query = { date: { $lte: new Date(from) }, isDeleted: false }
    }
    console.log("Query ::", query);
    return payment.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "collectedBy",
          foreignField: "_id",
          as: "collectedBy"
        }
      },
      { $unwind: "$collectedBy" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_id"
        }
      },
      { $unwind: "$user_id" },
      { $group: { _id: "$collectedBy", "payments": { $push: "$$ROOT" } } }
    ])
  },


  userBalanceReport: async (from, to) => {
    var paymentQuery = {};
    let promise = new Promise((resolve, reject) => {
      if (from != null && from != undefined && from != '' && to != null && to != undefined && to != '') {
        paymentQuery = { status: 'success', date: { $gte: new Date(from), $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) }, isDeleted: false }
      } else if (from != null && from != undefined && from != '') {
        paymentQuery = { status: 'success', date: { $gte: new Date(from) }, isDeleted: false }
      } else if (to != null && to != undefined && to != '') {
        paymentQuery = { status: 'success', date: { $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) }, isDeleted: false }
      }
      var orderQuery = {};
      if (from != null && from != undefined && from != '' && to != null && to != undefined && to != '') {
        orderQuery = { createdAt: { $gte: new Date(from), $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) }, isDeleted: false }
      } else if (from != null && from != undefined && from != '') {
        orderQuery = { createdAt: { $gte: new Date(from) } , isDeleted: false}
      } else if (to != null && to != undefined && to != '') {
        orderQuery = { createdAt: { $lte: new Date(new Date(to).getTime() + 18000000 + 18000000) }, isDeleted: false }
      }
      console.log("Order :::", orderQuery);
      console.log("Order :::", paymentQuery);
      payment.aggregate([{
        $match: paymentQuery
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_id"
        }
      },
      {
        $unwind: "$user_id"
      },
      { $group: { _id: "$user_id", sum: { $sum: "$amount" } } }
    ]).then((resultPayment) => {
      console.log("******____*****resultPayment", resultPayment.length);

      order.aggregate([{
        $match: orderQuery
      }, {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_id"
        }
      },
      {
        $unwind: "$user_id"
      },
      { $group: { _id: "$user_id", sum: { $sum: "$totalAmount" } } }
    ]).then((resultOrder) => {
  //    console.log(resultOrder.length) //decommented
      var final = [];
      //return {resultPayment : resultPayment,resultOrder:resultOrder};
      if (resultPayment.length > 0) {
        if (resultOrder.length > 0) {
          //console.log(resultPayment, "**********************", resultOrder)
          resultOrder.forEach(function (j, jdy, y) {
            resultPayment.forEach(function (i, idx, x) {
          //    console.log("Order user name :::",j._id.name,i._id.name);

              if (i._id._id + "" == j._id._id + "") {
          //      console.log("Matched ****************",i._id.name, i.sum, j.sum)
                final[final.length] = { user_id: i._id, balance: i.sum - j.sum }
              }
              console.log(idx,jdy)
              if (idx == x.length - 1 && jdy == y.length - 1) {
                resolve(final);
              }
            })
          })
        }
      } else {
        console.log("Resolveing outside in else")
        resolve(final);
      }
    }).catch((error) => {
      console.log(error);
      reject(error);
    })
  }).catch((error) => {
    reject(error);
  })
})
let result = await promise;
return result;
},


balanceTillDate: async (user_id, date, dealer_id) => {
  console.log(user_id, date)
  var query = { date: { $lt: new Date(new Date(date).getTime() + 18000000 + 18000000) }, paymentType: { $in: ['cash', '', null] }, isDeleted: false };
  if (user_id != null && user_id != undefined && user_id != '' && dealer_id != null && dealer_id != undefined && dealer_id != '') {
    query = { date: { $lt: new Date(new Date(date).getTime() + 18000000 + 18000000) }, collectedBy: mongoose.Types.ObjectId(user_id), user_id: mongoose.Types.ObjectId(dealer_id), paymentType: { $in: ['cash', '', null] }, isDeleted: false };
  } else if (user_id != null && user_id != undefined && user_id != '') {
    query = { date: { $lt: new Date(new Date(date).getTime() + 18000000 + 18000000) }, collectedBy: mongoose.Types.ObjectId(user_id), paymentType: { $in: ['cash', '', null] }, isDeleted: false };
  } else if (dealer_id != null && dealer_id != undefined && dealer_id != '') {
    query = { date: { $lt: new Date(new Date(date).getTime() + 18000000 + 18000000) }, user_id: mongoose.Types.ObjectId(dealer_id), paymentType: { $in: ['cash', '', null] }, isDeleted: false };
  }
  console.log("search : ", query)
  return payment.aggregate([
    { $match: query },
    { $group: { _id: "$_id", "payment": { $push: "$$ROOT" } } },
    { $unwind: "$payment" },
    {
      $addFields: {
        amount: {
          $cond: {
            if: { $ne: ["$payment.paymentType", "cash"] }, then: {
              $multiply: ["$payment.amount", -1]
            }, else: "$payment.amount"
          }
        },
        type: "$payment.paymentType"
      }
    },
    { $group: { _id: "$payment.collectedBy", balance: { $sum: "$payment.amount" } } }
  ])
  //   console.log(user_id,date)
  //   var query = {date : {$lt:new Date(date)}, paymentType:'cash'};
  //   if(user_id!=null && user_id!=undefined && user_id!='' && dealer_id!=null && dealer_id!=undefined && dealer_id!=''){
  //     query = {date : {$lt:new Date(date)},collectedBy:mongoose.Types.ObjectId(user_id),user_id:mongoose.Types.ObjectId(dealer_id) , paymentType:'cash'};
  //   }else if(user_id!=null && user_id!=undefined && user_id!=''){
  //     query = {date : {$lt:new Date(date)},collectedBy:mongoose.Types.ObjectId(user_id), paymentType:'cash'};
  //   }else if(dealer_id!=null && dealer_id!=undefined && dealer_id!=''){
  //     query = {date : {$lt:new Date(date)},user_id:mongoose.Types.ObjectId(dealer_id), paymentType:'cash'};
  //   }
  //   console.log("search : ",query)
  //   return payment.aggregate([{
  //     $match : query
  //   },
  //   { $group: { _id: "$collectedBy", balance: { $sum: "$amount" } } }
  // ])
},

dealerDeposittedTillDate: async (dealer_id, date) => {
  console.log(user_id, date)
  var query = { date: { $lt: new Date(date) }, paymentType: { $in: ['cash', '', null] }, isDeleted: false };
  if (user_id != null && user_id != undefined && user_id != '' && dealer_id != null && dealer_id != undefined && dealer_id != '') {
    query = { date: { $lt: new Date(date) }, collectedBy: mongoose.Types.ObjectId(user_id), user_id: mongoose.Types.ObjectId(dealer_id), paymentType: { $in: ['cash', '', null] }, isDeleted: false };
  } else if (user_id != null && user_id != undefined && user_id != '') {
    query = { date: { $lt: new Date(date) }, collectedBy: mongoose.Types.ObjectId(user_id), paymentType: { $in: ['cash', '', null] }, isDeleted: false };
  } else if (dealer_id != null && dealer_id != undefined && dealer_id != '') {
    query = { date: { $lt: new Date(date) }, user_id: mongoose.Types.ObjectId(dealer_id), paymentType: { $in: ['cash', '', null] }, isDeleted: false };
  }
  console.log("search : ", query)
  return payment.aggregate([
    { $match: query },
    { $group: { _id: "$_id", "payment": { $push: "$$ROOT" } } },
    { $unwind: "$payment" },
    {
      $addFields: {
        amount: {
          $cond: {
            if: { $ne: ["$payment.paymentType", "cash"] }, then: {
              $multiply: ["$payment.amount", -1]
            }, else: "$payment.amount"
          }
        },
        type: "$payment.paymentType"
      }
    },
    { $group: { _id: "$payment.collectedBy", balance: { $sum: "$payment.amount" } } }
  ])
}
}
