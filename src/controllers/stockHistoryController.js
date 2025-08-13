const StockHistory = require('../models/StockHistory');

exports.listStockHistory = async (req, res, next) => {
  try {
    const { item, changeType, limit = 50, page = 1 } = req.query;
    const filter = {};

    if (item) filter.item = item;
    if (changeType) filter.changeType = changeType;

    const entries = await StockHistory.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    return res.json(entries);
  } catch (err) {
    next(err);
  }
};

exports.getStockHistory = async (req, res, next) => {
  try {
    const entry = await StockHistory.findOne({ stockHistoryId: Number(req.params.id) });
    if (!entry) return res.status(404).json({ error: 'StockHistory entry not found' });
    return res.json(entry);
  } catch (err) {
    next(err);
  }
};
