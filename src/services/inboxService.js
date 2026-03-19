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
  }

  initialize(userProfile) {
    if (this.isInitialized) return;
    
    this.userProfile = userProfile;
    this.generateInitialMessages();
    this.startPeriodicUpdates();
    this.isInitialized = true;
  }

  generateInitialMessages() {
    const now = Date.now();
    const messages = [
      this.createMessage(
        "🎉 Welcome to StyleGenie!",
        "Your personal fashion journey starts here! I've curated some amazing pieces based on your style preferences.",
        now - (2 * 60 * 60 * 1000), // 2 hours ago
        'welcome',
        this.getWelcomeProducts()
      ),
      this.createMessage(
        "✨ New Arrivals Alert!",
        "Fresh styles just dropped that match your aesthetic perfectly. Check out these trending pieces!",
        now - (45 * 60 * 1000), // 45 minutes ago
        'new_arrivals',
        this.getNewArrivalProducts()
      ),
      this.createMessage(
        "💫 Style Inspiration",
        "Based on your recent activity, I found some pieces that would look amazing together!",
        now - (20 * 60 * 1000), // 20 minutes ago
        'inspiration',
        this.getInspiredProducts()
      )
    ];

    this.messages = messages;
    this.notifyListeners();
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

  getWelcomeProducts() {
    return [
      {
        id: 'welcome_1',
        title: 'Elegant Midi Dress',
        price: 89,
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop'
      },
      {
        id: 'welcome_2',
        title: 'Classic Blazer',
        price: 125,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop'
      }
    ];
  }

  getNewArrivalProducts() {
    return [
      {
        id: 'new_1',
        title: 'Trendy Knit Sweater',
        price: 75,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop'
      },
      {
        id: 'new_2',
        title: 'Designer Handbag',
        price: 185,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop'
      }
    ];
  }

  getInspiredProducts() {
    return [
      {
        id: 'inspired_1',
        title: 'Floral Print Dress',
        price: 95,
        image: 'https://images.unsplash.com/photo-1566479179817-c0b2b2b2b2b2?w=300&h=400&fit=crop'
      }
    ];
  }

  generateDynamicMessage() {
    const now = Date.now();
    const messageTypes = [
      {
        type: 'flash_sale',
        title: '🔥 Flash Sale Alert!',
        content: 'Limited time offer on your favorite styles! Up to 50% off selected items.',
        products: this.getSaleProducts()
      },
      {
        type: 'trend_alert',
        title: '📈 Trending Now',
        content: 'These styles are flying off the shelves! Get them before they\'re gone.',
        products: this.getTrendingProducts()
      },
      {
        type: 'personalized',
        title: '💎 Just for You',
        content: 'I found some pieces that match your recent searches perfectly!',
        products: this.getPersonalizedProducts()
      },
      {
        type: 'seasonal',
        title: '🍂 Seasonal Update',
        content: 'New season, new style! Check out these perfect pieces for the current weather.',
        products: this.getSeasonalProducts()
      },
      {
        type: 'restock',
        title: '🔄 Back in Stock',
        content: 'Good news! Items from your wishlist are available again.',
        products: this.getRestockProducts()
      }
    ];

    const randomType = messageTypes[Math.floor(Math.random() * messageTypes.length)];
    const newMessage = this.createMessage(
      randomType.title,
      randomType.content,
      now,
      randomType.type,
      randomType.products
    );

    this.messages.unshift(newMessage);
    
    // Keep only last 20 messages
    if (this.messages.length > 20) {
      this.messages = this.messages.slice(0, 20);
    }

    this.notifyListeners();
    return newMessage;
  }

  getSaleProducts() {
    const saleItems = [
      { id: 'sale_1', title: 'Designer Coat', price: 199, originalPrice: 299, image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=400&fit=crop' },
      { id: 'sale_2', title: 'Silk Blouse', price: 65, originalPrice: 95, image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300&h=400&fit=crop' }
    ];
    return saleItems;
  }

  getTrendingProducts() {
    return [
      { id: 'trend_1', title: 'Oversized Blazer', price: 145, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop' },
      { id: 'trend_2', title: 'Wide-Leg Trousers', price: 89, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop' }
    ];
  }

  getPersonalizedProducts() {
    return [
      { id: 'personal_1', title: 'Cashmere Sweater', price: 165, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop' }
    ];
  }

  getSeasonalProducts() {
    const season = this.getCurrentSeason();
    const seasonalItems = {
      winter: [
        { id: 'winter_1', title: 'Wool Coat', price: 225, image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=400&fit=crop' },
        { id: 'winter_2', title: 'Knee-High Boots', price: 155, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop' }
      ],
      spring: [
        { id: 'spring_1', title: 'Floral Dress', price: 85, image: 'https://images.unsplash.com/photo-1566479179817-c0b2b2b2b2b2?w=300&h=400&fit=crop' }
      ],
      summer: [
        { id: 'summer_1', title: 'Linen Shirt', price: 65, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop' }
      ],
      fall: [
        { id: 'fall_1', title: 'Cardigan', price: 95, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop' }
      ]
    };
    return seasonalItems[season] || seasonalItems.winter;
  }

  getRestockProducts() {
    return [
      { id: 'restock_1', title: 'Popular Jeans', price: 79, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop' }
    ];
  }

  getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  startPeriodicUpdates() {
    // Generate new message every 2-5 minutes
    const generateMessage = () => {
      const delay = Math.random() * (5 - 2) + 2; // 2-5 minutes
      setTimeout(() => {
        this.generateDynamicMessage();
        generateMessage(); // Schedule next message
      }, delay * 60 * 1000);
    };

    generateMessage();
  }

  getMessages() {
    return [...this.messages].sort((a, b) => b.timestamp - a.timestamp);
  }

  getUnreadCount() {
    return this.messages.filter(msg => !msg.read).length;
  }

  markAsRead(messageId) {
    const message = this.messages.find(msg => msg.id === messageId);
    if (message) {
      message.read = true;
      this.notifyListeners();
    }
  }

  markAllAsRead() {
    this.messages.forEach(msg => msg.read = true);
    this.notifyListeners();
  }

  deleteMessage(messageId) {
    this.messages = this.messages.filter(msg => msg.id !== messageId);
    this.notifyListeners();
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.getMessages(), this.getUnreadCount()));
  }

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