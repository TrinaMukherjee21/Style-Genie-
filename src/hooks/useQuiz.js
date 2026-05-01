import { useCallback, useMemo, useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useUserContext } from '../context/UserContext';
import { getMCQQuizByGender } from '../utils/mcqQuizData';
import { getProductsByGender } from '../utils/enhanced_product_database';
import { generateProfile } from '../utils/profileGenerator';
import { quizAnalyzer } from '../utils/quizAnalyzer';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

export function useQuiz() {
  const {
    quizProgress,
    currentQuizItem,
    quizAnswers,
    quizCompleted, 
    setQuizProgress,
    setCurrentQuizItem,
    addQuizAnswer,
    resetQuiz,
    completeQuiz: markQuizComplete,
    setRecommendations
  } = useAppContext();
  
  const {
    user,
    preferences,
    updateUserProfile,
    submitQuiz
  } = useUserContext();
  
  // Robust gender detection for Quiz
  // Order of priority: 
  // 1. User profile gender (from DB/Context)
  // 2. Preferences state
  // 3. LocalStorage
  // 4. Default to female
  const gender = user?.gender || preferences?.gender || localStorage.getItem('user_gender_preference') || 'unisex';
  
  const QUIZ_ITEMS = useMemo(() => {
    console.log('useQuiz: Recalculating MOU Quiz items for gender:', gender);
    return getMCQQuizByGender(gender);
  }, [gender]);
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const navigate = useNavigate();

  const generateFallbackRecommendations = (profile) => {
    const primaryStyle = profile.primaryAesthetic || 'minimalist';
    const secondaryStyle = profile.secondaryAesthetics?.[0] || 'vintage';
    const personalityType = profile.personalityType || 'Style Enthusiast';
    const userGender = gender || 'unisex';

    // Use enhanced product database for gender-specific recommendations
    const genderProducts = getProductsByGender(userGender);

    // Filter products by aesthetic
    const primaryProducts = genderProducts.filter(product =>
      product.aesthetic === primaryStyle || product.style.includes(primaryStyle)
    );

    const secondaryProducts = genderProducts.filter(product =>
      product.aesthetic === secondaryStyle || product.style.includes(secondaryStyle)
    );

    // Fallback to all products if no matches
    const availableProducts = primaryProducts.length > 0 ? primaryProducts : genderProducts;
    const secondaryAvailable = secondaryProducts.length > 0 ? secondaryProducts : genderProducts;

    // Style-specific product templates with proper images (backup)
    const styleProducts = {
      minimalist: [
        { title: 'Essential Minimalist Tee', category: 'tops', price: '$42', image: 'photo-1521572163474-6864f9cf17ab', description: 'Clean lines meet premium comfort' },
        { title: 'Structured Minimalist Blazer', category: 'outerwear', price: '$128', image: 'photo-1593032465175-481ac7f401a0', description: 'Sharp tailoring with refined elegance' },
        { title: 'Sleek Modern Sneakers', category: 'shoes', price: '$85', image: 'photo-1549298916-b41d501d3772', description: 'Minimalist design with contemporary edge' }
      ],
      vintage: [
        { title: 'Heritage Denim Jacket', category: 'outerwear', price: '$78', image: 'photo-1551028719-00167b16eac5', description: 'Authentic vintage wash with character' },
        { title: 'High-Waisted Vintage Jeans', category: 'bottoms', price: '$65', image: 'photo-1541099649105-f69ad21f3246', description: 'Classic fit with timeless appeal' },
        { title: 'Retro Round Sunglasses', category: 'accessories', price: '$38', image: 'photo-1511499767150-a48a237f0083', description: 'Vintage-inspired frames with golden details' }
      ],
      streetwear: [
        { title: 'Urban Oversized Hoodie', category: 'tops', price: '$72', image: 'photo-1556821840-3a63f95609a7', description: 'Street culture meets premium comfort' },
        { title: 'High-Top Street Sneakers', category: 'shoes', price: '$95', image: 'photo-1542291026-7eec264c27ff', description: 'Classic street style with modern updates' },
        { title: 'Graphic Culture Tee', category: 'tops', price: '$35', image: 'photo-1583743814966-8936f5b7be1a', description: 'Bold graphics with authentic street vibes' }
      ],
      preppy: [
        { title: 'Classic Oxford Shirt', category: 'tops', price: '$58', image: 'photo-1598033129183-c4f50c7176c8', description: 'Timeless button-down for refined elegance' },
        { title: 'Striped Casual Top', category: 'tops', price: '$52', image: 'photo-1434389677669-e08b4cac3105', description: 'Preppy sophistication with modern comfort' },
        { title: 'Designer Handbag', category: 'accessories', price: '$185', image: 'photo-1553062407-98eeb64c6a62', description: 'Luxury craftsmanship meets classic style' }
      ],
      boho: [
        { title: 'Flowing Maxi Dress', category: 'dress', price: '$68', image: 'photo-1469334031218-e382a71b716b', description: 'Free-spirited elegance with artistic flair' },
        { title: 'Layered Boho Jewelry', category: 'accessories', price: '$34', image: 'photo-1606760227091-3dd870d97f1d', description: 'Artisanal pieces for expressive styling' },
        { title: 'Delicate Chain Layers', category: 'accessories', price: '$28', image: 'photo-1611652022419-a9419f74343d', description: 'Bohemian elegance in golden layers' }
      ],
      gothic: [
        { title: 'Platform Statement Boots', category: 'shoes', price: '$125', image: 'photo-1608256246200-53e8b694267f', description: 'Dramatic silhouette with bold presence' },
        { title: 'Combat Leather Boots', category: 'shoes', price: '$98', image: 'photo-1544966503-7cc5ac882d5b', description: 'Rugged elegance meets rebellious spirit' }
      ],
      cyberpunk: [
        { title: 'Tech-Inspired Jacket', category: 'outerwear', price: '$145', image: 'photo-1525450824786-227cbef70703', description: 'Futuristic design with functional innovation' }
      ],
      maximalist: [
        { title: 'Bold Pattern Kimono', category: 'outerwear', price: '$76', image: 'photo-1617137984095-74e4e5e3613f', description: 'Fearless patterns for creative expression' },
        { title: 'Vibrant Print Dress', category: 'dress', price: '$89', image: 'photo-1515372039744-b8f02a3ae446', description: 'Bold colors and fearless patterns' },
        { title: 'Statement Print Top', category: 'tops', price: '$65', image: 'photo-1564557287817-3785e38ec1f5', description: 'Eye-catching prints for confident style' }
      ]
    };

    // Use enhanced products first, fallback to templates
    let selectedProducts = [];

    if (availableProducts.length > 0) {
      // Use real enhanced products
      selectedProducts = [
        ...availableProducts.slice(0, 3),
        ...secondaryAvailable.slice(0, 3)
      ].slice(0, 6);
    } else {
      // Fallback to style templates
      const primaryTemplates = styleProducts[primaryStyle] || styleProducts.minimalist;
      const secondaryTemplates = styleProducts[secondaryStyle] || styleProducts.vintage;

      selectedProducts = [
        ...primaryTemplates.slice(0, 2),
        ...secondaryTemplates.slice(0, 2),
        ...primaryTemplates.slice(2, 3),
        ...secondaryTemplates.slice(2, 3)
      ].slice(0, 6);
    }

    return selectedProducts.map((product, index) => {
      const uniqueId = `personalized_${primaryStyle}_${index}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Handle both enhanced products and template products
      const isEnhancedProduct = product.id && product.image;

      return {
        id: uniqueId,
        title: product.title,
        price: isEnhancedProduct ? `$${product.price}` : product.price,
        image: isEnhancedProduct ? product.image : `https://images.unsplash.com/${product.image}?w=300&h=400&fit=crop&auto=format&q=80`,
        description: product.description,
        aesthetic: isEnhancedProduct ? product.aesthetic : (index < 3 ? primaryStyle : secondaryStyle),
        category: product.category,
        gender: isEnhancedProduct ? product.gender : userGender,
        score: 0.95 - (index * 0.03),
        reasoning: `Perfect match for your ${personalityType} aesthetic preferences`,
        aiMessage: `Hey! I found this ${product.title.toLowerCase()} that's absolutely perfect for your ${primaryStyle} vibe. ${product.description}!`,
        compatibility: `${Math.round((0.95 - (index * 0.03)) * 100)}% match`,
        tags: isEnhancedProduct ? product.tags : [index < 3 ? primaryStyle : secondaryStyle, product.category],
        socialProof: `${Math.floor(Math.random() * 500) + 100} people with similar style love this`,
        inStock: Math.random() > 0.1,
        timestamp: Date.now(),
        source: isEnhancedProduct ? 'enhanced_product_database' : 'enhanced_quiz_fallback',
        personalizedMessage: `This ${product.title.toLowerCase()} was curated specifically for your ${personalityType} style DNA!`
      };
    });
  };

  const completeQuiz = useCallback(async (allAnswers) => {
    console.log('completeQuiz called with answers:', allAnswers);
    try {
      // Use enhanced quiz analyzer with gender
      console.log('=== QUIZ COMPLETION: Analyzing quiz results ===');
      console.log('All quiz answers to analyze:', allAnswers);
      console.log('User gender preference:', preferences?.gender);
      const enhancedProfile = quizAnalyzer.analyzeQuizResults(allAnswers, preferences?.gender);
      console.log('=== ENHANCED PROFILE GENERATED ===', enhancedProfile);
      
      if (!enhancedProfile) {
        console.error('Quiz analyzer returned null/undefined profile');
        throw new Error('Quiz analyzer returned null/undefined profile');
      }
      
      // Validate the enhanced profile has dynamic data
      if (enhancedProfile.personalityType === 'Style Enthusiast' || !enhancedProfile.personalityType) {
        console.warn('Profile seems to have default/fallback data, but proceeding...');
      }
      
      // User is already authenticated, use existing user info
      console.log('Current authenticated user:', user);
      
      // Send comprehensive quiz results to backend for personalized recommendations
      const quizResults = {
        personalityType: enhancedProfile.personalityType,
        confidence: enhancedProfile.confidence,
        preferences: enhancedProfile.preferences,
        primaryAesthetic: enhancedProfile.primaryAesthetic,
        secondaryAesthetics: enhancedProfile.secondaryAesthetics,
        aesthetics: enhancedProfile.aesthetics,
        cloutScore: enhancedProfile.cloutScore,
        tasteProfile: enhancedProfile.tasteProfile,
        gender: gender || 'unspecified'
      };
      
      // Store enhanced profile
      const finalProfile = {
        ...enhancedProfile,
        userId: user._id || user.id
      };
      
      console.log('Quiz completion: Submitting profile:', finalProfile);
      // Use submitQuiz to save to backend and update profile
      await submitQuiz(allAnswers, finalProfile);
      
      // Clear old recommendations first
      setRecommendations([]);
      
      // Mark quiz as completed in context
      markQuizComplete();
      
      console.log('Quiz completion successful, navigating to results...');
      navigate('/quiz/results');
    } catch (error) {
      console.error('Error completing quiz:', error);
      // Fallback to basic profile generation
      const fallbackProfile = generateProfile(allAnswers);
      updateUserProfile(fallbackProfile);
      navigate('/quiz/results');
    }
  }, [updateUserProfile, submitQuiz, setRecommendations, navigate]);

  const handleQuizAnswer = useCallback((optionIndex, itemId) => {
    if (isTransitioning) return;
    
    // Check if we already answered this specific item in this transition
    console.log(`QUIZ: Hook received answer for ${itemId}, index ${optionIndex}`);
    
    const currentItem = QUIZ_ITEMS.find(item => item.id === itemId);
    const selectedOption = currentItem?.options[optionIndex];

    const answer = {
      itemId,
      optionIndex,
      selectedOption,
      preference: 'love',
      liked: true,
      timestamp: Date.now(),
      item: {
        ...currentItem,
        aesthetics: selectedOption?.aesthetics || [],
        tags: selectedOption?.tags || [],
        category: selectedOption?.category || 'mixed'
      }
    };
    
    addQuizAnswer(answer);
    setIsTransitioning(true);

    // Delayed transition
    setTimeout(() => {
      console.log('QUIZ: Executing delayed state transition');
      if (currentQuizItem < QUIZ_ITEMS.length - 1) {
        setCurrentQuizItem(currentQuizItem + 1);
        setQuizProgress(((currentQuizItem + 1) / QUIZ_ITEMS.length) * 100);
      } else {
        completeQuiz([...quizAnswers, answer]);
      }
      setIsTransitioning(false);
    }, 1200);
  }, [currentQuizItem, quizAnswers, addQuizAnswer, setCurrentQuizItem, setQuizProgress, completeQuiz, QUIZ_ITEMS, isTransitioning]);

  const startQuiz = useCallback(() => {
    console.log('startQuiz called - resetting quiz and navigating...');
    resetQuiz();
    // Clear old recommendations when starting a new quiz
    setRecommendations([]);
    // Also clear localStorage to ensure clean state
    localStorage.removeItem('stylegenieQuizState');
    console.log('Navigating to /quiz...');
    navigate('/quiz');
  }, [resetQuiz, setRecommendations, navigate]);

  return {
    quizProgress,
    currentQuizItem,
    quizAnswers,
    quizCompleted,
    currentItem: QUIZ_ITEMS[currentQuizItem],
    totalItems: QUIZ_ITEMS.length,
    handleQuizAnswer,
    startQuiz,
    resetQuiz,
    isQuizComplete: currentQuizItem >= QUIZ_ITEMS.length,
    isTransitioning
  };
}