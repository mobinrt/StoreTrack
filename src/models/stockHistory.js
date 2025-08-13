const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const stockHistorySchema = new mongoose.Schema({
  item: { type: String, required: true },
  changeType: { type: String, enum: ['in', 'out'], required: true },
  quantity: { type: Number, required: true },
  orderId: { type: String }, 
  createdAt: { type: Date, default: Date.now },
  stockHistoryId:{ type: Number}
});

stockHistorySchema.plugin(AutoIncrement, { inc_field: 'stockHistoryId' });

module.exports = mongoose.model('StockHistory', stockHistorySchema);
