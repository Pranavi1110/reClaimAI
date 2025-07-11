require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const ngoUser = {
  _id: mongoose.Types.ObjectId("664f1a2b3c4d5e6f7a8b9c0d"),
  name: "Demo NGO",
  email: "demo@ngo.com",
  password: "demo", // For demo only
  role: "ngo",
  greenPoints: 0,
};

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    const existing = await User.findById(ngoUser._id);
    if (existing) {
      console.log("NGO user already exists:", existing);
    } else {
      await User.create(ngoUser);
      console.log("Dummy NGO user created:", ngoUser);
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB error:", err);
    process.exit(1);
  });
