const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Your schema file


router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(name,email,password,role)
  if (!['user', 'partner', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
   

    const newUser = new User({
      name,
      email,
      password,
      role,
      greenPoints: 0 // default handled by schema
    });
    console.log(newUser)

    await newUser.save();

    res.status(201).json({ message: `${role} registered successfully`, user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});
// Check if email exists
router.get('/check-email', async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json({ exists: true, user: user });
    } else {
      res.json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to check email', details: err.message });
  }
});


module.exports = router;
