const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/itemsController');

router.post('/', itemsController.createItem);
router.get('/', itemsController.listItems);
router.get('/:id', itemsController.getItem);
router.put('/:id', itemsController.updateItem);
router.delete('/:id', itemsController.deleteItem);

module.exports = router;