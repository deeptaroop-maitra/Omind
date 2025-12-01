const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const callsRoutes = require('./routes/calls');
const swagger = require('./swagger');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/omind';

mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error', err));

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/calls', callsRoutes);
app.use('/api-docs', swagger);

app.get('/', (req, res) => res.send({ ok: true, version: 'omind-prototype' }));

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
