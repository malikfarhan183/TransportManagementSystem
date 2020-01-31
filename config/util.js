var order = require('../models/order.js');
var payment = require('../models/payment.js');
var mongoose = require('mongoose');
var User = require('../models/user.js');
var tax = require('../models/tax.js');
module.exports = {
  getOrderLedgers: async (user_id,isFiller,to,from,isActive,balance)=>{
    var datetime = new Date("2019-07-20T01:00:00.000Z");
    console.log("isFiller ::",isFiller,"isActive",isActive);
    var datesCheck ={isDeleted : false };
    console.log("in")
    if(to!=null && to!=undefined && to!=''){
      if(from!=null && from!=undefined && from!=''){
        datesCheck = {createdAt : {$gte : new Date(from),$lte:new Date(to)},isDeleted : false };
        paymentDateCheck = {'$totalPayedYet.createdAt' : {$gte : new Date(from),$lte:new Date(to)} ,isDeleted : false }
      }
    }
    if(balance<0){
      balance = (-1)*balance;
    }

    // if(isFiller){// ======================user non filler
    console.log("User is Filler", datesCheck)


    return  order.aggregate([
      { $match: datesCheck},
      { $group: { _id: "$_id", "order": { $push: "$$ROOT" }   }},
      { $unwind : "$order" },
      {
        $lookup:
        {
          from: "taxes",
          localField: "order.mrp",
          foreignField: "_id",
          as: "taxMRP"
        }
      },
      { $unwind : "$taxMRP"},
      {
        $lookup:
        {
          from: "taxes",
          localField: "order.gst",
          foreignField: "_id",
          as: "tax"
        }
      },
      {
        $unwind : "$tax"
      },
      {
        $addFields: {
          GSTwithMRP :
          {
            $multiply:
            [
              {
                $multiply:
                [
                  {$multiply:
                    ["$taxMRP.rate",{
                      $divide:
                      ["$tax.rate",{
                        $sum:
                        [100,"$tax.rate"]
                      }
                    ]
                  }
                ]
              },
              {$divide:[{  $cond: { if: { $ne: [ "$order.deliveryItemType", 'Bulk' ] }, then: "$order.quantity", else: {$multiply : ["$order.quantity",20]} }},20]}
            ]
          },20
        ]
      },
      totalTons : {$divide:[{
        $cond: { if: { $ne: [ "$order.deliveryItemType", 'Bulk' ] }, then: "$order.quantity", else: {$multiply : ["$order.quantity",20]} }
      },20]},
      totalBags : {
        $cond: { if: { $ne: [ "$order.deliveryItemType", 'Bags' ] }, then: {$multiply : ["$order.quantity",20]}, else: "$order.quantity" }
      },
      GeneralSalesTax : {$multiply:["$order.totalAmount","$tax.rate"]},
      totalAmount: {$sum:[{$multiply:["$order.totalAmount","$tax.rate"]},"$order.totalAmount"]},
      previousValue : "$order.totalAmount"
    }
  },
  {
    $lookup:
    {
      from: "taxes",
      localField: "order.fat",
      foreignField: "_id",
      as: "tax"
    }
  },
  { $unwind : "$tax" },
  {
    $lookup:
    {
      from: "taxes",
      localField: "order.nfat",
      foreignField: "_id",
      as: "ntax"
    }
  },
  { $unwind : "$ntax" },
  {
    $addFields:
    {
      valueExcGST : {
        $cond :
        {if : {$ne:["$order.description","Opening Balance"]},then : {
          $subtract : ["$order.totalAmount","$GSTwithMRP"]
        },else : 0}

      },
      //  valueExcGST : {$subtract : ["$order.totalAmount","$GSTwithMRP"]},
      advanceTax:
      {
        $cond : {if : {$ne:["$order.description","Opening Balance"]},then : {
          $cond: { if: { $ne: [ "$order.isActiveFiler", false ] }, then: {$divide:[{$multiply:["$order.totalAmount","$tax.rate"]},100]}, else: {$divide:[{$multiply:["$order.totalAmount","$ntax.rate"]},100]} }
        }, else : 0
      }
    },
    // advanceTax : {$multiply:["$order.totalAmount","$tax.rate"]},
    grossRate : {$multiply:["$order.rate",20]},
    isFiler : "$order.isFiler",
    timeStamp : "$order.createdAt"+"",
    isActiveFiler : "$order.isActive",
    balance : balance,
    totalAmount:{
      $cond : {if : {$ne:["$order.description","Opening Balance"]},then : {$sum:[{$multiply:["$order.totalAmount","$tax.rate"]},"$order.totalAmount"]},else :0 }
    }

    //  totalAmount: {$sum:[{$multiply:["$order.totalAmount","$tax.rate"]},"$order.totalAmount"]}
  }

},
{
  $lookup:
  {
    from: "taxes",
    localField: "order.wht",
    foreignField: "_id",
    as: "tax"
  }
},
{
  $unwind : "$tax"
},
{
  $addFields:
  {
    withHoldingTax : {$multiply:["$order.totalAmount","$tax.rate"]},
    totalAmount: {$sum:[{$multiply:["$order.totalAmount","$tax.rate"]},"$totalAmount"]},
    user_id : '$order.user_id',
    tax : undefined
  }
},
{ $group:   { _id: "$order.user_id", "order": { $push: "$$ROOT" }   }},
{
  $lookup:
  {
    from: "payments",
    localField: "order.user_id",
    foreignField: "user_id",
    as: "totalPayedYet"
  }
}

])






//       return   order.aggregate([
// { $match: datesCheck},
// { $group: { _id: "$_id", "order": { $push: "$$ROOT" }   }},
// {
//   $unwind : "$order"
// },
// {
//   $lookup: {
//     from: "taxes",
//     localField: "order.mrp",
//     foreignField: "_id",
//     as: "taxMRP"
//   }
// },
// {
//   $unwind : "$taxMRP"
// },
//
//         // {
//         //   $addFields: {
//         //     GeneralSailsTaxWithMRP : {$multiply:["$order.totalAmount","$tax.rate"]},
//         //     totalAmount: {$sum:[{$multiply:["$order.totalAmount","$tax.rate"]},"$order.totalAmount"]},
//         //     previousValue : "$order.totalAmount"
//         //   }
//         // },
//         {
//           $lookup: {
//             from: "taxes",
//             localField: "order.gst",
//             foreignField: "_id",
//             as: "tax"
//           }
//         },
//         {
//           $unwind : "$tax"
//         },
//
//         {
//       $addFields: {
//         GSTwithMRP : {$multiply:[
//           {$multiply:[
//             {$multiply:["$taxMRP.rate",//3
//             {$divide:["$tax.rate",   //2
//             {$sum:[100,"$tax.rate"]     //1
//           }]
//         }]
//       },{$divide:[{
//         $cond: { if: { $ne: [ "$Order.deliveryItemType", 'Bags' ] }, then: "$order.quantity", else: {$multiply : ["$order.quantity",20]} }
//       },20]}
//     ]},
//     20
//   ]},
//   totalTons : {$divide:[{
//     $cond: { if: { $ne: [ "$Order.deliveryItemType", 'Bags' ] }, then: "$order.quantity", else: {$multiply : ["$order.quantity",20]} }
//   },20]},
//   GeneralSalesTax : {$multiply:["$order.totalAmount","$tax.rate"]},
//   totalAmount: {$sum:[{$multiply:["$order.totalAmount","$tax.rate"]},"$order.totalAmount"]},
//   previousValue : "$order.totalAmount"
// }
// },
// {
//   $lookup: {
//     from: "taxes",
//     localField: "order.fat",
//     foreignField: "_id",
//     as: "tax"
//   }
// },
// {
//   $unwind : "$tax"
// },
// {
//   $lookup: {
//     from: "taxes",
//     localField: "order.nfat",
//     foreignField: "_id",
//     as: "ntax"
//   }
// },
// {
//   $unwind : "$ntax"
// },
// {
//   $addFields: {
//     valueExcGST : {$subtract : ["$order.totalAmount","$GSTwithMRP"]},
//     advanceTax:{
//       $cond: { if: { $ne: [ "$Order.isActive", false ] }, then: {$multiply:["$order.totalAmount","$tax.rate"]}, else: {$multiply:["$order.totalAmount","$ntax.rate"]} }
//     },
//     // advanceTax : {$multiply:["$order.totalAmount","$tax.rate"]},
//     grossRate : {$multiply:["$order.rate",20]},
//     isFiler : "$Order.isFiler",
//     isActiveFiler : "$Order.isActive",
//     balance : balance,
//     totalAmount: {$sum:[{$multiply:["$order.totalAmount","$tax.rate"]},"$order.totalAmount"]}
//   }
//
// },
// {
//   $lookup: {
//     from: "taxes",
//     localField: "order.wht",
//     foreignField: "_id",
//     as: "tax"
//   }
// },
// {
//   $unwind : "$tax"
// },
// {
//   $addFields: {
//     withHoldingTax : {$multiply:["$order.totalAmount","$tax.rate"]},
//     totalAmount: {$sum:[{$multiply:["$order.totalAmount","$tax.rate"]},"$totalAmount"]},
//     user_id : '$order.user_id',
//     tax : undefined
//   }
// },
// { $group: { _id: "$order.user_id", "order": { $push: "$$ROOT" }   }},
// {
//   $lookup: {
//     from: "payments",
//     localField: "order.user_id",
//     foreignField: "user_id",
//     as: "totalPayedYet"
//   }
// },
// ])



//
// }else{ // ======================user is non filler
//   return   order.aggregate([
//     { $match: datesCheck},
//     { $group: { _id: "$_id", "order": { $push: "$$ROOT" }   }},
//     {
//       $unwind : "$order"
//     },
//     {
//       $lookup:
//       {
//         from: "users",
//         localField: "order.user_id",
//         foreignField: "_id",
//         as: "user_id"
//       }
//     },
//     {
//       $addFields: {date : "$order.staticFormatDate",
//       totalBags:{
//         $cond: { if: { $ne: [ "$Order.deliveryItemType", 'Bags' ] }, then: "$order.quantity", else: {$multiply : ["$order.quantity",20]} }
//       }
//     }
//
//   },
//   {
//     $lookup: {
//       from: "taxes",
//       localField: "order.mrp",
//       foreignField: "_id",
//       as: "taxMRP"
//     }
//   },
//   {
//     $unwind : "$taxMRP"
//   },
//
//   // {
//   //   $addFields: {
//   //     GeneralSailsTaxWithMRP : {$multiply:["$order.totalAmount","$tax.rate"]},
//   //     totalAmount: {$sum:[{$multiply:["$order.totalAmount","$tax.rate"]},"$order.totalAmount"]},
//   //     previousValue : "$order.totalAmount"
//   //   }
//   // },
//   {
//     $lookup: {
//       from: "taxes",
//       localField: "order.gst",
//       foreignField: "_id",
//       as: "tax"
//     }
//   },
//   {
//     $unwind : "$tax"
//   },
//
//   {
//     $addFields: {
//       GSTwithMRP : {$multiply:[
//         {$multiply:[
//           {$multiply:["$taxMRP.rate",//3
//           {$divide:["$tax.rate",   //2
//           {$sum:[100,"$tax.rate"]     //1
//         }]
//       }]
//     },{$divide:[{
//       $cond: { if: { $ne: [ "$Order.deliveryItemType", 'Bags' ] }, then: "$order.quantity", else: {$multiply : ["$order.quantity",20]} }
//     },20]}
//   ]},
//   20
// ]},
// totalTons : {$divide:[{
//   $cond: { if: { $ne: [ "$Order.deliveryItemType", 'Bags' ] }, then: "$order.quantity", else: {$multiply : ["$order.quantity",20]} }
// },20]},
// GeneralSailsTax : {$multiply:["$order.totalAmount","$tax.rate"]},
// totalAmount: {$sum:[{$multiply:["$order.totalAmount","$tax.rate"]},"$order.totalAmount"]},
// previousValue : "$order.totalAmount",
// isFiler : isFiller,
// isActiveFiler : isActive
// }
// },
// {
//   $lookup: {
//     from: "taxes",
//     localField: "order.nfat",
//     foreignField: "_id",
//     as: "tax"
//   }
// },
// {
//   $unwind : "$tax"
// },
// {
//   $addFields: {
//     valueExcGST : {$subtract : ["$order.totalAmount","$GSTwithMRP"]},
//     advanceTax : {$multiply:["$order.totalAmount","$tax.rate"]},
//     grossRate : {$multiply:["$order.rate",20]},
//     totalAmount: {$sum:[{$multiply:["$order.totalAmount","$tax.rate"]},"$order.totalAmount"]}
//   }
//
// },
// {
//   $lookup: {
//     from: "taxes",
//     localField: "order.wht",
//     foreignField: "_id",
//     as: "tax"
//   }
// },
// {
//   $unwind : "$tax"
// },
// {
//   $addFields: {
//     withHoldingTax : {$multiply:["$order.totalAmount","$tax.rate"]},
//     totalAmount: {$sum:[{$multiply:["$order.totalAmount","$tax.rate"]},"$totalAmount"]},
//     user_id : '$order.user_id',
//     tax : undefined
//   }
// },
// { $group: { _id: "$order.user_id", "order": { $push: "$$ROOT" }   }},
// {
//   $lookup: {
//     from: "payments",
//     localField: "order.user_id",
//     foreignField: "user_id",
//     as: "totalPayedYet"
//   }
// },
// ])
// }

},



getSingleUserOrderLedgers: async (user_id)=>{
  console.log(user_id)
  return order.aggregate([
    { $group: { _id: "$user_id", "order": { "$last": "$$ROOT" } }},
    {$match : {_id : user_id,isDeleted : false }},
    {
      $lookup: {
        from: "taxes",
        pipeline: [
          { $match: {"type" : "gst" }},
          { $project: { _id: 0, date: { name: "$type", date: "$date",rate: "$rate" } } },

        ],
        as: "tax"
      }
    },
    {
      $unwind : "$tax"
    },
    {
      $addFields: {
        GeneralSailsTax : {$multiply:["$order.totalAmount","$tax.date.rate"]},
        totalAmount: {$sum:[{$multiply:["$order.totalAmount","$tax.date.rate"]},"$order.totalAmount"]},
        previousValue : "$order.totalAmount"
      }
    },
    {
      $lookup: {
        from: "taxes",
        pipeline: [
          { $match: {"type" : "wht" }},
          { $project: { _id: 0, date: { name: "$type", date: "$date",rate: "$rate" } } },

        ],
        as: "tax"
      }
    },
    {
      $unwind : "$tax"
    },
    {
      $addFields: {
        withHoldingTax : {$multiply:["$order.totalAmount","$tax.date.rate"]},
        totalAmount: {$sum:[{$multiply:["$order.totalAmount","$tax.date.rate"]},"$order.totalAmount"]}
      }

    },
    {
      $lookup: {
        from: "taxes",
        pipeline: [
          { $match: {"type" : "fat" }},
          { $project: { _id: 0, date: { name: "$type", date: "$date",rate: "$rate" } } },

        ],
        as: "tax"
      }
    },
    {
      $unwind : "$tax"
    },
    {
      $addFields: {
        FillerWithHoldingTax : {$multiply:["$order.totalAmount","$tax.date.rate"]},
        totalAmount: {$sum:[{$multiply:["$order.totalAmount","$tax.date.rate"]},"$totalAmount"]},
        tax : undefined
      }
    },
    { $group: { _id: "$order.user_id", "order": { "$last": "$$ROOT" }  }}
  ])
},
/* Method for payment calculation total by users*/
calculateTotalPayments : async ()=>{
  payment.aggregate([
    { $group: { _id: "$user_id", sum: { $sum: "$amount" } }, isDeleted : false }
  ]).then((result)=>{
    return result;
  }).catch((error)=>{
    return error;
  })
},


createOpeningOrder : async (created_by,user_id,credit,isFiler,isActiveFiler)=>{
  console.log("Credit ::::::",credit);
  let promise = new Promise((resolve, reject) => {
    if(parseInt(credit)>=0){
      //Payment will be created
      payment.create({
        amount : credit,
        paymentType : "opening balance",
        status : "success",
        date :  new Date("2017-01-01T06:30:49.000Z"),
        user_id : user_id,
        description : "Openeing Balance"
      }).then(function (result) {
        // console.log("payment created :::",result)
        // resolve(result);
        order.find({}).then((result) => {
          var orderLength = result.length + 1;
          var invoiceStr = orderLength.toString();
          //  params.invoiceNumber = invoiceStr.padStart(6, '0');
          var params ={
            description : "Opening Balance",
            created_by :created_by,
            deliveryDate : new Date("2017-01-01T06:30:49.000Z"),
            createdAt : new Date("2017-01-01T06:30:49.000Z"),
            quantity : 0,
            user_id :user_id,
            totalAmount:0,
            invoiceNumber : invoiceStr.padStart(6, '0'),
            gst : process.env.gst,
            wht : process.env.wht,
            mrp : process.env.mrp,
            fat : process.env.fat,
            nfat : process.env.nfat,
            isFiler : isFiler,
            isActiveFiler : isActiveFiler
          }
          User.findOne({ _id: user_id }).exec(function (error, userResultFound) {
            if (error) {
              console.log("ERROR::::::::::::::::::::::::::::::::", error);
              resolve(error)
            } else {
              if (userResultFound) {
                console.log("UR::::::::::::::::::::::::::::::::");
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
                  User.findOne({ _id: user_id }).exec(function (error, userResult) {
                    // console.log("RESULT:::::::::::::::::::::::::::::::", userResult);


                    if (error) {
                      console.log("Error in Util :::",error);

                      resolve(error)
                    } else {
                      if (userResult) {

                        userResult.credit = parseInt(userResult.credit) - parseInt(params.totalAmount);
                        tax.find({
                          date: new Date(Date.now()).toISOString().split("T")[0] + "T01:00:00.000Z"
                        }).exec(function (error, taxResult) {
                          // console.log(":::::::TAX RESULT::::::", taxResult);

                          if (error) {
                            // console.log("Error in Util :::",error);

                            resolve(error)
                          } else {
                            if (taxResult.length > 0) {
                              // console.log("____in tax result:", taxResult);

                              var updateObject = {};
                              taxResult.forEach(function (i, idx, x) {
                                // if (i.type == 'gst') {
                                //   result['gst'] = i._id;
                                // } else if (i.type == 'nfat') {
                                //   result['nfat'] = i._id;
                                //   console.log("in tax result nfat:", i._id, idx, x);
                                // } else if (i.type == 'wht') {
                                //   result['wht'] = i._id;
                                // } else if (i.type == 'mrp') {
                                //   result['mrp'] = i._id;
                                // } else if (i.type == 'fat') {
                                //   result['fat'] = i._id;
                                // }
                                if (idx == x.length - 1) {
                                  if (Object.keys(updateObject).length > 0) {
                                    order.update({ _id: result._id }, result, { multi: false }).then(function (done) {
                                      userResult.save(function (error, saved) {
                                        if (error) {
                                          console.log("Error in Util :::",error);
                                          resolve(error)
                                        } else {
                                          resolve(result);
                                        }
                                      })
                                    }).catch(function (error) {
                                      console.log("Tax Ids not updated : ", error);
                                      //res.status(500).send({success:false ,error:error});
                                      userResult.save(function (error, saved) {
                                        if (error) {
                                          console.log("Error in Util :::",error);

                                          resolve(error)
                                        } else {
                                          resolve(result);
                                        }
                                      })
                                    })
                                  }else{
                                    userResult.save(function (error, saved) {
                                      if (error) {
                                        console.log("Error in Util :::",error);

                                        resolve(error)
                                      } else {
                                        resolve(result);
                                      }
                                    })
                                  }
                                }
                              })
                              // order.update({_id:result._id},{gst_id:})
                            } else {
                              // console.log("**************", "Tax not found", result);
                              userResult.save(function (error, saved) {
                                if (error) {
                                  console.log("Error in Util :::",error);

                                  resolve(error)
                                } else {
                                  resolve(result);
                                }
                              })
                            }
                          }
                        })

                      } else {
                        resolve(result);
                      }
                    }
                  })
                })
              } else {
                resolve(false);
              }
            }
          });
        }).catch(function(error){
          console.log("Error in Util :::",error);

          resolve(error)
        });
      }).catch(function(error){
        console.log("Error in Payment creation :::",error);
        resolve(error)
      })
    }else{
      //order will be created
      console.log("In*************");
      // console.log("1");
      order.find({}).exec((error,result) => {
        if(error){
          console.log("Error: ","2",error);
          resolve(error)
        }else{
          var orderLength = result.length + 1;
          var invoiceStr = orderLength.toString();
          //  params.invoiceNumber = invoiceStr.padStart(6, '0');
          var params ={
            description : "Opening Balance",
            created_by :created_by,
            deliveryDate : new Date("2017-01-01T06:30:49.000Z"),
            createdAt : new Date("2017-01-01T06:30:49.000Z"),
            quantity : 0,
            user_id :user_id,
            totalAmount:(credit)*(-1),
            invoiceNumber : invoiceStr.padStart(6, '0'),
            gst : process.env.gst,
            wht : process.env.wht,
            mrp : process.env.mrp,
            fat : process.env.fat,
            nfat : process.env.nfat,
            isFiler : isFiler,
            isActiveFiler : isActiveFiler
          }
          User.findOne({ _id: user_id }).exec(function (error, userResultFound) {
            if (error) {
              console.log("ERROR::::::::::::::::::::::::::::::::", error);
              resolve(error)
            } else {
              if (userResultFound) {

                console.log("UR::::::::::::::::::::::::::::::::");
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
                  User.findOne({ _id: user_id }).exec(function (error, userResult) {
                    // console.log("RESULT:::::::::::::::::::::::::::::::", userResult);


                    if (error) {
                      console.log("Error in Util :::",error);

                      resolve(error)
                    } else {
                      if (userResult) {
                        userResult.credit = parseInt(credit);
                        // userResult.credit = parseInt(userResult.credit) + parseInt(params.totalAmount);
                        tax.find({
                          date: new Date(Date.now()).toISOString().split("T")[0] + "T01:00:00.000Z"
                        }).exec(function (error, taxResult) {
                          // console.log(":::::::TAX RESULT::::::", taxResult);

                          if (error) {
                            // console.log("Error in Util :::",error);
                            // console.log("2");

                            resolve(error)
                          } else {
                            if (taxResult.length > 0) {
                              // console.log("____in tax result:", taxResult);

                              var updateObject = {};
                              taxResult.forEach(function (i, idx, x) {
                                // if (i.type == 'gst') {
                                //   result['gst'] = i._id;
                                // } else if (i.type == 'nfat') {
                                //   result['nfat'] = i._id;
                                //   console.log("in tax result nfat:", i._id, idx, x);
                                // } else if (i.type == 'wht') {
                                //   result['wht'] = i._id;
                                // } else if (i.type == 'mrp') {
                                //   result['mrp'] = i._id;
                                // } else if (i.type == 'fat') {
                                //   result['fat'] = i._id;
                                // }
                                console.log("update Object:", updateObject);

                                if (idx == x.length - 1) {
                                  payment.create({user_id:user_id,description : "Opening Balance",
                                  created_by :created_by,
                                  status: "success",
                                  date : new Date("2017-01-01T06:30:49.000Z"),
                                  amount : 0
                                }).then(function(savedPayment){
                                  if (Object.keys(updateObject).length > 0) {
                                    order.update({ _id: result._id }, result, { multi: false }).then(function (done) {
                                      userResult.save(function (error, saved) {
                                        if (error) {
                                          console.log("Error in Util :::",error);
                                          // console.log("3");
                                          resolve(error)
                                        } else {
                                          // console.log("4");
                                          resolve(result);
                                        }
                                      })
                                    }).catch(function (error) {
                                      console.log("Tax Ids not updated : ", error);
                                      // console.log("5");
                                      //res.status(500).send({success:false ,error:error});
                                      userResult.save(function (error, saved) {
                                        if (error) {
                                          // console.log("6");
                                          console.log("Error in Util :::",error);

                                          resolve(error)
                                        } else {
                                          // console.log("7");
                                          resolve(result);
                                        }
                                      })
                                    })
                                  }else{
                                    userResult.save(function (error, saved) {
                                      if (error) {
                                        // console.log("6");
                                        console.log("Error in Util :::",error);

                                        resolve(error)
                                      } else {
                                        // console.log("7");
                                        resolve(result);
                                      }
                                    })
                                  }
                                }).catch(function(error){
                                  console.log("Error in creating payment *******",error);
                                  if (Object.keys(updateObject).length > 0) {
                                    order.update({ _id: result._id }, result, { multi: false }).then(function (done) {
                                      userResult.save(function (error, saved) {
                                        if (error) {
                                          console.log("Error in Util :::",error);
                                          // console.log("8");
                                          resolve(error)
                                        } else {
                                          // console.log("9");
                                          resolve(result);
                                        }
                                      })
                                    }).catch(function (error) {
                                      console.log("Tax Ids not updated : ", error);
                                      //res.status(500).send({success:false ,error:error});
                                      userResult.save(function (error, saved) {
                                        if (error) {
                                          console.log("Error in Util :::",error);

                                          resolve(error)
                                        } else {
                                          // console.log("10");
                                          resolve(result);
                                        }
                                      })
                                    })
                                  }
                                })

                              }
                            })
                            // order.update({_id:result._id},{gst_id:})
                          } else {
                            // console.log("**************", "Tax not found", result);
                            payment.create({user_id:user_id,description : "Opening Balance",
                            created_by :created_by,
                            status: "success",
                            date : new Date("2017-01-01T06:30:49.000Z"),
                            amount : 0
                          }).then(function(savedPayment){
                            userResult.save(function (error, saved) {
                              if (error) {
                                console.log("Error in Util :::",error);
                                // console.log("11");
                                resolve(error)
                              } else {
                                // console.log("12");
                                resolve(result);
                              }
                            }).catch(function(error){
                              console.log("Error in Util 881 :::",error);
                              resolve(error)
                            })
                          })
                          }
                        }
                      })

                    } else {
                      // console.log("13");
                      reject(result);
                    }
                  }
                })
              })
            } else {
              // console.log("14");
              resolve(false);
            }
          }
        });
      }

    })
  }
})

let result =await promise;
// console.log("Result Promise :::",result);
return result;



}

}
