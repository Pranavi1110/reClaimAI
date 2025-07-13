const express = require('express');
const router = express.Router();
const Return = require('../models/Return');
const MarketplaceItem = require('../models/MarketplaceItem'); 

function shouldGoToMarketplace(condition, reason) {
  const reasonLower = reason.toLowerCase();
  const conditionLower = condition.toLowerCase();

  // Case: Reason is "Repair"
  if (reasonLower.includes('repair')||reasonLower.includes('damaged')) {
   return false;
  }

  // For all other reasons, only good items go to marketplace
  if (['good', 'like new'].includes(conditionLower) && !reasonLower.includes('broken') && !reasonLower.includes('missing')) {
    return true;
  }

  return false; // Otherwise, don't add
}

router.post('/mark-collected', async (req, res) => {
  const { returnId } = req.body;
  console.log('Marking collected for return ID:', returnId);

  if (!returnId) return res.status(400).json({ message: 'Return ID is required' });

  try {
    const returnEntry = await Return.findById(returnId);
    console.log('Found return entry:', returnEntry);
    if (!returnEntry) return res.status(404).json({ message: 'Return not found' });

    // Route based on condition
    const conditionLower = (returnEntry.condition || '').toLowerCase();
    if (conditionLower.includes('good')) {
      returnEntry.status = 'NGO'; // New status for NGO dashboard
      await returnEntry.save();
      return res.status(200).json({ message: 'Item sent to NGO dashboard.' });
    } else {
      returnEntry.status = 'Repair';
      await returnEntry.save();
      return res.status(200).json({ message: 'Item sent to Repairs dashboard.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;