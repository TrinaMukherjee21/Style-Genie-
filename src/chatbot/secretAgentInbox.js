// Secret Agent Inbox system for personalized fashion intelligence
export const secretAgentInbox = {
  generateSecretMessages: async (userProfile) => {
    return [
      {
        id: `secret_${Date.now()}`,
        title: 'Fashion Intelligence Report',
        content: 'Your style profile suggests you love minimalist aesthetics. I found some exclusive pieces that match your vibe perfectly.',
        timestamp: Date.now(),
        read: false,
        products: [
          { id: 's1', title: 'Minimalist Blazer', price: 120, category: 'outerwear' },
          { id: 's2', title: 'Clean Line Dress', price: 89, category: 'dresses' }
        ]
      }
    ];
  },

  generateDailyDrop: async (userProfile) => {
    return {
      id: `daily_${Date.now()}`,
      title: 'Daily Style Drop',
      content: 'Fresh picks curated just for you based on your recent activity.',
      timestamp: Date.now(),
      read: false,
      products: [
        { id: 'd1', title: 'Trending Piece', price: 75, category: 'tops' }
      ]
    };
  }
};