var mongoose = require('mongoose');
var TaxSchema = new mongoose.Schema({
    type: { type: String, default: "", enum: ["gst", "advance", "wht", "fat", "nfat", "ot1", "ot2", "mrp"] },
    rate: { type: Number, default: 0.0 },
    date: { type: Date, default: Date.now() },
    stringDate: { type: String },
    description: { type: String, default: "" },
    isDefault: {type: Boolean, default: false}
});

module.exports = mongoose.model('tax', TaxSchema);

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}
