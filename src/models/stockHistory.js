const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const stockHistorySchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  changeType: { type: String, enum: ['in', 'out'], required: true },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

stockHistorySchema.plugin(AutoIncrement, { inc_field: 'stockHistoryId' });

module.exports = mongoose.model('StockHistory', stockHistorySchema);
