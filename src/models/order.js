const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema({
  items: { type: [orderItemSchema], required: true },
  status: { type: String, enum: ['waiting', 'sent', 'canceled'], default: 'waiting' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
