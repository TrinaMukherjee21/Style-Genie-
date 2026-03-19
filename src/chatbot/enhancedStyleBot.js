// Enhanced StyleBot with Advanced Conversational AI
import { getProductImage } from '../utils/imageUtils';

export class EnhancedStyleBot {
  constructor() {
    this.conversationContext = {
      userPreferences: {},
      recentTopics: [],
      conversationHistory: [],
      userPersonality: 'neutral',
      sessionMemory: new Map()
    };

    this.intentPatterns = {
      search: {
        patterns: ['find', 'show', 'looking for', 'search for', 'get me', 'i want', 'need', 'browse'],
        confidence: 0.9,
        entities: ['category', 'color', 'price', 'occasion', 'style', 'size', 'brand']
      },
      styling_advice: {
        patterns: ['how to', 'what goes with', 'match', 'coordinate', 'style', 'pair with'],
        confidence: 0.85,
        entities: ['item', 'occasion', 'color', 'style']
      },
      recommendation: {
        patterns: ['recommend', 'suggest', 'what should', 'help me choose', 'advice'],
        confidence: 0.8,
        entities: ['occasion', 'style', 'preference', 'budget']
      }
    };

    this.personalityResponses = {
      enthusiastic: {
        greetings: ["OMG, I'm SO excited to help you find amazing pieces! ✨"],
        search: ["I found some absolutely STUNNING pieces for you! 💫"]
      },
      professional: {
        greetings: ["I'm here to provide expert fashion guidance tailored to your needs."],
        search: ["I've selected these professionally curated pieces for you."]
      },
      friendly: {
        greetings: ["Hey there! Ready to find some great fashion pieces together? 😊"],
        search: ["I think you'll really love these pieces I found! 💕"]
      }
    };

    this.products = this.initializeProducts();
  }

  initializeProducts() {
    return {
      female: [
        { id: 'f1', title: 'Silk Slip Dress', price: 128, category: 'dresses', description: 'Elegant slip dress in luxurious silk', color: 'navy', aesthetic: 'minimalist', tags: ['elegant', 'versatile'] },
        { id: 'f2', title: 'Cashmere Knit Sweater', price: 165, category: 'tops', description: 'Ultra-soft cashmere sweater', color: 'beige', aesthetic: 'minimalist', tags: ['cozy', 'luxury'] },
        { id: 'f3', title: 'High-Waisted Jeans', price: 89, category: 'bottoms', description: 'Premium high-waisted denim', color: 'blue', aesthetic: 'casual', tags: ['classic', 'flattering'] },
        { id: 'f4', title: 'Oversized Blazer', price: 195, category: 'outerwear', description: 'Structured oversized blazer', color: 'black', aesthetic: 'classic', tags: ['powerful', 'structured'] }
      ],
      male: [
        { id: 'm1', title: 'Oxford Dress Shirt', price: 75, category: 'tops', description: 'Classic white oxford shirt', color: 'white', aesthetic: 'classic', tags: ['crisp', 'professional'] },
        { id: 'm2', title: 'Slim Fit Chinos', price: 68, category: 'bottoms', description: 'Versatile slim-fit chinos', color: 'khaki', aesthetic: 'classic', tags: ['versatile', 'comfortable'] },
        { id: 'm3', title: 'White Leather Sneakers', price: 135, category: 'shoes', description: 'Premium white leather sneakers', color: 'white', aesthetic: 'minimalist', tags: ['clean', 'modern'] },
        { id: 'm4', title: 'Navy Blazer', price: 225, category: 'outerwear', description: 'Classic navy wool blazer', color: 'navy', aesthetic: 'classic', tags: ['sophisticated', 'versatile'] }
      ]
    };
  }

  async processMessage(message, userProfile = {}) {
    this.updateConversationContext(message, userProfile);
    const analysis = await this.analyzeMessageWithContext(message, userProfile);
    const response = await this.generateContextualResponse(analysis, userProfile);
    
    this.conversationContext.conversationHistory.push({
      message,
      analysis,
      response: response.message,
      timestamp: Date.now()
    });
    
    return response;
  }

  updateConversationContext(message, userProfile) {
    this.extractUserPreferences(message);
    const topics = this.extractTopics(message);
    this.conversationContext.recentTopics = [...topics, ...this.conversationContext.recentTopics].slice(0, 5);
    this.conversationContext.userPersonality = this.detectUserPersonality(message);
  }

  extractUserPreferences(message) {
    const lowerMessage = message.toLowerCase();
    
    const styleKeywords = {
      minimalist: ['clean', 'simple', 'minimal', 'basic'],
      bohemian: ['boho', 'flowy', 'artistic', 'free-spirited'],
      classic: ['timeless', 'traditional', 'elegant', 'sophisticated'],
      trendy: ['fashionable', 'current', 'modern', 'stylish']
    };
    
    for (const [style, keywords] of Object.entries(styleKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        this.conversationContext.userPreferences.preferredStyle = style;
        break;
      }
    }
  }

