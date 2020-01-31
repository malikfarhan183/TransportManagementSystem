var mongoose = require('mongoose');
var EnumSchema = new mongoose.Schema({
  area: { type: Array, default: [] },
  areaFrom: { type: Array, default: [] }
});
module.exports = mongoose.model('Enum', EnumSchema);
