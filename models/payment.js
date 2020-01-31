var mongoose = require('mongoose');
var PaymentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  account_id: { type: mongoose.Schema.Types.ObjectId, ref: "BankAccount"},
  name: { type: String, default: "" },
  amount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now() },
  paymentType: { type: String, enum: ['cash', 'cheque', 'draft', 'online','opening balance'] },
  receipt_no: { type: String },
  chequeNumber: { type: String },
  description : {type:String,default:""},
  draftNumber: { type: String },
  chequeDate: { type: Date },
  draftDate: { type: Date },
  name: { type: String },
  clearenceDate : {type: Date },
  depositSlip: { type: String }, //depositSlip
  bank_id: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" },
  status: { type: String, enum: ["under process", 'pending', 'success', 'failed', 'bounced'], default: 'pending' },
  updatedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], //5
  history: { type: Array, default: [] },
  remarks: { type: String, default: "" },
  remarks: { type: String, default: "" },
  issueStatus: { type: Boolean, default: false },
  cashOnHandAdded: { type: Boolean, default: false },
  depositedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  collectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  debitedAmount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  previousAmount : {type:Number , default:0},
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});
PaymentSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Payment', PaymentSchema);
