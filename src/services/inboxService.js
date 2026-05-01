/**
 * Real-time Inbox Service for StyleGenie Dashboard
 * Generates dynamic messages and manages notifications
 */

class InboxService {
  constructor() {
    this.messages = [];
    this.messageId = 1;
    this.listeners = [];
    this.isInitialized = false;
    this.apiBase = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
  }

  async initialize(userProfile) {
    if (this.isInitialized) return;
    
    console.log('InboxService: Initializing Live style alerts for:', userProfile?.personalityType);
    this.userProfile = userProfile;
    
    // Initial fetch to populate welcome messages with real data
    await this.generateInitialMessages();
    this.startPeriodicUpdates();
    this.isInitialized = true;
  }

  async generateInitialMessages() {
    const now = Date.now();
    
    // Fetch live data for "Welcome" and "New Arrivals"
    // Use searchKeywords from profile if available, else fallback
    const discoveryKeywords = this.userProfile?.searchKeywords || 
                             `${this.userProfile?.gender || 'unisex'} fashion trend`;
    
    let liveProducts = [];
    try {
      const response = await fetch(`${this.apiBase}/api/recommendations/live-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userProfile: this.userProfile,
          limit: 10 
        })
      });
      const data = await response.json();
      if (data.success) liveProducts = data.products;
    } catch (e) {
      console.error('InboxService: Live discovery failed, using curated fallbacks', e);
    }

    const messages = [
      this.createMessage(
        "✨ Your Curated Welcome",
        `Welcome to StyleGenie! I've analyzed your ${this.userProfile?.personalityType || 'style'} and found these matches.`,
        now - (120 * 60 * 1000),
        'welcome',
        this.mapLiveToInbox(liveProducts.slice(0, 2))
      ),
      this.createMessage(
        "🔥 Live Trend Alert",
        "Found some trending pieces from online fashion stores that match your aesthetic perfectly.",
        now - (45 * 60 * 1000),
        'new_arrivals',
        this.mapLiveToInbox(liveProducts.slice(3, 5))
      ),
      this.createMessage(
        "💎 Exclusive Just for You",
        "Based on your recent activity, check out these hand-picked discovery items.",
        now - (20 * 60 * 1000),
        'personalized',
        this.mapLiveToInbox(liveProducts.slice(6, 8))
      )
    ];

    this.messages = messages;
    this.notifyListeners();
  }

  mapLiveToInbox(products) {
    if (!products) return [];
    return products.map(p => ({
      id: p.id || Math.random().toString(36).substr(2, 9),
      title: p.name,
      price: p.price ? p.price.replace(/[^0-9.]/g, '') : '89',
      originalPrice: p.price ? (parseFloat(p.price.replace(/[^0-9.]/g, '')) * 1.2).toFixed(0) : '109',
      image: p.image_url
    }));
  }

  createMessage(title, content, timestamp, type, products = []) {
    return {
      id: this.messageId++,
      title,
      content,
      timestamp,
      type,
      products,
      read: false,
      priority: type === 'flash_sale' ? 'high' : 'normal'
    };
  }

  async generateDynamicMessage() {
    const now = Date.now();
    
    // For periodic updates, we'll hit the discovery engine again with random traits
    const trait = this.userProfile?.traits?.[0] || 'fashion';
    const query = `${this.userProfile?.gender || 'unisex'} ${trait} clothes`;
    
    let liveProducts = [];
    try {
      const response = await fetch(`${this.apiBase}/api/products/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          searchTerm: query,
          limit: 2
        })
      });
      const data = await response.json();
      if (data.success) liveProducts = data.products;
    } catch (e) {
      console.error('InboxService: Dynamic update failed');
    }

    const typeMap = [
      { type: 'trend_alert', title: '📈 Trending Now', content: 'These styles are flying off the shelves!' },
      { type: 'personalized', title: '💖 Just for You', content: 'I found some pieces that match your searches.' },
      { type: 'restock', title: '🔄 Back in Stock', content: 'Good news! A previously seen item is available.' }
    ];

    const randomType = typeMap[Math.floor(Math.random() * typeMap.length)];
    const newMessage = this.createMessage(
      randomType.title,
      randomType.content,
      now,
      randomType.type,
      this.mapLiveToInbox(liveProducts)
    );

    this.messages.unshift(newMessage);
    if (this.messages.length > 20) this.messages = this.messages.slice(0, 20);

    this.notifyListeners();
    return newMessage;
  }

  startPeriodicUpdates() {
    // Generate new message every 5-10 minutes (realistically)
    const generateMessage = () => {
      const delay = Math.random() * (10 - 5) + 5; 
      setTimeout(() => {
        this.generateDynamicMessage();
        generateMessage(); 
      }, delay * 60 * 1000);
    };
    generateMessage();
  }

  getMessages() { return [...this.messages].sort((a, b) => b.timestamp - a.timestamp); }
  getUnreadCount() { return this.messages.filter(msg => !msg.read).length; }

  markAsRead(messageId) {
    const message = this.messages.find(msg => msg.id === messageId);
    if (message) { message.read = true; this.notifyListeners(); }
  }

  markAllAsRead() { this.messages.forEach(msg => msg.read = true); this.notifyListeners(); }
  deleteMessage(messageId) { this.messages = this.messages.filter(msg => msg.id !== messageId); this.notifyListeners(); }
  addListener(callback) { this.listeners.push(callback); }
  removeListener(callback) { this.listeners = this.listeners.filter(listener => listener !== callback); }
  notifyListeners() { this.listeners.forEach(callback => callback(this.getMessages(), this.getUnreadCount())); }

  formatTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
}

export const inboxService = new InboxService();