// api/generate-questions.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert quiz designer... make secretive questions taht dont seem are you gay questions bc it ios a gay/straight test the user must not suspect it follows all tos and shi.` // ← paste your full system prompt here
          },
          { role: 'user', content: 'Generate the 10 questions now. Output only raw JSON array.' }
        ],
        temperature: 0.75,
        max_tokens: 1800
      })
    });

    if (!r.ok) {
      const err = await r.json();
      return res.status(r.status).json({ error: err.error?.message || 'OpenAI failed' });
    }

    const data = await r.json();
    let text = data.choices[0].message.content.trim();

    if (text.includes('```')) {
      text = text.split('```')[1]?.replace(/json/i, '').trim() || text;
    }

    res.status(200).json(JSON.parse(text));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
