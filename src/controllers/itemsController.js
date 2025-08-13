const Item = require('../models/Item');
const checkLowStock = require('../utils/lowStock');
const { formatDoc, formatDocs } = require('../utils/formatDoc');

exports.createItem = async (req, res, next) => {
  try {
    const { name, category, price, stockQuantity } = req.body;
    if (!name || price == null) return res.status(400).json({ error: 'name and price are required' });
    if (!category) {
      return res.status(400).json({ error: 'category is required' });
    }

    const existingItem = await Item.findOne({ name, category });
    if (existingItem) {
      return res.status(409).json({
        error: `Item with name "${name}" already exists in category "${category}"`
      });
    }
    
    const item = new Item({ name, category, price, stockQuantity: stockQuantity || 0 });
    await item.save();

    const threshold = Number(process.env.LOW_STOCK_THRESHOLD) || 5;
    const lowStockItems = await checkLowStock(threshold);

    if (lowStockItems.length > 0) {
      console.warn('LOW STOCK ALERT:', lowStockItems.map(i => `${i.name} (${i.stockQuantity})`).join(', '));
    }

    const responseData = { item };
    if (req.user?.role === 'admin' && lowStockItems.length > 0) {
      responseData.lowStock = lowStockItems;
    }

    return res.status(201).json(responseData);
  } catch (err) {
    next(err);
  }
};

exports.listItems = async (req, res, next) => {
  try {
    const { category, minPrice, maxPrice, name, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (name) filter.name = new RegExp(name, 'i');
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const items = await Item.find(filter)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    return res.json(formatDocs(items, 'itemId'));
  } catch (err) {
    next(err);
  }
};

exports.getItem = async (req, res, next) => {
  try {
    const item = await Item.findOne({ itemId: req.params.id });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    return res.json(formatDoc(item, 'itemId'));
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const update = req.body;
    if (update.stockQuantity != null && update.stockQuantity < 0)
      return res.status(400).json({ error: 'stockQuantity cannot be negative' });

    const item = await Item.findOne({ itemId: req.params.id });
    if (!item) return res.status(404).json({ error: 'Item not found' });

    let stockChange = 0;
    if (update.stockQuantity != null) {
      stockChange = update.stockQuantity - item.stockQuantity; // positive=in, negative=out
    }

    Object.assign(item, update);
    await item.save();

    if (stockChange !== 0) {
      const StockHistory = require('../models/StockHistory');
      await StockHistory.create({
        item: item.itemId,
        changeType: stockChange > 0 ? 'in' : 'out',
        quantity: Math.abs(stockChange)
      });
    }
    
    const threshold = Number(process.env.LOW_STOCK_THRESHOLD) || 5;
    const lowStockItems = await checkLowStock(threshold);

    if (lowStockItems.length > 0) {
      console.warn('LOW STOCK ALERT:', lowStockItems.map(i => `${i.name} (${i.stockQuantity})`).join(', '));
    }

    const responseData = { item };
    if (req.user?.role === 'admin' && lowStockItems.length > 0) {
      responseData.lowStock = lowStockItems;
    }

    return res.json(responseData);
  } catch (err) {
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findOneAndDelete({ itemId: req.params.id });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    return res.json({ message: 'Item deleted', ...formatDoc(item, 'itemId') });
  } catch (err) {
    next(err);
  }
};
