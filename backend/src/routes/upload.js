const express = require('express');
const multer = require('multer');
const path = require('path');
const Call = require('../models/Call');
const { transcribe } = require('../services/sttService');
const { analyzeTranscript } = require('../services/llmService');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
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

    // Process asynchronously
    (async () => {
      try {
        const transcript = await transcribe(file.path);
        const analysis = await analyzeTranscript(transcript);

        call.transcript = transcript;
        call.scores = analysis.scores || {};
        call.coachingPlan = analysis.coachingPlan || {};
        call.status = 'done';
        await call.save();
      } catch (err) {
        console.error('Processing error', err);
        call.status = 'error';
        await call.save();
      }
    })();

    res.json({ id: call._id, status: 'processing' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

module.exports = router;
