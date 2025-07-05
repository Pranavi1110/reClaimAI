const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Admin dashboard (placeholder)' });
});

module.exports = router; 