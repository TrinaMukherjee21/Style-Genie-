// chatbot/workingChatbot.js
// Simple client-side fallback responses and utilities used by the UI.
export const workingResponses = {
  greetings: [
    "Hello! I'm StyleGenie — your personal fashion assistant. How can I help you today?",
    "Hi! Want help finding something or styling an outfit?",
    "Hey there! Tell me what you need — accessories, shoes, or similar items?"
  ],
  fallback: [
    "I didn't understand that. Can you rephrase?",
    "Sorry, could you tell me more about what you're looking for?",
    "If you want help with an image, try uploading a picture and asking \"What goes with this?\""
  ]
};

export function pickGreeting(){
  return workingResponses.greetings[Math.floor(Math.random()*workingResponses.greetings.length)];
}
