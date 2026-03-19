// chatbot/enhancedChatbot.js
// This module implements a lightweight client-side helper for calling the /chat endpoint
// and provides a small intent-sniffing layer so the frontend UI can behave better.
export async function sendChatMessage({apiBase, userId, message, imageBase64}){
  const payload = { user_id: userId, message };
  if(imageBase64) payload.image = imageBase64;
  const res = await fetch(apiBase + "/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  return data;
}

// small client-side helper to detect greeting-like messages
export function isGreeting(text){
  if(!text) return false;
  const t = text.toLowerCase();
  return ["hi","hello","hey","good morning","good afternoon","good evening"].some(x=>t.includes(x));
}
