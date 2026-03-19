import { QUIZ_ITEMS } from './realQuizData.js';

export class QuizAnalyzer {
  constructor() {
    this.preferences = {
      style_preferences: {},
      category_preferences: {},
      color_preferences: {},
      price_range: { min: 0, max: 200, preferred: 50 },
      occasion_preferences: {},
      brand_preferences: {}
    };
  }

  analyzeQuizResults(responses, gender = null, quizItemsByGender = null) {
    console.log('QuizAnalyzer: Analyzing quiz results with responses:', responses);
    console.log('QuizAnalyzer: Gender preference:', gender);
    
    // Initialize counters
    const styleScores = {};
    const categoryScores = {};
    const colorScores = {};
    const tagScores = {};

    // Use gender-specific quiz items if provided, or default to QUIZ_ITEMS
    const quizItems = quizItemsByGender || QUIZ_ITEMS;

    // Process each response with enhanced logic
    responses.forEach((response, index) => {
      // Find item from the response or gender-specific quiz items
      let item = response.item; 
      if (!item) {
        item = quizItems.find(i => i.id === response.itemId);
      }
      
      if (!item) {
        console.warn(`QuizAnalyzer: Item not found for ID ${response.itemId}`);
        return;
      }

      const preference = response.preference; // 'love', 'like', 'dislike', 'hate'
      const weight = this.getPreferenceWeight(preference);
      
      // Apply time-based weighting (recent responses matter more)
      const timeWeight = 1 + (index / responses.length) * 0.3;
      const adjustedWeight = weight * timeWeight;

      console.log(`Processing item ${item.id} (${item.type}) with preference ${preference}, weight: ${adjustedWeight}`);

      // Update style preferences with enhanced weighting
      item.aesthetics.forEach(aesthetic => {
        styleScores[aesthetic] = (styleScores[aesthetic] || 0) + adjustedWeight;
      });

      // Update category preferences  
      if (item.category) {
        categoryScores[item.category] = (categoryScores[item.category] || 0) + adjustedWeight;
      }

      // Update color preferences
      if (item.color) {
        colorScores[item.color] = (colorScores[item.color] || 0) + adjustedWeight;
      }

      // Update tag preferences
      if (item.tags) {
        item.tags.forEach(tag => {
          tagScores[tag] = (tagScores[tag] || 0) + adjustedWeight;
        });
      }
    });

    console.log('Style scores before normalization:', styleScores);

    // Ensure we have some style scores
    if (Object.keys(styleScores).length === 0) {
      console.warn('No style scores generated, using default');
      styleScores.minimalist = 1;
      styleScores.vintage = 0.5;
    }

    // Normalize scores to percentages
    const totalResponses = responses.length || 1;
    
    // Normalize and create preferences object
    this.preferences.style_preferences = this.enhancedNormalizeScores(styleScores, totalResponses);
    this.preferences.category_preferences = this.normalizeCategoryScores(categoryScores, totalResponses);
    this.preferences.color_preferences = this.normalizeScores(colorScores, totalResponses);

    console.log('Normalized style preferences:', this.preferences.style_preferences);

    // Determine primary personality type with enhanced logic
    const primaryStyle = this.determinePrimaryStyleEnhanced(styleScores, responses);
    const personalityProfile = this.generatePersonalityProfile(primaryStyle, styleScores);
    
    console.log('Generated personality profile:', personalityProfile);

    // Generate taste profile description
    const tasteProfile = this.generateTasteProfile(primaryStyle, styleScores, gender);

    const result = {
      personalityType: personalityProfile.type,
      tasteProfile: tasteProfile,
      aesthetics: this.preferences.style_preferences,
      preferences: this.preferences,
      cloutScore: this.calculateCloutScore(styleScores),
      styleStreak: this.calculateStyleStreak(styleScores, responses),
      confidence: this.calculateConfidence(responses),
      primaryAesthetic: primaryStyle,
      secondaryAesthetics: this.getSecondaryAesthetics(styleScores, primaryStyle),
      traits: personalityProfile.traits,
      isHybrid: personalityProfile.isHybrid || false,
      gender: gender || 'unspecified'
    };

    console.log('Final quiz analysis result:', result);
    return result;
  }

