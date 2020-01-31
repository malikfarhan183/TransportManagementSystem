var mongoose = require('mongoose');
var OrderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  gst: { type: mongoose.Schema.Types.ObjectId, ref: "tax", default: mongoose.Schema.Types.ObjectId("5d63dc60fd8d7e0016ae452c") }, //<-------------------
  nfat: { type: mongoose.Schema.Types.ObjectId, ref: "tax", default: mongoose.Schema.Types.ObjectId("5d63dc60fd8d7e0016ae452d") },
  fat: { type: mongoose.Schema.Types.ObjectId, ref: "tax", default: mongoose.Schema.Types.ObjectId("5d63dc60fd8d7e0016ae452b") },
  wht: { type: mongoose.Schema.Types.ObjectId, ref: "tax", default: mongoose.Schema.Types.ObjectId("5d667c570ca7c5a646627150") }, //left
  mrp: { type: mongoose.Schema.Types.ObjectId, ref: "tax", default: mongoose.Schema.Types.ObjectId("5d63dc60fd8d7e0016ae452a") },
  test: { type: String, default: "Test"},
  status: { type: String, default: "pending" },
  title: { type: String },
  description: { type: String },
  deliveryDate: { type: Date },
  quantity: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  freightCharges: { type: Number, default: 0 },
  distance: { type: Number, default: 0 },
  fuelConsumed: { type: Number, default: 0 },
  item: { type: Array, default: [] },
  deliveryStatus: { type: String, default: "pending", enum: ['pending', 'loaded', 'deipatched', 'arrived', 'delivered'] },
  deliveryTime: { type: Date },
  paymentStatus: { type: String, default: "pending", enum: ['pending', 'under process', 'partially paid', 'paid'] },
  deliveryType: { type: String },
  deliveryItemType: { type: String },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
  quantity: { type: Number, default: 0 },
  biltyNumber: { type: String },
  truckNumber: { type: mongoose.Schema.Types.ObjectId, ref: "Truck" },
  rate: { type: Number, default: 0 },
  totalPayedByDate: { type: Number, default: 0 },
  address: { type: String, default: "" },
  fromAddress: { type: String, default: "" },
  totalAmount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  isFiler: { type: Boolean, default: false },
  isActiveFiler: { type: Boolean, default: false },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  invoiceNumber: { type: String, default: "000000" }
});

OrderSchema.pre('save', function (next) {
  var user = this;
  next();
});
OrderSchema.pre('aggregate', function (next) {


  //   this.staticFormatDate = new Date(this.createdAt).toISOString().split("T")[0]+"T01:00:00.000Z";
  //   console.log("Date :::::: aggregate ::::: ",this.staticFormatDate)
  next();
});
module.exports = mongoose.model('Order', OrderSchema);
