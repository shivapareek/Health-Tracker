const express = require('express');
const router = express.Router();
const HealthEntry = require('../models/HealthEntry');


router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const entries = await HealthEntry.find({
      userId: 'default_user',
      type: type,
      date: { $gte: startDate }
    }).sort({ date: 1 });
    
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const entries = await HealthEntry.find({
      userId: 'default_user',
      date: { $gte: startDate }
    }).sort({ date: 1 });
    
    // Group by type
    const groupedData = {
      calories: [],
      sleep: [],
      workouts: [],
      weight: [],
      steps: []
    };
    
    entries.forEach(entry => {
      if (groupedData[entry.type]) {
        groupedData[entry.type].push({
          date: entry.date.toISOString().split('T')[0],
          value: entry.value,
          _id: entry._id
        });
      }
    });
    
    res.json(groupedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/', async (req, res) => {
  try {
    const { type, value, date } = req.body;
    
    const newEntry = new HealthEntry({
      userId: 'default_user',
      type,
      value: parseFloat(value),
      date: new Date(date)
    });
    
    const savedEntry = await newEntry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, value, date } = req.body;
    
    const updatedEntry = await HealthEntry.findByIdAndUpdate(
      id,
      { type, value: parseFloat(value), date: new Date(date) },
      { new: true }
    );
    
    if (!updatedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    res.json(updatedEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedEntry = await HealthEntry.findByIdAndDelete(id);
    
    if (!deletedEntry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.get('/stats/summary', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const pipeline = [
      {
        $match: {
          userId: 'default_user',
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$type',
          average: { $avg: '$value' },
          total: { $sum: '$value' },
          count: { $sum: 1 },
          latest: { $last: '$value' }
        }
      }
    ];
    
    const stats = await HealthEntry.aggregate(pipeline);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;