  extractTopics(message) {
    const topics = [];
    const lowerMessage = message.toLowerCase();
    
    const topicKeywords = {
      work_fashion: ['work', 'office', 'professional', 'business'],
      casual_wear: ['casual', 'weekend', 'everyday', 'comfortable'],
      special_events: ['party', 'date', 'wedding', 'event']
    };
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        topics.push(topic);
      }
    }
    
    return topics;
  }

  detectUserPersonality(message) {
    const lowerMessage = message.toLowerCase();
    
    if (['love', 'amazing', 'awesome', 'excited'].some(word => lowerMessage.includes(word))) {
      return 'enthusiastic';
    }
    
    if (['professional', 'business', 'appropriate'].some(word => lowerMessage.includes(word))) {
      return 'professional';
    }
    
    return 'friendly';
  }

  async analyzeMessageWithContext(message, userProfile) {
    const lowerMessage = message.toLowerCase();
    const intent = this.classifyIntentWithContext(lowerMessage);
    const entities = this.extractEntitiesWithContext(lowerMessage);
    const confidence = this.calculateEnhancedConfidence(intent, entities);
    
    return {
      originalMessage: message,
      intent,
      entities,
      confidence,
      context: this.conversationContext
    };
  }

  classifyIntentWithContext(message) {
    if (['hello', 'hi', 'hey'].some(word => message.includes(word))) {
      return 'greeting';
    }
    
    for (const [intentName, intentData] of Object.entries(this.intentPatterns)) {
      if (intentData.patterns.some(pattern => message.includes(pattern))) {
        return intentName;
      }
    }
    
    return 'general';
  }

  extractEntitiesWithContext(message) {
    const entities = {};
    
    const categoryPatterns = {
      dresses: ['dress', 'gown', 'frock'],
      tops: ['shirt', 'blouse', 'top', 'sweater'],
      bottoms: ['pants', 'jeans', 'skirt', 'trousers'],
      shoes: ['shoes', 'sneakers', 'boots', 'heels'],
      outerwear: ['jacket', 'blazer', 'coat']
    };
    
    for (const [category, patterns] of Object.entries(categoryPatterns)) {
      if (patterns.some(pattern => message.includes(pattern))) {
        entities.category = category;
        break;
      }
    }
    
    const colors = ['black', 'white', 'navy', 'blue', 'red', 'pink'];
    entities.colors = colors.filter(color => message.includes(color));
    
    return entities;
  }

  calculateEnhancedConfidence(intent, entities) {
    let confidence = 0.5;
    
    if (intent !== 'general') confidence += 0.2;
    if (Object.keys(entities).length > 0) confidence += 0.1;
    if (entities.category) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  async generateContextualResponse(analysis, userProfile) {
    const { intent, entities } = analysis;
    const personality = this.conversationContext.userPersonality;
    
    let message = '';
    let products = [];
    let suggestions = [];
    
    switch (intent) {
      case 'search':
        products = this.searchProductsWithContext(entities, userProfile);
        message = this.generateDynamicSearchResponse(products.length, entities, personality);
        suggestions = this.generateContextualSuggestions('search', entities);
        break;
        
      case 'recommendation':
        products = this.getPersonalizedRecommendations(entities, userProfile);
        message = this.generateDynamicRecommendationResponse(products.length, entities, personality);
        suggestions = this.generateContextualSuggestions('recommendation', entities);
        break;
        
      case 'greeting':
        message = this.generatePersonalizedGreeting(userProfile, personality);
        suggestions = this.generateContextualSuggestions('general', entities);
        break;
        
      default:
        message = "I'm here to help with fashion and styling! What would you like to explore? ✨";
        suggestions = this.generateContextualSuggestions('general', entities);
    }
    
    products = products.map(product => ({
      ...product,
      image: getProductImage(product.title, product.category, product.aesthetic || 'minimalist')
    }));
    
    return {
      message,
      products,
      suggestions,
      confidence: analysis.confidence,
      personality
    };
  }

  searchProductsWithContext(entities, userProfile) {
    const gender = userProfile.gender || 'female';
    let products = this.products[gender] || this.products.female;
    
    if (entities.category) {
      products = products.filter(p => p.category === entities.category);
    }
    
    if (entities.colors && entities.colors.length > 0) {
      products = products.filter(p => entities.colors.some(color => p.color.includes(color)));
    }
    
    return products.slice(0, 3);
  }

  getPersonalizedRecommendations(entities, userProfile) {
    const products = this.searchProductsWithContext(entities, userProfile);
    
    if (products.length === 0) {
      const gender = userProfile.gender || 'female';
      const allProducts = this.products[gender] || this.products.female;
      return allProducts.slice(0, 3);
    }
    
    return products;
  }

  generateDynamicSearchResponse(productCount, entities, personality) {
    const personalityResponses = this.personalityResponses[personality]?.search || this.personalityResponses.friendly.search;
    const baseResponse = personalityResponses[0];
    
    if (productCount === 0) {
      return "I couldn't find exactly what you're looking for, but here are some great alternatives!";
    }
    
    return `${baseResponse} I found ${productCount} amazing pieces that match your style!`;
  }

  generateDynamicRecommendationResponse(productCount, entities, personality) {
    const personalityResponses = this.personalityResponses[personality]?.search || this.personalityResponses.friendly.search;
    const baseResponse = personalityResponses[0];
    
    return `${baseResponse} I've curated ${productCount} pieces based on your preferences!`;
  }

  generatePersonalizedGreeting(userProfile, personality) {
    const userName = userProfile.name || userProfile.firstName || 'there';
    const greetings = this.personalityResponses[personality]?.greetings || this.personalityResponses.friendly.greetings;
    
    return `Hello ${userName}! ${greetings[0]}`;
  }

  generateContextualSuggestions(type, entities) {
    const baseSuggestions = {
      search: ['Show different colors', 'Find similar styles', 'See accessories', 'Price range options'],
      recommendation: ['Personal style quiz', 'Trending now', 'Budget-friendly options', 'Premium selections'],
      general: ['Find dresses', 'Casual wear', 'Work outfits', 'Style advice']
    };
    
    return baseSuggestions[type] || baseSuggestions.general;
  }
}

export const enhancedStyleBot = new EnhancedStyleBot();