  getPreferenceWeight(preference) {
    const weights = {
      'love': 2.0,
      'like': 1.0,
      'dislike': -1.0,
      'hate': -2.0
    };
    return weights[preference] || 0;
  }

  normalizeScores(scores, totalResponses) {
    const normalized = {};
    Object.keys(scores).forEach(key => {
      const rawScore = scores[key];
      // Convert to 0-100 percentage, with 50 as neutral
      const percentage = Math.max(0, Math.min(100, 50 + (rawScore / totalResponses) * 25));
      normalized[key] = Math.round(percentage);
    });
    return normalized;
  }

  enhancedNormalizeScores(scores, totalResponses) {
    const normalized = {};
    const scoreValues = Object.values(scores);
    const maxScore = Math.max(...scoreValues);
    const minScore = Math.min(...scoreValues);
    const scoreRange = maxScore - minScore || 1;

    Object.keys(scores).forEach(key => {
      const rawScore = scores[key];
      // Enhanced normalization with better distribution
      let percentage;
      
      if (rawScore > 0) {
        // Positive preferences get 60-95%
        percentage = 60 + ((rawScore - 0) / (maxScore - 0)) * 35;
      } else if (rawScore < 0) {
        // Negative preferences get 5-40%
        percentage = 40 + ((rawScore - minScore) / (0 - minScore)) * 35;
      } else {
        // Neutral gets around 50%
        percentage = 45 + Math.random() * 10;
      }
      
      normalized[key] = Math.round(Math.max(5, Math.min(95, percentage)));
    });

    console.log('Enhanced normalized scores:', normalized);
    return normalized;
  }

  normalizeCategoryScores(categoryScores, totalResponses) {
    const normalized = {};
    const categoryMapping = {
      'garment upper body': ['tops', 'shirts', 'sweaters', 'jackets', 'blazers'],
      'garment lower body': ['trousers', 'jeans', 'shorts', 'skirts'],
      'shoes': ['shoes', 'boots', 'sneakers', 'sandals'],
      'accessories': ['bags', 'jewelry', 'watches', 'sunglasses'],
      'garment full body': ['dresses', 'jumpsuits', 'overalls'],
      'underwear': ['lingerie', 'underwear', 'swimwear'],
      'sportwear': ['activewear', 'athletic', 'sports']
    };

    Object.keys(categoryScores).forEach(category => {
      const rawScore = categoryScores[category];
      const percentage = Math.max(0, Math.min(100, 50 + (rawScore / totalResponses) * 25));
      
      // Map to dataset categories
      if (categoryMapping[category]) {
        categoryMapping[category].forEach(mappedCategory => {
          normalized[mappedCategory.toLowerCase()] = Math.round(percentage);
        });
      } else {
        normalized[category.toLowerCase()] = Math.round(percentage);
      }
    });

    return normalized;
  }

  determinePrimaryStyle(styleScores) {
    let maxScore = -Infinity;
    let primaryStyle = 'minimalist';

    Object.keys(styleScores).forEach(style => {
      if (styleScores[style] > maxScore) {
        maxScore = styleScores[style];
        primaryStyle = style;
      }
    });

    return primaryStyle;
  }

  determinePrimaryStyleEnhanced(styleScores, responses) {
    console.log('Determining primary style from scores:', styleScores);
    
    // Find the style with highest positive score
    const positiveStyles = Object.keys(styleScores)
      .filter(style => styleScores[style] > 0)
      .sort((a, b) => styleScores[b] - styleScores[a]);

    if (positiveStyles.length === 0) {
      console.log('No positive style scores, using minimalist as default');
      return 'minimalist';
    }

    const primaryStyle = positiveStyles[0];
    console.log(`Primary style determined: ${primaryStyle} with score ${styleScores[primaryStyle]}`);
    return primaryStyle;
  }

  getSecondaryAesthetics(styleScores, primaryStyle) {
    return Object.keys(styleScores)
      .filter(style => style !== primaryStyle)
      .sort((a, b) => styleScores[b] - styleScores[a])
      .slice(0, 2);
  }

