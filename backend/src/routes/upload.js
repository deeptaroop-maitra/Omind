const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Call = require('../models/Call');
const { transcribe } = require('../services/sttService');
const { analyzeTranscript } = require('../services/llmService');

const router = express.Router();

// Create uploads dir if it doesn't exist
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const call = await Call.create({ filename: file.originalname, filepath: file.path, status: 'processing' });

    // Process asynchronously with a short delay to ensure file is written
    setTimeout(async () => {
      try {
        console.log('Processing call', call._id, 'file:', file.path);
        const transcript = await transcribe(file.path);
        console.log('Transcript retrieved');
        const analysis = await analyzeTranscript(transcript);
        console.log('Analysis completed');

        call.transcript = transcript;
        call.scores = analysis.scores || {};
        call.coachingPlan = analysis.coachingPlan || {};
        call.status = 'done';
        await call.save();
        console.log('Call saved successfully');
      } catch (err) {
        console.error('Processing error:', err);
        call.status = 'error';
        call.transcript = err.message;
        await call.save();
      }
    }, 500);

    res.json({ id: call._id, status: 'processing' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
