const Order = require('../models/Order');
const Item = require('../models/item');
const StockHistory = require('../models/StockHistory');

/*
  Strategy:
  - For each ordered item do an atomic findOneAndUpdate that decrements stock only if stock >= qty.
  - If any item fails, rollback the successfully-deducted items.
  - This avoids simple race conditions without requiring replica-set transactions.
  - For production, prefer real MongoDB transactions (replica set) for full ACID safety.
*/

exports.createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: 'items array is required' });

    // track successfully deducted items to rollback if necessary
    const deducted = [];

    for (const it of items) {
      const { item: itemId, quantity } = it;
      if (!itemId || !quantity || quantity <= 0) {

        for (const d of deducted) {
          await Item.findByIdAndUpdate(d.itemId, { $inc: { stockQuantity: d.qty } });
        }
        return res.status(400).json({ error: 'invalid item entry' });
      }

      const updated = await Item.findOneAndUpdate(
        { _id: itemId, stockQuantity: { $gte: quantity } },
        { $inc: { stockQuantity: -quantity } },
        { new: true }
      );

      if (!updated) {

        for (const d of deducted) {
          await Item.findByIdAndUpdate(d.itemId, { $inc: { stockQuantity: d.qty } });
        }
        return res.status(400).json({ error: `Insufficient stock for item ${itemId}` });
      }

      deducted.push({ itemId, qty: quantity });
    }

    const order = await Order.create({ items, status: 'waiting' });

    // log stock history entries
    const histories = items.map(it => ({ item: it.item, changeType: 'out', quantity: it.quantity }));
    await StockHistory.insertMany(histories);

    return res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

exports.listOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const orders = await Order.find(filter).populate('items.item').sort({ createdAt: -1 }).limit(200);
    return res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.item');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['waiting', 'sent', 'canceled'].includes(status))
      return res.status(400).json({ error: 'invalid status' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    
    if (status === 'canceled' && order.status !== 'canceled') {
      const ops = order.items.map(it => Item.findByIdAndUpdate(it.item, { $inc: { stockQuantity: it.quantity } }));
      await Promise.all(ops);

      const histories = order.items.map(it => ({ item: it.item, changeType: 'in', quantity: it.quantity }));
      await StockHistory.insertMany(histories);
    }

    order.status = status;
    await order.save();
    const populated = await order.populate('items.item');
    return res.json(populated);
  } catch (err) {
    next(err);
  }
};
