const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  callOpening: Number,
  issueCapture: Number,
  sentimentAgent: Number,
  sentimentCustomer: Number,
  csat: Number,
  resolution: Number
}, { _id: false });

const CallSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  transcript: String,
  scores: ScoreSchema,
  coachingPlan: Object,
  status: { type: String, default: 'processing' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Call', CallSchema);
