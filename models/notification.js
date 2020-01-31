var mongoose = require('mongoose');
var NotificationSchema = new mongoose.Schema({
  user_id : {type:mongoose.Schema.Types.ObjectId , ref:"User"},
  message : {type:String , default:""},
  readStatus : {type:Boolean , default:false},
  createdAt : {type:Date , default:Date.now()}
});
module.exports = mongoose.model('Notification', NotificationSchema);
