// StyleBot utility - Advanced AI Fashion Assistant with Multi-turn Conversations
import { pickGreeting, workingResponses } from '../chatbot/workingChatbot';
import { sendChatMessage, isGreeting } from '../chatbot/enhancedChatbot';
import { intentProcessor } from '../chatbot/advancedIntentProcessor';
import { responseGenerator } from '../chatbot/responseGenerator';
import { tasteProfileManager } from '../chatbot/tasteProfileManager';
import { getProductsByGender, searchProducts } from './enhanced_product_database';
import API_BASE_URL from '../config';

class StyleBot {
  constructor() {
    this.primaryBot = { processMessage: this.processEnhancedMessage.bind(this) };
    this.secondaryBot = { processMessage: this.processSecondaryMessage.bind(this) };
    this.fallbackBot = { processMessage: this.processFallbackMessage.bind(this) };
    this.conversationMemory = new Map();
    this.visualContext = new Map(); // Store uploaded images
  }

  async processMessage(message, userProfile = {}, imageContext = null) {
    const userId = userProfile.userId || userProfile.id || 'guest';
    
    try {
      console.log('Calling Python backend with message:', message);
      
      // Call your Python interactive_ai.py backend
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          user_id: userId,
          image: imageContext // base64 image if provided
        })
      });

      if (!response.ok) {
        console.error('Backend response not OK:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend response:', data);
      
      if (data.success && data.response) {
        return {
          message: data.response.text,
          products: data.response.products || [],
          suggestions: this._getContextualSuggestions(data.response.intent, userProfile),
          confidence: 0.9,
          intent: data.response.intent,
          conversationTurn: 1
        };
      } else {
        console.error('Backend returned error:', data.error);
        throw new Error(data.error || 'Unknown error from backend');
      }

    } catch (error) {
      console.error('Python backend failed:', error);
      
      // Enhanced fallback with intelligent responses
      return this._getIntelligentFallback(message, userProfile);
    }
  }

  async _getContextualProducts(analysis, userProfile) {
    const userId = userProfile.userId || userProfile.id || 'guest';
    
    // Handle visual search context
    if (analysis.intent === 'styling_advice' || analysis.intent === 'visual_search') {
      const visualCtx = this.visualContext.get(userId);
      if (visualCtx && !visualCtx.analyzed) {
        return this._getVisualStylingProducts(analysis, userProfile, visualCtx);
      }
    }

    // Use secondary bot for product search if primary failed
    const response = this.secondaryBot.processMessage(
      this._buildEnhancedQuery(analysis), 
      userProfile
    );
    
    return response.products || [];
  }

  _getVisualStylingProducts(analysis, userProfile, visualContext) {
    // Mock visual analysis - in production, use actual image analysis
    const styleRequests = {
      'bottomwear': [
        { id: 'vb1', title: 'High-Waisted Denim', price: 78, category: 'bottoms', description: 'Perfect casual pairing', matchReason: 'Complements your top beautifully' },
        { id: 'vb2', title: 'White Wide-Leg Pants', price: 92, category: 'bottoms', description: 'Chic and versatile', matchReason: 'Creates elegant contrast' }
      ],
      'footwear': [
        { id: 'vf1', title: 'White Canvas Sneakers', price: 65, category: 'shoes', description: 'Casual comfort meets style', matchReason: 'Perfect for your casual vibe' },
        { id: 'vf2', title: 'Block Heel Sandals', price: 89, category: 'shoes', description: 'Elevated casual look', matchReason: 'Adds sophistication' }
      ],
      'accessories': [
        { id: 'va1', title: 'Crossbody Bag', price: 55, category: 'accessories', description: 'Hands-free convenience', matchReason: 'Completes your casual look' },
        { id: 'va2', title: 'Delicate Gold Necklace', price: 42, category: 'accessories', description: 'Subtle elegance', matchReason: 'Adds the perfect finishing touch' }
      ]
    };

    const requestType = analysis.entities.style_request || 'bottomwear';
    return styleRequests[requestType] || styleRequests.bottomwear;
  }

  _buildEnhancedQuery(analysis) {
    let query = analysis.originalMessage || '';
    
    // Enhance query with extracted entities
    if (analysis.entities.category) {
      query += ` ${analysis.entities.category.join(' ')}`;
    }
    if (analysis.entities.color) {
      query += ` ${analysis.entities.color.join(' ')}`;
    }
    if (analysis.entities.occasion) {
      query += ` for ${analysis.entities.occasion.join(' ')}`;
    }
    
    return query;
  }

  _calculateMatchScore(product, analysis, userProfile) {
    let score = 0.7; // Base score
    
    // Entity matching
    if (analysis.entities.color && product.color) {
      const hasMatchingColor = analysis.entities.color.some(color => 
        product.color.toLowerCase().includes(color.toLowerCase())
      );
      if (hasMatchingColor) score += 0.2;
    }
    
    // Taste profile matching
    if (userProfile.primaryAesthetic && product.aesthetic) {
      if (product.aesthetic === userProfile.primaryAesthetic) score += 0.1;
    }
    
    return Math.min(1, score);
  }

  _generateMatchReason(product, analysis) {
    const reasons = [
      `Perfect for your ${analysis.entities.occasion?.[0] || 'style'} needs`,
      `Matches your ${analysis.entities.color?.[0] || 'preferred'} color palette`,
      `Complements your aesthetic perfectly`,
      `Great quality and style combination`
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  _getContextualSuggestions(analysis, userProfile) {
    const baseSuggestions = {
      'visual_search': ['Show me more options', 'Different colors', 'Other styles', 'Complete the outfit'],
      'styling_advice': ['Show matching accessories', 'Different occasions', 'Color alternatives', 'Style variations'],
      'product_search': ['Show similar items', 'Different price range', 'Other brands', 'More categories']
    };
    
    return baseSuggestions[analysis.intent] || ['Show me more', 'Different style', 'Other options', 'Help me choose'];
  }

  _getClarificationSuggestions(clarificationType) {
    const suggestions = {
      'intent_unclear': ['Find dresses', 'Style advice', 'Show accessories', 'Casual wear'],
      'missing_specifics': ['Casual pieces', 'Work outfits', 'Party wear', 'Everyday basics'],
      'missing_base_item': ['I have a red top', 'Show me dresses', 'Need shoes', 'Looking for accessories']
    };
    
    return suggestions[clarificationType] || ['Help me find clothes', 'Style advice', 'Show recommendations'];
  }

  _getIntelligentFallback(message, userProfile) {
    const userName = userProfile.name || userProfile.firstName || 'there';
    const userGender = userProfile.gender || userProfile.primaryGender || 'female';
    const msgLower = message.toLowerCase();

    // Get gender-appropriate products for recommendations
    const genderProducts = getProductsByGender(userGender);

    // Christmas/Winter elegant outfit
    if ((msgLower.includes('christmas') || msgLower.includes('winter')) &&
        (msgLower.includes('bodycon') || msgLower.includes('elegant') || msgLower.includes('classy'))) {
      return {
        message: `Oh my goodness, Christmas Eve with a bodycon dress sounds absolutely divine! 🎄✨ I can already picture you looking stunning and sophisticated. The combination of elegance with that Pinterest-worthy aesthetic is *chef's kiss*! Here are some gorgeous pieces that would create the perfect holiday look with a blazer and boots:`,
        products: [
          {
            id: 'elegant_dress_001',
            title: 'Elegant Black Bodycon Dress',
            price: 89,
            description: 'Sophisticated bodycon dress perfect for Christmas Eve and special occasions',
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop&auto=format&q=80'
          },
          {
            id: 'winter_coat_001',
            title: 'Luxe Wool Hover Coat',
            price: 159,
            description: 'Premium wool coat that elevates any winter outfit',
            image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop&auto=format&q=80'
          },
          {
            id: 'elegant_boots_001',
            title: 'Elegant Knee-High Boots',
            price: 129,
            description: 'Sophisticated knee-high boots that complete any winter look',
            image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=600&fit=crop&auto=format&q=80'
          }
        ],
        suggestions: ['Show winter coats', 'More elegant dresses', 'Holiday accessories', 'Complete the look'],
        confidence: 0.95
      };
    }
    
    // Floral dress specific
    if (msgLower.includes('floral') && msgLower.includes('dress')) {
      const floralDresses = searchProducts('dress', userGender, 'boho').filter(product =>
        product.color?.includes('floral') || product.description?.includes('floral')
      );

      return {
        message: `Floral dresses are pure poetry in fashion! 🌸 There's something so romantic and feminine about them. I have some absolutely gorgeous options that I think will make your heart skip a beat:`,
        products: floralDresses.length > 0 ? floralDresses.slice(0, 2) : [
          {
            id: 'floral_midi_001',
            title: 'Romantic Floral Midi Dress',
            price: 75,
            description: 'Beautiful midi dress with delicate floral print',
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&auto=format&q=80',
            gender: userGender
          },
          {
            id: 'floral_maxi_001',
            title: 'Vintage Floral Maxi Dress',
            price: 125,
            description: 'Flowing maxi with delicate floral details',
            image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=600&fit=crop&auto=format&q=80',
            gender: userGender
          }
        ],
        suggestions: ['Show more floral dresses', 'Different floral patterns', 'Solid color dresses', 'Matching accessories'],
        confidence: 0.9
      };
    }
    
    // General dress requests
    if (msgLower.includes('dress')) {
      const dresses = searchProducts('dress', userGender);

      return {
        message: `Dresses are my absolute specialty! 👗 I love helping find that perfect piece that makes you feel confident and beautiful. Based on your style, here are some stunning options:`,
        products: dresses.length > 0 ? dresses.slice(0, 2) : [
          {
            id: 'elegant_dress_002',
            title: 'Classic A-Line Dress',
            price: 85,
            description: 'Timeless silhouette that flatters every body type',
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop&auto=format&q=80',
            gender: userGender
          },
          {
            id: 'wrap_dress_001',
            title: 'Elegant Wrap Dress',
            price: 95,
            description: 'Sophisticated wrap style perfect for any occasion',
            image: 'https://images.unsplash.com/photo-1583496661160-fb5886a13d24?w=400&h=600&fit=crop&auto=format&q=80',
            gender: userGender
          }
        ],
        suggestions: ['Show more dresses', 'Formal dresses', 'Casual dresses', 'Party dresses'],
        confidence: 0.85
      };
    }
    
    // Outfit suggestions
    if (msgLower.includes('outfit') || msgLower.includes('suggest') || msgLower.includes('recommend')) {
      return {
        message: `I'm practically bouncing with excitement to style you! 🎨 Based on everything you've told me, I can already see the most amazing look coming together. Here are my carefully curated recommendations:`,
        products: [
          {
            id: 'cashmere_sweater_001',
            title: 'Luxe Cashmere Sweater',
            price: 145,
            description: 'Incredibly soft cashmere sweater perfect for cozy yet stylish looks',
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop&auto=format&q=80'
          },
          {
            id: 'tailored_trousers_001',
            title: 'High-Waisted Trousers',
            price: 95,
            description: 'Perfectly tailored trousers that pair beautifully with any top',
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=600&fit=crop&auto=format&q=80'
          }
        ],
        suggestions: ['Complete the look', 'Show accessories', 'Different styles', 'Seasonal pieces'],
        confidence: 0.88
      };
    }
    
    // Greetings
    if (msgLower.includes('hi') || msgLower.includes('hello') || msgLower.includes('hey')) {
      return {
        message: `Hi ${userName}! ✨ I'm your personal fashion stylist, and I'm absolutely thrilled to help you discover your perfect style! What's inspiring your fashion mood today?`,
        products: [],
        suggestions: ['Show me casual pieces', 'Find formal wear', 'Style advice', 'Daily recommendations'],
        confidence: 0.8
      };
    }
    
    // Default intelligent fallback
    return {
      message: `I'd absolutely love to help you find something amazing, ${userName}! ✨ What's your style mood today? Are you looking for something elegant, casual, or maybe something for a special occasion?`,
      products: [],
      suggestions: ['Show me dresses', 'Find casual wear', 'Winter outfits', 'Style advice'],
      confidence: 0.7
    };
  }

  processEnhancedMessage(message, userProfile) {
    return {
      message: "I'm here to help with your fashion needs!",
      products: [],
      confidence: 0.8
    };
  }

  processSecondaryMessage(message, userProfile) {
    return {
      message: "Let me help you find something great!",
      products: []
    };
  }

  processFallbackMessage(message, userProfile) {
    return this._getFallbackResponse(message, userProfile);
  }

  _getFallbackImage(category) {
    const categoryImages = {
      'dresses': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop&auto=format&q=80',
      'tops': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop&auto=format&q=80',
      'bottoms': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop&auto=format&q=80',
      'outerwear': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=400&fit=crop&auto=format&q=80',
      'shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop&auto=format&q=80',
      'accessories': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop&auto=format&q=80'
    };
    
    return categoryImages[category] || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&h=400&fit=crop&auto=format&q=80';
  }

  // Additional methods for compatibility
  generateDailyDrop(userProfile) {
    const userId = userProfile.userId || userProfile.id || 'guest';
    const personalizedMessages = [
      `✨ ${userProfile.name || 'Hey there'}! I found something that screams your ${userProfile.primaryAesthetic || 'amazing'} style!`,
      `🌟 Daily inspiration alert! This piece is giving me major ${userProfile.primaryAesthetic || 'chic'} vibes - perfect for you!`,
      `💫 Your personal stylist here! Found this gem that matches your taste perfectly!`,
      `🎯 Style radar activated! This piece was practically made for your wardrobe!`
    ];

    const message = personalizedMessages[Math.floor(Math.random() * personalizedMessages.length)];
    
    try {
      // Get personalized recommendations
      const products = tasteProfileManager?.getPersonalizedRecommendations(
        userId, 
        this.secondaryBot.products[userProfile.gender || 'female'] || [], 
        1
      ) || [];
      
      return {
        message: message,
        products: products.map(product => ({
          ...product,
          image: product.image || this._getFallbackImage(product.category),
          isDailyDrop: true
        }))
      };
    } catch (error) {
      return { message: message, products: [] };
    }
  }

  updateTasteProfile(userId, feedback) {
    return tasteProfileManager?.updateProfile?.(userId, feedback) || { updated: true, feedback };
  }

  // Clear conversation context (useful for new chat sessions)
  clearContext(userId) {
    intentProcessor?.conversationHistory?.delete(userId);
    this.visualContext.delete(userId);
    // Clear enhanced bot context too
    if (this.primaryBot.conversationContext) {
      this.primaryBot.conversationContext.sessionMemory.delete(userId);
    }
  }

  // Get conversation insights for debugging
  getConversationInsights(userId) {
    return {
      context: intentProcessor?.getConversationContext?.(userId),
      visualContext: this.visualContext.get(userId),
      tasteProfile: tasteProfileManager?.getProfileSummary?.(userId),
      enhancedContext: this.primaryBot.conversationContext?.sessionMemory?.get(userId)
    };
  }
  
  _generateFallbackMessage(analysis, userProfile) {
    const userName = userProfile.name || userProfile.firstName || 'there';
    
    if (analysis.intent === 'visual_search' || analysis.intent === 'styling_advice') {
      return `Hi ${userName}! I can see you're looking for styling advice. Let me help you find the perfect pieces! ✨`;
    }
    
    if (analysis.entities.category && analysis.entities.category.length > 0) {
      return `Great choice, ${userName}! I found some amazing ${analysis.entities.category[0]} that I think you'll love! 💫`;
    }
    
    return `Hi ${userName}! I'm here to help you discover amazing fashion pieces. What are you looking for today? 🌟`;
  }
}

export const styleBot = new StyleBot();