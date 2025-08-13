const Item = require('../models/Item');

/**
 * Checks for low-stock items and returns them.
 * @param {Number} threshold - Minimum stock quantity before considered low.
 * @returns {Promise<Array>} - Array of low-stock items.
 */
async function checkLowStock(threshold) {
  const lowStockItems = await Item.find({ stockQuantity: { $lt: threshold } }).sort({ stockQuantity: 1 });
  return lowStockItems;
}

module.exports = checkLowStock;