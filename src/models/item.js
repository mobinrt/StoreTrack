const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  category: { type: String, index: true },
  price: { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, required: true, min: 0, default: 0 },
}, { timestamps: true });

itemSchema.plugin(AutoIncrement, { inc_field: 'itemId' });

module.exports = mongoose.model('Item', itemSchema);
