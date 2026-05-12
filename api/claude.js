module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Sin API key' });

  const { system, messages, max_tokens = 1000 } = req.body;
  const openaiMessages = [];
  if (system) openaiMessages.push({ role: 'system', content: system });
  openaiMessages.push(...messages);

  // Modelos free en orden de preferencia
  const models = [
    'google/gemma-3-27b-it:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'mistralai/mistral-7b-instruct:free',
    'qwen/qwen-2.5-72b-instruct:free',
  ];

  for (const model of models) {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://factor-loboral.vercel.app',
        'X-Title': 'Factor Laboral Humano',
      },
      body: JSON.stringify({ model, max_tokens, messages: openaiMessages }),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || '';

    if (text) {
      return res.status(200).json({ content: [{ type: 'text', text }] });
    }
    // Si falla (rate limit u otro error), intenta el siguiente modelo
  }

  // Todos fallaron
  return res.status(200).json({
    content: [{ type: 'text', text: 'En este momento hay mucha demanda. Por favor escríbenos directamente al WhatsApp 3719-0890 y te atendemos de inmediato. 😊' }]
  });
};