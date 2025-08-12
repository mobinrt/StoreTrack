const Item = require('../models/item');

exports.createItem = async (req, res, next) => {
  try {
    const { name, category, price, stockQuantity } = req.body;
    if (!name || price == null) return res.status(400).json({ error: 'name and price are required' });

    const item = new Item({ name, category, price, stockQuantity: stockQuantity || 0 });
    await item.save();
    return res.status(201).json(item);
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
    return res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    return res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const update = req.body;
    if (update.stockQuantity != null && update.stockQuantity < 0)
      return res.status(400).json({ error: 'stockQuantity cannot be negative' });

    const item = await Item.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!item) return res.status(404).json({ error: 'Item not found' });
    return res.json(item);
  } catch (err) {
    next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    return res.json({ message: 'Item deleted' });
  } catch (err) {
    next(err);
  }
};
