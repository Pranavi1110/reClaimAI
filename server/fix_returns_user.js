// Usage: node fix_returns_user.js <NGO_USER_ID>
require("dotenv").config();
const mongoose = require("mongoose");
const Return = require("./models/Return");

const ngoUserId = process.argv[2];
if (!ngoUserId) {
  console.error("Usage: node fix_returns_user.js <NGO_USER_ID>");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const result = await Return.updateMany(
      { $or: [{ user: { $exists: false } }, { user: null }] },
      { $set: { user: ngoUserId } }
    );
    console.log("Updated returns:", result.modifiedCount);
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });
