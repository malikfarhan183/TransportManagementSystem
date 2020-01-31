var mongoose = require('mongoose');
var BankAccountSchema = new mongoose.Schema({
  accountTitle: { type: String, default: "" },
  accountNumber: { type: String, default: "" },
  address: { type: String, default: "" },
  bank: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" },
  branchCode: { type: String, default: "" },
  isDeleted: { type: Boolean, default: false },
  code: { type: String, default: "" }
});

BankAccountSchema.pre('find', function () {
  this.populate('bank');
});
BankAccountSchema.pre('findOne', function () {
  this.populate('bank');
});

module.exports = mongoose.model('BankAccount', BankAccountSchema);
