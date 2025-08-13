const Item = require('../models/Item');

exports.lowStock = async (req, res, next) => {
  try {
    const threshold = Number(req.query.threshold) || 5;
    const items = await Item.find({ stockQuantity: { $lt: threshold } }).sort({ stockQuantity: 1 });
    return res.json({ threshold, count: items.length, items });
  } catch (err) {
    next(err);
  }
};
