import { Client } from "@gradio/client";

const USE_MOCK = process.env.REACT_APP_USE_MOCK === 'true' || process.env.NEXT_PUBLIC_USE_MOCK === 'true'

// Mock result image for development (no API credits used)
const MOCK_IMAGE_URL = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=512&h=768&fit=crop'

// Helper to ensure input is a Blob/File for Gradio
const toBlob = async (input) => {
  if (input instanceof File || input instanceof Blob) {
    return input;
  }
  if (typeof input === 'string') {
    const response = await fetch(input);
    return await response.blob();
  }
  throw new Error('Invalid image format');
};

export async function runVirtualTryOn(personImage, garmentImage, category = 'tops') {
  // MOCK MODE — returns fake result instantly, no API credits used
  if (USE_MOCK) {
    console.log('[VTON] Mock mode enabled — no API call made');
    await new Promise(r => setTimeout(r, 3000)); // Simulate loading
    return MOCK_IMAGE_URL;
  }

  try {
    const personBlob = await toBlob(personImage);
    const garmentBlob = await toBlob(garmentImage);

    const hfToken = process.env.REACT_APP_HF_TOKEN || process.env.NEXT_PUBLIC_HF_TOKEN;

    // Connect to the free IDM-VTON HuggingFace space with token
    const client = await Client.connect("yisol/IDM-VTON", { hf_token: hfToken });

    const garmentDes = category === 'tops' 
      ? "Upper body garment" 
      : category === 'bottoms' 
      ? "Lower body garment" 
      : "Full outfit";

    // Call the correct endpoint based on category
    // Using array syntax and index 0 for maximum compatibility
    const result = await client.predict(0, [
      {
        background: personBlob,
        layers: [],
        composite: null
      },
      garmentBlob,
      garmentDes,
      true, // is_checked
      false, // is_checked_crop
      30, // denoise_steps
      42 // seed
    ]);

    if (result && result.data && result.data[0]) {
      // result.data[0] is the main output image
      // In some versions it might be an object with .url, in others just a string/url
      const out = result.data[0];
      return typeof out === 'string' ? out : out.url;
    } else {
      throw new Error('Invalid response from IDM-VTON space');
    }
  } catch (error) {
    console.error('[VTON Error]:', error);
    throw new Error('Failed to generate try-on. The free HuggingFace space might be overloaded. Please try again.');
  }
}
