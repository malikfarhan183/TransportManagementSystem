var tax = require('../models/tax.js');
module.exports = {
  updateCreateTax: async (date,type,rate)=>{
    tax.findOne({date: date, type:type}).exec((error,result)=>{
      if(error){
        console.log(error);
        return error;
      }else{
        if(result){
          result.rate = rate;
          result.save((error,saved)=>{
            if(error){
              console.log(error);
              return error;
            }else{
              return saved;
            }
          })
        }else{
          //not found in DB
          tax.create({
            date:new Date(date).toISOString().split(["T"])[0]+"T01:00:00.000Z",
            rate:rate,
            type:type
          }).then((created)=>{
            return created;
          }).catch((error)=>{
            return error;
          })
        }
      }
    })
  },

  getTax : async (date)=>{
    console.log("Request Service : ",date)
      let promise = new Promise((resolve, reject) => {
        var thisDate = new Date(date);
        console.log(new Date(thisDate.toISOString().split("T")[0] + "T01:00:00.000Z"))
        tax.find({date :new Date(thisDate.toISOString().split("T")[0] + "T01:00:00.000Z")}).exec(function(error,resultTax){
          if(error){
            console.log("Error :::",error);
            return error;
            // res.status(500).send({success:false , error:error , message : "Tax finding error"});
          }else{
            var order = {};
              order.fat = process.env.fat;
              order.gst = process.env.gst;
              order.mrp = process.env.mrp;
              order.nfat = process.env.nfat;
              order.wht = process.env.wht;
              if(resultTax.length>0){
                resultTax.forEach(function(i,idx,x){
                  order[i.type] = i._id;
                  if(idx == x.length - 1){
                    console.log("Returning taxes : ",order);
                    resolve(order);
                  }
                })
              }else{
                console.log("Not found taxes for ",order);
                resolve(order);
              }
            }
          })
      })

      let result =await promise;
      return result;

    }
  }