  generatePersonalityProfile(primaryStyle, styleScores) {
    // Get secondary styles for hybrid personalities
    const sortedStyles = Object.keys(styleScores)
      .sort((a, b) => styleScores[b] - styleScores[a]);
    
    const secondaryStyle = sortedStyles[1];
    const primaryScore = styleScores[primaryStyle] || 0;
    const secondaryScore = styleScores[secondaryStyle] || 0;
    
    // Add timestamp-based randomization for true diversity
    const timeBasedSeed = Date.now() % 1000;
    const styleBasedSeed = Math.abs(primaryScore * 1000) % 100;
    const combinedSeed = (timeBasedSeed + styleBasedSeed) % 100;
    
    // Dynamic personality generation based on style combinations
    const personalityVariations = {
      minimalist: {
        pure: ["Minimalist Maven", "Clean Slate Curator", "Effortless Essentialist"],
        hybrid: {
          preppy: ["Refined Minimalist", "Polished Purist", "Modern Classic"],
          vintage: ["Timeless Minimalist", "Vintage Purist", "Heritage Minimalist"],
          cyberpunk: ["Tech Minimalist", "Digital Purist", "Future Classic"]
        }
      },
      vintage: {
        pure: ["Vintage Virtuoso", "Retro Revival Expert", "Timeless Trendsetter"],
        hybrid: {
          boho: ["Bohemian Vintage Soul", "Free-Spirit Collector", "Artistic Time Traveler"],
          streetwear: ["Urban Vintage Curator", "Street Heritage Hunter", "Retro Street Style"],
          gothic: ["Dark Vintage Romantic", "Gothic Antiquarian", "Victorian Rebel"]
        }
      },
      streetwear: {
        pure: ["Street Style Star", "Urban Fashion Pioneer", "City Culture Creator"],
        hybrid: {
          cyberpunk: ["Tech Street Warrior", "Digital Urban Explorer", "Future Street Legend"],
          vintage: ["Retro Street Scholar", "Heritage Streetwear Collector", "Classic Urban Explorer"],
          gothic: ["Dark Street Artist", "Gothic Urban Rebel", "Shadow Street Style"]
        }
      },
      preppy: {
        pure: ["Preppy Perfectionist", "Classic Elegance Expert", "Traditional Trendsetter"],
        hybrid: {
          minimalist: ["Modern Traditionalist", "Clean Classic", "Refined Purist"],
          vintage: ["Heritage Aristocrat", "Timeless Traditionalist", "Classic Collector"],
          boho: ["Bohemian Prepster", "Free-Spirit Elite", "Artistic Aristocrat"]
        }
      },
      boho: {
        pure: ["Bohemian Spirit", "Free-Spirit Fashion Guru", "Artistic Soul Curator"],
        hybrid: {
          maximalist: ["Maximalist Bohemian", "Bold Spirit Creator", "Expressive Free Soul"],
          vintage: ["Vintage Bohemian", "Retro Free Spirit", "Heritage Artist"],
          minimalist: ["Minimalist Bohemian", "Clean Spirit", "Refined Free Soul"]
        }
      },
      gothic: {
        pure: ["Gothic Guardian", "Dark Aesthetic Master", "Shadow Style Sage"],
        hybrid: {
          vintage: ["Victorian Goth", "Heritage Dark Soul", "Romantic Gothic"],
          cyberpunk: ["Cyber Gothic", "Tech Dark Lord", "Digital Shadow"],
          streetwear: ["Street Goth", "Urban Shadow", "Dark Street Warrior"]
        }
      },
      cyberpunk: {
        pure: ["Tech Trendsetter", "Future Fashion Pioneer", "Digital Style Innovator"],
        hybrid: {
          minimalist: ["Minimal Tech Aesthete", "Clean Future Vision", "Digital Purist"],
          streetwear: ["Cyber Street Legend", "Tech Urban Explorer", "Digital Street Warrior"],
          gothic: ["Dark Tech Visionary", "Gothic Cyber Punk", "Shadow Tech Master"]
        }
      },
      maximalist: {
        pure: ["Maximalist Maverick", "Bold Expression Expert", "Fearless Fashion Creator"],
        hybrid: {
          boho: ["Maximalist Bohemian", "Expressive Free Spirit", "Bold Artistic Soul"],
          vintage: ["Retro Maximalist", "Bold Heritage Collector", "Expressive Time Traveler"],
          streetwear: ["Urban Maximalist", "Street Expression Master", "Bold City Creator"]
        }
      }
    };

    // Determine if it's a hybrid personality (secondary style has significant score)
    const hybridThreshold = 0.5 + (combinedSeed % 20) * 0.01; // Dynamic threshold: 0.5-0.7
    const isHybrid = secondaryScore > primaryScore * hybridThreshold;
    
    if (isHybrid && personalityVariations[primaryStyle]?.hybrid?.[secondaryStyle]) {
      const hybridOptions = personalityVariations[primaryStyle].hybrid[secondaryStyle];
      const randomIndex = combinedSeed % hybridOptions.length;
      return {
        type: hybridOptions[randomIndex],
        traits: this.generateHybridTraits(primaryStyle, secondaryStyle),
        isHybrid: true,
        primaryStyle,
        secondaryStyle,
        uniqueId: `${primaryStyle}_${secondaryStyle}_${combinedSeed}`
      };
    } else {
      const pureOptions = personalityVariations[primaryStyle]?.pure || ["Style Enthusiast"];
      const randomIndex = combinedSeed % pureOptions.length;
      return {
        type: pureOptions[randomIndex],
        traits: this.generatePureTraits(primaryStyle),
        isHybrid: false,
        primaryStyle,
        uniqueId: `${primaryStyle}_pure_${combinedSeed}`
      };
    }
  }

