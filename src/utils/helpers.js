export function formatPrice(price) {
  if (typeof price === 'string') return price;
  return `$${price.toFixed(2)}`;
}

export function calculateDiscount(originalPrice, currentPrice) {
  const original = parseFloat(originalPrice.replace('$', ''));
  const current = parseFloat(currentPrice.replace('$', ''));
  return Math.round(((original - current) / original) * 100);
}

export function getRandomAIMessage() {
  const messages = [
    "Your style radar is off the charts today! 📡",
    "Plot twist: This item found YOU. Destiny much? ✨",
    "Warning: May cause sudden increase in compliments 😎",
    "Your aesthetic twin from Paris just hearted this 💜",
    "I've been stalking this item for you (legally) 🕵️",
    "Your future self will thank me for this find ⏰"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function generateShareText(userProfile) {
  const { personalityType, aesthetics } = userProfile;
  const topAesthetic = Object.entries(aesthetics)
    .sort(([, a], [, b]) => b - a)[0];
  
  return `I'm a ${personalityType} with ${topAesthetic[1]}% ${topAesthetic[0]} vibes! What's your StyleGenie DNA? 🧬✨`;
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}