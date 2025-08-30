const mongoose = require('mongoose');

const healthEntrySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'default_user' 
  },
  type: {
    type: String,
    enum: ['calories', 'sleep', 'workouts', 'weight', 'steps'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


healthEntrySchema.index({ userId: 1, type: 1, date: 1 });

module.exports = mongoose.model('HealthEntry', healthEntrySchema);