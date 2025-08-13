const Order = require('../models/Order');
const Item = require('../models/Item');
const StockHistory = require('../models/StockHistory');
const checkLowStock = require('../utils/lowStock');
const { formatDoc, formatDocs } = require('../utils/formatDoc');

/*
  Strategy:
  - Each ordered item decrements stock atomically using itemId.
  - Rollback if any item fails.
  - For production, use real MongoDB transactions for full ACID safety.
*/

exports.createOrder = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ error: 'items array is required' });

    const deducted = [];

    for (const it of items) {
      const { item: itemId, quantity } = it;
      if (!itemId || !quantity || quantity <= 0) {
        
        for (const d of deducted) {
          await Item.findOneAndUpdate({ itemId: d.itemId }, { $inc: { stockQuantity: d.qty } });
        }
        return res.status(400).json({ error: 'invalid item entry' });
      }

      const updated = await Item.findOneAndUpdate(
        { itemId, stockQuantity: { $gte: quantity } },
        { $inc: { stockQuantity: -quantity } },
        { new: true }
      );

      if (!updated) {
        // rollback
        for (const d of deducted) {
          await Item.findOneAndUpdate({ itemId: d.itemId }, { $inc: { stockQuantity: d.qty } });
        }
        return res.status(400).json({ error: `Insufficient stock for item ${itemId}` });
      }

      deducted.push({ itemId, qty: quantity });
    }

    const order = await Order.create({ items, status: 'waiting' });

    for (const it of items) {
      await StockHistory.create({
        item: it.item,
        changeType: 'out',
        quantity: it.quantity,
        orderId: order.orderId
      });

    }
        
    const threshold = Number(process.env.LOW_STOCK_THRESHOLD) || 5;
    const lowStockItems = await checkLowStock(threshold);

    if (lowStockItems.length > 0) {
      console.warn('LOW STOCK ALERT:', lowStockItems.map(i => `${i.name} (${i.stockQuantity})`).join(', '));
    }

    const responseData = { order };
    if (req.user?.role === 'admin' && lowStockItems.length > 0) {
      responseData.lowStock = lowStockItems;
    }

    return res.status(201).json({ order, lowStock: lowStockItems });
  } catch (err) {
    next(err);
  }
};

exports.listOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('items.item')
      .sort({ createdAt: -1 })
      .limit(200);

    return res.json(formatDocs(orders, ['_id', 'orderId', 'items', 'status', 'createdAt', 'updatedAt']));
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id }).populate('items.item');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    return res.json(formatDoc(order, ['_id', 'orderId', 'items', 'status', 'createdAt', 'updatedAt']));
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['waiting', 'sent', 'canceled'].includes(status))
      return res.status(400).json({ error: 'invalid status' });

    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // if cancelling, restore stock & log history
    if (status === 'canceled' && order.status !== 'canceled') {
      const ops = order.items.map(it =>
        Item.findOneAndUpdate({ itemId: it.item }, { $inc: { stockQuantity: it.quantity } })
      );
      await Promise.all(ops);
      

      for (const it of order.items) {
        await StockHistory.create({
          item: it.item,
          changeType: 'in',
          quantity: it.quantity,
          orderId: order.orderId
        });
      }
    }

    order.status = status;
    await order.save();
    const populated = await order.populate('items.item');

    return res.json(formatDoc(populated, ['_id', 'orderId', 'items', 'status', 'createdAt', 'updatedAt']));
  } catch (err) {
    next(err);
  }
};
