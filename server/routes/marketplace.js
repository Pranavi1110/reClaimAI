const express = require('express');
const router = express.Router();
const Return = require('../models/Return');
const User = require('../models/User');

// Get all items ready for marketplace
router.get('/', async (req, res) => {
  try {
    const items = await Return.find({ readyForMarket: true });
    console.log('Marketplace items found:', items.length);
    console.log('Items:', items.map(item => ({ 
      id: item._id, 
      name: item.productName, 
      status: item.status, 
      readyForMarket: item.readyForMarket 
    })));
    res.json(items);
  } catch (err) {
    console.error('Marketplace fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch marketplace items' });
  }
});

// (Optional) Add new item to marketplace
// router.post('/', async (req, res) => {
//   // Implementation for admin to add new item
// });

// POST /claim/:id - Claim a marketplace item
router.post('/claim/:id', async (req, res) => {
  const { userId } = req.body;
  console.log('Claim request - userId:', userId, 'itemId:', req.params.id);
  
  if (!userId) return res.status(400).json({ error: 'User ID required' });
  try {
    const item = await Return.findById(req.params.id);
    console.log('Found item:', item ? { 
      id: item._id, 
      status: item.status, 
      readyForMarket: item.readyForMarket 
    } : 'Item not found');
    
    if (!item) return res.status(404).json({ error: 'Item not found' });
    if (!item.readyForMarket) return res.status(404).json({ error: 'Item not available for marketplace' });
    if (item.status === 'Claimed') return res.status(400).json({ error: 'Already claimed' });

    item.status = 'Claimed';
    item.claimedBy = userId;
    await item.save();
    console.log('Item updated successfully');

    // Award random green points (5-25)
    const greenPointsEarned = Math.floor(Math.random() * 21) + 5;
    const user = await User.findById(userId);
    console.log('Found user:', user ? { id: user._id, greenPoints: user.greenPoints } : 'User not found');
    
    if (user) {
      user.greenPoints = (user.greenPoints || 0) + greenPointsEarned;
      await user.save();
      console.log('User green points updated to:', user.greenPoints);
    }
    res.json({ item, greenPoints: user ? user.greenPoints : 0, pointsEarned: greenPointsEarned });
  } catch (err) {
    console.error('Claim error details:', err);
    res.status(500).json({ error: 'Failed to claim item', details: err.message });
  }
});

module.exports = router; 