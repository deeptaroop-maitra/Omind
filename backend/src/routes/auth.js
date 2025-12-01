const express = require('express');
const router = express.Router();

// Mock login - in a real app, validate credentials and issue JWT
router.post('/login', (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: 'username required' });
  // Return mock token and user info
  res.json({ token: 'mock-token', user: { username, name: 'Demo User' } });
});

module.exports = router;
