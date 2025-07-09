const express = require('express');
const router = express.Router();
const Return = require('../models/Return');
const genAI = require('@google/generative-ai');
require('dotenv').config();

const MODEL = 'gemini-1.5-flash';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const client = new genAI.GoogleGenerativeAI(GEMINI_API_KEY);
const model = client.getGenerativeModel({ model: MODEL });

const retryGeminiRequest = async (imageBase64, mimeType, prompt, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent([
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType
          }
        },
        prompt
      ]);
      return result;
    } catch (err) {
      console.error(`Gemini attempt ${attempt} failed: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
};

router.post('/submit', async (req, res) => {
  const { productName, reason, description, imageBase64, mimeType, purchaseDate } = req.body;

  if (!imageBase64 || !mimeType) {
    return res.status(400).json({ message: 'Image or MIME type missing' });
  }

  if (!purchaseDate) return res.status(400).json({ message: 'Purchase date is required' });

  const purchase = new Date(purchaseDate);
  const now = new Date();
  const timeDiff = now - purchase;
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

  if (daysDiff > 2) {
    return res.status(400).json({ message: 'Return window expired (over 2 days).' });
  }

  const prompt = `
    Analyze this product return image and classify its condition.
    Respond only with one of the following:
    - "damaged"
    - "repairable"
    - "good condition"
  `;

  try {
    const result = await retryGeminiRequest(imageBase64, mimeType, prompt);
    const response = await result.response;
    const text = await response.text();

    const cleanText = text.replace(/```(?:json)?|```/g, '').trim().toLowerCase();

    let predictedCondition = 'unknown';
    if (cleanText.includes('damaged')) predictedCondition = 'damaged';
    else if (cleanText.includes('repairable')) predictedCondition = 'repairable';
    else if (cleanText.includes('good condition')) predictedCondition = 'good condition';

    const followup =
      predictedCondition === 'damaged'
        ? 'Do you want a replacement item or donate to NGO?'
        : 'Thanks! Your item will be reviewed shortly.';

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    const returnEntry = new Return({
      productName,
      reason,
      description,
      condition: predictedCondition,
      imageUrl: imageDataUrl,
      purchaseDate,
    });

    await returnEntry.save();

    res.json({
      message: 'Return submitted successfully',
      prediction: {
        condition: predictedCondition,
        followup,
      },
    });
  } catch (error) {
    console.error('Gemini AI error:', error.message);
    res.status(500).json({
      message: 'Failed to analyze image',
      error: error.message,
      suggestion: 'Gemini service might be overloaded. Try again shortly.',
    });
  }
});

module.exports = router;
