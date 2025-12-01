const express = require('express');
const Call = require('../models/Call');
const router = express.Router();

router.get('/', async (req, res) => {
  const calls = await Call.find().sort({ createdAt: -1 }).limit(50);
  res.json(calls);
});

router.get('/:id', async (req, res) => {
  const call = await Call.findById(req.params.id);
  if (!call) return res.status(404).json({ error: 'Not found' });
  res.json(call);
});

module.exports = router;
