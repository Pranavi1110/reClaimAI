require("dotenv").config();
const express = require("express");
const router = express.Router();
const Return = require("../models/Return");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const User = require("../models/User");
const DonationHistory = require("../models/DonationHistory");
const axios = require("axios");

// Multer setup for proof image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// GET /api/ngo/returns - Items in good condition
router.get("/returns", async (req, res) => {
  const items = await Return.find({ condition: "good condition" });
  res.json({ items });
});

// GET /api/ngo/credits-and-rank - Green credits and rank for all NGOs
router.get("/credits-and-rank", async (req, res) => {
  // Get all NGOs sorted by greenPoints
  const ngos = await User.find({ role: "ngo" }).sort({ greenPoints: -1 });
  if (!ngos.length) {
    return res.json({
      greenPoints: 0,
      rank: null,
      totalNgos: 0,
      leaderboard: [],
    });
  }
  // For demo, assume first NGO is current user (in real app, use auth)
  const currentNgo = ngos[0];
  const rank = ngos.findIndex((u) => u._id.equals(currentNgo._id)) + 1;
  res.json({
    greenPoints: currentNgo.greenPoints,
    rank,
    totalNgos: ngos.length,
    leaderboard: ngos.map((ngo, i) => ({
      name: ngo.name,
      greenPoints: ngo.greenPoints,
      rank: i + 1,
    })),
  });
});

// For demo, use a hardcoded dummy NGO user if not found
const DUMMY_NGO = {
  _id: "664f1a2b3c4d5e6f7a8b9c0d",
  name: "Demo NGO",
  role: "ngo",
  greenPoints: 0,
};

// PUT /api/ngo/returns/:id/status - Update status and auto-calculate credits
router.put("/returns/:id/status", async (req, res) => {
  const { status } = req.body;
  const item = await Return.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found" });

  // Prevent changing from donated to received
  if (item.status === "donated" && status === "received") {
    return res
      .status(400)
      .json({ error: "Cannot change status from donated back to received." });
  }

  item.status = status;
  await item.save();

  // Debug info
  console.log("Item:", item);

  // Auto-calculate credits if donated
  if (status === "donated") {
    let credits = 0;
    if (/food/i.test(item.productName)) credits = 5;
    else if (
      /cloth|shirt|pant|jacket|dress|saree|kurta|t-shirt/i.test(
        item.productName
      )
    )
      credits = 10;
    else if (
      /electronic|laptop|phone|tv|tablet|gadget/i.test(item.productName) &&
      item.repairStatus === "Repaired"
    )
      credits = 15;
    // Find NGO user from item.user
    let ngo = null;
    if (item.user && credits > 0) {
      ngo = await User.findById(item.user);
    }
    if (!ngo && credits > 0) {
      // Use dummy NGO if not found
      ngo = await User.findOne({ email: "demo@ngo.com" });
      if (!ngo) {
        ngo = await User.create({
          _id: DUMMY_NGO._id,
          name: DUMMY_NGO.name,
          email: "demo@ngo.com",
          password: "demo",
          role: "ngo",
          greenPoints: 0,
        });
      }
    }
    if (ngo && ngo.role === "ngo") {
      ngo.greenPoints += credits;
      // Increment impact stats
      if (!ngo.partnerDetails) ngo.partnerDetails = {};
      if (!ngo.partnerDetails.ngoInfo) ngo.partnerDetails.ngoInfo = {};
      ngo.partnerDetails.ngoInfo.itemsDonated =
        (ngo.partnerDetails.ngoInfo.itemsDonated || 0) + 1;
      await ngo.save();
      console.log(
        "Green credits added:",
        credits,
        "New total:",
        ngo.greenPoints
      );
      // Log donation to history
      await DonationHistory.create({
        itemId: item._id,
        itemName: item.productName,
        ngoId: ngo._id,
        ngoName: ngo.name,
        date: new Date(),
        status: "donated",
        credits,
        proofImage: item.proofImage || null,
      });
    } else {
      console.log("No valid NGO found for item.user:", item.user);
    }
  }
  res.json({ item });
});

// POST /api/ngo/returns/:id/upload-proof - Upload proof image with Gemini AI validation
router.post(
  "/returns/:id/upload-proof",
  upload.single("proof"),
  async (req, res) => {
    let proofVerified = false;
    let proofReason = "Could not verify image.";
    try {
      const geminiApiKey = process.env.GEMINI_API_KEY;
      const geminiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: req.file.mimetype,
                    data: Buffer.from(fs.readFileSync(req.file.path)).toString(
                      "base64"
                    ),
                  },
                },
                {
                  text: "Is this image a real photo of a donation or someone receiving an item? Reply only 'yes' or 'no' and a short reason.",
                },
              ],
            },
          ],
        }
      );
      // Log the raw Gemini API response for debugging
      console.log(
        "Gemini API raw response:",
        JSON.stringify(geminiRes.data, null, 2)
      );
      const geminiText =
        geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (/yes/i.test(geminiText)) {
        proofVerified = true;
        proofReason = geminiText;
      } else {
        proofVerified = false;
        proofReason = geminiText || "Image rejected by AI.";
      }
    } catch (e) {
      console.error("Gemini API error:", e.message);
    }
    const item = await Return.findByIdAndUpdate(
      req.params.id,
      { proofImage: req.file.filename, proofVerified, proofReason },
      { new: true }
    );
    // If item is already donated, update DonationHistory with proof image
    if (item && item.status === "donated") {
      await DonationHistory.findOneAndUpdate(
        { itemId: item._id, status: "donated" },
        { proofImage: req.file.filename }
      );
    }
    res.json({ item });
  }
);

// GET /api/ngo/metrics - Impact metrics, top donor, history
router.get("/metrics", async (req, res) => {
  // Dummy data for now
  res.json({
    metrics: { childrenHelped: 12, foodRedirected: 50, clothingDonated: 30 },
    topDonor: { name: "Helping Hands", credits: 120 },
    history: [
      { date: "2025-07-01", itemName: "Jacket", status: "donated" },
      { date: "2025-07-02", itemName: "Rice Bag", status: "donated" },
    ],
  });
});

// GET/POST /api/ngo/success-stories
let stories = [{ caption: "We helped 10 kids with warm clothes!" }];
router.get("/success-stories", (req, res) => {
  res.json({ stories });
});
router.post("/success-stories", (req, res) => {
  const { caption } = req.body;
  const story = { caption };
  stories.push(story);
  res.json({ story });
});

// GET /api/ngo/export-history - Download CSV
router.get("/export-history", (req, res) => {
  const csv =
    "Date,Item,Status\n2025-07-01,Jacket,donated\n2025-07-02,Rice Bag,donated\n";
  res.header("Content-Type", "text/csv");
  res.attachment("donation_history.csv");
  res.send(csv);
});

// GET /api/ngo/donation-history - Get donation history for current NGO (for demo, all)
router.get("/donation-history", async (req, res) => {
  try {
    // For demo, return all donation history
    const history = await DonationHistory.find().sort({ date: -1 });
    res.json({ history });
  } catch (err) {
    console.error("Error fetching donation history:", err);
    res.status(500).json({ error: "Failed to fetch donation history." });
  }
});

module.exports = router;
