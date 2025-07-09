const express = require('express');
const router = express.Router();
const Return = require('../models/Return');

// Get all items ready for marketplace
router.get('/', async (req, res) => {
  try {
    const items = await Return.find({ readyForMarket: true });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch marketplace items' });
  }
});

// (Optional) Add new item to marketplace
// router.post('/', async (req, res) => {
//   // Implementation for admin to add new item
// });

// (Optional) Claim an item
// router.patch('/:id/claim', async (req, res) => {
//   // Implementation for user to claim item
// });

module.exports = router; 