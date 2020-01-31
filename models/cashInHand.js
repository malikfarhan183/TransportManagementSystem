var mongoose = require('mongoose');
var CashInHandSchema = new mongoose.Schema({
  totalCash : {type:Number , default:0}
});
module.exports = mongoose.model('CashInHand', CashInHandSchema);
