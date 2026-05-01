
/**
 * Utility to convert a File object to base64 string
 * Strips the data:image/jpeg;base64, prefix as required by Claude API
 */
export const toBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.toString().split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

const MOCK_PALETTE_DATA = {
  "skinTone": "medium",
  "undertone": "warm",
  "seasonType": "Autumn",
  "paletteName": "Warm Autumn",
  "bestColours": [
    { "name": "Burnt Orange", "hex": "#CC5500" },
    { "name": "Olive Green", "hex": "#708238" },
    { "name": "Camel", "hex": "#C19A6B" },
    { "name": "Warm Brown", "hex": "#8B4513" },
    { "name": "Rust Red", "hex": "#B7410E" },
    { "name": "Golden Yellow", "hex": "#FFD700" }
  ],
  "avoidColours": [
    { "name": "Icy Pink", "hex": "#FFB6C1" },
    { "name": "Cool Grey", "hex": "#808080" },
    { "name": "Navy Blue", "hex": "#000080" }
  ],
  "styleTips": [
    "Embrace earthy tones like terracotta and olive which complement your warm undertone perfectly",
    "Avoid stark white — opt for off-white or cream shades instead",
    "Gold jewellery and accessories will enhance your natural warmth better than silver"
  ],
  "analysisNote": "Your warm autumn colouring is beautifully complemented by rich, muted earth tones. Your skin has golden undertones that glow when paired with spices like cinnamon and turmeric. Staying away from cool, icy pastels will ensure your complexion remains vibrant and never washed out."
};

/**
 * Analyses the colour palette of a user from their face photo
 * @param {File} imageFile 
 * @returns {Promise<Object>} The structured JSON analysis
 */
export const analyseColourPalette = async (imageFile) => {
  const useMock = process.env.REACT_APP_USE_MOCK === 'true' || 
                 !process.env.REACT_APP_ANTHROPIC_API_KEY || 
                 process.env.REACT_APP_ANTHROPIC_API_KEY === 'your_anthropic_api_key_here';

  if (useMock) {
    console.log('🎨 Colour Analysis: Using MOCK mode (Mock flag: ' + process.env.REACT_APP_USE_MOCK + ')');
    await new Promise(r => setTimeout(r, 2500));
    return MOCK_PALETTE_DATA;
  }

  console.log('🚀 Colour Analysis: Attempting real API call to Anthropic...');

  try {
    const base64ImageData = await toBase64(imageFile);
    
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: "image/jpeg",
                  data: base64ImageData
                }
              },
              {
                type: "text",
                text: `You are an expert personal colour analyst and fashion stylist.
Analyse this person's colouring — skin tone, undertone, eye colour, and hair colour.

Determine their seasonal colour type and generate a personalised palette.

Respond ONLY with a valid JSON object in this exact format, no other text:
{
  "skinTone": "medium",
  "undertone": "warm",
  "seasonType": "Autumn",
  "paletteName": "Warm Autumn",
  "bestColours": [
    { "name": "Burnt Orange", "hex": "#CC5500" },
    { "name": "Olive Green", "hex": "#708238" },
    { "name": "Camel", "hex": "#C19A6B" },
    { "name": "Warm Brown", "hex": "#8B4513" },
    { "name": "Rust Red", "hex": "#B7410E" },
    { "name": "Golden Yellow", "hex": "#FFD700" }
  ],
  "avoidColours": [
    { "name": "Icy Pink", "hex": "#FFB6C1" },
    { "name": "Cool Grey", "hex": "#808080" },
    { "name": "Navy Blue", "hex": "#000080" }
  ],
  "styleTips": [
    "Embrace earthy tones like terracotta and olive which complement your warm undertone perfectly",
    "Avoid stark white — opt for off-white or cream shades instead",
    "Gold jewellery and accessories will enhance your natural warmth better than silver"
  ],
  "analysisNote": "Your warm autumn colouring is beautifully complemented by rich, muted earth tones..."
}`
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `API Error: ${response.status}`);
    }

    const result = await response.json();
    const textContent = result.content[0].text;
    
    try {
      return JSON.parse(textContent);
    } catch (parseError) {
      console.error("Failed to parse Claude JSON response:", textContent);
      throw new Error("Could not analyse the photo. Please try a clearer face photo.");
    }
  } catch (error) {
    console.error("Colour Analysis Error:", error);
    throw error;
  }
};
