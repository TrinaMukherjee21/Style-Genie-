import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useUserContext } from '../context/UserContext';
import RecommendationCard from '../components/dashboard/RecommendationCard';
import InboxMessageCard from '../components/dashboard/InboxMessageCard';
import StatsWidget from '../components/dashboard/StatsWidget';
import ActionPanel from '../components/dashboard/ActionPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { getProductImage } from '../utils/imageUtils';
import { Inbox, RefreshCw, Filter, Star, Archive, Trash2, Sparkles } from 'lucide-react';
import API_BASE_URL from '../config';

const DashboardPage = () => {
  const { recommendations, setRecommendations } = useAppContext();
  const { user, userProfile: rawUserProfile, isAuthenticated } = useUserContext();
  
  // Sanitize userProfile to prevent object rendering errors
  const userProfile = React.useMemo(() => {
    if (!rawUserProfile) return null;
    
    const sanitized = { ...rawUserProfile };
    
    // Remove or convert any objects that might cause rendering issues
    Object.keys(sanitized).forEach(key => {
      const value = sanitized[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Check for the specific problematic object
        if (value.dominant_style || value.style_diversity || value.confidence_level) {
          console.warn(`Removing problematic object from userProfile.${key}:`, Object.keys(value));
          delete sanitized[key];
        }
      }
    });
    
    return sanitized;
  }, [rawUserProfile]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  
  // Inbox state
  const [inboxMessages, setInboxMessages] = useState([]);
  const [originalInboxMessages, setOriginalInboxMessages] = useState([]); // Store unfiltered messages
  const [isLoadingInbox, setIsLoadingInbox] = useState(false);
  const [inboxStats, setInboxStats] = useState({});
  const [activeFilter, setActiveFilter] = useState('all'); // all, unread, starred
  const [currentView, setCurrentView] = useState('inbox'); // inbox, recommendations
  const [processingMessages, setProcessingMessages] = useState(new Set()); // Track messages being processed

  const fetchPersonalizedRecommendations = async () => {
    if (!userProfile) return;
    
    setIsLoadingRecommendations(true);
    setRecommendations([]);
    
    try {
      const gender = user?.preferences?.gender || user?.gender || 'female';
      const userId = user?._id || user?.id || 'anonymous';
      
      // Try enhanced backend first
      const response = await fetch(`${API_BASE_URL}/api/enhanced/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: {
            ...userProfile,
            gender: gender,
            userId: userId
          },
          gender: gender,
          userId: userId
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          setRecommendations(data.products);
          return;
        }
      }
    } catch (error) {
      console.error('Enhanced backend failed:', error);
    }
    
    // Fallback recommendations
    generateFallbackRecommendations();
    setIsLoadingRecommendations(false);
  };

  const fetchInboxMessages = async () => {
    setIsLoadingInbox(true);
    try {
      const userId = user?._id || user?.id || 'anonymous';
      const queryParams = new URLSearchParams({
        userId: userId,
        limit: '20',
        skip: '0'
      });
      
      if (activeFilter === 'unread') {
        queryParams.append('unread', 'true');
      } else if (activeFilter === 'recommendations') {
        queryParams.append('type', 'new_arrival');
      } else if (activeFilter === 'trends') {
        queryParams.append('type', 'trend_alert');
      } else if (activeFilter === 'starred') {
        queryParams.append('starred', 'true');
      } else if (activeFilter === 'daily') {
        queryParams.append('type', 'style_tip');
      } else if (activeFilter === 'challenges') {
        queryParams.append('type', 'limited_offer');
      }
      
      // Try enhanced inbox backend first
      let response;
      try {
        response = await fetch(`${API_BASE_URL}/api/inbox?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } catch (enhancedError) {
        console.log('Enhanced inbox backend not available, trying main backend...');
        response = await fetch(`${API_BASE_URL}/api/inbox?${queryParams}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          }
        });
      }
      
      if (response.ok) {
        const data = await response.json();
        const messages = data.messages || [];
        setOriginalInboxMessages(messages);
        setInboxMessages(messages);
        
        // Use backend stats if available, otherwise calculate
        const calculatedStats = data.stats || {
          total_messages: messages.length,
          unread_messages: messages.filter(msg => !msg.read).length,
          starred_messages: messages.filter(msg => msg.starred).length
        };
        setInboxStats(calculatedStats);
        console.log('Inbox messages loaded:', data);
      } else {
        console.error('Failed to fetch inbox messages:', response.status);
        // Fallback to local messages if backend fails
        if (originalInboxMessages.length === 0) {
          createPersonalizedInboxMessages();
        } else {
          filterLocalMessages();
        }
      }
    } catch (error) {
      console.error('Error fetching inbox:', error);
      // Fallback to local messages if network fails
      if (originalInboxMessages.length === 0) {
        createPersonalizedInboxMessages();
      } else {
        filterLocalMessages();
      }
    } finally {
      setIsLoadingInbox(false);
    }
  };

  const filterLocalMessages = () => {
    // Get all messages first (use stored original messages if filtering)
    const allMessages = originalInboxMessages.length > 0 ? originalInboxMessages : inboxMessages;
    if (!allMessages.length) return;
    
    let filteredMessages = [...allMessages];
    
    switch (activeFilter) {
      case 'unread':
        filteredMessages = allMessages.filter(msg => !msg.read);
        break;
      case 'starred':
        filteredMessages = allMessages.filter(msg => msg.starred);
        break;
      case 'recommendations':
        filteredMessages = allMessages.filter(msg => 
          msg.type === 'recommendation' || msg.message_type === 'recommendation'
        );
        break;
      case 'trends':
        filteredMessages = allMessages.filter(msg => 
          msg.type === 'trend_alert' || msg.message_type === 'trend_alert'
        );
        break;
      case 'daily':
        filteredMessages = allMessages.filter(msg => 
          msg.type === 'daily_update' || msg.message_type === 'daily_update'
        );
        break;
      case 'challenges':
        filteredMessages = allMessages.filter(msg => 
          msg.type === 'style_challenge' || msg.message_type === 'style_challenge'
        );
        break;
      default:
        // 'all' - no filtering needed
        break;
    }
    
    setInboxMessages(filteredMessages);
  };
  
  const generateRecommendationMessages = async () => {
    console.log('Attempting to generate inbox messages...');
    console.log('User profile:', userProfile);
    
    try {
      const userId = user?._id || user?.id || 'anonymous';
      const requestBody = {
        userProfile: {
          ...userProfile,
          name: user?.name || user?.email?.split('@')[0],
          userId: userId
        },
        count: 12
      };
      
      // Try enhanced inbox backend first
      let response;
      try {
        response = await fetch(`${API_BASE_URL}/api/inbox/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
      } catch (enhancedError) {
        console.log('Enhanced inbox backend not available, trying main backend...');
        response = await fetch(`${API_BASE_URL}/api/inbox/generate-recommendations`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
      }
      
      if (response.ok) {
        const data = await response.json();
        console.log('Successfully generated recommendations:', data);
        
        // Update messages and stats immediately
        if (data.messages) {
          setOriginalInboxMessages(data.messages);
          setInboxMessages(data.messages);
        }
        
        if (data.stats) {
          setInboxStats(data.stats);
        }
        
        // Refresh inbox to show new messages
        setTimeout(() => {
          console.log('Refreshing inbox after generation...');
          fetchInboxMessages();
        }, 1000);
      } else {
        console.error('Failed to generate recommendations:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        // Create personalized local messages if backend fails
        createPersonalizedInboxMessages();
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Create personalized local messages
      createPersonalizedInboxMessages();
    }
  };

  const createPersonalizedInboxMessages = () => {
    console.log('🎯 Creating highly personalized inbox messages based on user profile...');
    
    if (!userProfile || !userProfile.personalityType) {
      createBasicFallbackMessages();
      return;
    }

    // Import enhanced inbox system
    import('../utils/enhancedInboxSystem').then(({ enhancedInboxSystem }) => {
      const personalizedMessages = enhancedInboxSystem.generateDynamicMessages({
        ...userProfile,
        name: user?.name || user?.email?.split('@')[0],
        userId: user?._id || user?.id
      }, 15);
      
      setOriginalInboxMessages(personalizedMessages);
      setInboxMessages(personalizedMessages);
      
      // Update stats for local messages
      const localStats = {
        total_messages: personalizedMessages.length,
        unread_messages: personalizedMessages.filter(msg => !msg.read).length,
        starred_messages: personalizedMessages.filter(msg => msg.starred).length
      };
      setInboxStats(localStats);
      
      // Cache these messages with timestamp for daily refresh
      const userId = user?._id || user?.id;
      if (userId) {
        localStorage.setItem(`user_inbox_${userId}`, JSON.stringify(personalizedMessages));
        localStorage.setItem(`user_inbox_date_${userId}`, new Date().toDateString());
      }
      
      console.log('Enhanced personalized messages created:', personalizedMessages);
    }).catch(error => {
      console.error('Error loading enhanced inbox system:', error);
      // Fallback to original system
      const personalizedMessages = generateDailyPersonalizedContent(
        String(userProfile.personalityType || 'Style Enthusiast'),
        String(userProfile.primaryAesthetic || 'minimalist'),
        Array.isArray(userProfile.secondaryAesthetics) ? userProfile.secondaryAesthetics : [],
        typeof userProfile.confidence === 'number' ? userProfile.confidence : 0.85
      );
      
      setOriginalInboxMessages(personalizedMessages);
      setInboxMessages(personalizedMessages);
      
      const localStats = {
        total_messages: personalizedMessages.length,
        unread_messages: personalizedMessages.filter(msg => !msg.read).length,
        starred_messages: personalizedMessages.filter(msg => msg.starred).length
      };
      setInboxStats(localStats);
    });
  };

  const generateDailyPersonalizedContent = (personalityType, primaryAesthetic, secondaryAesthetics, confidence) => {
    const userName = user?.name || user?.email?.split('@')[0] || 'Fashionista';
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
    const currentTime = Date.now();
    
    // Ensure all parameters are safe to use
    const safePersonalityType = String(personalityType || 'Style Enthusiast');
    const safePrimaryAesthetic = String(primaryAesthetic || 'minimalist');
    const safeSecondaryAesthetics = Array.isArray(secondaryAesthetics) ? secondaryAesthetics : [];
    const safeConfidence = typeof confidence === 'number' ? confidence : 0.85;
    const gender = user?.preferences?.gender || user?.gender || 'female';
    
    // Enhanced aesthetic-specific styling advice with more diversity
    const aestheticAdvice = {
      minimalist: {
        tips: [
          'Focus on quality over quantity - invest in timeless pieces with clean lines',
          'Master the art of monochromatic dressing with different textures',
          'Create visual interest through proportions rather than patterns',
          'Build a capsule wardrobe with versatile, high-quality basics'
        ],
        trends: [
          'Oversized silhouettes with structured elements',
          'Sustainable fashion with eco-friendly materials',
          'Architectural details in simple designs',
          'Tonal dressing in sophisticated neutrals'
        ],
        colors: [
          'Embrace the power of neutral tones with one statement color',
          'Experiment with different shades of white and cream',
          'Add depth with charcoal, taupe, and warm greys',
          'Try unexpected pops of forest green or navy'
        ]
      },
      vintage: {
        tips: [
          'Mix eras thoughtfully - pair 70s prints with 90s silhouettes for modern vintage',
          'Invest in authentic vintage pieces as statement items',
          'Learn the silhouettes that defined each decade',
          'Balance vintage pieces with modern accessories'
        ],
        trends: [
          'Y2K revival meets cottagecore for the perfect nostalgic blend',
          '90s minimalism with a contemporary twist',
          'Art Deco inspired jewelry and accessories',
          'Victorian romanticism in modern interpretations'
        ],
        colors: [
          'Rich jewel tones and faded pastels create authentic vintage vibes',
          'Dusty roses and sage greens for romantic vintage',
          'Bold oranges and browns for 70s inspiration',
          'Deep burgundys and forest greens for timeless elegance'
        ]
      },
      streetwear: {
        tips: [
          'Layer textures and proportions - oversized tops with fitted bottoms create perfect street style',
          'Mix high-end pieces with thrift finds for authentic street style',
          'Master the art of sneaker styling with different outfits',
          'Use accessories like caps and bags to complete your look'
        ],
        trends: [
          'Tech-wear influences meeting classic street elements',
          'Sustainable streetwear with upcycled materials',
          'Oversized blazers over graphic tees',
          'Athletic wear integrated into everyday outfits'
        ],
        colors: [
          'Bold graphics with neutral bases let statement pieces shine',
          'Neon accents against black and white foundations',
          'Earth tones for a more mature street aesthetic',
          'Monochromatic color schemes with textural contrast'
        ]
      },
      preppy: {
        tips: [
          'Master the art of polished casual - crisp shirts with relaxed fits',
          'Layer classic pieces in unexpected ways',
          'Invest in quality basics that will last for years',
          'Add personality through tasteful accessories and details'
        ],
        trends: [
          'Academia meets modern prep with structured blazers and soft knits',
          'Sustainable luxury with timeless designs',
          'Relaxed tailoring for contemporary comfort',
          'Tennis-core meets traditional prep aesthetics'
        ],
        colors: [
          'Classic navy and cream with unexpected pops of vibrant colors',
          'Traditional plaids and stripes in fresh color combinations',
          'Soft pastels for spring and summer elegance',
          'Rich autumnal tones for sophisticated warmth'
        ]
      },
      boho: {
        tips: [
          'Layer textures and flowing fabrics - mix delicate jewelry for effortless elegance',
          'Embrace natural fibers and handcrafted details',
          'Create visual interest through pattern mixing',
          'Balance flowing silhouettes with structured elements'
        ],
        trends: [
          'Desert-inspired earth tones with artistic prints',
          'Modern bohemian with minimalist touches',
          'Sustainable fashion with artisan-made pieces',
          'Romantic florals meets contemporary silhouettes'
        ],
        colors: [
          'Warm terracotta and sage green create the perfect boho palette',
          'Sunset inspired oranges and deep purples',
          'Earthy browns and creams for natural elegance',
          'Jewel tones mixed with neutral foundations'
        ]
      },
      cyberpunk: {
        tips: [
          'Embrace futuristic silhouettes with metallic and holographic accents',
          'Mix technical fabrics with avant-garde designs',
          'Layer structured pieces with flowing elements',
          'Use lighting and reflective materials as style statements'
        ],
        trends: [
          'Tech-noir aesthetics with sustainable materials',
          'Holographic accessories meet minimalist silhouettes',
          'Augmented reality inspired patterns and prints',
          'Gender-neutral futuristic fashion'
        ],
        colors: [
          'Electric blues and neon purples against black foundations',
          'Metallic silvers and chrome accents',
          'Iridescent materials that shift with light',
          'High-contrast combinations of bright and dark'
        ]
      },
      gothic: {
        tips: [
          'Master the art of romantic darkness with luxurious fabrics',
          'Balance dramatic silhouettes with delicate details',
          'Use accessories to add gothic elements to everyday wear',
          'Explore different gothic substyles from romantic to industrial'
        ],
        trends: [
          'Dark academia meets gothic romance',
          'Sustainable gothic fashion with vintage influences',
          'Modern goth with architectural elements',
          'Gothic minimalism for subtle dark aesthetics'
        ],
        colors: [
          'Rich blacks with deep jewel tone accents',
          'Burgundy and deep purple for romantic gothic',
          'Metallic accents in silver and gunmetal',
          'Forest green and navy for subtle dark elegance'
        ]
      }
    };

    const currentAdvice = aestheticAdvice[safePrimaryAesthetic.toLowerCase()] || aestheticAdvice.minimalist;
    
    // Function to get random item from array
    const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
    
    // Generate diverse, personalized messages
    const selectedTip = getRandomItem(currentAdvice.tips);
    const selectedTrend = getRandomItem(currentAdvice.trends);
    const selectedColor = getRandomItem(currentAdvice.colors);
    
    // Generate fresh product recommendations
    const freshProducts = generateFreshProductRecommendations(safePrimaryAesthetic, safePersonalityType, currentTime, gender);
    
    const messages = [
      {
        _id: `daily_greeting_${Date.now()}`,
        type: 'daily_update',
        title: `✨ Good ${getTimeOfDay()}, ${userName}!`,
        content: `Your ${safePrimaryAesthetic} style is looking incredible this ${dayOfWeek}`,
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: generatePersonalizedGreeting(userName, safePrimaryAesthetic, safePersonalityType, dayOfWeek, safeConfidence, safeSecondaryAesthetics),
        priority: 'high',
        tags: ['daily', 'greeting', safePrimaryAesthetic.toLowerCase()]
      },
      {
        _id: `personalized_tip_${Date.now()}`,
        type: 'style_tip',
        title: `💡 ${safePersonalityType} Style Tip`,
        content: selectedTip,
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: `As a ${safePersonalityType} with a love for ${safePrimaryAesthetic} style, here's my personalized tip for you: ${selectedTip}. This approach really complements your natural style instincts and will help you create looks that feel authentically YOU!`,
        priority: 'medium',
        tags: ['tip', 'personal', safePrimaryAesthetic.toLowerCase()]
      },
      {
        _id: `trend_alert_${Date.now()}`,
        type: 'trend_alert',
        title: '🔥 Perfect Trend Match',
        content: `${selectedTrend} - Made for your ${safePrimaryAesthetic} style!`,
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: `I'm so excited about this trend because it's literally perfect for you! ${selectedTrend} This trend speaks directly to your ${safePrimaryAesthetic} aesthetic ${safeSecondaryAesthetics.length > 0 ? `with hints of ${safeSecondaryAesthetics[0]}` : ''}, and I know you'll style it in the most amazing way!`,
        priority: 'high',
        tags: ['trend', 'alert', safePrimaryAesthetic.toLowerCase()]
      },
      {
        _id: `color_palette_${Date.now()}`,
        type: 'color_inspiration',
        title: '🎨 Your Personal Color Story',
        content: selectedColor,
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: `Let's talk colors, ${userName}! ${selectedColor} I've noticed this palette works incredibly well with your ${safePersonalityType} personality and ${safePrimaryAesthetic} preferences. These colors will make you feel confident and absolutely radiant!`,
        priority: 'medium',
        tags: ['color', 'palette', safePrimaryAesthetic.toLowerCase()]
      },
      {
        _id: `weekly_challenge_${Date.now()}`,
        type: 'style_challenge',
        title: `🎯 ${dayOfWeek} Style Challenge`,
        content: generateStyleChallenge(safePrimaryAesthetic, safePersonalityType),
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: generateStyleChallengeMessage(safePrimaryAesthetic, safePersonalityType, userName),
        priority: 'medium',
        tags: ['challenge', 'interactive', dayOfWeek.toLowerCase()]
      },
      {
        _id: `seasonal_rec_${Date.now()}`,
        type: 'seasonal_recommendation',
        title: '🌟 Seasonal Style Update',
        content: generateSeasonalRecommendation(safePrimaryAesthetic, safeSecondaryAesthetics),
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: generateSeasonalMessage(userName, safePrimaryAesthetic, safePersonalityType),
        priority: 'normal',
        tags: ['seasonal', 'recommendation', getCurrentSeason().toLowerCase()]
      },
      {
        _id: `mood_based_${Date.now()}`,
        type: 'mood_inspiration',
        title: '💫 Mood-Based Styling',
        content: generateMoodBasedStyling(safePrimaryAesthetic, safePersonalityType),
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: generateMoodMessage(userName, safePrimaryAesthetic, safePersonalityType),
        priority: 'low',
        tags: ['mood', 'inspiration', 'lifestyle']
      }
    ];

    // Add fresh product recommendation messages
    freshProducts.forEach((product, index) => {
      messages.push({
        _id: `fresh_pick_${currentTime}_${index}`,
        type: 'recommendation',
        title: `🔥 Fresh Pick: ${product.title}`,
        content: `New arrival perfect for your ${safePrimaryAesthetic} style`,
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: `${userName}, this just dropped and I immediately thought of you! This ${product.title} embodies everything you love about ${safePrimaryAesthetic} fashion. It's giving major ${safePersonalityType} energy and I know it'll be perfect for your ${Math.round(safeConfidence * 100)}% confidence style!`,
        priority: 'high',
        tags: [safePrimaryAesthetic.toLowerCase(), product.category, 'fresh', 'new_arrival'],
        product_data: product,
        metadata: {
          compatibility_score: product.score,
          aesthetic_match: safePrimaryAesthetic,
          personality_type: safePersonalityType,
          recommendation_reason: product.reasoning,
          is_fresh_pick: true,
          arrival_date: new Date().toISOString()
        }
      });
    });

    // Add trending alerts
    const trendingItems = generateTrendingAlerts(safePrimaryAesthetic, safePersonalityType, currentTime, gender);
    trendingItems.forEach((trend, index) => {
      messages.push({
        _id: `trending_${currentTime}_${index}`,
        type: 'trend_alert',
        title: `📈 Trending Now: ${trend.title}`,
        content: `This is gaining popularity in the ${safePrimaryAesthetic} community`,
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: `Hey ${userName}! The ${safePrimaryAesthetic} community is going crazy for ${trend.title} right now! As a ${safePersonalityType}, you're always ahead of the curve, so I wanted to make sure you see this before it goes completely mainstream. What do you think?`,
        priority: 'high',
        tags: ['trending', safePrimaryAesthetic.toLowerCase(), 'community', 'popular'],
        metadata: {
          trend_score: trend.popularity,
          community_engagement: trend.engagement,
          aesthetic_match: safePrimaryAesthetic,
          trend_category: trend.category
        }
      });
    });

    // Add limited time offers
    const limitedOffers = generateLimitedTimeOffers(safePrimaryAesthetic, safePersonalityType, currentTime, gender);
    limitedOffers.forEach((offer, index) => {
      messages.push({
        _id: `limited_offer_${currentTime}_${index}`,
        type: 'limited_offer',
        title: `⏰ Limited Time: ${offer.title}`,
        content: `Special offer ending soon - perfect for your style`,
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: `${userName}, I spotted this limited-time offer and had to share it with you immediately! This ${offer.title} is exactly what you've been looking for to elevate your ${safePrimaryAesthetic} wardrobe. But hurry - it's only available for ${offer.timeLeft}!`,
        priority: 'urgent',
        tags: ['limited_time', 'offer', safePrimaryAesthetic.toLowerCase(), 'urgent'],
        product_data: offer.product,
        metadata: {
          expires_at: offer.expiresAt,
          discount_percentage: offer.discount,
          original_price: offer.originalPrice,
          sale_price: offer.salePrice,
          time_left: offer.timeLeft
        }
      });
    });

    // Add style inspiration from influencers
    const styleInspo = generateStyleInfluencerContent(safePrimaryAesthetic, safePersonalityType, currentTime);
    styleInspo.forEach((inspo, index) => {
      messages.push({
        _id: `style_inspo_${currentTime}_${index}`,
        type: 'style_inspiration',
        title: `💫 Style Inspo: ${inspo.title}`,
        content: `Trending look that matches your aesthetic perfectly`,
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: `${userName}, I've been following the ${safePrimaryAesthetic} style community and found this amazing inspiration that's so YOU! ${inspo.description} I can totally see you rocking this look with your ${safePersonalityType} confidence!`,
        priority: 'normal',
        tags: ['inspiration', 'influencer', safePrimaryAesthetic.toLowerCase(), 'style'],
        metadata: {
          influencer_name: inspo.influencer,
          engagement_rate: inspo.engagement,
          style_match: inspo.matchScore,
          look_category: inspo.category
        }
      });
    });

    return messages;
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const generateStyleChallenge = (aesthetic, personality) => {
    const challenges = {
      minimalist: [
        'Try adding one unexpected texture to your clean lines today',
        'Experiment with proportions - pair an oversized top with fitted bottoms',
        'Add one statement accessory to your neutral palette'
      ],
      vintage: [
        'Mix two different decades in one outfit today',
        'Try a modern silhouette with vintage-inspired prints',
        'Incorporate one contemporary piece into your vintage look'
      ],
      streetwear: [
        'Layer three different textures in one outfit',
        'Try an unexpected color combination in your street look',
        'Mix athletic wear with refined pieces'
      ],
      preppy: [
        'Add an unexpected edgy element to your polished look',
        'Try a relaxed fit in your typically structured style',
        'Incorporate one bold pattern into your classic palette'
      ],
      boho: [
        'Try structured elements in your flowing aesthetic',
        'Experiment with geometric jewelry alongside your organic pieces',
        'Add one minimalist piece to your textured layers'
      ]
    };
    
    const aestheticChallenges = challenges[aesthetic] || challenges.minimalist;
    return aestheticChallenges[Math.floor(Math.random() * aestheticChallenges.length)];
  };

  const generateStyleChallengeMessage = (aesthetic, personality, userName) => {
    const safeUserName = String(userName || 'Style Explorer');
    const safeAesthetic = String(aesthetic || 'minimalist');
    const safePersonality = String(personality || 'Style Enthusiast');
    return `Hey ${safeUserName}! I have a fun style challenge that's perfect for your ${safePersonality} spirit and ${safeAesthetic} aesthetic. This challenge will push your style boundaries in the most exciting way while staying true to your core aesthetic. I can't wait to see how you interpret this with your unique flair!`;
  };

  const generatePersonalizedGreeting = (userName, primaryAesthetic, personalityType, dayOfWeek, confidence, secondaryAesthetics) => {
    // Ensure all parameters are strings or have safe defaults
    const safeUserName = String(userName || 'Style Explorer');
    const safeAesthetic = String(primaryAesthetic || 'minimalist');
    const safePersonality = String(personalityType || 'Style Enthusiast');
    const safeDayOfWeek = String(dayOfWeek || 'day');
    const safeConfidence = typeof confidence === 'number' ? confidence : 0.85;
    const safeSecondaryAesthetics = Array.isArray(secondaryAesthetics) ? secondaryAesthetics : [];
    
    const greetings = [
      `Hey ${safeUserName}! I've been thinking about your gorgeous ${safeAesthetic} aesthetic, and I have some exciting ideas for you this ${safeDayOfWeek}. Your ${safePersonality} energy pairs beautifully with ${safeAesthetic} pieces!`,
      `Good ${getTimeOfDay()}, ${safeUserName}! Your ${safeAesthetic} style journey continues to inspire me. I've been curating some amazing finds that match your ${Math.round(safeConfidence * 100)}% confidence level!`,
      `Hello gorgeous! Your ${safePersonality} personality shines through your ${safeAesthetic} choices. I've got some fresh inspiration for your ${safeDayOfWeek} that I know you'll love!`,
      `${safeUserName}, you absolute style icon! Your ${safeAesthetic} aesthetic ${safeSecondaryAesthetics.length > 0 ? `with hints of ${safeSecondaryAesthetics[0]}` : ''} is giving me all the inspiration today. Ready for some exciting discoveries?`,
      `Happy ${safeDayOfWeek}, ${safeUserName}! I've been studying your ${safePersonality} style DNA and ${safeAesthetic} preferences, and I have some personalized gems that will elevate your wardrobe game!`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  const generateSeasonalRecommendation = (primaryAesthetic, secondaryAesthetics) => {
    const season = getCurrentSeason();
    const seasonalAdvice = {
      spring: {
        minimalist: "Fresh whites and soft pastels bring minimalist elegance to spring",
        vintage: "Vintage floral prints and light fabrics perfect for spring romance", 
        streetwear: "Layer light hoodies with spring colors for fresh street style",
        preppy: "Pastel blazers and crisp white shirts define spring prep perfection",
        boho: "Flowing fabrics in earth tones welcome spring's natural energy",
        cyberpunk: "Iridescent fabrics catch spring light in futuristic ways",
        gothic: "Deep florals and romantic layers for spring gothic elegance"
      },
      summer: {
        minimalist: "Clean lines in breathable fabrics for effortless summer style",
        vintage: "Retro swimwear and flowing sundresses capture summer nostalgia",
        streetwear: "Lightweight layers and bold graphics for summer streets",
        preppy: "Tennis skirts and polo shirts bring preppy summer vibes",
        boho: "Maxi dresses and statement jewelry for bohemian summer magic",
        cyberpunk: "Metallic swimwear and futuristic sunglasses for cyber summer",
        gothic: "Romantic lace in dark colors for sophisticated summer goth"
      },
      autumn: {
        minimalist: "Rich textures in neutral tones embrace autumn minimalism",
        vintage: "Cozy knits and classic coats define vintage autumn elegance",
        streetwear: "Layered hoodies and earthy tones for autumn street comfort",
        preppy: "Tweed blazers and warm plaids bring preppy autumn sophistication",
        boho: "Warm scarves and textured layers create autumn bohemian magic",
        cyberpunk: "Dark metallics and structured coats for cyber autumn edge",
        gothic: "Luxurious velvets and dramatic silhouettes for gothic autumn"
      },
      winter: {
        minimalist: "Structured coats in timeless colors define winter minimalism",
        vintage: "Classic wool coats and vintage accessories for winter glamour",
        streetwear: "Oversized puffers and urban layers for winter street warmth",
        preppy: "Cashmere scarves and wool coats bring preppy winter luxury",
        boho: "Layered textures and rich fabrics create winter bohemian warmth",
        cyberpunk: "Tech fabrics and avant-garde outerwear for cyber winter",
        gothic: "Dramatic capes and rich fabrics for gothic winter romance"
      }
    };
    
    return seasonalAdvice[season][primaryAesthetic.toLowerCase()] || seasonalAdvice[season].minimalist;
  };

  const generateSeasonalMessage = (userName, primaryAesthetic, personalityType) => {
    const season = getCurrentSeason();
    const safeUserName = String(userName || 'Style Explorer');
    const safeAesthetic = String(primaryAesthetic || 'minimalist');
    const safePersonality = String(personalityType || 'Style Enthusiast');
    return `${safeUserName}, ${season} is calling your name! As a ${safePersonality} with amazing ${safeAesthetic} taste, I've been thinking about how to adapt your signature style for the season. This is the perfect time to experiment while staying true to your aesthetic!`;
  };

  const generateMoodBasedStyling = (primaryAesthetic, personalityType) => {
    const moodStyling = {
      minimalist: "Feeling overwhelmed? Embrace minimalist dressing to create mental clarity through simplified, intentional choices",
      vintage: "Channel your nostalgic mood with vintage pieces that tell stories and connect you to fashion history",
      streetwear: "Express your urban energy through streetwear that reflects your dynamic, trend-conscious personality",
      preppy: "Embrace structured elegance when you want to feel polished and put-together for any situation",
      boho: "Let your free spirit shine through bohemian pieces that reflect your artistic, creative soul",
      cyberpunk: "Channel your futuristic vision through avant-garde pieces that showcase your innovative spirit",
      gothic: "Express your dramatic side through romantic gothic pieces that celebrate your unique aesthetic"
    };
    
    return moodStyling[primaryAesthetic.toLowerCase()] || moodStyling.minimalist;
  };

  const generateMoodMessage = (userName, primaryAesthetic, personalityType) => {
    const safeUserName = String(userName || 'Style Explorer');
    const safeAesthetic = String(primaryAesthetic || 'minimalist');
    const safePersonality = String(personalityType || 'Style Enthusiast');
    return `${safeUserName}, style is so much more than clothes - it's about expressing your inner self! Your ${safePersonality} personality and ${safeAesthetic} aesthetic work beautifully together to reflect your mood and energy. Let's explore how to style according to how you're feeling today!`;
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  };

  // Generate fresh product recommendations
  const generateFreshProductRecommendations = (aesthetic, personality, timestamp, gender = 'female') => {
    const products = {
      female: {
        preppy: [
          { title: "Classic Navy Blazer", category: "blazers", score: 0.95, reasoning: "Perfect for your polished style", price: "$89", image: "https://images.unsplash.com/photo-1548624149-f7b1509e1331?w=400&h=400&fit=crop" },
          { title: "Pleated Tennis Skirt", category: "skirts", score: 0.88, reasoning: "Sporty prep perfection", price: "$65", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop" },
          { title: "Pearl Strand Necklace", category: "jewelry", score: 0.90, reasoning: "Classic elegance for any outfit", price: "$156", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop" }
        ],
        minimalist: [
          { title: "Silk Slip Dress", category: "dresses", score: 0.96, reasoning: "Effortless minimalist elegance", price: "$145", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop" },
          { title: "Geometric Statement Earrings", category: "jewelry", score: 0.87, reasoning: "Subtle yet striking", price: "$42", image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop" }
        ],
        streetwear: [
          { title: "Platform Sneakers", category: "shoes", score: 0.93, reasoning: "Bold street statement", price: "$134", image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=400&h=400&fit=crop" }
        ]
      },
      male: {
        preppy: [
          { title: "Men's Structured Blazer", category: "blazers", score: 0.95, reasoning: "Classic masculine silhouette", price: "$129", image: "https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=400&h=400&fit=crop" },
          { title: "Oxford Cotton Dress Shirt", category: "shirts", score: 0.94, reasoning: "Crisp cotton for business flair", price: "$78", image: "https://images.unsplash.com/photo-1594932224828-b4b059b6f68d?w=400&h=400&fit=crop" }
        ],
        minimalist: [
          { title: "Polished Leather Oxfords", category: "shoes", score: 0.93, reasoning: "Essential formal footwear", price: "$145", image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=400&fit=crop" },
          { title: "Minimalist Gold Watch", category: "accessories", score: 0.89, reasoning: "Understated luxury", price: "$159", image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=400&fit=crop" }
        ],
        streetwear: [
          { title: "Cargo Pants in Olive", category: "pants", score: 0.89, reasoning: "Urban utility meets style", price: "$92", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop" }
        ]
      }
    };

    const genderPool = products[gender] || products.female;
    const aestheticProducts = genderPool[aesthetic.toLowerCase()] || genderPool.minimalist || [];
    return aestheticProducts.slice(0, 3);
  };

  // Generate trending alerts
  const generateTrendingAlerts = (aesthetic, personality, timestamp) => {
    const trends = {
      preppy: [
        { title: "Tennis Core Aesthetic", popularity: 0.92, engagement: "89%", category: "athleisure" },
        { title: "Dark Academia Preppy", popularity: 0.88, engagement: "76%", category: "academic" }
      ],
      minimalist: [
        { title: "Quiet Luxury Movement", popularity: 0.95, engagement: "94%", category: "luxury" },
        { title: "Architectural Fashion", popularity: 0.87, engagement: "82%", category: "structured" }
      ],
      vintage: [
        { title: "Y2K Tech Wear Revival", popularity: 0.91, engagement: "88%", category: "tech" },
        { title: "Cottagecore Vintage", popularity: 0.86, engagement: "79%", category: "rustic" }
      ],
      streetwear: [
        { title: "Gorpcore Street Style", popularity: 0.93, engagement: "91%", category: "outdoor" },
        { title: "Cyber Street Aesthetic", popularity: 0.89, engagement: "85%", category: "futuristic" }
      ]
    };

    return trends[aesthetic.toLowerCase()] || trends.minimalist;
  };

  // Generate limited time offers
  const generateLimitedTimeOffers = (aesthetic, personality, timestamp) => {
    const offers = [
      {
        title: `${aesthetic} Collection Flash Sale`,
        discount: 30,
        originalPrice: 129,
        salePrice: 90,
        timeLeft: "2 days",
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        product: { title: "Curated Style Bundle", category: "collection", image: "bundle-collection.jpg" }
      },
      {
        title: "New Arrival Early Access",
        discount: 20,
        originalPrice: 89,
        salePrice: 71,
        timeLeft: "6 hours",
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        product: { title: "Designer Collaboration Piece", category: "designer", image: "collab-piece.jpg" }
      }
    ];

    return offers.slice(0, 1); // Return 1 limited offer
  };

  // Generate style influencer content
  const generateStyleInfluencerContent = (aesthetic, personality, timestamp) => {
    const influences = {
      preppy: [
        {
          title: "Effortless Preppy Chic",
          description: "This preppy style influencer nailed the perfect balance of polished and relaxed",
          influencer: "@preppyaesthetic",
          engagement: "92%",
          matchScore: 0.94,
          category: "casual_prep"
        }
      ],
      minimalist: [
        {
          title: "Monochrome Minimalism",
          description: "Clean lines and neutral tones create this stunning minimalist look",
          influencer: "@minimalist_style",
          engagement: "87%",
          matchScore: 0.91,
          category: "monochrome"
        }
      ],
      vintage: [
        {
          title: "90s Revival Done Right",
          description: "This vintage enthusiast perfectly captures the 90s spirit with modern touches",
          influencer: "@vintage_vibes",
          engagement: "85%",
          matchScore: 0.89,
          category: "90s_revival"
        }
      ],
      streetwear: [
        {
          title: "Urban Explorer Aesthetic",
          description: "Street style meets functionality in this perfectly executed look",
          influencer: "@streetstyle_nyc",
          engagement: "96%",
          matchScore: 0.93,
          category: "urban_explorer"
        }
      ]
    };

    return influences[aesthetic.toLowerCase()] || influences.minimalist;
  };

  const createBasicFallbackMessages = () => {
    const userName = user?.name || user?.email?.split('@')[0] || 'Style Explorer';
    const currentTime = Date.now();
    
    const fallbackMessages = [
      {
        _id: `fallback_welcome_${currentTime}`,
        type: 'welcome',
        title: `👋 Welcome to StyleGenie, ${userName}!`,
        content: 'Your personal AI stylist is ready to help you discover amazing fashion finds.',
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: `Hey ${userName}! Welcome to StyleGenie! I'm your personal AI fashion assistant, and I'm here to help you discover pieces that match your unique style. Let's find some amazing fashion together!`,
        priority: 'high',
        tags: ['welcome', 'getting_started']
      },
      {
        _id: `style_tip_${currentTime + 1}`,
        type: 'style_tip',
        title: '✨ Daily Style Tip',
        content: 'Start with basics: A well-fitted white tee and good jeans are the foundation of any great wardrobe!',
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: `${userName}, here's a timeless style tip: invest in quality basics first! A perfect white tee and well-fitted jeans can be styled a million different ways. They're the building blocks of effortless style!`,
        priority: 'medium',
        tags: ['tip', 'basics', 'wardrobe']
      },
      {
        _id: `trend_alert_${currentTime + 2}`,
        type: 'trend_alert',
        title: '🔥 What\'s Trending Now',
        content: 'Oversized blazers are having a major moment! Perfect for both casual and professional looks.',
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: `${userName}, oversized blazers are everywhere right now and for good reason! They're incredibly versatile - throw one over a t-shirt for instant polish, or wear it with tailored pants for a power look. It's an investment piece that works for everyone!`,
        priority: 'high',
        tags: ['trend', 'blazers', 'versatile']
      },
      {
        _id: `recommendation_${currentTime + 3}`,
        type: 'recommendation',
        title: '🛍️ Curated Just For You',
        content: 'Check out these versatile pieces perfect for building your signature style!',
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: `${userName}, I've curated some amazing versatile pieces that work for any style! These are perfect for building a wardrobe that truly reflects your personality. Each piece can be styled multiple ways!`,
        priority: 'high',
        tags: ['recommendation', 'curated', 'versatile'],
        product_data: {
          title: 'Essential Style Bundle',
          price: '$89',
          category: 'bundle',
          image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&h=400&fit=crop'
        }
      },
      {
        _id: `quiz_prompt_${currentTime + 4}`,
        type: 'style_challenge',
        title: '🎯 Discover Your Style DNA',
        content: 'Take our Style Quiz to unlock personalized recommendations tailored just for you!',
        read: false,
        starred: false,
        created_at: new Date().toISOString(),
        ai_message: `${userName}, ready to discover your unique style DNA? Our Style Quiz will help me understand your preferences so I can find pieces that are absolutely perfect for you. It's fun, quick, and the results are amazing!`,
        priority: 'high',
        tags: ['quiz', 'personalization', 'style_dna']
      }
    ];
    
    setOriginalInboxMessages(fallbackMessages);
    setInboxMessages(fallbackMessages);
    
    const fallbackStats = {
      total_messages: fallbackMessages.length,
      unread_messages: fallbackMessages.filter(msg => !msg.read).length,
      starred_messages: fallbackMessages.filter(msg => msg.starred).length
    };
    setInboxStats(fallbackStats);
    
    console.log('✨ Created comprehensive fallback messages for user:', userName);
  };
  
  const markMessageRead = async (messageId) => {
    const messageToUpdate = originalInboxMessages.find(msg => msg._id === messageId);
    if (messageToUpdate?.read || processingMessages.has(messageId)) return;
    
    setProcessingMessages(prev => new Set([...prev, messageId]));
    
    // Update state immediately
    setOriginalInboxMessages(prev => 
      prev.map(msg => msg._id === messageId ? { ...msg, read: true } : msg)
    );
    
    setInboxMessages(prev => 
      prev.map(msg => msg._id === messageId ? { ...msg, read: true } : msg)
    );
    
    setInboxStats(prev => ({
      ...prev,
      unread_messages: Math.max(0, prev.unread_messages - 1)
    }));
    
    setProcessingMessages(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };
  
  const starMessage = async (messageId, starred) => {
    const messageToUpdate = originalInboxMessages.find(msg => msg._id === messageId);
    if (messageToUpdate?.starred === starred || processingMessages.has(messageId)) return;
    
    setProcessingMessages(prev => new Set([...prev, messageId]));
    
    // Update state immediately
    setOriginalInboxMessages(prev => 
      prev.map(msg => msg._id === messageId ? { ...msg, starred } : msg)
    );
    
    setInboxMessages(prev => 
      prev.map(msg => msg._id === messageId ? { ...msg, starred } : msg)
    );
    
    setInboxStats(prev => ({
      ...prev,
      starred_messages: starred 
        ? prev.starred_messages + 1 
        : Math.max(0, prev.starred_messages - 1)
    }));
    
    setProcessingMessages(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };

  const generateFallbackRecommendations = () => {
    const gender = user?.preferences?.gender || user?.gender || 'female';
    const aesthetic = userProfile?.primaryAesthetic || 'minimalist';
    const currentTime = Date.now();
    
    const genderProducts = {
      male: [
        { id: 'm1', title: 'Classic White T-Shirt', price: '$29', category: 'tops', aesthetic: 'minimalist', description: 'Essential cotton tee for everyday comfort' },
        { id: 'm2', title: 'Vintage Denim Jacket', price: '$78', category: 'outerwear', aesthetic: 'vintage', description: 'Classic denim with authentic vintage wash' },
        { id: 'm3', title: 'Streetwear Hoodie', price: '$65', category: 'tops', aesthetic: 'streetwear', description: 'Oversized hoodie with urban edge' },
        { id: 'm4', title: 'Tailored Navy Blazer', price: '$129', category: 'outerwear', aesthetic: 'preppy', description: 'Professional blazer for smart occasions' },
        { id: 'm5', title: 'Slim Fit Chinos', price: '$89', category: 'bottoms', aesthetic: 'preppy', description: 'Versatile pants for smart-casual looks' },
        { id: 'm6', title: 'Leather Combat Boots', price: '$145', category: 'shoes', aesthetic: 'gothic', description: 'Heavy-duty boots with attitude' },
        { id: 'm7', title: 'Minimalist Watch', price: '$159', category: 'accessories', aesthetic: 'minimalist', description: 'Clean design timepiece' },
        { id: 'm8', title: 'Cargo Pants', price: '$95', category: 'bottoms', aesthetic: 'streetwear', description: 'Urban utility meets style' }
      ],
      female: [
        { id: 'f1', title: 'Silk Slip Dress', price: '$89', category: 'dresses', aesthetic: 'minimalist', description: 'Elegant silk dress for special occasions' },
        { id: 'f2', title: 'Bohemian Maxi Dress', price: '$78', category: 'dresses', aesthetic: 'boho', description: 'Flowing dress with artistic patterns' },
        { id: 'f3', title: 'Oversized Blazer', price: '$125', category: 'outerwear', aesthetic: 'preppy', description: 'Professional blazer with modern fit' },
        { id: 'f4', title: 'High-Waisted Vintage Jeans', price: '$65', category: 'bottoms', aesthetic: 'vintage', description: 'Flattering high-rise denim' },
        { id: 'f5', title: 'Statement Chandelier Earrings', price: '$45', category: 'accessories', aesthetic: 'boho', description: 'Bold jewelry for artistic expression' },
        { id: 'f6', title: 'Platform Heels', price: '$99', category: 'shoes', aesthetic: 'gothic', description: 'Bold platform heels with edge' },
        { id: 'f7', title: 'Cashmere Knit Sweater', price: '$135', category: 'tops', aesthetic: 'minimalist', description: 'Luxurious knit for cozy elegance' },
        { id: 'f8', title: 'Leather Moto Jacket', price: '$189', category: 'outerwear', aesthetic: 'gothic', description: 'Edgy leather jacket with feminine cut' }
      ]
    };
    
    const allProducts = genderProducts[gender] || genderProducts.female;
    
    // Apply diversity algorithm - ensure different categories
    const usedCategories = new Set();
    const diverseProducts = [];
    
    // First, prioritize user's primary aesthetic
    const primaryProducts = allProducts.filter(p => p.aesthetic === aesthetic);
    const otherProducts = allProducts.filter(p => p.aesthetic !== aesthetic);
    
    // Add products ensuring category diversity
    [...primaryProducts, ...otherProducts].forEach(product => {
      if (diverseProducts.length >= 6) return;
      
      // Prefer new categories, but allow duplicates if needed
      if (!usedCategories.has(product.category) || diverseProducts.length < 3) {
        diverseProducts.push(product);
        usedCategories.add(product.category);
      }
    });
    
    // Ensure we have exactly 6 products
    while (diverseProducts.length < 6 && diverseProducts.length < allProducts.length) {
      const remaining = allProducts.filter(p => !diverseProducts.includes(p));
      if (remaining.length > 0) {
        diverseProducts.push(remaining[0]);
      } else {
        break;
      }
    }
    
    const formattedRecommendations = diverseProducts.map((product, index) => {
      const baseScore = product.aesthetic === aesthetic ? 0.9 : 0.7;
      const randomVariation = (Math.random() * 0.2) - 0.1; // -0.1 to +0.1
      const finalScore = Math.max(0.6, Math.min(0.95, baseScore + randomVariation));
      
      return {
        id: `${gender}_${product.id}_${currentTime}_${index}`,
        title: product.title,
        price: product.price,
        image: getProductImage(product.title, product.category, product.aesthetic),
        description: product.description,
        aesthetic: product.aesthetic,
        category: product.category,
        score: finalScore,
        reasoning: product.aesthetic === aesthetic 
          ? `Perfect match for your ${aesthetic} style preference` 
          : `Great ${product.category} to complement your ${aesthetic} aesthetic`,
        compatibility: `${Math.round(finalScore * 100)}% match`,
        tags: [product.aesthetic, product.category, gender],
        timestamp: currentTime + index // Ensure unique timestamps
      };
    });
    
    console.log(`Generated ${formattedRecommendations.length} diverse recommendations for ${gender} with ${aesthetic} preference`);
    setRecommendations(formattedRecommendations);
  };

  useEffect(() => {
    // Load inbox messages when component mounts or filter changes
    if (isAuthenticated()) {
      if (originalInboxMessages.length > 0) {
        // If we have original messages, just apply filter
        filterLocalMessages();
      } else {
        // Otherwise fetch fresh messages
        fetchInboxMessages();
      }
    } else if (originalInboxMessages.length > 0) {
      // Apply local filtering if we have messages but not authenticated
      filterLocalMessages();
    }
  }, [user, activeFilter]); // Removed originalInboxMessages dependency

  // Calculate stats from messages - only run when messages are initially loaded
  const calculateStats = (messages) => {
    return {
      total_messages: messages.length,
      unread_messages: messages.filter(msg => !msg.read).length,
      starred_messages: messages.filter(msg => msg.starred).length
    };
  };

  useEffect(() => {
    // Comprehensive user data loading when profile is available
    const hasValidProfile = userProfile && (userProfile.aesthetics || userProfile.personalityType);
    
    if (hasValidProfile && isAuthenticated()) {
      console.log('🚀 User profile detected, loading complete dashboard data...');
      loadCompleteUserDashboardData();
    }
  }, [userProfile, isAuthenticated]);

  // Set up periodic content refresh every 30 minutes
  useEffect(() => {
    if (!isAuthenticated() || !userProfile) return;
    
    const refreshInterval = setInterval(() => {
      console.log('🔄 Refreshing inbox content...');
      generateFreshInboxContent();
    }, 30 * 60 * 1000); // 30 minutes
    
    return () => clearInterval(refreshInterval);
  }, [userProfile, isAuthenticated]);

  // Generate fresh content periodically
  const generateFreshInboxContent = async () => {
    if (!userProfile) return;
    
    try {
      console.log('📬 Generating fresh inbox content...');
      
      // Import enhanced inbox system dynamically
      const { enhancedInboxSystem } = await import('../utils/enhancedInboxSystem');
      
      const freshMessages = enhancedInboxSystem.generateFreshContent({
        ...userProfile,
        name: user?.name || user?.email?.split('@')[0],
        userId: user?._id || user?.id
      }, originalInboxMessages);
      
      // Add new messages to existing ones (keep some old, add new)
      const existingMessages = originalInboxMessages.slice(0, 8); // Keep 8 most recent
      const combinedMessages = [...freshMessages, ...existingMessages];
      
      setOriginalInboxMessages(combinedMessages);
      
      // Update stats
      const newStats = calculateStats(combinedMessages);
      setInboxStats(prevStats => ({
        ...prevStats,
        ...newStats
      }));
      
      // Apply current filter
      if (activeFilter === 'all') {
        setInboxMessages(combinedMessages);
      } else {
        applyCurrentFilter(combinedMessages);
      }
      
      console.log('✨ Fresh enhanced content added! Total messages:', combinedMessages.length);
      
    } catch (error) {
      console.error('Error generating fresh content:', error);
      // Fallback to original system
      const personalizedMessages = generateDailyPersonalizedContent(
        String(userProfile.personalityType || 'Style Enthusiast'),
        String(userProfile.primaryAesthetic || 'minimalist'),
        Array.isArray(userProfile.secondaryAesthetics) ? userProfile.secondaryAesthetics : [],
        typeof userProfile.confidence === 'number' ? userProfile.confidence : 0.85
      );
      
      const existingMessages = originalInboxMessages.slice(0, 5);
      const freshMessages = personalizedMessages.slice(0, 10);
      const combinedMessages = [...freshMessages, ...existingMessages];
      
      setOriginalInboxMessages(combinedMessages);
      
      const newStats = calculateStats(combinedMessages);
      setInboxStats(prevStats => ({
        ...prevStats,
        ...newStats
      }));
      
      if (activeFilter === 'all') {
        setInboxMessages(combinedMessages);
      } else {
        applyCurrentFilter(combinedMessages);
      }
    }
  };

  // Helper function to apply current filter
  const applyCurrentFilter = (messages) => {
    let filtered = [...messages];
    switch (activeFilter) {
      case 'unread':
        filtered = messages.filter(msg => !msg.read);
        break;
      case 'starred':
        filtered = messages.filter(msg => msg.starred);
        break;
      case 'recommendations':
        filtered = messages.filter(msg => 
          msg.type === 'recommendation' || msg.message_type === 'recommendation'
        );
        break;
      case 'trends':
        filtered = messages.filter(msg => 
          msg.type === 'trend_alert' || msg.message_type === 'trend_alert'
        );
        break;
      case 'daily':
        filtered = messages.filter(msg => 
          msg.type === 'daily_update' || msg.message_type === 'daily_update'
        );
        break;
      case 'challenges':
        filtered = messages.filter(msg => 
          msg.type === 'style_challenge' || msg.message_type === 'style_challenge'
        );
        break;
      case 'fresh_picks':
        filtered = messages.filter(msg => 
          msg.type === 'recommendation' && msg.metadata?.is_fresh_pick
        );
        break;
      case 'limited_offers':
        filtered = messages.filter(msg => 
          msg.type === 'limited_offer'
        );
        break;
    }
    setInboxMessages(filtered);
  };

  const loadCompleteUserDashboardData = async () => {
    try {
      console.log('📊 Loading complete dashboard data...');
      
      // 1. Load cached recommendations first (fast)
      await loadCachedRecommendations();
      
      // 2. Load inbox messages and auto-generate if empty
      fetchInboxMessages();
      
      // 3. If no cached recommendations, fetch fresh ones
      if (recommendations.length === 0) {
        console.log('🔄 No cached recommendations, fetching fresh...');
        setTimeout(() => fetchPersonalizedRecommendations(), 1000);
      }
      
      // 4. Auto-generate inbox messages - always ensure user has messages
      setTimeout(async () => {
        await ensureUserHasMessages();
      }, 1500);
      
      console.log('✅ Complete dashboard data loading finished');
    } catch (error) {
      console.error('❌ Error in complete dashboard data loading:', error);
    }
  };

  const loadCachedRecommendations = async () => {
    try {
      const userId = user?._id || user?.id;
      if (!userId) return;
      
      const cachedRecs = localStorage.getItem(`user_recommendations_${userId}`);
      const cacheTime = localStorage.getItem(`user_recommendations_time_${userId}`);
      
      if (cachedRecs && cacheTime) {
        const isRecent = (Date.now() - parseInt(cacheTime)) < 24 * 60 * 60 * 1000; // 24 hours
        
        if (isRecent) {
          console.log('✅ Loading cached recommendations for user:', userId);
          const cachedRecommendations = JSON.parse(cachedRecs);
          setRecommendations(cachedRecommendations);
          return true;
        } else {
          console.log('⏰ Cached recommendations expired');
          // Clear expired cache
          localStorage.removeItem(`user_recommendations_${userId}`);
          localStorage.removeItem(`user_recommendations_time_${userId}`);
        }
      }
      return false;
    } catch (error) {
      console.error('❌ Error loading cached recommendations:', error);
      return false;
    }
  };

  const ensureUserHasMessages = async () => {
    console.log('📬 Ensuring user has inbox messages...');
    
    // Check if inbox setup was triggered from login
    const shouldSetupInbox = localStorage.getItem('trigger_inbox_setup');
    
    if (shouldSetupInbox === 'true' || inboxMessages.length === 0) {
      console.log('📧 Generating personalized inbox messages...');
      
      // Clear the trigger
      localStorage.removeItem('trigger_inbox_setup');
      localStorage.removeItem('inbox_setup_user');
      
      // Try backend first, fallback to local generation
      try {
        await generateRecommendationMessages();
      } catch (error) {
        console.log('📧 Backend unavailable, generating local messages...');
        createPersonalizedInboxMessages();
      }
      
      // Refresh after a short delay to show new messages
      setTimeout(() => {
        fetchInboxMessages();
      }, 1000);
    }
  };

  const checkAndGenerateInboxMessages = async () => {
    // Legacy function for compatibility
    await ensureUserHasMessages();
  };

  // Debug logging (removed to prevent spam)

  // Check if user has any profile data (more flexible check)
  const hasBasicProfile = userProfile && (
    userProfile.personalityType || 
    userProfile.primaryAesthetic || 
    userProfile.aesthetics ||
    userProfile.user ||
    userProfile.quizResult
  );
  
  // Debug: Log userProfile to identify object structure
  React.useEffect(() => {
    if (userProfile) {
      console.log('Sanitized UserProfile structure:', Object.keys(userProfile));
    }
  }, [userProfile]);

  // Always show dashboard if user is authenticated
  const shouldShowDashboard = isAuthenticated();
  
  // Auto-generate inbox messages for users without them
  React.useEffect(() => {
    if (shouldShowDashboard && inboxMessages.length === 0 && !isLoadingInbox) {
      console.log('Auto-generating inbox messages for authenticated user');
      createPersonalizedInboxMessages();
    }
  }, [shouldShowDashboard, inboxMessages.length, isLoadingInbox]);

  // Debug removed: console.log('hasBasicProfile:', hasBasicProfile);

  // Show dashboard if user should have access
  if (!shouldShowDashboard) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-24">
        <div className="text-center glass-effect p-12 rounded-3xl border-2 border-purple-500/30 animate-card-hover">
          <h2 className="text-2xl font-bold text-white mb-4 font-heading">Please log in to continue</h2>
          <p className="text-gray-300 font-body">You need to be logged in to access your dashboard.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="mt-4 btn-primary px-6 py-3 rounded-xl transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header with Navigation Tabs */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 font-heading text-brand-gold ">
                StyleGenie <span className="text-brand-pink italic">Dashboard</span>
              </h2>
              <p className="text-brand-sage font-bold uppercase tracking-[0.3em] text-[10px] opacity-60">Your personalized style narrative and insights</p>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={generateFreshInboxContent}
                disabled={isLoadingInbox}
                className="bg-brand-dark text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3 shadow-xl hover:bg-brand-pink hover:-translate-y-1"
              >
                <Sparkles className="w-4 h-4 text-brand-pink" />
                Fresh Picks
              </button>
              
              <button
                onClick={fetchInboxMessages}
                disabled={isLoadingInbox}
                className="bg-white text-brand-sage border border-brand-gray px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3 shadow-sm hover:bg-brand-dark hover:text-white"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2 bg-brand-cream/50 p-2 rounded-2xl border border-brand-gray max-w-md">
            <button
              onClick={() => setCurrentView('inbox')}
              className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3 ${
                currentView === 'inbox'
                  ? 'bg-brand-dark text-white shadow-xl translate-y-[-2px]'
                  : 'text-brand-sage hover:text-brand-dark hover:bg-white'
              }`}
            >
              <Inbox className="w-4 h-4" />
              Inbox
              {inboxStats.unread_messages > 0 && (
                <span className="bg-brand-pink text-white text-[9px] px-2 py-0.5 rounded-full">
                  {inboxStats.unread_messages}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentView('recommendations')}
              className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3 ${
                currentView === 'recommendations'
                  ? 'bg-brand-dark text-white shadow-xl translate-y-[-2px]'
                  : 'text-brand-sage hover:text-brand-dark hover:bg-white'
              }`}
            >
              <Star className="w-4 h-4" />
              Picks
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentView === 'inbox' ? (
              <>
                {/* Inbox Filters */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {['all', 'unread', 'starred'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 capitalize ${
                          activeFilter === filter
                            ? 'bg-gradient-to-r from-[#c0a0e6]/20 border border-[#c0a0e6]/20 to-[#c0a0e6]/5 text-white'
                            : 'bg-brand-dark text-gray-300 hover:text-white hover:bg-brand-dark/80'
                        }`}
                      >
                        {filter === 'all' && '📧 All Messages'}
                        {filter === 'unread' && `🔥 Unread (${inboxStats.unread_messages || 0})`}
                        {filter === 'starred' && `⭐ Starred (${inboxStats.starred_messages || 0})`}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {['recommendations', 'trends', 'daily', 'challenges', 'fresh_picks', 'limited_offers'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                          activeFilter === filter
                            ? 'bg-brand-pink text-white shadow-lg'
                            : 'bg-brand-cream/50 text-brand-sage hover:bg-brand-gray'
                        }`}
                      >
                        {filter === 'recommendations' && 'Product Finds'}
                        {filter === 'trends' && 'Trend Alerts'}
                        {filter === 'daily' && 'Daily Updates'}
                        {filter === 'challenges' && 'Style Challenges'}
                        {filter === 'fresh_picks' && 'Fresh Picks'}
                        {filter === 'limited_offers' && 'Limited Offers'}
                      </button>
                    ))}
                  </div>
                  
                  {/* Bulk Actions */}
                  {originalInboxMessages.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={async () => {
                          const unreadMessages = originalInboxMessages.filter(msg => !msg.read);
                          if (unreadMessages.length === 0) return;
                          
                          console.log('📚 Bulk marking all messages as read');
                          
                          // Update all messages at once to prevent multiple state updates
                          setOriginalInboxMessages(prevMessages => 
                            prevMessages.map(msg => 
                              msg.read ? msg : { ...msg, read: true }
                            )
                          );
                          
                          // Update filtered messages immediately
                          if (activeFilter === 'all') {
                            setInboxMessages(prevMessages => 
                              prevMessages.map(msg => 
                                msg.read ? msg : { ...msg, read: true }
                              )
                            );
                          } else {
                            // Apply filter after bulk update
                            const bulkUpdatedMessages = originalInboxMessages.map(msg => 
                              msg.read ? msg : { ...msg, read: true }
                            );
                            let filteredMessages = [...bulkUpdatedMessages];
                            switch (activeFilter) {
                              case 'unread':
                                filteredMessages = bulkUpdatedMessages.filter(msg => !msg.read);
                                break;
                              case 'starred':
                                filteredMessages = bulkUpdatedMessages.filter(msg => msg.starred);
                                break;
                            }
                            setInboxMessages(filteredMessages);
                          }
                          
                          // Make individual server calls but don't update state again
                          unreadMessages.forEach(async (msg) => {
                            try {
                              await fetch(`http://127.0.0.1:5000/api/inbox/${msg._id}/read`, {
                                method: 'POST',
                                headers: {
                                  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                                  'Content-Type': 'application/json',
                                }
                              });
                            } catch (error) {
                              console.error('Error in bulk read:', error);
                            }
                          });
                        }}
                        disabled={!originalInboxMessages.some(msg => !msg.read)}
                        className="px-3 py-1.5 text-xs bg-blue-600/20 text-blue-300 rounded-md hover:bg-blue-600/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Mark All Read
                      </button>
                      <span className="text-xs text-gray-500 self-center">
                        {activeFilter === 'all' ? originalInboxMessages.length : inboxMessages.length} messages
                        {activeFilter === 'all' && originalInboxMessages.filter(msg => !msg.read).length > 0 && 
                          ` • ${originalInboxMessages.filter(msg => !msg.read).length} unread`
                        }
                        {activeFilter === 'starred' && originalInboxMessages.filter(msg => msg.starred).length > 0 &&
                          ` • ${originalInboxMessages.filter(msg => msg.starred).length} starred`
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* Inbox Messages */}
                <div className="space-y-4 overflow-x-hidden px-1">
                  {isLoadingInbox ? (
                    <div className="text-center py-12">
                      <LoadingSpinner size="lg" color="purple" />
                      <p className="text-gray-200 text-lg font-body mt-4">Loading your inbox...</p>
                    </div>
                  ) : inboxMessages.length > 0 ? (
                    inboxMessages.map((message) => (
                      <InboxMessageCard
                        key={message._id}
                        message={message}
                        onMarkRead={markMessageRead}
                        onStar={starMessage}
                      />
                    ))
                  ) : (
                    <div className="text-center py-12 card-premium rounded-xl border-2 border-purple-500/30">
                      <Inbox className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-200 text-lg font-body mb-2">Your inbox is empty!</p>
                      
                      {!hasBasicProfile ? (
                        <>
                          <p className="text-gray-400 text-sm mb-6">
                            Complete the Style Quiz to unlock personalized recommendations from your AI stylist!
                          </p>
                          <button
                            onClick={() => window.location.href = '/quiz'}
                            className="w-full bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 hover:from-[#d4af37]/20 border border-[#d4af37]/20 hover:to-[#d4af37]/5 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-purple-500/20 transform hover:scale-105"
                          >
                            🎯 Take Style Quiz First
                          </button>
                        </>
                      ) : (
                        <p className="text-gray-400 text-sm">
                          {isAuthenticated() 
                            ? "Your personalized messages will appear here automatically. Try refreshing if you don't see any messages yet."
                            : "Please log in to receive personalized style recommendations."
                          }
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Legacy Recommendations View */
              <div className="space-y-6 overflow-x-hidden px-1">
                {isLoadingRecommendations ? (
                  <div className="text-center py-12">
                    <LoadingSpinner size="lg" color="purple" />
                    <p className="text-gray-200 text-lg font-body mt-4">Analyzing your style DNA...</p>
                    <p className="text-gray-400 text-sm mt-2 font-body">Finding products that match your {String(userProfile?.personalityType || 'unique')} aesthetic</p>
                  </div>
                ) : (
                  <>
                    {recommendations.map((item) => (
                      <RecommendationCard key={item.id} recommendation={item} />
                    ))}
                    
                    {recommendations.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-gray-200 text-lg font-body">No recommendations yet!</p>
                        <p className="text-gray-400 text-sm mt-2 font-body">Switch to Inbox to see your personalized messages.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-8">
            {/* Inbox Stats */}
            <div className="bg-brand-dark rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 blur-3xl rounded-full transition-all duration-1000 group-hover:scale-150"></div>
              <h3 className="text-xl font-serif font-bold text-white mb-8 flex items-center gap-4 relative z-10">
                <Inbox className="w-6 h-6 text-brand-pink" />
                Archive Stats
              </h3>
              <div className="space-y-5 relative z-10">
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Volume</span>
                  <span className="text-white font-bold">{inboxStats.total_messages || 0}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Unread Insights</span>
                  <span className="text-brand-pink font-bold">{inboxStats.unread_messages || 0}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Starred Gems</span>
                  <span className="text-brand-pink font-bold">{inboxStats.starred_messages || 0}</span>
                </div>
              </div>
            </div>
            
            <StatsWidget />
            <ActionPanel />
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
};

export default DashboardPage;