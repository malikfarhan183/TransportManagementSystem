var mongoose = require('mongoose');
var BankSchema = new mongoose.Schema({
  name : {type:String , default:""},
  uan : {type:String , default:"111-000-000"},
  bankAccounts: [{type:mongoose.Schema.Types.ObjectId , ref:"BankAccount"}],
  location:{type:String, default:""},
  code : {type:String, default:""}
});
module.exports = mongoose.model('Bank', BankSchema);
