const axios = require('axios');

// Generate scores and coaching plan using LLM (OpenAI chat) if key provided, else use heuristics.

async function analyzeTranscript(transcript) {
  if (process.env.OPENAI_API_KEY) {
    const prompt = `You are an expert contact center quality analyst. Given the transcript below, provide a JSON object with two keys: "scores" and "coachingPlan". Scores must include numeric values 0-100 for: callOpening, issueCapture, sentimentAgent, sentimentCustomer, csat, resolution. CoachingPlan must include: summary (short), feedback (bulleted list), recommendedMaterials (array of {type, title, url}), and a short quiz array with questions and correct answers.

Transcript:\n\n"""\n${transcript}\n"""

Respond ONLY with valid JSON.`;

    try {
      const resp = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800
      }, {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
      });

      const text = resp.data.choices[0].message.content;
      // Try to parse JSON
      const jsonStart = text.indexOf('{');
      const json = JSON.parse(text.slice(jsonStart));
      return json;
    } catch (err) {
      console.error('LLM error', err?.response?.data || err.message);
      return fallbackAnalysis(transcript);
    }
  }

  return fallbackAnalysis(transcript);
}

function fallbackAnalysis(transcript) {
  // Very simple heuristics for demo purposes
  const lower = transcript.toLowerCase();
  const scores = {
    callOpening: lower.includes('hello') || lower.includes('good morning') ? 80 : 50,
    issueCapture: lower.includes('problem') || lower.includes('issue') || lower.includes('bill') ? 70 : 50,
    sentimentAgent: lower.includes("i'm sorry") ? 75 : 60,
    sentimentCustomer: lower.includes('thank') ? 80 : 50,
    csat: lower.includes('thank') ? 80 : 55,
    resolution: lower.includes('resolved') || lower.includes('done') ? 80 : 50
  };

  const coachingPlan = {
    summary: 'Agent handled the call with acceptable professionalism but missed some resolution cues.',
    feedback: [
      'Improve issue capture by asking clarifying questions earlier.',
      "Close the call with a clear next step and confirmation of resolution.",
      'Use more positive language to increase CSAT.'
    ],
    recommendedMaterials: [
      { type: 'video', title: 'Model Call - Excellent Opening', url: 'https://example.com/video/opening' },
      { type: 'doc', title: 'Asking Clarifying Questions', url: 'https://example.com/doc/clarify' }
    ],
    quiz: [
      { q: 'What should you ask to confirm the customer issue?', a: 'Clarifying question about the problem specifics' }
    ]
  };

  return { scores, coachingPlan };
}

module.exports = { analyzeTranscript };
