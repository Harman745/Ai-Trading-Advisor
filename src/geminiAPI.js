// AI API Helper Functions (OpenAI)

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o-mini';

/**
 * Call Gemini API with text prompt
 */
export async function callGeminiAPI(prompt) {
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
 * Call Gemini API with image + text
 */
export async function callGeminiAPIWithImage(prompt, imageBase64, mimeType) {
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
          content: [
          {
            type: 'text',
            text: prompt
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`
            }
          }
        ]
        }
      ]
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

export async function callGeminiAPIForJSON(prompt) {
  const text = await callGeminiAPI(prompt);
  return parseJSONFromResponse(text);
}

/**
 * Parse JSON from Gemini response
 * Handles markdown code blocks and other formatting
 */
export function parseJSONFromResponse(text) {
  // Remove markdown code blocks
  let cleaned = text
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();
  
  // Try to find JSON object in the text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }
  
  return JSON.parse(cleaned);
}