  generatePureTraits(style) {
    const traitOptions = {
      minimalist: ["Clean", "Intentional", "Refined", "Effortless", "Timeless", "Sophisticated"],
      vintage: ["Nostalgic", "Authentic", "Timeless", "Curated", "Romantic", "Classic"],
      streetwear: ["Urban", "Trendy", "Bold", "Creative", "Edgy", "Authentic"],
      preppy: ["Polished", "Classic", "Sophisticated", "Refined", "Traditional", "Elegant"],
      boho: ["Free-spirited", "Artistic", "Individualistic", "Creative", "Earthy", "Expressive"],
      gothic: ["Dramatic", "Alternative", "Expressive", "Bold", "Mysterious", "Artistic"],
      cyberpunk: ["Futuristic", "Innovative", "Edgy", "Tech-savvy", "Progressive", "Bold"],
      maximalist: ["Bold", "Expressive", "Fearless", "Creative", "Vibrant", "Confident"]
    };
    
    const available = traitOptions[style] || ["Stylish", "Creative", "Unique"];
    return this.selectRandomTraits(available, 3);
  }

  generateHybridTraits(primary, secondary) {
    const primaryTraits = this.generatePureTraits(primary);
    const secondaryTraits = this.generatePureTraits(secondary);
    
    // Mix traits from both styles
    const mixed = [...primaryTraits.slice(0, 2), ...secondaryTraits.slice(0, 1)];
    return mixed;
  }

