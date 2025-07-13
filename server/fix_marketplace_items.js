const mongoose = require('mongoose');
const Return = require('./models/Return');
require('dotenv').config();

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Update all existing items to have readyForMarket field
      const result = await Return.updateMany(
        { readyForMarket: { $exists: false } },
        { $set: { readyForMarket: false } }
      );
      console.log('Updated items without readyForMarket:', result.modifiedCount);
      
      // Update all existing items to have repairStatus field
      const result2 = await Return.updateMany(
        { repairStatus: { $exists: false } },
        { $set: { repairStatus: 'Received' } }
      );
      console.log('Updated items without repairStatus:', result2.modifiedCount);
      
      // For items that should be in marketplace (status: 'Marketplace'), set readyForMarket to true
      const result3 = await Return.updateMany(
        { status: 'Marketplace' },
        { $set: { readyForMarket: true } }
      );
      console.log('Updated marketplace items:', result3.modifiedCount);
      
      // For items that are repaired, set repairStatus to 'Repaired'
      const result4 = await Return.updateMany(
        { status: 'Marketplace' },
        { $set: { repairStatus: 'Repaired' } }
      );
      console.log('Updated repaired items:', result4.modifiedCount);
      
      console.log('Database update completed successfully!');
      process.exit(0);
    } catch (err) {
      console.error('Error updating database:', err);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 