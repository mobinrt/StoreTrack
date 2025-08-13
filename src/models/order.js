const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const orderItemSchema = new mongoose.Schema({
  item: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema({
  items: { type: [orderItemSchema], required: true },
  status: { type: String, enum: ['waiting', 'sent', 'canceled'], default: 'waiting' }
}, { timestamps: true });

orderSchema.plugin(AutoIncrement, { inc_field: 'orderId' });

module.exports = mongoose.model('Order', orderSchema);
