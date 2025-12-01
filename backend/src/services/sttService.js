const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// Simple STT wrapper: uses OpenAI Whisper transcription endpoint if OPENAI_API_KEY provided,
// otherwise returns a mock transcript for demo purposes.

async function transcribe(filePath) {
  // Verify file exists
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found at ${filePath}, using mock transcript`);
    return `Mock transcript (file not found at ${filePath})`;
  }

  if (process.env.OPENAI_API_KEY) {
    // Call OpenAI transcription endpoint
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));
      form.append('model', 'whisper-1');

      const resp = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });

      console.log('STT response received: ', resp.data);

      return resp.data.text;
    } catch (err) {
      console.error('STT error', err?.response?.data || err.message);
      return `__TRANSCRIPTION_ERROR: ${err.message}`;
    }
  }

  // Mock fallback: read a sample .txt transcript if present, or return stub text
  const sampleTxt = path.join(__dirname, '..', '..', 'sample_calls', path.basename(filePath) + '.txt');
  if (fs.existsSync(sampleTxt)) {
    return fs.readFileSync(sampleTxt, 'utf8');
  }
  return `Mock transcript for ${path.basename(filePath)}. Customer: Hello, I'm calling about my bill. Agent: I'm sorry to hear that...`;
}

module.exports = { transcribe };