  selectRandomTraits(traits, count) {
    const shuffled = [...traits].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  generateTasteProfile(primaryStyle, styleScores, gender = null) {
    // Get secondary style for hybrid profiles
    const sortedStyles = Object.keys(styleScores)
      .sort((a, b) => styleScores[b] - styleScores[a]);
    const secondaryStyle = sortedStyles[1];
    const isHybrid = styleScores[secondaryStyle] > styleScores[primaryStyle] * 0.6;

    // Generate consistent seed for randomization
    const timeBasedSeed = Date.now() % 1000;
    const styleBasedSeed = Math.abs((styleScores[primaryStyle] || 0) * 100) % 100;
    const genderSeed = gender ? gender.charCodeAt(0) * 10 : 0;
    const combinedSeed = (timeBasedSeed + styleBasedSeed + genderSeed) % 100;

    const profileVariations = {
      minimalist: [
        "You appreciate clean lines, quality basics, and pieces that work seamlessly together. Less is more is your mantra, and you value timeless design over fleeting trends.",
        "Your style philosophy centers around intentional curation and effortless elegance. You invest in fewer, better pieces that speak to your refined aesthetic sensibilities.",
        "Simplicity is your sophistication. You're drawn to architectural silhouettes, neutral palettes, and the kind of understated luxury that whispers rather than shouts."
      ],
      
      vintage: [
        "You're drawn to pieces with history and character. You love the craftsmanship of bygone eras and aren't afraid to mix vintage finds with modern staples.",
        "Your wardrobe is a curated collection of timeless treasures. You appreciate authentic details, quality construction, and the romantic nostalgia of fashion's golden eras.",
        "You see fashion as storytelling, with each vintage piece carrying its own narrative. Your style celebrates the artistry and craftsmanship that modern fast fashion has forgotten."
      ],
      
      streetwear: [
        "Urban culture inspires your style choices. You stay ahead of trends, love statement pieces, and aren't afraid to experiment with bold combinations.",
        "Your style is rooted in authentic street culture and creative self-expression. You mix high and low, vintage and contemporary, creating looks that are uniquely yours.",
        "You view fashion as a form of cultural commentary and personal rebellion. Your wardrobe reflects the energy and creativity of city life, with pieces that make a statement."
      ],
      
      preppy: [
        "You value tradition, quality, and polished looks. Your style is refined and put-together, perfect for both professional and social settings.",
        "Classic elegance defines your approach to fashion. You appreciate heritage brands, timeless silhouettes, and the confidence that comes from always looking appropriately sophisticated.",
        "Your style embodies effortless refinement and understated luxury. You choose pieces that transcend trends, building a wardrobe that's both classic and contemporary."
      ],
      
      boho: [
        "Free-spirited and artistic, you're drawn to flowing fabrics, natural textures, and pieces that tell a story. Your style reflects your creative soul.",
        "Your fashion choices celebrate individual expression and artistic freedom. You layer textures, mix patterns, and choose pieces that feel authentic to your creative spirit.",
        "You're attracted to handcrafted details, organic materials, and the kind of effortless bohemian luxury that speaks to your wanderlust and artistic sensibilities."
      ],
      
      gothic: [
        "You embrace the darker side of fashion with dramatic silhouettes and bold statements. Your style is an extension of your alternative worldview.",
        "Your wardrobe is a canvas for artistic expression and alternative beauty. You appreciate the drama of dark romanticism and the power of fashion as personal manifesto.",
        "You're drawn to architectural silhouettes, rich textures, and the kind of dramatic elegance that transforms everyday dressing into wearable art."
      ],
      
      cyberpunk: [
        "You're fascinated by the intersection of technology and fashion. Futuristic details, metallic accents, and innovative designs catch your eye.",
        "Your style reflects a vision of the future – sleek, innovative, and unapologetically modern. You appreciate cutting-edge design and materials that push fashion boundaries.",
        "You see fashion as technology, choosing pieces with functional innovation and avant-garde aesthetics that blur the line between clothing and wearable tech."
      ],
      
      maximalist: [
        "More is more! You love bold patterns, bright colors, and aren't afraid to mix prints and textures. Your style is as vibrant as your personality.",
        "You approach fashion with fearless creativity and joyful self-expression. Your wardrobe is a celebration of color, pattern, and the power of standing out.",
        "Your style philosophy is about embracing abundance and creative maximalism. You mix high and low, vintage and contemporary, creating looks that are pure artistic expression."
      ]
    };

    // Hybrid profile generation
    if (isHybrid) {
      const hybridProfiles = {
        minimalist_preppy: "Your style blends clean minimalism with classic refinement. You appreciate understated luxury and pieces that work seamlessly from boardroom to brunch.",
        vintage_boho: "You're a romantic at heart, drawn to flowing vintage silhouettes and artisanal details. Your style tells stories of free-spirited adventures and timeless femininity.",
        streetwear_cyberpunk: "Your aesthetic is urban futurism – mixing street culture with cutting-edge innovation. You're drawn to technical fabrics and designs that look toward tomorrow.",
        gothic_vintage: "You embody dark romanticism, mixing Victorian elegance with modern edge. Your style is both haunting and beautiful, classic yet completely contemporary.",
        boho_maximalist: "You're an artistic maximalist who celebrates creative expression through bold patterns, vibrant colors, and fearless mixing of textures and prints."
      };

      const hybridKey = `${primaryStyle}_${secondaryStyle}`;
      if (hybridProfiles[hybridKey]) {
        return hybridProfiles[hybridKey];
      }
    }

    // Select variation based on consistent seed for pure styles
    const variations = profileVariations[primaryStyle] || profileVariations.minimalist;
    const randomIndex = combinedSeed % variations.length;
    return variations[randomIndex];
  }

  calculateCloutScore(styleScores) {
    // Calculate based on confidence in style choices and diversity with better distribution
    const maxScore = Math.max(...Object.values(styleScores));
    const totalStyles = Object.keys(styleScores).length;
    const totalScore = Object.values(styleScores).reduce((sum, score) => sum + Math.abs(score), 0);
    
    // Generate consistent but varied score based on user's unique style profile
    const timeBasedSeed = Date.now() % 1000;
    const styleBasedSeed = Math.abs(maxScore * 100) % 500;
    const diversityFactor = totalStyles * 50;
    
    // Different scoring tiers for more realistic distribution
    const baseScore = (maxScore * 25) + (totalStyles * 20) + (totalScore * 8);
    const profileSeed = (timeBasedSeed + styleBasedSeed + diversityFactor) % 400;
    const confidenceBonus = maxScore > 5 ? 150 : 75;
    
    let score = Math.floor(baseScore + profileSeed + confidenceBonus);
    
    // Create realistic score tiers with better distribution
    if (score > 800) score = 800 + (score - 800) * 0.3; // Premium tier
    else if (score > 600) score = 600 + (score - 600) * 0.7; // High tier  
    else if (score < 300) score = Math.max(200, score * 1.2); // Boost lower scores
    
    return Math.max(180, Math.min(980, Math.round(score)));
  }

  calculateStyleStreak(styleScores, responses) {
    // Calculate streak based on consistency and strong preferences with more variety
    const maxScore = Math.max(...Object.values(styleScores));
    const strongResponses = responses.filter(r => r.preference === 'love' || r.preference === 'hate').length;
    const consistency = maxScore / responses.length;
    
    // Create user-specific streak calculation
    const timeBasedVariation = (Date.now() % 100) / 100; // 0.0-0.99
    const styleBasedVariation = (Math.abs(maxScore * 50) % 30) / 30; // 0.0-0.99
    const engagementBonus = strongResponses * 3;
    
    // Base streak with more intelligent calculation
    const baseStreak = Math.floor(consistency * 15) + engagementBonus;
    const variationFactor = Math.floor((timeBasedVariation + styleBasedVariation) * 30);
    
    // Create realistic streak patterns (most people have streaks 3-28 days)
    let finalStreak = baseStreak + variationFactor;
    
    // Add some special high streaks occasionally
    if (finalStreak > 35 && timeBasedVariation > 0.9) {
      finalStreak = Math.min(99, finalStreak * 1.5);
    }
    
    return Math.max(1, Math.min(99, Math.round(finalStreak)));
  }

  calculateConfidence(responses) {
    // Calculate confidence based on strength of preferences
    let strongPreferences = 0;
    let totalResponses = responses.length;

    responses.forEach(response => {
      if (response.preference === 'love' || response.preference === 'hate') {
        strongPreferences++;
      }
    });

    return Math.max(0.6, Math.min(1.0, strongPreferences / totalResponses));
  }

  // Convert quiz results to format expected by your model
  convertToModelFormat(quizResults) {
    return {
      user_preferences: {
        style_preferences: quizResults.preferences.style_preferences,
        category_preferences: quizResults.preferences.category_preferences,
        color_preferences: quizResults.preferences.color_preferences,
        interaction_patterns: {
          preferred_response_length: 'medium',
          likes_suggestions: true,
          prefers_detailed_descriptions: true,
          conversation_style: 'friendly'
        }
      },
      personality_type: quizResults.personalityType,
      primary_aesthetic: quizResults.primaryAesthetic,
      confidence: quizResults.confidence
    };
  }

  // Generate enhanced query for your model based on preferences
  generateModelQuery(preferences) {
    const topStyles = Object.keys(preferences.style_preferences)
      .sort((a, b) => preferences.style_preferences[b] - preferences.style_preferences[a])
      .slice(0, 2);

    const topCategories = Object.keys(preferences.category_preferences)
      .sort((a, b) => preferences.category_preferences[b] - preferences.category_preferences[a])
      .slice(0, 2);

    const topColors = Object.keys(preferences.color_preferences)
      .sort((a, b) => preferences.color_preferences[b] - preferences.color_preferences[a])
      .slice(0, 2);

    // Create a rich query string for your model
    const queryParts = [
      ...topStyles,
      ...topCategories,
      ...topColors,
      'fashion', 'style', 'clothing'
    ];

    return queryParts.join(' ');
  }
}

export const quizAnalyzer = new QuizAnalyzer();