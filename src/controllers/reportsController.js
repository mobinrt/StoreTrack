const Item = require('../models/Item');
const Order = require('../models/Order');

exports.lowStock = async (req, res, next) => {
  try {
    const threshold = Number(req.query.threshold) || 5;
    const items = await Item.find({ stockQuantity: { $lt: threshold } }).sort({ stockQuantity: 1 });
    return res.json({ threshold, count: items.length, items });
  } catch (err) {
    next(err);
  }
};

exports.salesReport = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const match = { status: 'sent' };

    if (start) match.createdAt = { $gte: new Date(start) };
    if (end) {
      match.createdAt = match.createdAt || {};
      match.createdAt.$lte = new Date(end);
    }

    const orders = await Order.find(match).lean();

    const allItemIds = [];
    for (const order of orders) {
      for (const it of order.items) {
        allItemIds.push(parseInt(it.item, 10));
      }
    }

    const itemsData = await Item.find({ itemId: { $in: allItemIds } }).lean();

    const itemMap = {};
    for (const item of itemsData) {
      itemMap[item.itemId] = item; 
    }

    let totalRevenue = 0;
    const itemCounts = {};

    for (const order of orders) {
      for (const it of order.items) {
        const itemIdInt = parseInt(it.item, 10);
        const itemData = itemMap[itemIdInt];
        if (!itemData) continue;

        totalRevenue += itemData.price * it.quantity;

        if (!itemCounts[itemIdInt]) {
          itemCounts[itemIdInt] = { name: itemData.name, sold: 0, price: itemData.price };
        }
        itemCounts[itemIdInt].sold += it.quantity;
      }
    }

    const topSelling = Object.values(itemCounts)
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    return res.json({
      totalRevenue,
      totalOrders: orders.length,
      topSelling
    });
  } catch (err) {
    next(err);
  }
};
