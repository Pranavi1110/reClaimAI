const express = require('express');
const router = express.Router();
const Return = require('../models/Return');
const User = require('../models/User');
const genAI = require('@google/generative-ai');
require('dotenv').config();

const MODEL = 'gemini-1.5-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const client = new genAI.GoogleGenerativeAI(GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: MODEL });

/**
 * Submit Return Request
 */
router.post('/submit', async (req, res) => {
  const {
    productName,
    reason,
    description,
    imageBase64,
    mimeType,
    purchaseDate,
    email // ✅ expect user email from frontend
  } = req.body;

  if (!email || !imageBase64 || !purchaseDate || !productName || !reason) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const purchase = new Date(purchaseDate);
  const now = new Date();
  const daysDiff = (now - purchase) / (1000 * 60 * 60 * 24);

  if (daysDiff > 2) {
    return res.status(400).json({ message: 'Return window expired (over 2 days).' });
  }

  const prompt = `
You are a sustainability and quality expert. Analyze this product return image and write a **detailed paragraph** about:

- Product condition (damaged / repairable / good)
- Whether it can be:
  - **Refused** (should not be accepted)
  - **Reduced** (waste minimized)
  - **Reused** (used again as-is)
  - **Repurposed** (used for another purpose)
  - **Recycled**
  - **Restocked** (if in good shape)

💡 Write a **minimum 4-line paragraph**, combining all insights. Return only the paragraph. DO NOT return JSON or lists. Use clear professional tone.
`;

  try {
    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      },
      prompt,
    ]);

    const response = await result.response;
    const analysisSummary = (await response.text()).replace(/```(?:json)?|```/g, '').trim();

    // Basic keyword-based condition classification
    let condition = 'unknown';
    const summaryText = analysisSummary.toLowerCase();
    if (summaryText.includes('damaged')) condition = 'damaged';
    else if (summaryText.includes('repairable')) condition = 'repairable';
    else if (summaryText.includes('good')) condition = 'good condition';

    const imageDataUrl = `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`;

    const returnEntry = new Return({
      productName,
      reason,
      description,
      condition,
      imageUrl: imageDataUrl,
      purchaseDate,
      analysisSummary,
      submittedBy: user._id, // ✅ Store who submitted it
    });

    await returnEntry.save();

    res.json({
      message: 'Return submitted successfully',
      prediction: {
        condition,
        summary: analysisSummary,
      },
    });
  } catch (error) {
    console.error('Gemini AI error:', error.message);
    res.status(500).json({
      message: 'Failed to analyze image',
      error: error.message,
    });
  }
});

/**
 * Get All Returns Submitted by the Logged-in Customer
 */
router.get('/user-returns', async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const returns = await Return.find({ submittedBy: user._id }).sort({ createdAt: -1 });

    res.json({ returns });
  } catch (error) {
    console.error('Error fetching returns:', error);
    res.status(500).json({ message: 'Error fetching returns' });
  }
});

module.exports = router;
