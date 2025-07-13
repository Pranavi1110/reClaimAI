const express = require('express');
const router = express.Router();
const Return = require('../models/Return');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { spawn } = require('child_process');
const path = require('path');

// Get all items needing repair (not yet repaired)
router.get('/repairs', async (req, res) => {
  try {
    const items = await Return.find({ status: 'Repair' });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch repair items' });
  }
});

// Update repair status
router.patch('/repairs/:id/status', async (req, res) => {
  const { repairStatus } = req.body;
  try {
    const item = await Return.findByIdAndUpdate(
      req.params.id,
      {
        repairStatus,
        readyForMarket: repairStatus === 'Repaired',
      },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update repair status' });
  }
});

// Upload proof image (accept image URL in body for now)
router.post('/repairs/:id/proof', async (req, res) => {
  const { proofImage } = req.body;
  try {
    const item = await Return.findByIdAndUpdate(
      req.params.id,
      { proofImage, readyForMarket: true },
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload proof image' });
  }
});

// AI verification endpoint for repair proof
router.post('/repairs/:id/verify-repair', upload.single('proofImage'), async (req, res) => {
  try {
    const item = await Return.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const originalImageUrl = item.imageUrl;
    const proofImagePath = req.file.path;

    // Call AI script (simulate for now)
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../ml/image_classifier.py'),
      originalImageUrl,
      proofImagePath,
    ]);

    let aiResult = '';
    pythonProcess.stdout.on('data', (data) => {
      aiResult += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`AI error: ${data}`);
    });

    pythonProcess.on('close', async (code) => {
      if (aiResult.trim() === 'MATCH') {
        item.repairStatus = 'Repaired';
        item.proofImage = proofImagePath; // In production, use a proper URL
        item.readyForMarket = true;
        await item.save();
        res.json(item);
      } else {
        res.status(400).json({ error: 'AI verification failed. Images do not match.' });
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /repairs/:id/mark-repaired - Mark as repaired and send to marketplace
router.patch('/repairs/:id/mark-repaired', async (req, res) => {
  try {
    console.log('Marking item as repaired and sending to marketplace:', req.params.id);
    const item = await Return.findByIdAndUpdate(
      req.params.id,
      {
        repairStatus: 'Repaired',
        status: 'Marketplace',
        readyForMarket: true
      },
      { new: true }
    );
    console.log('Updated item:', {
      id: item._id,
      name: item.productName,
      status: item.status,
      readyForMarket: item.readyForMarket
    });
    res.json(item);
  } catch (err) {
    console.error('Error marking as repaired:', err);
    res.status(500).json({ error: 'Failed to mark as repaired and send to marketplace' });
  }
});

module.exports = router; 