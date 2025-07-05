const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const returnRouter = require('./routes/return');
const partnerRouter = require('./routes/partner');
const adminRouter = require('./routes/admin');
const marketplaceRouter = require('./routes/marketplace');

app.get('/api/return', (req, res) => res.json({ message: 'Return API' }));
app.get('/api/partner', (req, res) => res.json({ message: 'Partner API' }));
app.get('/api/admin', (req, res) => res.json({ message: 'Admin API' }));
app.get('/api/marketplace', (req, res) => res.json({ message: 'Marketplace API' }));

app.use('/api/return', returnRouter);
app.use('/api/partner', partnerRouter);
app.use('/api/admin', adminRouter);
app.use('/api/marketplace', marketplaceRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 