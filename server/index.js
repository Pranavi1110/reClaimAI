const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const returnRouter = require("./routes/return");
const partnerRouter = require("./routes/partner");
const adminRouter = require("./routes/admin");
const marketplaceRouter = require("./routes/marketplace");
const ngoRouter = require("./routes/ngo");

app.get("/api/return", (req, res) => res.json({ message: "Return API" }));
app.get("/api/partner", (req, res) => res.json({ message: "Partner API" }));
app.get("/api/admin", (req, res) => res.json({ message: "Admin API" }));
app.get("/api/marketplace", (req, res) =>
  res.json({ message: "Marketplace API" })
);
app.get("/api/ngo", (req, res) => res.json({ message: "NGO API" }));

app.use("/api/return", returnRouter);
app.use("/api/partner", partnerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/marketplace", marketplaceRouter);
app.use("/api/ngo", ngoRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
