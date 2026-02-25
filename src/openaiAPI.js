// AI API Helper Functions (OpenAI)

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o-mini';

/**
 * Call OpenAI API with text prompt
 */
export async function callOpenAIAPI(prompt) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.7,
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || 'OpenAI API request failed');
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  
  if (!text) {
    throw new Error('No response from OpenAI API');
  }

  return text;
}

/**
 * Call OpenAI API with image + text
 */
export async function callOpenAIAPIWithImage(prompt, imageBase64, mimeType) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file');
  }

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0.7,
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
        {
          role: 'user',
          content: {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
            },
          },
        },
      ],
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || 'OpenAI API request failed');
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  
  if (!text) {
    throw new Error('No response from OpenAI API');
  }

  return text;
}
