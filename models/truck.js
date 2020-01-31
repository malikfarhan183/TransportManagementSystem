var mongoose = require('mongoose');
var TruckSchema = new mongoose.Schema({
  registrationNumber : {type:String, unique:true , required:true},
  tokenUpto : {type:Date},
  make : {type:String},
  model : {type:String},
  manufacturerDate : {type:Date},
  primaryDriver : {type:String},
  primaryDriverName : {type:String},
  primaryDriverCnic : {type:String},
  primaryDriverMobile1 : {type:String},
  primaryDriverMobile2 : {type:String},
  secondaryDriver : {type:String},
  updatedBy : {type:mongoose.Schema.Types.ObjectId , ref:"User"},
  secondaryDriverName : {type:String},
  secondaryDriverCnic : {type:String},
  secondaryDriverMobile1 : {type:String},
  secondaryDriverMobile2 : {type:String},
  user_id : {type:mongoose.Schema.Types.ObjectId , ref:"User"},
  updatedSaved : {type:Array , default:[]}
});
module.exports = mongoose.model('Truck', TruckSchema);
