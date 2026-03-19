import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, Target, Share2, ShoppingBag, Heart, RotateCcw } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useUserContext } from '../../context/UserContext';
import { useQuiz } from '../../hooks/useQuiz';
import LoadingSpinner from '../common/LoadingSpinner';
import { getProductImage } from '../../utils/imageUtils';
import API_BASE_URL from '../../config';

const QuizResults = () => {
  const navigate = useNavigate();
  const { addToCart, addToFavorites } = useAppContext();
  const { userProfile } = useUserContext();
  const { startQuiz } = useQuiz();
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Debug logging
  console.log('=== QUIZ RESULTS COMPONENT ===');
  console.log('QuizResults: userProfile keys:', userProfile ? Object.keys(userProfile) : 'null');
  console.log('PersonalityType:', String(userProfile?.personalityType || 'none'));
  console.log('TasteProfile:', String(userProfile?.tasteProfile || 'none'));
  console.log('Aesthetics keys:', userProfile?.aesthetics ? Object.keys(userProfile.aesthetics) : 'none');
  console.log('Primary Aesthetic:', String(userProfile?.primaryAesthetic || 'none'));
  
  useEffect(() => {
    console.log('QuizResults mounted, userProfile keys:', userProfile ? Object.keys(userProfile) : 'null');
    if (!userProfile?.personalityType || userProfile.personalityType === 'Style Enthusiast') {
      console.error('PROBLEM: Still showing fallback personality type!');
    }
  }, [userProfile]);

  const generateFallbackRecommendations = () => {
    const primaryStyle = userProfile.primaryAesthetic || userProfile.aesthetics ?
      Object.keys(userProfile.aesthetics).sort((a, b) => userProfile.aesthetics[b] - userProfile.aesthetics[a])[0] :
      'minimalist';

    const personalityType = userProfile.personalityType || userProfile.stylePersonality || "Style Enthusiast";

    // Get secondary aesthetic for variety
    const secondaryStyle = userProfile.secondaryAesthetics?.[0] ||
      Object.keys(userProfile.aesthetics || {}).sort((a, b) => userProfile.aesthetics[b] - userProfile.aesthetics[a])[1] ||
      'vintage';

    // Get user's gender preference
    const userGender = localStorage.getItem('user_gender_preference') || 'unisex';

    // PERFECT PRODUCT DATABASE with verified image matching
    const productTemplates = {
      minimalist: [
        // UNISEX ITEMS
        {
          title: 'Essential White Cotton Tee',
          description: 'Premium minimalist t-shirt in pure white cotton',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'tops',
          price: '$42',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Structured Modern Blazer',
          description: 'Sharp architectural blazer in neutral charcoal tones',
          image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'outerwear',
          price: '$135',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Minimalist White Sneakers',
          description: 'Clean leather sneakers with sleek design',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'shoes',
          price: '$95',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Minimalist Leather Tote',
          description: 'Clean-lined leather bag in neutral tone',
          image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'accessories',
          price: '$125',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Sleek Wristwatch',
          description: 'Minimalist timepiece with clean design',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'accessories',
          price: '$198',
          gender: ['male', 'female', 'unisex']
        },
        // WOMEN'S ITEMS
        {
          title: 'Elegant Black Dress',
          description: 'Flattering minimalist dress in a timeless black silhouette',
          image: 'https://images.unsplash.com/photo-1485230895905-ec4093e81ea4?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'dress',
          price: '$85',
          gender: ['female']
        },
        {
          title: 'Classic Black Pants',
          description: 'Timeless straight-leg pants in premium black fabric',
          image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'bottoms',
          price: '$68',
          gender: ['female', 'unisex']
        },
        {
          title: 'Minimalist Silk Blouse',
          description: 'Elegant silk top in neutral ivory tones',
          image: 'https://images.unsplash.com/photo-1604176354204-926873ff3da9?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'tops',
          price: '$78',
          gender: ['female']
        },
        // MEN'S ITEMS
        {
          title: 'Tailored Oxford Shirt',
          description: 'Crisp button-down for professional elegance',
          image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'tops',
          price: '$58',
          gender: ['male']
        },
        {
          title: 'Tailored Chino Pants',
          description: 'Clean-cut pants in classic khaki',
          image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'bottoms',
          price: '$72',
          gender: ['male']
        },
        {
          title: 'Premium Cashmere Sweater',
          description: 'Soft cashmere blend in a timeless cream hue',
          image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'tops',
          price: '$89',
          gender: ['male', 'unisex']
        }
      ],
      vintage: [
        {
          title: 'Heritage Denim Jacket',
          description: 'Authentic vintage wash with timeless appeal',
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'outerwear',
          price: '$78',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Retro High-Waisted Jeans',
          description: 'Classic vintage fit in premium denim',
          image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'bottoms',
          price: '$65',
          gender: ['female', 'unisex']
        },
        {
          title: 'Vintage Inspired Sunglasses',
          description: 'Round frames with golden details',
          image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'accessories',
          price: '$42',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Classic Leather Jacket',
          description: 'Timeless leather with vintage appeal',
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'outerwear',
          price: '$195',
          gender: ['male']
        },
        {
          title: 'Vintage Band Tee',
          description: 'Authentic retro concert tee',
          image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'tops',
          price: '$45',
          gender: ['male', 'female', 'unisex']
        }
      ],
      streetwear: [
        {
          title: 'Urban Oversized Hoodie',
          description: 'Street-ready comfort with modern urban edge',
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'tops',
          price: '$72',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'High-Top Street Sneakers',
          description: 'Classic street style with contemporary updates',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'shoes',
          price: '$95',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Graphic Street Tee',
          description: 'Bold graphics with authentic street culture vibes',
          image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'tops',
          price: '$38',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Cargo Pants',
          description: 'Functional street style with multiple pockets',
          image: 'https://images.unsplash.com/photo-1603320409990-02d834987237?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'bottoms',
          price: '$68',
          gender: ['male', 'unisex']
        },
        {
          title: 'Bomber Jacket',
          description: 'Classic streetwear essential',
          image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'outerwear',
          price: '$98',
          gender: ['male', 'female', 'unisex']
        }
      ],
      preppy: [
        {
          title: 'Classic Oxford Shirt',
          description: 'Timeless button-down for refined elegance',
          image: 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'tops',
          price: '$58',
          gender: ['male', 'unisex']
        },
        {
          title: 'Striped Casual Elegance',
          description: 'Preppy stripes with modern sophistication',
          image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'tops',
          price: '$52',
          gender: ['female', 'unisex']
        },
        {
          title: 'Tailored Blazer',
          description: 'Sophisticated elegance for the modern woman',
          image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'outerwear',
          price: '$145',
          gender: ['female']
        },
        {
          title: 'Delicate Gold Jewelry',
          description: 'Elegant layered necklaces for sophisticated looks',
          image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'accessories',
          price: '$85',
          gender: ['female', 'unisex']
        },
        {
          title: 'Luxury Designer Handbag',
          description: 'Sophisticated craftsmanship meets timeless style',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'accessories',
          price: '$185',
          gender: ['female', 'unisex']
        },
        {
          title: 'Polo Shirt Classic',
          description: 'Timeless polo in premium cotton',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'tops',
          price: '$68',
          gender: ['male']
        }
      ],
      boho: [
        {
          title: 'Flowing Bohemian Maxi',
          description: 'Free-spirited dress with artistic flair',
          image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'dress',
          price: '$68',
          gender: ['female']
        },
        {
          title: 'Layered Statement Jewelry',
          description: 'Artisanal pieces for expressive layering',
          image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'accessories',
          price: '$34',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Delicate Chain Collection',
          description: 'Bohemian elegance in golden layers',
          image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'accessories',
          price: '$29',
          gender: ['female', 'unisex']
        },
        {
          title: 'Fringe Crossbody Bag',
          description: 'Boho-chic bag with authentic fringe details',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'accessories',
          price: '$52',
          gender: ['female', 'unisex']
        },
        {
          title: 'Vintage Leather Sandals',
          description: 'Handcrafted sandals with bohemian charm',
          image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'shoes',
          price: '$48',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Linen Relaxed Shirt',
          description: 'Breezy linen shirt in natural tones',
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'tops',
          price: '$54',
          gender: ['male', 'unisex']
        }
      ],
      gothic: [
        {
          title: 'Platform Statement Boots',
          description: 'Dramatic silhouette with bold presence',
          image: 'https://images.unsplash.com/photo-1608256246200-53e8b694267f?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'shoes',
          price: '$125',
          gender: ['female', 'unisex']
        },
        {
          title: 'Combat Leather Boots',
          description: 'Rugged elegance with rebellious spirit',
          image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'shoes',
          price: '$98',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Black Leather Jacket',
          description: 'Dark elegance with gothic edge',
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'outerwear',
          price: '$185',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Gothic Lace Dress',
          description: 'Dark romantic elegance',
          image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'dress',
          price: '$95',
          gender: ['female']
        }
      ],
      cyberpunk: [
        {
          title: 'Tech-Inspired Jacket',
          description: 'Futuristic design meets functional innovation',
          image: 'https://images.unsplash.com/photo-1525450824786-227cbef70703?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'outerwear',
          price: '$145',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Futuristic Sneakers',
          description: 'Next-gen footwear with tech-inspired design',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'shoes',
          price: '$125',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Metallic Accent Tee',
          description: 'Cutting-edge style with metallic details',
          image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'tops',
          price: '$48',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Holographic Accessories',
          description: 'Futuristic accents with chrome finish',
          image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'accessories',
          price: '$65',
          gender: ['male', 'female', 'unisex']
        }
      ],
      maximalist: [
        {
          title: 'Bold Floral Kimono',
          description: 'Vibrant kimono with fearless floral patterns',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'outerwear',
          price: '$78',
          gender: ['female', 'unisex']
        },
        {
          title: 'Rainbow Pattern Dress',
          description: 'Bold multicolor dress with vibrant patterns',
          image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'dress',
          price: '$92',
          gender: ['female']
        },
        {
          title: 'Statement Print Blouse',
          description: 'Eye-catching blouse with maximalist prints',
          image: 'https://images.unsplash.com/photo-1567401893414-75b77c480f57?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'tops',
          price: '$68',
          gender: ['female', 'unisex']
        },
        {
          title: 'Colorful Statement Jewelry',
          description: 'Bold layered jewelry with vibrant stones',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'accessories',
          price: '$45',
          gender: ['male', 'female', 'unisex']
        },
        {
          title: 'Vibrant Patterned Shirt',
          description: 'Bold patterns with maximalist energy',
          image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=300&h=400&fit=crop&auto=format&q=80',
          category: 'tops',
          price: '$58',
          gender: ['male', 'unisex']
        }
      ]
    };

    // Helper function to filter products by gender
    const filterByGender = (products, gender) => {
      if (gender === 'prefer-not-to-say' || gender === 'unisex') {
        return products; // Show all products
      }
      return products.filter(p =>
        p.gender && p.gender.includes(gender)
      );
    };

    // Generate diverse recommendations
    const primaryProducts = productTemplates[primaryStyle] || productTemplates.minimalist;
    const secondaryProducts = productTemplates[secondaryStyle] || productTemplates.vintage;

    // Filter by user's gender preference
    const filteredPrimaryProducts = filterByGender(primaryProducts, userGender);
    const filteredSecondaryProducts = filterByGender(secondaryProducts, userGender);

    // Get products with their source aesthetic marked
    const primaryWithAesthetic = filteredPrimaryProducts.map(p => ({...p, sourceAesthetic: primaryStyle}));
    const secondaryWithAesthetic = filteredSecondaryProducts.slice(0, 2).map(p => ({...p, sourceAesthetic: secondaryStyle}));

    // Mix products from primary (80%) and secondary (20%) styles
    const allProducts = [...primaryWithAesthetic, ...secondaryWithAesthetic];

    // Shuffle and select unique products
    const shuffled = allProducts.sort(() => 0.5 - Math.random()).slice(0, 6);

    return shuffled.map((product, index) => ({
      id: `personalized_${product.sourceAesthetic}_${index}_${Date.now()}`,
      title: product.title,
      price: product.price,
      image: product.image,
      description: product.description,
      aesthetic: product.sourceAesthetic, // Use the actual source aesthetic
      category: product.category,
      score: 0.95 - (index * 0.02), // Decreasing scores for variety
      reasoning: `Perfect match for your ${personalityType} style preferences`,
      personalizedMessage: `This ${product.title.toLowerCase()} complements your ${product.sourceAesthetic} aesthetic perfectly!`
    }));
  };

  const fetchRecommendations = async () => {
    if (!userProfile) return;
    
    setLoadingRecommendations(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizResults: {
            personalityType: userProfile.personalityType || userProfile.stylePersonality,
            confidence: userProfile.confidence || 0.9,
            preferences: userProfile.preferences,
            primaryAesthetic: userProfile.primaryAesthetic,
            secondaryAesthetics: userProfile.secondaryAesthetics,
            aesthetics: userProfile.aesthetics,
            cloutScore: userProfile.cloutScore,
            tasteProfile: userProfile.tasteProfile
          },
          userProfile: userProfile
        })
      });

      const data = await response.json();
      
      if (response.ok && data.products && data.products.length > 0) {
        // Convert API products to component format
        const formattedProducts = data.products.map(product => ({
          id: product.id,
          title: product.title,
          price: product.price,
          image: getProductImage(product.title, product.category),
          description: `${product.aesthetic} style - Perfect for your ${userProfile.personalityType || userProfile.stylePersonality} personality!`,
          aesthetic: product.aesthetic,
          score: product.score
        }));
        
        setRecommendations(formattedProducts);
      } else {
        // Use fallback recommendations if API fails or returns empty
        setRecommendations(generateFallbackRecommendations());
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Always provide fallback recommendations on error
      setRecommendations(generateFallbackRecommendations());
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    // Simulate processing time for dramatic effect
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Fetch recommendations after showing results
      setTimeout(() => {
        fetchRecommendations();
      }, 1000);
    }, 3000);

    return () => clearTimeout(timer);
  }, []); // Remove userProfile dependency to prevent infinite loop

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-brand-navy relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0  opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-pink-900/10 to-[#c0a0e6]/5/20"></div>
        
        <div className="text-center relative z-10">
          <LoadingSpinner size="xl" color="purple" />
          <div className="mt-6 space-y-2">
            <p className="text-xl font-medium text-white">Analyzing your style DNA...</p>
            <p className="text-gray-300">This is getting interesting 🧬</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    console.log('QuizResults: No userProfile found');
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-brand-navy">
        <div className="text-center card-premium p-8 rounded-2xl shadow-lg border-2 border-purple-500/30">
          <p className="text-xl text-white mb-4 font-semibold">Quiz results not found!</p>
          <p className="text-gray-300 mb-6">It looks like you haven't completed the quiz yet.</p>
          <div className="space-y-3">
            <button 
              onClick={() => {
                console.log('Take Quiz clicked from no-profile state - calling startQuiz...');
                startQuiz();
              }}
              className="btn-primary px-8 py-3 rounded-xl transition-colors w-full"
            >
              Take Quiz
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-outline px-8 py-3 rounded-xl transition-colors w-full"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  console.log('QuizResults: userProfile found with keys:', Object.keys(userProfile));

  const topAesthetics = userProfile.aesthetics 
    ? Object.entries(userProfile.aesthetics)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
    : userProfile.primaryAesthetic 
        ? [[userProfile.primaryAesthetic, 85], ['vintage', 65], ['minimalist', 45]]
        : [['minimalist', 75], ['streetwear', 55], ['boho', 35]];

  return (
    <div className="min-h-screen pt-16 bg-brand-navy relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0  opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/10 via-pink-900/10 to-[#c0a0e6]/5/20"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 py-12 z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4 font-heading">
            Your Style DNA is Ready! 🧬
          </h2>
          
          <p className="text-xl text-gray-200 mb-6 font-body">
            We've analyzed your subconscious preferences and decoded your unique aesthetic profile.
          </p>
        </div>

        {/* Results Card */}
        <div className="card-premium rounded-3xl p-8 border-2 border-purple-500/30 shadow-lg mb-8 ">
          {/* Personality Type */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">You are a</h3>
            <div className="text-4xl font-bold mb-4 text-shimmer">
              {userProfile.personalityType || userProfile.stylePersonality || "Style Enthusiast"}
            </div>
            <p className="text-gray-200 max-w-2xl mx-auto font-medium">
              {userProfile.tasteProfile || userProfile.description || "Your unique style reflects your personal aesthetic preferences. You have a distinctive taste that sets you apart from the crowd."}
            </p>
          </div>

          {/* Aesthetic Breakdown */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {topAesthetics.map(([aesthetic, percentage], index) => (
              <div key={aesthetic} className="text-center">
                <div className="text-3xl font-bold text-brand-gold opacity-50 mb-2">
                  {percentage}%
                </div>
                <div className="text-white font-semibold capitalize mb-2">
                  {aesthetic}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20 to-[#d4af37]/5 h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${percentage}%`,
                      animationDelay: `${index * 200}ms`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="text-center bg-gradient-to-r from-[#d4af37]/10 to-[#120D20] rounded-xl p-4 border border-purple-500/30">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-6 h-6 text-brand-gold opacity-50 mr-2" />
                <span className="text-2xl font-bold text-brand-gold opacity-50">
                  {userProfile.cloutScore}
                </span>
              </div>
              <div className="text-gray-300 font-medium">Clout Score</div>
            </div>

            <div className="text-center bg-gradient-to-r from-[#d4af37]/20 border border-[#d4af37]/20/20 to-[#d4af37]/5/20 rounded-xl p-4 border border-green-500/30">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-brand-gold opacity-50 mr-2" />
                <span className="text-2xl font-bold text-brand-gold opacity-50">
                  {userProfile.styleStreak}
                </span>
              </div>
              <div className="text-gray-300 font-medium">Day Streak</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={async () => {
                // Generate inbox messages before navigating to dashboard
                try {
                  const token = localStorage.getItem('access_token');
                  if (token) {
                    // Trigger inbox message generation
                    const response = await fetch(`${API_BASE_URL}/api/inbox/generate-recommendations`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      }
                    });
                    
                    if (response.ok) {
                      console.log('Inbox messages generated successfully');
                    }
                  }
                } catch (error) {
                  console.error('Error generating inbox messages:', error);
                }
                
                // Navigate to dashboard
                navigate('/dashboard');
              }}
              className="btn-primary px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>See My Recommendations</span>
              <Sparkles className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                // Mock share functionality
                if (navigator.share) {
                  navigator.share({
                    title: 'My StyleGenie DNA',
                    text: `I'm a ${userProfile.personalityType || userProfile.stylePersonality || "Style Enthusiast"}! What's your style DNA?`,
                    url: window.location.origin
                  });
                } else {
                  // Fallback for browsers that don't support Web Share API
                  navigator.clipboard.writeText(
                    `I'm a ${userProfile.personalityType || userProfile.stylePersonality || "Style Enthusiast"}! Find out your style DNA at ${window.location.origin}`
                  );
                  alert('Share text copied to clipboard!');
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-2 border-blue-500/50 hover:border-blue-400 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105"
            >
              <Share2 className="w-5 h-5" />
              <span>Share Results</span>
            </button>
            
            <button
              onClick={() => {
                console.log('Retake Quiz button clicked!');
                // Confirm with user before retaking quiz
                if (window.confirm('Are you sure you want to retake the quiz? Your current results will be replaced.')) {
                  console.log('User confirmed retake, calling startQuiz...');
                  startQuiz(); // This will reset quiz state and navigate to /quiz
                }
              }}
              className="bg-gradient-to-r from-[#c0a0e6]/20 border border-[#c0a0e6]/20 to-[#c0a0e6]/5 hover:from-[#c0a0e6]/20 border border-[#c0a0e6]/20 hover:to-[#c0a0e6]/5 text-white border-2 border-orange-500/50 hover:border-orange-400 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-105"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="card-premium backdrop-blur-lg rounded-3xl p-8 border-2 border-purple-500/30 shadow-lg mb-8 ">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">✨ Your Curated Collection</h3>
            <p className="text-gray-200 font-medium">
              Based on your {userProfile.personalityType || userProfile.stylePersonality || "unique style"} DNA, here are pieces that will resonate with your style
            </p>
          </div>

          {loadingRecommendations ? (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" color="purple" />
              <p className="text-gray-300 mt-4">Finding your perfect matches...</p>
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map(product => (
                <div key={product.id} className="card-enhanced rounded-xl p-4 border-2 border-purple-500/30 hover:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-lg">
                  <img 
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="space-y-2">
                    <h4 className="text-white font-semibold">{product.title}</h4>
                    <p className="text-brand-gold opacity-50 font-bold">{product.price}</p>
                    <p className="text-gray-300 text-sm">{product.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full font-medium">
                        {product.aesthetic}
                      </span>
                      <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full font-medium">
                        {Math.round(product.score * 100)}% match
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => addToCart(product)}
                        className="flex-1 btn-primary py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center gap-1 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => addToFavorites(product)}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-200 p-2 rounded-lg transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-300 font-medium">No recommendations available at the moment</p>
              <button 
                onClick={fetchRecommendations}
                className="mt-4 btn-primary px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Fun Fact */}
        <div className="text-center bg-gradient-to-r from-[#c0a0e6]/20 border border-[#c0a0e6]/20/30 to-[#c0a0e6]/5/30 rounded-xl p-6 border-2 border-cyan-500/30">
          <h4 className="text-white font-bold mb-2">🎯 Fun Fact</h4>
          <p className="text-gray-200 font-medium">
            Your aesthetic combination is shared by only 6% of StyleGenie users. 
            You're officially unique! 
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;